export const createEmptyProductForm = () => ({
  name: "",
  sku: "",
  category: "",
  selling_price: "",
  purchase_price: "",
  gst: 18,
  stock: "",
  low_stock_limit: 5,
});

export const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const getStockStatus = (product) => {
  const stock = Number(product.stock || 0);
  const limit = Number(product.low_stock_limit || 0);

  if (stock === 0) {
    return {
      text: "Out of Stock",
      className: "stock-out",
    };
  }

  if (stock <= limit) {
    return {
      text: "Low Stock",
      className: "stock-low",
    };
  }

  return {
    text: "In Stock",
    className: "stock-good",
  };
};

export const getCategories = (products) => [
  ...new Set(
    products
      .map((product) => product.category)
      .filter(Boolean)
  ),
];

export const filterProducts = (
  products,
  search,
  categoryFilter
) => {
  const query = search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch = [
      product.name,
      product.sku,
      product.category,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

    const matchesCategory =
      categoryFilter === "ALL" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
};