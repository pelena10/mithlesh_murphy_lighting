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
  const [allFGNameAttributes, setAllFGNameAttributes] = useState([]);
  const [fgName, setFgName] = useState([]);
  const [fgNameById, setFgNameById] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderType, setOrderType] = useState("regular");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCustdataPending, setTotalCustdataPending] = useState(0);
  const [totalItems, settotalItems] = useState(0);
  const [totalQuantity, settotalQuantity] = useState(0);
  const [gstAmount, setgstAmount] = useState(0);
  const [grandTotal, setgrandTotal] = useState(0);
  const [cashDiscount, setCashDiscount] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handleClose = () => setShowModal(false);
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: "",
  });
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
  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getCustomersNameList();
      const fgdata = await orderApi.getFgName();
      setCustomerDetails(data);
      setFgName(fgdata);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchFgNameById = async (id) => {
    try {
      const data = await orderApi.getFgNameById(id);
      const Attributesdata = await orderApi.getAllFGNameAttributes(id);
      setAllFGNameAttributes(Attributesdata)
      setFgNameById(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };
  const fetchItem = async (cust_id) => {
    try {
      const orderItems = await orderApi.getTempItems(cust_id);
      const TotalCustdata = await orderApi.getTotalCustPendingOrders(selectedCustomer);
      setTotalCustdataPending(TotalCustdata)
      setOrderItems(orderItems);

      const totalItems = orderItems.length;
      const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.amount,
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
    fetchCustomers();
  }, []);
  useEffect(() => {
    fetchItem(selectedCustomer);
  }, [selectedCustomer]);

 useEffect(() => {
  if (newItem.productId) {
    fetchFgNameById(newItem.productId);
  } else {
    setFgNameById(null);
  }
}, [newItem.productId]);

  const handleSubmitOrder = async () => {
    if (!selectedCustomer) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Customer at least is required.',
      });

      return;
    }
    if (!orderItems.length) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'at least one item are required.',
      });

      return;
    }
    const payload = {
      customerId: selectedCustomer,
      orderType,
      cashDiscount,
      totalItems,
      totalQuantity,
      totalAmount,
      gstAmount,
      grandTotal,
      items: orderItems
    };
    try {
      const res = await orderApi.createOrder(payload);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.message,
      });
      setOrderItems([]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting order:", error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const handleAddItem = async () => {
    if (!selectedCustomer) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a customer first.',
      });
      return;
    }
    if (!newItem.productId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a FG Name first.',
      });
      return;
    }
    if (!newItem.quantity) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Enter a quantity.',
      });
      return;
    }
    if (!allFGNameAttributes.master || !allFGNameAttributes.tanner) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Master or Tanner',
      });
      return;
    }
    const payload = {
      customerId: selectedCustomer,
      orderType,
      cashDiscount,
      id: orderItems.length + 1,
      name: fgNameById.fg_name,
      productId: newItem.productId,
      quantity: newItem.quantity,
      master: allFGNameAttributes.master,
      tenner: allFGNameAttributes.tanner,
      pendingOrder: totalCustdataPending,
      dp: allFGNameAttributes.price,
      discount: allFGNameAttributes.discount || 0,
      projectDiscount: allFGNameAttributes.projectDiscount || 0,
      amount: (allFGNameAttributes.price - (allFGNameAttributes.discount || 0)) * newItem.quantity,
      hoFgStore: allFGNameAttributes.hoFgStore || 0,
      ptFgStore: allFGNameAttributes.ptFgStore || 0,
      hoRndo: allFGNameAttributes.hoRndo || 0,
      inFgStore: allFGNameAttributes.inFgStore || 0,
      jbFgStore: allFGNameAttributes.jbFgStore || 0,
    };

    try {
      await orderApi.addTempItem(payload);
      setNewItem({ quantity: "", productId: "" });
      setFgNameById(null);
      setAllFGNameAttributes([]);
      setOrderItems([]);
      fetchItem(selectedCustomer);
    } catch (error) {
      console.error("Error submitting order:", error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to Add Item',
      });
    }
  };
  const handleDelete = async (id, cust_id) => {
    try {
      await orderApi.deleteTempItem(id);
      fetchItem(cust_id);
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = async (id) => {
    const updatedData = orderItems.find((item) => item.id == id);

    if (!updatedData) {


      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid product selected',
      });
      return;
    }

    try {
      await orderApi.updateTempItem(id, updatedData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'product Update Successfull!',
      });
         fetchItem(cust_id);
    } catch (err) {
      console.error(err);
    }
  };
  const filteredItems = orderItems
    .filter(item =>
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse();

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
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
          <Col xs={12} md={8}>
            <MainCard title="Order Details" className="h-100">
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

                {/* ORDER TYPE */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Order Type</Form.Label>
                    <Form.Select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                    >
                      <option value="regular">Regular</option>
                      <option value="project">Project</option>
                      <option value="premium">Premium</option>
                      <option value="ecom">Ecom</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* CASH DISCOUNT */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Cash Discount</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="switch"
                        id="cash-discount-switch"
                        checked={cashDiscount}
                        onChange={(e) => setCashDiscount(e.target.checked)}
                        className="custom-switch-lg"
                      />
                      <span className="fw-semibold">{cashDiscount ? 'ON' : 'OFF'}</span>
                    </div>

                  </Form.Group>
                </Col>
              </Row>
            </MainCard>
          </Col>

          {/* RIGHT SIDE - ORDER SUMMARY */}

          <Col xs={12} md={4}>
            <MainCard title="Order Summary" className="h-100">
              <div className="border p-4 rounded bg-light">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Total Items</span>
                    <span className="fw-medium">{totalItems}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Total Quantity</span>
                    <span className="fw-medium">{totalQuantity}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Total Amount</span>
                    <span className="fw-medium">₹{totalAmount.toFixed(2)}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">GST (18%)</span>
                    <span className="fw-medium">₹{gstAmount.toFixed(2)}</span>
                  </li>
                  <li className="pt-2 mt-2 border-top d-flex justify-content-between">
                    <span className="fw-bold">Grand Total</span>
                    <span className="fw-bold text-success">₹{grandTotal.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
            </MainCard>
          </Col>

        </Row>
      </div>

      {/* Add Item */}
      <MainCard title="Add Item to Order">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label>Add Item </Form.Label>
            <Form.Select
              value={newItem.productId}
              onChange={(e) =>
                setNewItem({ ...newItem, productId: e.target.value })
              }
            >
              <option value="">Select Fg Name</option>
              {fgName.map((fg) => (
                <option key={fg.id} value={fg.id}>
                  {fg.fg_name}
                </option>
              ))}

            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
            />
          </Col>
          <Col md={2}>
            <Form.Label>Master</Form.Label>
            <Form.Control
              type="text"
              value={allFGNameAttributes.master || 0}
              disabled
            />
          </Col>
          <Col md={2}>
            <Form.Label>Tenner</Form.Label>
            <Form.Control
              type="text"
              value={allFGNameAttributes.tanner || 0}

              disabled
            />
          </Col>
          <Col md={2}>
            <Form.Label>Pending Order</Form.Label>
            <Form.Control
              type="text"
              value={totalCustdataPending || 0}
              disabled
            />
          </Col>
          <Col md={1}>
            <Button variant="primary" onClick={handleAddItem} className="icon-btn1">
              <FaPlus size={25} />
            </Button>
          </Col>
        </Row>
      </MainCard>


      <MainCard title="Order Items">
        {/* <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select w-auto"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div> */}

        <div className="table-responsive">
          <table className="table  table-bordered align-middle mb-0 ">
            <thead className="table  text-center text-nowrap " style={{ background: "#3f4d67", color: "#fff" }}>
              <tr>
                <th style={{ minWidth: '150px', color: '#fff' }}>Name</th>
                <th style={{ minWidth: '80px', color: '#fff' }}>Qty</th>
                <th style={{ minWidth: '80px', color: '#fff' }}>DP</th>
                <th style={{ minWidth: '100px', color: '#fff' }}>Discount (%)</th>
                <th style={{ minWidth: '120px', color: '#fff' }}>Project Disc.</th>
                <th style={{ minWidth: '100px', color: '#fff' }}>Amount</th>
                <th style={{ minWidth: '110px', color: '#fff' }}>HO (FG)</th>
                <th style={{ minWidth: '110px', color: '#fff' }}>PT (FG)</th>
                <th style={{ minWidth: '110px', color: '#fff' }}>HO (RNDO)</th>
                <th style={{ minWidth: '110px', color: '#fff' }}>IN (FG)</th>
                <th style={{ minWidth: '110px', color: '#fff' }}>JB (FG)</th>
                <th style={{ minWidth: '90px', color: '#fff' }}>Master</th>
                <th style={{ minWidth: '90px', color: '#fff' }}>Tenner</th>
                <th style={{ minWidth: '90px', color: '#fff' }}>Pending</th>
                <th style={{ minWidth: '100px', color: '#fff' }}>Action</th>
              </tr>
            </thead>
            {orderItems.length > 0 ? (
              <tbody>
                {orderItems.map((item, index) => (

                  <tr key={item.id}>
                    <td className="text-nowrap">{item.product_name || "-"}</td>

                    {[
                      { key: "quantity", type: "text" },
                      { key: "dp", type: "text" },
                      { key: "discount", type: "text" },
                      { key: "project_discount", type: "text" },
                      { key: "amount", type: "text" },
                      { key: "ho_fg_store", type: "text", disabled: true },
                      { key: "pt_fg_store", type: "text", disabled: true },
                      { key: "ho_rndo", type: "text", disabled: true },
                      { key: "in_fg_store", type: "text", disabled: true },
                      { key: "jb_fg_store", type: "text", disabled: true },
                      { key: "master", type: "text", disabled: true },
                      { key: "tenner", type: "text", disabled: true },
                      { key: "pending_order", type: "text", disabled: true },
                    ].map(({ key, type, disabled }) => (
                      <td key={key}>
                        <input
                          type={type}
                          className="form-control form-control-sm  "
                          value={item[key] || "0"}
                          onChange={(e) => handleChange(index, key, e.target.value)}
                          style={{ minWidth: "80px" }}
                          disabled={disabled}
                        />
                      </td>
                    ))}

                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          className="icon-btn"
                          onClick={() => handleDelete(item.id, item.cust_id)}
                        >
                          <ImCross size={16} />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="icon-btn"
                          onClick={() => handleEdit(item.id)}
                        >
                          <FiEdit size={16} />
                        </Button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="16" className="text-center">
                    No data available
                  </td>
                </tr>
              </tbody>
            )
            }

          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <span>Page {currentPage} of {totalPages}</span>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
        {orderItems.length > 0 && (
          <div className="d-flex justify-content-end mt-3">

            <Button variant="primary" onClick={handleSubmitOrder}>
              Submit Order
            </Button>
          </div>
        )}
        {/* Modal to show customer details */}
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
