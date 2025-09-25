import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Table, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { FiEye, FiRefreshCw } from "react-icons/fi";
import OrderApi from "../../api/Api_Routes/orderApi"
export default function O2DDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderApi.getPendingOrder();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching pending orders:", err);
      alert("Failed to load pending orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filtered = orders.filter((o) =>
    o.id.toString().includes(searchTerm) ||  o.cust_id.toString().includes(searchTerm) 
  ||
    o.order_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);

  // Calculate totals
  const totals = filtered.reduce(
    (acc, order) => {
      acc.totalAmount += order.total_amount || 0;
      acc.discount += order.discount_amount || 0;
      acc.tax += order.tax_amount || 0;
      acc.grandTotal += order.grand_total || 0;
      return acc;
    },
    { totalAmount: 0, discount: 0, tax: 0, grandTotal: 0 }
  );

  return (
    <MainCard title="Order Details">
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by Order ID or Status"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={{ span: 2, offset: 6 }} className="text-end">
          <Button variant="secondary" onClick={fetchOrders}>
            <FiRefreshCw /> Refresh
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center p-4">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table bordered hover>
              <thead className="table text-center" style={{ background: "#3f4d67", color: "#fff" }}>
                <tr>
                   <th style={{  color: "#fff" }}>ID</th>
                   <th style={{  color: "#fff" }}>Customer ID</th>
                   <th style={{  color: "#fff" }}>Order Date</th>
                   <th style={{  color: "#fff" }}>Expected Delivery</th>
                   <th style={{  color: "#fff" }}>Total Amount</th>
                   <th style={{  color: "#fff" }}>Discount</th>
                   <th style={{  color: "#fff" }}>Tax</th>
                   <th style={{  color: "#fff" }}>Grand Total</th>
                   <th style={{  color: "#fff" }}>Status</th>
                   <th style={{  color: "#fff" }}>Notes</th>
                   <th style={{  color: "#fff" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((o) => (
                  <tr key={o.id} >
                    <td className="text-center">{o.id}</td>
                    <td className="text-center">{o.cust_id}</td>
                    <td>{new Date(o.order_date).toLocaleString()}</td>
                    <td>{new Date(o.expected_delivery_date).toLocaleString()}</td>
                    <td className="text-end">₹{o.total_amount?.toFixed(2)}</td>
                    <td className="text-end">₹{o.discount_amount?.toFixed(2)}</td>
                    <td className="text-end">₹{o.tax_amount?.toFixed(2)}</td>
                    <td className="text-end fw-bold">₹{o.grand_total?.toFixed(2)}</td>
                    <td className="text-center">{o.order_status}</td>
                    <td>{o.notes || "-"}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => alert(`View details for order #${o.id}`)}
                      >
                        <FiEye /> View
                      </Button>
                    </td>
                  </tr>
                ))}

                {/* Totals row */}
                <tr className="table-secondary fw-bold text-end">
                  <td colSpan={4} className="text-center">TOTAL</td>
                  <td>₹{totals.totalAmount.toFixed(2)}</td>
                  <td>₹{totals.discount.toFixed(2)}</td>
                  <td>₹{totals.tax.toFixed(2)}</td>
                  <td>₹{totals.grandTotal.toFixed(2)}</td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </MainCard>
  );
}
