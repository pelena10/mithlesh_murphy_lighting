import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Row, Col, Form, Button } from "react-bootstrap";

export default function CashDiscount() {
  const [dns, setDns] = useState([]);
  const [selectedDn, setSelectedDn] = useState("");
  const [discount, setDiscount] = useState("");

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

  const handleSubmit = async () => {
    if (!selectedDn || !discount) {
      alert("Select DN and enter discount.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/dn/${selectedDn}/discount`, {
        discount: parseFloat(discount)
      });
      alert("Discount applied successfully.");
      setSelectedDn("");
      setDiscount("");
    } catch (err) {
      console.error("Failed to apply discount:", err);
    }
  };

  return (
    <MainCard title="Apply Cash Discount">
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select DN</Form.Label>
            <Form.Select value={selectedDn} onChange={(e) => setSelectedDn(e.target.value)}>
              <option value="">-- Select DN --</option>
              {dns.map((dn) => (
                <option key={dn.id} value={dn.id}>
                  DN #{dn.id} - {dn.date}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Discount %</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter discount %"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button onClick={handleSubmit}>Apply</Button>
        </Col>
      </Row>
    </MainCard>
  );
}
