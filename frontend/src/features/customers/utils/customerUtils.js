export const emptyCustomerForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const filterCustomers = (customers, search) => {
  const query = search.trim().toLowerCase();

  if (!query) return customers;

  return customers.filter((customer) =>
    [
      customer.name,
      customer.phone,
      customer.email,
      customer.city,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    )
  );
};