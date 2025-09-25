import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Row, Col, Form, Button } from "react-bootstrap";

export default function BranchReceiving() {
  const [dns, setDns] = useState([]);
  const [selectedDn, setSelectedDn] = useState("");

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

  const handleReceive = async () => {
    if (!selectedDn) {
      alert("Select DN to mark as received.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/dn/${selectedDn}/receive`);
      alert("DN marked as received.");
      setSelectedDn("");
    } catch (err) {
      console.error("Failed to mark as received:", err);
    }
  };

  return (
    <MainCard title="Branch Receiving">
      <Row>
        <Col md={8}>
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
        <Col md={4} className="d-flex align-items-end">
          <Button onClick={handleReceive}>Mark as Received</Button>
        </Col>
      </Row>
    </MainCard>
  );
}
