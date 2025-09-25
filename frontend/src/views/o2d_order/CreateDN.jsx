import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import axios from "axios";
import { TiDelete } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import { IoIosAddCircle } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Modal, ListGroup } from 'react-bootstrap';
import { InputGroup } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { orderApi } from "../../api/Api_Routes/orderApi";
import { customerApi } from "../../api/Api_Routes/customerApi";

export default function OrderDetailPage() {
  const tableRef = useRef(null);
  const [orderItems, setOrderItems] = useState([]);
  const [customersDetails, setCustomerDetails] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [masterDataCustomer, setMasterDataCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderType, setOrderType] = useState("regular");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, settotalItems] = useState(0);
  const [totalQuantity, settotalQuantity] = useState(0);
  const [gstAmount, setgstAmount] = useState(0);
  const [grandTotal, setgrandTotal] = useState(0);
  const [cashDiscount, setCashDiscount] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [masterData, setMasterData] = useState({
    branches: [],
    stores: [],
  });
 const [selectedBranch, setSelectedBranch] = useState("");
 const [selectedStore, setSelectedStore] = useState("");
  const handleClose = () => setShowModal(false);
  const handleViewDetails = async () => {
    if (selectedCustomer) {
      setShowModal(true);
      try {
        const data = await customerApi.getById(selectedCustomer);
        setCustomerData(data);

      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a customer first.',
      });

    }
  };


  const handleChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  // Fetch customers
 const fetchMasterDataCustomer = async () => {
  try {
    const customers = await customerApi.getCustomersNameList();
    const master    = await customerApi.getMasterDataCustomer();
    setCustomerDetails(customers);
    setMasterData(master);
  } catch (err) {
    console.error("Error fetching customers:", err);
  }
};

  const fetchItem = async (cust_id) => {
    try {
      const orderItems = await orderApi.getPendingOrderItems(cust_id);
      setOrderItems(orderItems);
      const totalItems = orderItems.length;
      const totalQuantity = orderItems.reduce((sum, item) => sum + item.order_qty, 0);
      const totalAmount = orderItems.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const gstRate = 0.18;
      const gstAmount = totalAmount * gstRate;
      const grandTotal = totalAmount + gstAmount;
      settotalItems(totalItems)
      settotalQuantity(totalQuantity)
      setTotalAmount(totalAmount)
      setgstAmount(gstAmount)
      setgrandTotal(grandTotal)
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  useEffect(() => {
    fetchMasterDataCustomer();
  }, []);
  useEffect(() => {
    fetchItem(selectedCustomer);
  }, [selectedCustomer]);

  const Cell = ({ left, right }) => (
    <Row className="mb-2 border-bottom pb-1">
      <Col xs={6} className="fw-semibold text-muted">{left}</Col>
      <Col xs={6} className="fw-semibold text-muted">{right || "N/A"}</Col>
    </Row>
  );
  return (
    <>
      <div className="mb-3">
        <Row className="g-3">
          {/* LEFT SIDE - ORDER DETAILS */}
          <Col xs={12} md={12}>
            <MainCard title="Delivery Note" className="h-100" >
              <Row className="g-3">
                {/* SELECT CUSTOMER + VIEW DETAILS */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Select Customer</Form.Label>
                    <InputGroup>
                      <Form.Select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                      >
                        <option value="">Select Customer</option>
                        {customersDetails.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.cust_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Button
                        variant="outline-secondary"
                        onClick={handleViewDetails}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <IoPersonCircleSharp size={18} className="me-1" />
                        View
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label>Select Branch</Form.Label>
                    <Form.Select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      <option value="">Select Branch</option>
                      {masterData.branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label>Select Store</Form.Label>
                    <Form.Select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                    >
                      <option value="">Select Store</option>
                      {masterData.stores
                        .filter(store => store.branch_id == selectedBranch) 
                        .map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label>Select Type</Form.Label>
                    <Form.Select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                    >
                      <option value="l">L</option>
                      <option value="m">M</option>
                      <option value="v">V</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={8} className="d-flex justify-content-between">
                  <Form.Group>

                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="switch"
                        id="cash-discount-switch"
                        checked={cashDiscount}
                        onChange={(e) => setCashDiscount(e.target.checked)}
                        className="custom-switch-lg"
                      />
                      <span className="fw-semibold">Cash Discount</span>
                    </div>

                  </Form.Group>
                  <Form.Group>

                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="switch"
                        id="cash-discount-switch"
                        className="custom-switch-lg"
                      />
                      <span className="fw-semibold">Advance Payment</span>
                    </div>

                  </Form.Group>
                  <Form.Group>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="checkbox"
                        id="regular-check"
                        className="custom-checkbox-lg"
                      />
                      <span className="fw-semibold">Regular </span>
                    </div>


                  </Form.Group>
                  <Form.Group>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="checkbox"
                        id="project-check"
                        className="custom-checkbox-lg"
                      />
                      <span className="fw-semibold">Project</span>
                    </div>


                  </Form.Group>
                </Col>

              </Row>

            </MainCard>

          </Col>

          <Col xs={12} md={12}>
            <MainCard title="Order Summary" className="h-100">
              <div className="border p-4 rounded bg-light">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total Items: {totalItems} </span>
                  <span className="text-muted">Total Quantity: {totalQuantity}</span>
                  <span className="text-muted">Total Amount: ₹{totalAmount?.toFixed(2)}</span>
                  <span className="text-muted">GST (18%): ₹{gstAmount?.toFixed(2)}</span>
                  <span className="fw-bold text-success">Grand Total: ₹{grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </MainCard>
          </Col>
        </Row>
      </div>

      <MainCard title="Item for Delivery">
        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table text-center text-nowrap">
              <tr>
                <th style={{ minWidth: '150px' }}>Name</th>
                <th style={{ minWidth: '110px' }}>HO (FG Store)</th>
                <th style={{ minWidth: '80px' }}>Pending Qty</th>
                <th style={{ minWidth: '80px' }}>Order Qty</th>
                <th style={{ minWidth: '80px' }}>Dispatch Qty</th>
                <th style={{ minWidth: '100px' }}>Discount</th>
                <th style={{ minWidth: '100px' }}>Order Type</th>
                <th style={{ minWidth: '100px' }}>Amount</th>
                <th style={{ minWidth: '100px' }}>Action</th>
              </tr>
            </thead>
            {orderItems.length > 0 ? (
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-nowrap">{item.product_name || "NA"}</td>
                    <td className="text-nowrap">{item.product_name || "NA"}</td>
                    <td className="text-nowrap">{item.pendingqty || "NA"}</td>
                    <td className="text-nowrap">{item.order_qty || 0}</td>
                    <td className="text-nowrap">{item.dispatch_qty || 0}</td>
                    <td className="text-nowrap">{item.discount || "0.000"}</td>
                    <td className="text-nowrap">{item.order_type || "NA"}</td>
                    <td className="text-nowrap">{item.amount || 0}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          className="icon-btn"
                          onClick={() => handleRemoveItem(index)} // Add this function
                        >
                          <ImCross size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="8" className="text-center"> {/* Fixed colSpan to match number of columns */}
                    No data available
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Header
            closeButton
            className="text-white py-2"
            style={{ background: "#3f4d67" }}
          >
            <Modal.Title className="d-flex text-light align-items-center">
              <IoPersonCircleSharp size={24} className="me-2" />
              Customer Details
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {customerData ? (
              <>
                <Cell
                  left={`GST No: ${customerData?.gst_no ?? 'NA'}`}
                  right={`Overdue Credit Total: ${customerData?.overdues?.total_dues ?? 0}`}
                />
                <Cell
                  left={`Registered Mobile: ${customerData?.contact?.register_mobile ?? 'NA'}`}
                  right={`Overdue Credit Over 90D: ${customerData?.overdues?.overdue_over_90_days ?? 0}`}
                />
                <Cell
                  left={`Registered Email: ${customerData?.contact?.register_email ?? 'NA'}`}
                  right={`Overdue Credit 90D: ${customerData?.overdues?.over_90_days ?? 0}`}
                />
                <Cell
                  left={`Price List Code:${customerData?.accountDetail?.price_list_code ?? 0}`}
                  right={`Overdue Credit 60D: ${customerData?.overdues?.over_60_days ?? 0}`}
                />
                <Cell
                  left={`Discount Code: ${customerData?.accountDetail?.disc_code ?? 0}`}
                  right={`Overdue Credit 45D: ${customerData?.overdues?.over_45_days ?? 0}`}
                />
                <Cell
                  left={`Credit Limit: ${customerData?.creditLimits?.credit_limit ?? 0}`}
                  right={`Overdue Credit 30D: ${customerData?.overdues?.over_30_days ?? 0}`}
                />
                <Cell left="Payment Terms:" right={customerData?.payment_terms ?? "N/A"} />

                {/* Month-wise section */}
                <Row className="mt-3">
                  <Col xs={6}>
                    <div className="fw-semibold text-muted">Last Month Sale:</div>
                    <div>{customerData?.last_month_sale ?? 0}</div>
                  </Col>
                  <Col xs={6}>
                    <div className="fw-semibold text-muted">Current Month Sale:</div>
                    <div>{customerData?.current_month_sale ?? 0}</div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xs={6}>
                    <div className="fw-semibold text-muted">Last Month Collection:</div>
                    <div>{customerData?.last_month_collection ?? 0}</div>
                  </Col>
                  <Col xs={6}>
                    <div className="fw-semibold text-muted">Current Month Collection:</div>
                    <div>{customerData?.current_month_collection ?? 0}</div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <div className="fw-semibold text-muted">Feedback:</div>
                    <div>{customerData?.cust_rating
                      ? [...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={18}
                          color={i < customerData.cust_rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))
                      : "N/A"}</div>
                  </Col>
                </Row>
              </>
            ) : (
              <p>No customer data found.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </MainCard>
    </>
  );
}
