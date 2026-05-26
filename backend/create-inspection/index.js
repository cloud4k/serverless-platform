const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const { NodeHttpHandler } = require("@smithy/node-http-handler");

const REGION = "us-east-1";

const requestHandler = new NodeHttpHandler({
  connectionTimeout: 3000,
  socketTimeout: 3000
});

const ddbClient = new DynamoDBClient({
  region: REGION,
  requestHandler
});

const ddb = DynamoDBDocumentClient.from(ddbClient);

const sqs = new SQSClient({
  region: REGION,
  requestHandler
});

const s3 = new S3Client({
  region: REGION,
  requestHandler
});

const sns = new SNSClient({
  region: REGION,
  requestHandler
});

const TABLE_NAME = process.env.TABLE_NAME;
const QUEUE_URL = process.env.QUEUE_URL;
const UPLOAD_BUCKET = process.env.UPLOAD_BUCKET;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return response(200, {});
    }

    const path = event.rawPath || "";

    if (path === "/upload-url") {
      const body = event.body ? JSON.parse(event.body) : {};

      const originalFileName = body.fileName || "inspection-photo.jpg";
      const contentType = body.contentType || "image/jpeg";
      const safeFileName = originalFileName.replace(/\s+/g, "-");
      const objectKey = `uploads/${Date.now()}-${safeFileName}`;

      const command = new PutObjectCommand({
        Bucket: UPLOAD_BUCKET,
        Key: objectKey,
        ContentType: contentType
      });

      const uploadUrl = await getSignedUrl(s3, command, {
        expiresIn: 300
      });

      const imageUrl = `https://${UPLOAD_BUCKET}.s3.amazonaws.com/${objectKey}`;

      return response(200, {
        uploadUrl,
        imageUrl,
        objectKey
      });
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const inspectionId = Date.now().toString();

    const inspectionItem = {
      inspectionId,
      customerName: body.customerName || "",
      orderNumber: body.orderNumber || "",
      inspectionType: body.inspectionType || "",
      priority: body.priority || "",
      notes: body.notes || "",
      imageUrl: body.imageUrl || null,
      status: "SUBMITTED",
      createdAt: new Date().toISOString()
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: inspectionItem
      })
    );

    const emailMessage = `
New Inspection Submitted

Inspection ID: ${inspectionItem.inspectionId}
Customer Name: ${inspectionItem.customerName}
Order Number: ${inspectionItem.orderNumber}
Inspection Type: ${inspectionItem.inspectionType}
Priority: ${inspectionItem.priority}
Status: ${inspectionItem.status}
Created At: ${inspectionItem.createdAt}

Notes:
${inspectionItem.notes || "No notes provided"}

Image:
${inspectionItem.imageUrl || "No image uploaded"}
`;

await sns.send(
  new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Subject: `New ${inspectionItem.priority} Inspection`,
    Message: emailMessage
  })
);

    console.log("SNS notification sent successfully");
    console.log("Skipping SQS temporarily for VPC test");

    return response(200, {
      message: "Inspection submitted successfully",
      inspection: inspectionItem
    });
  } catch (error) {
    console.error("Request failed:", error);

    return response(500, {
      message: "Request failed",
      error: error.message
    });
  }
};