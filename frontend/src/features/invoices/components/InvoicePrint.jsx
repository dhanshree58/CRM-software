import React from "react";
import {
  formatCurrency,
  formatDate,
  getInvoiceNumber,
} from "../utils/invoiceUtils";

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

export default function printInvoice(order) {
  if (!order) {
    alert("No invoice selected.");
    return;
  }

  const invoiceWindow = window.open(
    "",
    "_blank",
    "width=1000,height=800"
  );

  if (!invoiceWindow) {
    alert("Please allow pop-ups to print the invoice.");
    return;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const invoiceNumber = getInvoiceNumber(order);

  const itemRows = items
    .map((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;

      // Calculate a fallback if the API doesn't provide line total.
      const lineTotal =
        item.total != null
          ? Number(item.total)
          : quantity * price;

      return `
        <tr>
          <td class="center">${index + 1}</td>
          <td>${escapeHtml(
            item.product_name || item.name || "-"
          )}</td>
          <td class="center">${quantity}</td>
          <td class="right">${formatCurrency(price)}</td>
          <td class="right">${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const subtotal = formatCurrency(order.subtotal);
  const discount = formatCurrency(order.discount);
  const tax = formatCurrency(order.tax);
  const total = formatCurrency(order.total);

  invoiceWindow.document.open();

  invoiceWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice ${escapeHtml(invoiceNumber)}</title>

        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #fff;
            color: #1f2937;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.5;
          }

          .invoice {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            padding-bottom: 22px;
            border-bottom: 2px solid #2563eb;
          }

          .company h1 {
            margin: 0 0 5px;
            color: #1d4ed8;
            font-size: 25px;
          }

          .company p {
            margin: 2px 0;
            color: #64748b;
          }

          .invoice-title {
            text-align: right;
            overflow-wrap: anywhere;
          }

          .invoice-title h2 {
            margin: 0 0 8px;
            color: #1d4ed8;
            font-size: 25px;
            letter-spacing: 2px;
          }

          .invoice-title p {
            margin: 3px 0;
          }

          .section-grid {
            display: flex;
            justify-content: space-between;
            gap: 25px;
            margin: 28px 0;
          }

          .section {
            flex: 1;
            min-width: 0;
            overflow-wrap: anywhere;
          }

          .section h3 {
            margin: 0 0 10px;
            color: #64748b;
            font-size: 11px;
            letter-spacing: 1px;
          }

          .section strong {
            display: block;
            margin-bottom: 5px;
            color: #111827;
            font-size: 13px;
          }

          .section p {
            margin: 3px 0;
          }

          table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            table-layout: fixed;
          }

          thead {
            display: table-header-group;
          }

          th {
            padding: 11px 8px;
            background: #eff6ff;
            color: #1e40af;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            border-bottom: 1px solid #bfdbfe;
          }

          td {
            padding: 11px 8px;
            border-bottom: 1px solid #e5e7eb;
            overflow-wrap: anywhere;
            vertical-align: top;
          }

          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          th:first-child,
          td:first-child {
            width: 8%;
          }

          th:nth-child(2),
          td:nth-child(2) {
            width: 38%;
          }

          th:nth-child(3),
          td:nth-child(3) {
            width: 12%;
          }

          th:nth-child(4),
          td:nth-child(4) {
            width: 20%;
          }

          th:nth-child(5),
          td:nth-child(5) {
            width: 22%;
          }

          .center {
            text-align: center;
          }

          .right {
            text-align: right;
          }

          .summary {
            width: 300px;
            max-width: 100%;
            margin: 25px 0 0 auto;
          }

          .summary-row,
          .summary-total {
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }

          .summary-row {
            padding: 7px 0;
          }

          .summary-row span,
          .summary-total span {
            color: #64748b;
          }

          .summary-total {
            margin-top: 8px;
            padding-top: 12px;
            border-top: 2px solid #1d4ed8;
            color: #1d4ed8;
            font-size: 16px;
            font-weight: bold;
          }

          .footer {
            margin-top: 45px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #64748b;
            font-size: 11px;
          }

          @media screen {
            body {
              padding: 30px;
              background: #f3f4f6;
            }

            .invoice {
              max-width: 800px;
              min-height: 500px;
              padding: 35px;
              background: #fff;
              box-shadow: 0 2px 12px #00000012;
            }
          }

          @media print {
            body {
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .invoice {
              max-width: none;
              padding: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>

      <body>
        <main class="invoice">
          <header class="header">
            <div class="company">
              <h1>BusinessCRM</h1>
              <p>Order Management System</p>
              <p>Customer Invoice</p>
            </div>

            <div class="invoice-title">
              <h2>INVOICE</h2>
              <p>
                <strong>Invoice No:</strong>
                ${escapeHtml(invoiceNumber)}
              </p>
              <p>
                <strong>Date:</strong>
                ${escapeHtml(formatDate(order.created_at))}
              </p>
            </div>
          </header>

          <section class="section-grid">
            <div class="section">
              <h3>BILL TO</h3>
              <strong>
                ${escapeHtml(
                  order.customer_name || "Walk-in Customer"
                )}
              </strong>
              <p>${escapeHtml(order.customer_phone || "-")}</p>
             <p>${escapeHtml(order.customer_address || "")}</p>
<p>${escapeHtml(
  [order.customer_city, order.customer_state, order.customer_pincode]
    .filter(Boolean)
    .join(", ")
)}</p>
${order.customer_email ? `<p>${escapeHtml(order.customer_email)}</p>` : ""}
            </div>

            <div class="section">
              <h3>ORDER DETAILS</h3>
              <p>
                <strong>Order:</strong>
                ${escapeHtml(order.order_number || "-")}
              </p>
              <p>
                <strong>Payment:</strong>
                ${escapeHtml(order.payment_method || "-")}
                <p>
  <strong>Payment Status:</strong>
  ${escapeHtml(order.payment_status || "-")}
</p>
              </p>
              <p>
                <strong>Status:</strong>
                ${escapeHtml(order.status || "-")}
              </p>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th class="right">Price</th>
                <th class="right">Total</th>
              </tr>
            </thead>

            <tbody>
              ${
                itemRows ||
                '<tr><td colspan="5">No item details available</td></tr>'
              }
            </tbody>
          </table>

          <section class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal}</strong>
            </div>

            <div class="summary-row">
              <span>Discount</span>
              <strong>-${discount}</strong>
            </div>

            <div class="summary-row">
              <span>GST / Tax</span>
              <strong>${tax}</strong>
            </div>

            <div class="summary-total">
              <span>Grand Total</span>
              <span>${total}</span>
            </div>
          </section>

          <footer class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>This is a computer-generated invoice.</p>
          </footer>
        </main>

        <script>
          window.addEventListener("load", function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 300);
          });

          window.addEventListener("afterprint", function () {
            window.close();
          });
        </script>
      </body>
    </html>
  `);

  invoiceWindow.document.close();
}
