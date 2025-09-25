import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Row, Col, Form, Button } from "react-bootstrap";

export default function DNChecking() {
  const [dns, setDns] = useState([]);
  const [selectedDn, setSelectedDn] = useState("");
  const [remarks, setRemarks] = useState("");

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

  const handleCheck = async () => {
    if (!selectedDn || !remarks) {
      alert("Select DN and enter remarks.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/dn/${selectedDn}/check`, { remarks });
      alert("DN checked and remarks saved.");
      setSelectedDn("");
      setRemarks("");
    } catch (err) {
      console.error("Failed to check DN:", err);
    }
  };

  return (
    <MainCard title="DN Checking">
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
        <Col md={6}>
          <Form.Group>
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end mt-3">
        <Button onClick={handleCheck}>Submit</Button>
      </div>
    </MainCard>
  );
}
