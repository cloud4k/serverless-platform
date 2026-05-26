import { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    customerName: "",
    orderNumber: "",
    inspectionType: "",
    priority: "",
    notes: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    const response = await fetch(`${API_BASE_URL}/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: selectedFile.name,
        contentType: selectedFile.type
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get upload URL");
    }

    const uploadResponse = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": selectedFile.type
      },
      body: selectedFile
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image to S3");
    }

    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("Submitting inspection...");

      const imageUrl = selectedFile ? await uploadImage() : null;

      const response = await fetch(`${API_BASE_URL}/inspection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Inspection submission failed");
      }

      setMessage(data.message || "Inspection submitted successfully.");

      setFormData({
        customerName: "",
        orderNumber: "",
        inspectionType: "",
        priority: "",
        notes: ""
      });

      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Submission failed.");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Inspection Submission</h1>

        <p style={subtitleStyle}>
          Submit inspection details to the private serverless backend.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="John Smith"
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label>Order Number</label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              placeholder="ORD-1001"
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label>Inspection Type</label>
            <select
              name="inspectionType"
              value={formData.inspectionType}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select</option>
              <option value="Safety Inspection">Safety Inspection</option>
              <option value="Quality Inspection">Quality Inspection</option>
              <option value="Equipment Inspection">Equipment Inspection</option>
              <option value="Final Approval">Final Approval</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label>Inspection Notes</label>
            <textarea
              rows="5"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter inspection details..."
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Inspection Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                console.log("Selected file:", file);
                setSelectedFile(file);
              }}
              style={fileInputStyle}
            />

            {selectedFile && (
              <p style={selectedFileStyle}>Selected: {selectedFile.name}</p>
            )}
          </div>

          <button type="submit" style={submitButtonStyle}>
            Submit Inspection
          </button>

          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px"
};

const cardStyle = {
  width: "100%",
  maxWidth: "900px",
  background: "white",
  borderRadius: "20px",
  padding: "32px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "10px"
};

const subtitleStyle = {
  color: "#666",
  marginBottom: "30px"
};

const fieldStyle = {
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box"
};

const fileInputStyle = {
  display: "block",
  width: "100%",
  marginTop: "10px",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  background: "white",
  color: "black",
  cursor: "pointer",
  boxSizing: "border-box"
};

const submitButtonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "14px 24px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
};

const selectedFileStyle = {
  color: "green",
  marginTop: "10px",
  fontWeight: "bold"
};

const messageStyle = {
  marginTop: "20px",
  color: "green",
  fontWeight: "bold"
};