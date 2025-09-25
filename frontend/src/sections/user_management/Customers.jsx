import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Row, Col, Button, Form } from "react-bootstrap";
import "./CustomersPage.css";
import MainCard from './../../components/MainCard';
import Swal from 'sweetalert2';
import { validateRequiredFields } from "../../utils/customerValidation/validateRequiredFields";
// import steps from "../../utils/customerValidation/customerFormSteps"; // Import steps
import initialFormData from "../../utils/customerValidation/initialCustomerFormData"; // Import initial
import { customerApi } from "../../api/Api_Routes/customerApi";
const steps = [
  {
    name: "basic",
    title: "Basic Information",
    fields: [
      { name: "cust_name", label: "Customer Name", required: true, type: "text" },
      { name: "gst_no", label: "GST Number", required: true, type: "text" },
      { name: "udyam_reg_no", label: "Udyam Registration", required: true, type: "text" },
      { name: "pan", label: "PAN", required: true, type: "text" },
      { name: "aadhar", label: "Aadhar", required: true, type: "text" },
      { name: "cust_status", label: "Status", required: true, type: "select", options: ["Active", "Inactive"] }
    ]
  },
  {
    name: "billing",
    title: "Billing Address",
    fields: [
      { name: "billing_address", label: "Address", required: true, type: "text" },
      { name: "billing_city", label: "City", required: true, type: "text" },
      { name: "billing_district", label: "District", required: true, type: "text" },
      { name: "billing_state", label: "State", required: true, type: "text" },
      { name: "billing_pin_code", label: "PIN Code", required: true, type: "text" }
    ]
  },
  {
    name: "shipping",
    title: "Shipping Address",
    fields: [
      { name: "shipping_address", label: "Address", required: true, type: "text" },
      { name: "shipping_city", label: "City", required: true, type: "text" },
      { name: "shipping_district", label: "District", required: true, type: "text" },
      { name: "shipping_state", label: "State", required: true, type: "text" },
      { name: "shipping_pin_code", label: "PIN Code", required: true, type: "text" }
    ]
  },
  {
    name: "contact",
    title: "Contact Information",
    fields: [
      // Primary registered contact
      { name: "register_mobile", label: "Mobile", required: true, type: "text" },
      { name: "register_email", label: "Email", required: true, type: "email" },

      // Contact person 1
      { name: "contact_person1_name", label: "Contact Person 1 Name", required: true, type: "text" },
      { name: "contact_person1_mobile", label: "Contact Person 1 Mobile", required: true, type: "text" },
      { name: "contact_person1_email", label: "Contact Person 1 Email", required: true, type: "email" },
      { name: "contact_person1_dob", label: "Contact Person 1 DOB", required: false, type: "date" },
      { name: "contact_person1_anniversary", label: "Contact Person 1 nniversary", required: false, type: "date" },



      // Contact person 2
      { name: "contact_person2_name", label: "Contact Person 2 Name", required: false, type: "text" },
      { name: "contact_person2_mobile", label: "Contact Person 2 Mobile", required: false, type: "text" },
      { name: "contact_person2_email", label: "Contact Person 2 Email", required: false, type: "email" },
      { name: "contact_person2_dob", label: "Contact Person 2 DOB", required: false, type: "date" },
      { name: "contact_person2_anniversary", label: "Contact Person 2 nniversary", required: false, type: "date" },

      // Contact person 3
      { name: "contact_person3_name", label: "Contact Person 3 Name", required: false, type: "text" },
      { name: "contact_person3_mobile", label: "Contact Person 3 Mobile", required: false, type: "text" },
      { name: "contact_person3_email", label: "Contact Person 3 Email", required: false, type: "email" },
      { name: "contact_person3_dob", label: "Contact Person 3 DOB", required: false, type: "date" },
      { name: "contact_person3_anniversary", label: "Contact Person 3 nniversary", required: false, type: "date" },
    ]
  },
  {
    name: "business",
    title: "Business Details",
    fields: [
      { name: "annual_turnover", label: "Annual Turnover", required: false, type: "number" },
      { name: "no_counters_in_chain", label: "Number of Counters", required: false, type: "number" },
      { name: "list_of_other_products", label: "Other Products", required: false, type: "text" },
      { name: "list_of_other_companies", label: "Other Companies", required: false, type: "text" },
      { name: "appoint_date", label: "Appointment Date", required: false, type: "date" },
      { name: "shop_location_link", label: "Shop Location Link", required: false, type: "text" }
    ]
  },
  {
    name: "account",
    title: "Account Details",
    fields: [
      { 
        name: "cust_branch", 
        label: "Branch", 
        required: false, 
        type: "select", 
        optionsKey: "branches" // Reference to master data
      },
      { 
        name: "dispatch_store", 
        label: "Dispatch Store", 
        required: false, 
        type: "select", 
        optionsKey: "stores" 
      },
      { 
        name: "cust_category", 
        label: "Category", 
        required: false, 
        type: "select", 
        optionsKey: "customersCategory" 
      },
      { 
        name: "price_list_code", 
        label: "Price List Code", 
        required: false, 
        type: "select", 
        optionsKey: "priceLists" 
      },
      { 
        name: "disc_code", 
        label: "Discount Code", 
        required: false, 
        type: "select", 
        optionsKey: "discountLists" 
      },
      { 
        name: "sales_person", 
        label: "Sales Person", 
        required: false, 
        type: "select", 
        options: ["John Doe", "Jane Smith", "Robert Johnson", "Sarah Williams"] // Static options
      },
      { 
        name: "allocated_cre", 
        label: "Allocated CRE", 
        required: false, 
        type: "select", 
        options: ["CRE001", "CRE002", "CRE003", "CRE004"] // Static options
      },
      { 
        name: "zone", 
        label: "Zone", 
        required: false, 
        type: "select", 
        optionsKey: "zone" 
      },
      { name: "tally_name", label: "Tally Name", required: false, type: "text", readOnly: true },
    ]
  },
  {
    name: "documents",
    title: "Documents",
    fields: [
      { name: "shop_image_1", label: "Shop Image 1", required: false, type: "file" },
      { name: "shop_image_2", label: "Shop Image 2", required: false, type: "file" },
      { name: "shop_image_3", label: "Shop Image 3", required: false, type: "file" },
      { name: "shop_image_4", label: "Shop Image 4", required: false, type: "file" },
      // Security Cheque

      { name: "image_security_cheque_1", label: "Security Cheque 1", required: false, type: "file" },
      { name: "image_security_cheque_2", label: "Security Cheque 2", required: false, type: "file" },
      { name: "image_security_cheque_3", label: "Security Cheque 3", required: false, type: "file" },
      { name: "image_security_cheque_4", label: "Security Cheque 4", required: false, type: "file" },

      // GST Certificate
      { name: "gst_certificate_image", label: "GST Certificate", required: false, type: "file" }
    ]
  }
];
const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [documentFiles, setDocumentFiles] = useState({});
  const [documentPreviews, setDocumentPreviews] = useState({});
  const [zoomModal, setZoomModal] = useState({ show: false, src: "", scale: 1 });
  const fileInputRefs = useRef({});
  const [masterData, setMasterData] = useState({
    branches: [],
    stores: [],
    customersCategory: [],
    priceLists: [],
    discountLists: [],
    zone: [],
    fgprice: []
  });
  // Function to generate preview for files
  const generatePreview = (file, fieldName) => {
    if (file && /\.(jpg|jpeg|png)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentPreviews(prev => ({
          ...prev,
          [fieldName]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files or when file is removed
      setDocumentPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
    }
  };
  useEffect(() => {
   
    
    loadData();
  }, []);
   const loadData = async () => {
      const masterDataResponse = await customerApi.getMasterDataCustomer();
           setMasterData(masterDataResponse);
    };
  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      accountDetail: {
        ...prev.accountDetail,
        tally_name: `${prev.cust_name || ""} - ${prev.billingAddresses[0]?.billing_city || ""} - (${prev.accountDetail?.cust_category || ""})`
      }
    }));
    console.log("fossrmData", formData);
  }, [
    formData.cust_name,
    formData.billingAddresses[0]?.billing_city,
    formData.accountDetail?.cust_category
  ]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
      showErrorAlert("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const getStepCompletionCount = (stepIndex) => {
    const step = steps[stepIndex];

    // Documents step doesn't require validation
    if (step.name === "documents") return { completed: 0, total: 0 };

    let completedCount = 0;
    const totalCount = step.fields.filter(field => field.required).length;

    step.fields
      .filter(field => field.required)
      .forEach(field => {
        let value = "";

        if (step.name === "basic") {
          value = formData[field.name] || "";
        } else if (step.name === "billing") {
          value = formData.billingAddresses[0][field.name] || "";
        } else if (step.name === "shipping") {
          value = formData.shippingAddresses[0][field.name] || "";
        } else if (step.name === "contact") {
          value = formData.contact[field.name] || "";
        }

        // Check if field has value and no validation error
        const hasValue = value.toString().trim() !== "";
        const hasError = validateField(field.name, value);

        if (hasValue && !hasError) {
          completedCount++;
        }
      });

    return { completed: completedCount, total: totalCount };
  };

  // Add this function to check if a step is completed
  const isStepValid = (stepIndex) => {
    const step = steps[stepIndex];

    // Documents step doesn't require validation
    if (step.name === "documents") return true;

    // Check if all required fields are filled and valid
    return step.fields
      .filter(field => field.required)
      .every(field => {
        let value = "";
        if (step.name === "basic") {
          value = formData[field.name] || "";
        } else if (step.name === "billing") {
          value = formData.billingAddresses[0][field.name] || "";
        } else if (step.name === "shipping") {
          value = formData.shippingAddresses[0][field.name] || "";
        } else if (step.name === "contact") {
          value = formData.contact[field.name] || "";
        }

        // Check if field has value and no validation error
        const hasValue = value.toString().trim() !== "";
        const hasError = validateField(field.name, value);

        return hasValue && !hasError;
      });
  };
  const validateField = (name, value) => {
    let error = "";

    // Normalize the value for validation
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    // Find the field config from steps
    const fieldConfig = steps
      .flatMap(step => step.fields)
      .find(field => field.name === name);

    // If the field is required and value is empty
    if (fieldConfig?.required && (trimmedValue === "" || trimmedValue === null || trimmedValue === undefined)) {
      error = `${fieldConfig.label || name} is required`;
      return error;
    }

    // Field-specific validation
    switch (name) {
      case "cust_name":
        if (trimmedValue && (trimmedValue.length < 2 || trimmedValue.length > 100)) {
          error = "Name must be 2-100 characters";
        }
        break;

      case "gst_no":
        if (trimmedValue && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(trimmedValue)) {
          error = "Invalid GST format";
        }
        break;

      case "pan":
        if (trimmedValue && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmedValue)) {
          error = "Invalid PAN format";
        }
        break;

      case "aadhar":
        if (trimmedValue) {
          const digitsOnly = trimmedValue.replace(/\D/g, ""); // Remove non-digit characters
          if (!/^[2-9][0-9]{11}$/.test(digitsOnly)) {
            error = "Invalid Aadhar format (must be 12 digits starting from 2-9)";
          }
        }
        break;


      case "register_mobile":
      case "contact_person1_mobile":
      case "contact_person2_mobile":
      case "contact_person3_mobile":
        if (trimmedValue && !/^[6-9]\d{9}$/.test(trimmedValue.replace(/\D/g, ''))) {
          error = "Invalid mobile number";
        }
        break;

      case "register_email":
      case "contact_person1_email":
      case "contact_person2_email":
      case "contact_person3_email":
        if (trimmedValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          error = "Invalid email format";
        }
        break;

      case "billing_pin_code":
      case "shipping_pin_code":
        if (trimmedValue && !/^\d{6}$/.test(trimmedValue)) {
          error = "PIN code must be 6 digits";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (stepName, field, value, index = 0) => {
    setFormData(prev => {
      const newData = { ...prev };

      if (stepName === "basic") {
        newData[field] = value;

        // Validate field and update errors
        const error = validateField(field, value);
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: error
        }));
      } else if (stepName === "billing") {
        newData.billingAddresses[index][field] = value;

        // Validate pin code
        if (field === "billing_pin_code") {
          const error = validateField(field, value);
          setErrors(prevErrors => ({
            ...prevErrors,
            [`billing_${field}`]: error
          }));
        }
      } else if (stepName === "shipping") {
        newData.shippingAddresses[index][field] = value;

        // Validate pin code
        if (field === "shipping_pin_code") {
          const error = validateField(field, value);
          setErrors(prevErrors => ({
            ...prevErrors,
            [`shipping_${field}`]: error
          }));
        }
      } else if (stepName === "contact") {
        newData.contact[field] = value;

        // Validate contact fields
        if (field.includes("mobile") || field.includes("email")) {
          const error = validateField(field, value);
          setErrors(prevErrors => ({
            ...prevErrors,
            [field]: error
          }));
        }
      } else if (stepName === "business") {
        newData.businessDetail[field] = value;
      } else if (stepName === "account") {
        newData.accountDetail[field] = value;
      }

      return newData;
    });
  };

  const handleFileChange = (fieldName, file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorAlert("File size must be less than 5MB");
        return;
      }

      setDocumentFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));
      generatePreview(file, fieldName);
    } else {
      // Remove file
      setDocumentFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fieldName];
        return newFiles;
      });

      setDocumentPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
    }
  };

  const isStepComplete = stepIndex => {
    const step = steps[stepIndex];

    // Documents step doesn't require completion
    if (step.name === "documents") return true;

    return step.fields
      .filter(field => field.required)
      .every(field => {
        if (step.name === "basic") {
          return formData[field.name] && formData[field.name].toString().trim() !== "";
        } else if (step.name === "billing") {
          return formData.billingAddresses[0][field.name] &&
            formData.billingAddresses[0][field.name].toString().trim() !== "";
        } else if (step.name === "shipping") {
          return formData.shippingAddresses[0][field.name] &&
            formData.shippingAddresses[0][field.name].toString().trim() !== "";
        }
        else if (step.name === "contact") {
          return formData.contact[field.name] &&
            formData.contact[field.name].toString().trim() !== "";
        }
        return true;
      });
  };
  const isStepCompleted = (stepIndex) => {
    const step = steps[stepIndex];
    const isCompleted = step.fields.every((field) => {
      switch (step.name) {
        case "business":
          return (
            formData.businessDetail?.[field.name] &&
            formData.businessDetail?.[field.name].toString().trim() !== ""
          );
        case "account":
          return (
            formData.accountDetail?.[field.name] &&
            formData.accountDetail?.[field.name].toString().trim() !== ""

          );
        case "documents":
          return (
            formData.documents?.[field.name] &&
            formData.documents?.[field.name].toString().trim() !== ""
          );
        default:
          return false;
      }
    });
    return {
      name: step.name,
      completed: isCompleted
    };
  };

  const hasStepErrors = stepIndex => {
    const step = steps[stepIndex];

    return step.fields.some(field => {
      if (step.name === "basic") {
        return errors[field.name];
      } else if (step.name === "billing" && field.name === "billing_pin_code") {
        return errors[`billing_${field.name}`];
      } else if (step.name === "shipping" && field.name === "shipping_pin_code") {
        return errors[`shipping_${field.name}`];
      } else if (step.name === "contact" &&
        (field.name.includes("mobile") || field.name.includes("email"))) {
        return errors[field.name];
      }
      return false;
    });
  };

  const uploadDocuments = async (customerId) => {
    try {
      const formData = new FormData();

      // Append all document files
      Object.entries(documentFiles).forEach(([fieldName, file]) => {
        if (file) {
          formData.append(fieldName, file);
        }
      });

      if (Object.keys(documentFiles).length > 0) {
        await customerApi.uploadDocuments(customerId, formData);

      }
    } catch (err) {
      console.error("Document upload error:", err);
      throw new Error("Failed to upload documents");
    }
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true
    });
  };



  const handleSave = async () => {
    const missing = validateRequiredFields(formData, steps);
    console.log("missing", formData)
    if (missing.length > 0) {
      // Convert "billing_city" → "Billing City"
      const prettyNames = missing.map(f =>
        f
          .replace(/_/g, " ")         // underscores → spaces
          .replace(/\b\w/g, c => c.toUpperCase()) // capitalize each word
      );

      Swal.fire({
        icon: "warning",
        title: "Please Complete All Required Fields",
        html: `
          <div style="text-align:left;">
            ${prettyNames.map(name => `• ${name}`).join("<br>")}
          </div>
        `,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK, Got It",
        backdrop: true,
      });
      return;
    }

    try {
      let response;

      if (editingCustomer) {
        response = await customerApi.update(editingCustomer.id, formData);
        // Upload documents if any
        if (Object.keys(documentFiles).length > 0) {
          await uploadDocuments(editingCustomer.id);
        }
        showSuccessAlert("Customer updated successfully!");
      } else {
        const missingDocs = [];
        if (!documentFiles.image_security_cheque_1) missingDocs.push("Security Cheque 1");
        if (!documentFiles.gst_certificate_image) missingDocs.push("GST Certificate");

        if (missingDocs.length > 0) {
          showErrorAlert(`Please upload: ${missingDocs.join(", ")}`);
          return;
        }
        response = await customerApi.create(formData);
        // Upload documents if any
        if (Object.keys(documentFiles).length > 0 && response.id) {
          await uploadDocuments(response.id);
        }

        showSuccessAlert("Customer added successfully!");
      }

      fetchCustomers();
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.path] = error.msg;
        });
        setErrors(backendErrors);
        showErrorAlert("Please fix the validation errors");
      } else {
        showErrorAlert("Error saving customer: " + (err.response?.data?.message || err.message));
      }
    }
  };
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await customerApi.delete(id);
      fetchCustomers();
      showSuccessAlert("Customer deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      showErrorAlert("Error deleting customer: " + (err.response?.data?.message || err.message));
    }
  };

  const openAddModal = () => {
    setFormData(initialFormData);
    setEditingCustomer(null);
    setActiveStep(0);
    setErrors({});
    setDocumentFiles({});
    setDocumentPreviews({});
    setShowModal(true);
  };

  const openEditModal = customer => {
    // Transform the customer data to match our form structure
    const formData = {
      ...customer,
      billingAddresses: customer.billingAddresses || [{
        billing_address: "",
        billing_city: "",
        billing_district: "",
        billing_state: "",
        billing_pin_code: ""
      }],
      shippingAddresses: customer.shippingAddresses || [{
        shipping_address: "",
        shipping_city: "",
        shipping_district: "",
        shipping_state: "",
        shipping_pin_code: ""
      }],
      contact: customer.contact || {
        register_mobile: "",
        register_email: "",

        contact_person1_name: "",
        contact_person1_mobile: "",
        contact_person1_email: "",
        contact_person1_dob: "",
        contact_person1_anniversary: "",

        contact_person2_name: "",
        contact_person2_mobile: "",
        contact_person2_email: "",
        contact_person2_dob: "",
        contact_person2_anniversary: "",

        contact_person3_name: "",
        contact_person3_mobile: "",
        contact_person3_email: "",
        contact_person3_dob: "",
        contact_person3_anniversary: "",
      },

      businessDetail: customer.businessDetail || {
        annual_turnover: "",
        no_counters_in_chain: "",
        list_of_other_products: "",
        list_of_other_companies: "",
        appoint_date: "",
        shop_location_link: "",
      },
      accountDetail: customer.accountDetail || {
        tally_name: "",
        cust_branch: "",
        dispatch_store: "",
        cust_category: "",
        price_list_code: "",
        disc_code: "",
        sales_person: "",
        allocated_cre: "",
        zone: "",
      },
      documents: customer.documents || {}
    };

    setFormData(formData);
    setEditingCustomer(customer);
    setActiveStep(0);
    setErrors({});
    setDocumentFiles({});
    setDocumentPreviews({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditingCustomer(null);
    setActiveStep(0);
    setErrors({});
    setDocumentFiles({});
    setDocumentPreviews({});
  };

  const filteredCustomers = customers.filter(
    c =>
      c.cust_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.gst_no?.toLowerCase().includes(search.toLowerCase()) ||
      c.pan?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const currentData = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const progressPercent = ((activeStep + 1) / steps.length) * 100;

  const renderField = (step, field, index = 0) => {
    let value = "";
    let error = "";

    if (step.name === "basic") {
      value = formData[field.name] || "";
      error = errors[field.name];
    } else if (step.name === "billing") {
      value = formData.billingAddresses[index][field.name] || "";
      if (field.name === "billing_pin_code") {
        error = errors[`billing_${field.name}`];
      }
    } else if (step.name === "shipping") {
      value = formData.shippingAddresses[index][field.name] || "";
      if (field.name === "shipping_pin_code") {
        error = errors[`shipping_${field.name}`];
      }
    } else if (step.name === "contact") {
      value = formData.contact[field.name] || "";
      error = errors[field.name];
    }
    else if (step.name === "business") {
      value = formData.businessDetail[field.name] || "";
    }
    else if (step.name === "account") {
      value = formData.accountDetail[field.name] || "";
    }
    else if (step.name === "documents") {
      const currentDoc = formData.documents ? formData.documents[field.name] : null;
      const filePreview = documentPreviews[field.name];
      const hasNewFile = documentFiles[field.name];
      const isImageFile = hasNewFile && /\.(jpg|jpeg|png)$/i.test(hasNewFile.name);
      const isExistingImage = currentDoc && /\.(jpg|jpeg|png)$/i.test(currentDoc);
      const requiredFields = ['image_security_cheque_1', 'gst_certificate_image'];
      const isRequired = requiredFields.includes(field.name);
      return (
        <div className="mb-4 document-upload-container">
          <label className="form-label fw-semibold">{field.label}    {isRequired && <span className="text-danger">*</span>}</label>

          {/* Enhanced Drop Zone */}
          <div
            className="document-drop-zone border border-dashed rounded-3 p-4 text-center bg-light position-relative"
            onClick={() => fileInputRefs.current[field.name]?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('drag-over');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
              const file = e.dataTransfer.files[0];
              if (file) handleFileChange(field.name, file);
            }}
          >
            <div className="drop-zone-content">
              <i className="bi bi-cloud-upload fs-1 text-primary mb-2"></i>
              <p className="mb-1 fw-medium">Drag & drop files here</p>
              <p className="mb-2 text-muted small">or click to browse</p>
              <small className="text-muted d-block">Supported formats: JPG, JPEG, PNG, PDF</small>
              <small className="text-muted">Max file size: 5MB</small>
            </div>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="d-none"
              ref={(el) => (fileInputRefs.current[field.name] = el)}
              onChange={(e) => handleFileChange(field.name, e.target.files[0])}
            />
          </div>

          {/* Enhanced Preview Section */}
          {(currentDoc || hasNewFile) && (
            <div className="mt-3">
              <h6 className="mb-2 text-muted">File Preview:</h6>

              <div className="document-preview-card card">
                <div className="card-body">
                  {/* New file preview */}
                  {hasNewFile && (
                    <div className="d-flex align-items-center gap-3">
                      {isImageFile ? (
                        <>
                          <div className="position-relative">
                            <img
                              src={filePreview}
                              alt="document preview"
                              className="rounded shadow-sm document-preview-image"
                              onClick={() => setZoomModal({ show: true, src: filePreview, scale: 1 })}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileChange(field.name, null);
                              }}
                              style={{ width: '24px', height: '24px', padding: 0, borderRadius: '50%' }}
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-medium text-truncate">{documentFiles[field.name].name}</p>
                            <p className="mb-0 text-muted small">
                              {(documentFiles[field.name].size / 1024).toFixed(1)} KB
                            </p>
                            <p className="mb-0 text-success small">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Ready to upload
                            </p>
                            <p className="mb-0 text-info small " style={{ cursor: "pointer" }} onClick={() => setZoomModal({ show: true, src: filePreview, scale: 1 })}
                            >
                              <i className="bi bi-info-circle-fill me-1"></i>
                              Click to Preveiw
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="position-relative">
                            <div className="document-icon-container bg-light rounded p-2">
                              <i className="bi bi-file-earmark-pdf fs-2 text-danger"></i>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileChange(field.name, null);
                              }}
                              style={{ width: '24px', height: '24px', padding: 0, borderRadius: '50%' }}
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-medium text-truncate">{documentFiles[field.name].name}</p>
                            <p className="mb-0 text-muted small">
                              {(documentFiles[field.name].size / 1024).toFixed(1)} KB
                            </p>
                            <p className="mb-0 text-success small">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Ready to upload
                            </p>
                            <p className="mb-0 text-info small " style={{ cursor: "pointer" }} onClick={() => setZoomModal({ show: true, src: filePreview, scale: 1 })}
                            >
                              <i className="bi bi-info-circle-fill me-1"></i>
                              Click to Preveiw
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Existing file preview (only show if no new file is selected) */}
                  {currentDoc && !hasNewFile && (
                    <div className="d-flex align-items-center gap-3">
                      {isExistingImage ? (
                        <>
                          <div className="position-relative">
                            <img
                              src={`http://localhost:5000/${currentDoc}`}
                              alt="document preview"
                              className="rounded shadow-sm document-preview-image"
                              onClick={() => setZoomModal({
                                show: true,
                                src: `http://localhost:5000/${currentDoc}`,
                                scale: 1
                              })}
                            />

                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 text-muted small">Existing file</p>
                            <p className="mb-0 text-info small " style={{ cursor: "pointer" }} onClick={() => setZoomModal({
                              show: true,
                              src: `http://localhost:5000/${currentDoc}`,
                              scale: 1
                            })}>
                              <i className="bi bi-info-circle-fill me-1"></i>
                              Click to Preveiw
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="position-relative">
                            <div className="document-icon-container bg-light rounded p-2">
                              <i className="bi bi-file-earmark-pdf fs-2 text-danger"></i>
                            </div>

                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 text-muted small">Existing file</p>
                            <p className="mb-0 text-info small " style={{ cursor: "pointer" }} onClick={() => setZoomModal({
                              show: true,
                              src: `http://localhost:5000/${currentDoc}`,
                              scale: 1
                            })}>
                              <i className="bi bi-info-circle-fill me-1"></i>
                              Click to Preveiw
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } 

    if (field.type === "select") {
      // Get options based on whether it's static or from master data
      let options = [];
      
      if (field.options) {
        // Static options
        options = field.options.map(opt => ({ value: opt, label: opt }));
      } else if (field.optionsKey && masterData[field.optionsKey]) {
        // Dynamic options from master data
        options = masterData[field.optionsKey].map(item => ({
          value: item.id?.toString() || item.name || item.value,
          label: item.name || item.value || `Item ${item.id}`
        }));
      }

      return (
        <div className="mb-3">
          <label className="form-label">
            {field.label}{field.required && <span className="text-danger">*</span>}
          </label>
          <select
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={value}
            onChange={(e) => handleInputChange(step.name, field.name, e.target.value, index)}
          >
            <option value="">Select {field.label}</option>
            {options.map((option, optIndex) => (
              <option key={optIndex} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    }


    // if (field.type === "select") {
    //   return (
    //     <div className="mb-3">
    //       <label className="form-label">{field.label}{field.required && <span className="text-danger">*</span>}</label>
    //       <select
    //         className={`form-control ${error ? 'is-invalid' : ''}`}
    //         value={value}
    //         onChange={(e) => handleInputChange(step.name, field.name, e.target.value, index)}
    //       >
    //         <option value="">Select {field.label}</option>
    //         {field?.options?.map(option => (
    //           <option key={option} value={option}>{option}</option>
    //         ))}
    //       </select>
    //       {error && <div className="invalid-feedback">{error}</div>}
    //     </div>
    //   );
    // }

    return (
      <>

        <div className="mb-3">
          <label className="form-label">{field.label}{field.required && <span className="text-danger">*</span>}</label>
          <input
            type={field.type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={value}
            onChange={(e) => handleInputChange(step.name, field.name, e.target.value, index)}
            placeholder={field.label}
            required={field.required}
            disabled={field.readOnly}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </>
    );
  };

  return (
    <>
      <MainCard>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Customers</h3>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add Customer
            </button>
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, GST or PAN..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>GST No</th>
                  <th>PAN</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? (<tr><td colSpan="6" className="text-center">Loading...</td></tr>)
                  : currentData.length > 0
                    ? currentData.map(cust => (
                      <tr key={cust.id}>
                        <td>{cust.id}</td>
                        <td>{cust.cust_name}</td>
                        <td>{cust.gst_no || "-"}</td>
                        <td>{cust.pan || "-"}</td>
                        <td>
                          <span className={`badge ${cust.cust_status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {cust.cust_status}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => openEditModal(cust)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(cust.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                    : (<tr><td colSpan="6" className="text-center">No customers found.</td></tr>)
                }
              </tbody>
            </table>
          </div>

          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                >Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                >Next</button>
              </li>
            </ul>
          </nav>

          {showModal && (
            <Modal
              show={showModal}
              onHide={closeModal}
              size="xxl" // Changed to xxl for larger modal
              scrollable
              backdrop="static"
              centered
              className="customer-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingCustomer ? "Edit Customer" : "Add Customer"}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  {/* Vertical Steps Navigation */}
                  <Col md={3} className="border-end">
                    <div className="vertical-steps">
                      {steps.map((step, index) => {
                        const isValid = isStepValid(index);
                        const isActive = activeStep === index;
                        const isIndex56 = (index === 4 || index === 5);
                        const isCompleted = activeStep > index && isValid;
                        const hasErrors = hasStepErrors(index) || (activeStep > index && !isValid);
                        const completionCount = getStepCompletionCount(index);
                        const isStepCompletedWr = isStepCompleted(index);
                        const stepDone =
                          isCompleted ||
                          (completionCount.completed === completionCount.total &&
                            completionCount.total > 0) ||
                          isStepCompletedWr.completed;
                        return (
                          <div
                            key={step.name}
                            className={`vertical-step ${isActive ? "active" : ""} ${hasErrors ? 'has-error' : ''}`}
                            onClick={() => setActiveStep(index)}
                          >
                            <div className={`step-number ${stepDone ? "completed" : ""}`}>
                              {stepDone ? "✓" : index + 1}
                            </div>
                            <div className="step-info">
                              <div className="step-title">{step.title} {isIndex56 && "(Optional)"}</div>

                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </Col>

                  {/* Form Content */}
                  <Col md={9}>
                    <div className="px-3">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-primary mb-0">
                          {steps[activeStep].title}
                        </h4>
                        {getStepCompletionCount(activeStep).total > 0 && (
                          <span className="step-completion-badge">
                            {getStepCompletionCount(activeStep).completed} / {getStepCompletionCount(activeStep).total} required fields completed
                          </span>
                        )}
                      </div>

                      <div className="steps-wrapper">
                        {steps.map((step, index) => (
                          <div
                            key={step.name}
                            className={`form-step ${activeStep === index ? "active" : ""}`}
                          >
                            <Row>

                              {step.fields.map((field, fieldIndex) => (
                                <React.Fragment key={field.name}>
                                  <Col md={6} className="mb-3">
                                    {renderField(step, field)}
                                  </Col>
                                  {(field.name === 'contact_person1_anniversary' ||
                                    field.name === 'contact_person2_anniversary') && (
                                      <>

                                        <hr key={`hr-${fieldIndex}`} style={{ border: 'none' }} />
                                      </>
                                    )}
                                </React.Fragment>
                              ))}
                            </Row>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                <Button
                  variant="outline-primary"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                >
                  Previous
                </Button>
                {activeStep < steps.length - 1 && (
                  <Button
                    variant="outline-primary"
                    disabled={!isStepComplete(activeStep) || hasStepErrors(activeStep)}
                    onClick={() => {
                      // Validate current step before proceeding
                      if (isStepValid(activeStep)) {
                        setActiveStep(prev => prev + 1);
                      } else {
                        showErrorAlert("Please complete all required fields correctly before proceeding");
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!isStepComplete(activeStep) || hasStepErrors(activeStep)}
                >
                  {editingCustomer ? "Update" : "Save"}
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'} mt-3`} role="alert">
              {message}
            </div>
          )}
        </div>
        {/* Zoom Modal */}
        {zoomModal.show && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
            style={{ zIndex: 99999 }}
            onClick={() => setZoomModal({ show: false, src: "", scale: 1 })}
          >
            <div className="position-relative">
              <img
                src={zoomModal.src}
                alt="zoomed"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  transform: `scale(${zoomModal.scale})`,
                  transition: "transform 0.2s ease"
                }}
                onWheel={(e) =>
                  setZoomModal((z) => ({
                    ...z,
                    scale: Math.min(Math.max(z.scale + (e.deltaY < 0 ? 0.1 : -0.1), 0.5), 3)
                  }))
                }
              />
              <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                <button
                  className="btn btn-light btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomModal((z) => ({ ...z, scale: Math.max(z.scale - 0.1, 0.5) }));
                  }}
                >
                  –
                </button>
                <button
                  className="btn btn-light btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomModal((z) => ({ ...z, scale: Math.min(z.scale + 0.1, 3) }));
                  }}
                >
                  +
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomModal({ show: false, src: "", scale: 1 });
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </MainCard>
    </>
  );
};

export default CustomersPage;