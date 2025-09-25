// validateRequiredFields.js
export const validateRequiredFields = (formData, steps) => {
  // collect required fields
  const requiredFields = steps.flatMap(step =>
    step.fields.filter(f => f.required).map(f => f.name)
  );

  const getValue = (obj, key) => {
    if (key.startsWith("billing_")) {
      return obj.billingAddresses?.[0]?.[key];
    }
    if (key.startsWith("shipping_")) {
      return obj.shippingAddresses?.[0]?.[key];
    }
    if (key.startsWith("register_") || key.startsWith("contact_person")) {
      return obj.contact?.[key];
    }
    if (
      [
        "annual_turnover",
        "no_counters_in_chain",
        "list_of_other_products",
        "list_of_other_companies",
        "appoint_date"
      ].includes(key)
    ) {
      return obj.businessDetail?.[key];
    }
    if (
      [
        "tally_name",
        "cust_branch",
        "dispatch_store",
        "cust_category",
        "price_list_code",
        "disc_code",
        "sales_person",
        "allocated_cre",
        "zone"
      ].includes(key)
    ) {
      return obj.accountDetail?.[key];
    }
    return obj[key];
  };

  // find missing required fields
  return requiredFields.filter(field => {
    const val = getValue(formData, field);
    return val === "" || val === null || val === undefined;
  });
};
