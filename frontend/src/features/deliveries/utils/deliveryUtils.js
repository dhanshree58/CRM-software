export const emptyDeliveryForm = {
  order_id: "",
  delivery_person: "",
  phone: "",
  address: "",
  status: "ASSIGNED",
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

export const formatStatus = (status) => {
  return String(status || "")
    .replaceAll("_", " ")
    .replace(/\w\S*/g, (word) =>
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
    );
};

export const getStatusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "delivered" || value === "completed") {
    return "delivery-status delivered";
  }

  if (value === "out_for_delivery") {
    return "delivery-status shipped";
  }

  if (value === "assigned") {
    return "delivery-status processing";
  }

  if (value === "cancelled") {
    return "delivery-status cancelled";
  }

  return "delivery-status pending";
};

export const filterDeliveries = (
  deliveries,
  search,
  statusFilter
) => {
  const query = search.trim().toLowerCase();

  return deliveries.filter((delivery) => {
    const matchesSearch = [
      delivery.order_number,
      delivery.customer_name,
      delivery.delivery_person,
      delivery.phone,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

    const matchesStatus =
      statusFilter === "ALL" ||
      String(delivery.status || "").toUpperCase() ===
        statusFilter;

    return matchesSearch && matchesStatus;
  });
};