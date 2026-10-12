export const createEmptyOrderForm = () => ({
  customer_id: "",
  payment_method: "Cash",
  discount: 0,
  items: [
    {
      product_id: "",
      quantity: 1,
    },
  ],
});

export const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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

export const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "delivered" || normalized === "completed") {
    return "status delivered";
  }

  if (normalized === "processing") return "status processing";
  if (normalized === "shipped") return "status shipped";
  if (normalized === "cancelled") return "status cancelled";

  return "status pending";
};

export const filterOrders = (orders, search, statusFilter) => {
  const query = search.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesSearch = [
      order.order_number,
      order.customer_name,
      order.customer_phone,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

    const matchesStatus =
      statusFilter === "ALL" ||
      String(order.status || "").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });
};

export const calculateItemPrice = (products, productId) => {
  const product = products.find(
    (item) => Number(item.id) === Number(productId)
  );

  return product ? Number(product.selling_price || 0) : 0;
};

export const calculateOrderTotals = (items, products, discount) => {
  const subtotal = items.reduce((total, item) => {
    const price = calculateItemPrice(products, item.product_id);
    return total + price * Number(item.quantity || 0);
  }, 0);

  const actualDiscount = Math.max(Number(discount || 0), 0);
  const tax = Math.max(subtotal - actualDiscount, 0) * 0.18;
  const total = Math.max(subtotal - actualDiscount + tax, 0);

  return {
    subtotal,
    discount: actualDiscount,
    tax,
    total,
  };
};