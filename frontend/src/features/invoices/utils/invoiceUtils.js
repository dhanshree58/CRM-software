export const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getInvoiceNumber = (order) => {
  return (
    order?.invoice_number ||
    `INV-${order?.order_number ?? ""}`
  );
};

export const filterInvoices = (orders, search) => {
  const query = search.trim().toLowerCase();

  if (!query) return orders;

  return orders.filter((order) =>
    [
      order.order_number,
      order.customer_name,
      order.customer_phone,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    )
  );
};