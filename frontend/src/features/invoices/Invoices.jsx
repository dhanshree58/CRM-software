
import React, { useState } from "react";

import useInvoices from "./hooks/useInvoices";
import InvoiceToolbar from "./components/InvoiceToolbar";
import InvoiceTable from "./components/InvoiceTable";
import InvoicePreview from "./components/InvoicePreview";
import printInvoice from "./components/InvoicePrint";

export default function Invoices() {
  const {
    filteredOrders,
    loading,
    search,
    setSearch,
    loadInvoices,
    fetchInvoice,
  } = useInvoices();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const viewInvoice = async (order) => {
    setError("");
    try {
      const invoice = await fetchInvoice(order);

      if (!invoice) {
        setError("Invoice not found or the server returned no data.");
        return;
      }

      setSelectedInvoice(invoice);
      setShowModal(true);
    } catch (err) {
      console.error("Invoice fetch failed:", err);
      setError(err?.message || "Error fetching invoice. Please try again.");
    }
  };

  const closeInvoice = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  const handlePrint = () => {
    if (!selectedInvoice) {
      setError("No invoice loaded to print.");
      return;
    }
    printInvoice(selectedInvoice);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>Generate, view and print digital customer invoices.</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <InvoiceToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={loadInvoices}
        loading={loading}
      />

      <InvoiceTable
        invoices={filteredOrders}
        loading={loading}
        onView={viewInvoice}
      />

      <InvoicePreview
        invoice={selectedInvoice}
        open={showModal}
        onClose={closeInvoice}
        onPrint={handlePrint}
      />
    </div>
  );
}