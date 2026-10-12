import React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";

import useCustomers from "./hooks/useCustomers";
import CustomerToolbar from "./components/CustomerToolbar";
import CustomerTable from "./components/CustomerTable";
import CustomerForm from "./components/CustomerForm";
import CustomerDetails from "./components/CustomerDetails";

import { emptyCustomerForm } from "./utils/customerUtils";

export default function Customers() {
  const {
    filteredCustomers,
    loading,
    search,
    setSearch,
    loadCustomers,
    saveCustomer,
  } = useCustomers();

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form, setForm] = useState({ ...emptyCustomerForm });

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm({ ...emptyCustomerForm });
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      pincode: customer.pincode || "",
    });

    setShowViewModal(false);
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const saved = await saveCustomer(form, editingCustomer);

    if (saved) {
      setShowModal(false);
      setEditingCustomer(null);
      setForm({ ...emptyCustomerForm });
    }
  };

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your customers and their order history.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <CustomerToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={loadCustomers}
        loading={loading}
      />

      <CustomerTable
        customers={filteredCustomers}
        loading={loading}
        onView={viewCustomer}
        onEdit={openEditModal}
      />

      <CustomerForm
        open={showModal}
        editingCustomer={editingCustomer}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />

      <CustomerDetails
        customer={selectedCustomer}
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEdit={openEditModal}
      />
    </div>
  );
}