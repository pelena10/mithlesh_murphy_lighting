import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Row, Col, Button, Form, Table, Alert } from "react-bootstrap";
import { ImCross } from "react-icons/im";

export default function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [dns, setDns] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedDn, setSelectedDn] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dn");
      setDns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchDns();
  }, []);

  const handleSelectDn = (dnId) => {
    const dn = dns.find((d) => d.id === parseInt(dnId));
    if (dn?.items) {
      setInvoiceItems(dn.items);
      setSelectedDn(dnId);
    } else {
      setInvoiceItems([]);
    }
  };

  const handleRemoveItem = (id) => {
    setInvoiceItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedDn || !invoiceNumber || !invoiceDate) {
      setError("All fields are required.");
      return;
    }
    setError("");

    const payload = {
      customerId: selectedCustomer,
      dnId: selectedDn,
      invoiceNumber,
      invoiceDate,
      items: invoiceItems
    };

    try {
      await axios.post("http://localhost:5000/api/invoices", payload);
      alert("Invoice submitted successfully.");
      setSelectedCustomer("");
      setSelectedDn("");
      setInvoiceItems([]);
      setInvoiceNumber("");
      setInvoiceDate("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit invoice.");
    }
  };

  // Totals
  const totals = invoiceItems.reduce(
    (acc, item) => {
      acc.quantity += item.quantity || 0;
      return acc;
    },
    { quantity: 0 }
  );

  return (
    <>
      <MainCard title="Create Invoice">
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Customer</Form.Label>
              <Form.Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cust_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Delivery Note (DN)</Form.Label>
              <Form.Select
                value={selectedDn}
                onChange={(e) => handleSelectDn(e.target.value)}
              >
                <option value="">-- Select DN --</option>
                {dns
                  .filter((d) => d.customer_id == selectedCustomer)
                  .map((dn) => (
                    <option key={dn.id} value={dn.id}>
                      DN #{dn.id} - {new Date(dn.date).toLocaleDateString()}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Invoice No.</Form.Label>
              <Form.Control
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </MainCard>

      {invoiceItems.length > 0 && (
        <MainCard title="Invoice Items">
          <Table bordered responsive>
            <thead className="table-primary text-center">
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName || item.product_name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td>{item.remarks || "-"}</td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <ImCross size={16} />
                    </Button>
                  </td>
                </tr>
              ))}

              {/* Totals Row */}
              <tr className="table-secondary fw-bold text-center">
                <td>Total</td>
                <td>{totals.quantity}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </Table>

          <div className="d-flex justify-content-end">
            <Button variant="success" onClick={handleSubmit}>
              Submit Invoice
            </Button>
          </div>
        </MainCard>
      )}
    </>
  );
}
