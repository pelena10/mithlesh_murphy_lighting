import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function UploadBuilty() {
  const [dns, setDns] = useState([]);
  const [selectedDn, setSelectedDn] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchDns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dn");
        setDns(res.data);
      } catch (err) {
        console.error("Failed to fetch DNs:", err);
      }
    };
    fetchDns();
  }, []);

  const handleUpload = async () => {
    if (!selectedDn || !file) {
      alert("Select DN and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("builty", file);

    try {
      await axios.post(`http://localhost:5000/api/dn/${selectedDn}/upload-builty`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Builty uploaded successfully.");
      setSelectedDn("");
      setFile(null);
    } catch (err) {
      console.error("Failed to upload builty:", err);
    }
  };

  return (
    <MainCard title="Upload Builty">
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select DN</Form.Label>
            <Form.Select value={selectedDn} onChange={(e) => setSelectedDn(e.target.value)}>
              <option value="">-- Select DN --</option>
              {dns.map((dn) => (
                <option key={dn.id} value={dn.id}>
                  DN #{dn.id}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Choose File</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button onClick={handleUpload}>Upload</Button>
        </Col>
      </Row>
    </MainCard>
  );
}
