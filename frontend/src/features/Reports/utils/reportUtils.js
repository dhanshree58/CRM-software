export const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export const getReportData = (report) => {
  const salesData = report?.salesChart || report?.sales || [];
  const productData =
    report?.productSales || report?.topProducts || [];
  const paymentData =
    report?.paymentChart || report?.payments || [];
  const orderStatusData =
    report?.statusChart || report?.orderStatus || [];

  const totalSales =
    report?.totalSales || report?.summary?.totalSales || 0;
  const totalOrders =
    report?.totalOrders || report?.summary?.totalOrders || 0;
  const totalCustomers =
    report?.totalCustomers ||
    report?.summary?.totalCustomers ||
    0;

  const averageOrderValue =
    Number(totalOrders) > 0
      ? Number(totalSales) / Number(totalOrders)
      : 0;

  return {
    salesData,
    productData,
    paymentData,
    orderStatusData,
    totalSales,
    totalOrders,
    totalCustomers,
    averageOrderValue,
  };
};

export const exportReportCSV = (reportData) => {
  const {
    totalSales,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    productData,
  } = reportData;

  const rows = [
    ["CRM SALES REPORT"],
    [],
    ["Metric", "Value"],
    ["Total Sales", totalSales],
    ["Total Orders", totalOrders],
    ["Total Customers", totalCustomers],
    ["Average Order Value", averageOrderValue],
    [],
  ];

  if (productData.length > 0) {
    rows.push(
      ["Top Products"],
      ["Product", "Quantity", "Sales"]
    );

    productData.forEach((product) => {
      rows.push([
        product.product_name || product.name || "-",
        product.quantity || product.total_quantity || 0,
        product.sales || product.total_sales || 0,
      ]);
    });
  }

  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "").replaceAll('"', '""');
          return `"${text}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "crm-sales-report.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};