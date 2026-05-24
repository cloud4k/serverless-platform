const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const {
  SNSClient,
  PublishCommand
} = require("@aws-sdk/client-sns");

const dynamoClient = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const sns = new SNSClient({
  region: "us-east-1"
});

exports.handler = async (event) => {
  console.log("SQS EVENT:", JSON.stringify(event));

  try {
    for (const record of event.Records) {

      const body = JSON.parse(record.body);

      const inspectionId = body.inspectionId;

      console.log(`Processing inspection: ${inspectionId}`);

      // Simulate processing time
      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );

      // Update DynamoDB status
      const updateCommand = new UpdateCommand({
        TableName: "sip-inspection-table",
        Key: {
          inspectionId
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":status": "COMPLETED"
        }
      });

      await docClient.send(updateCommand);

      console.log(`Inspection completed: ${inspectionId}`);

      // Publish SNS notification
      await sns.send(
        new PublishCommand({
          TopicArn: "arn:aws:sns:us-east-1:643025069654:sip-inspection-topic",
          Subject: "Inspection Completed",
          Message: `Inspection ${inspectionId} has been completed successfully.`
        })
      );

      console.log("SNS notification sent");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Worker processing completed"
      })
    };

  } catch (error) {

    console.error("Worker Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Worker failed"
      })
    };
  }
};
