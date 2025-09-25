export
 const initialFormData = {
  // Basic info
  cust_name: "",
  gst_no: "",
  udyam_reg_no: "",
  pan: "",
  aadhar: "",
  cust_status: "Active",

  // Billing address
  billingAddresses: [{
    billing_address: "",
    billing_city: "",
    billing_district: "",
    billing_state: "",
    billing_pin_code: ""
  }],

  // Shipping address
  shippingAddresses: [{
    shipping_address: "",
    shipping_city: "",
    shipping_district: "",
    shipping_state: "",
    shipping_pin_code: ""
  }],

  // Contact info
  contact: {
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

  // Business details
  businessDetail: {
    annual_turnover: "",
    no_counters_in_chain: "",
    list_of_other_products: "",
    list_of_other_companies: "",
    appoint_date: "",
    shop_location_link: "",
  },

  // Account details
  accountDetail: {
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

  // Documents
  documents: {}
};

export default initialFormData;