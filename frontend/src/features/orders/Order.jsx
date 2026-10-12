import React from "react"
import { useState } from "react";
import { Plus } from "lucide-react";

import useOrders from "./hooks/useOrders";
import OrderToolbar from "./components/OrderToolbar";
import OrderTable from "./components/OrderTable";
import OrderForm from "./components/OrderForm";
import OrderDetails from "./components/OrderDetails";

import { createEmptyOrderForm } from "./utils/orderUtils";

export default function Orders() {
  const {
    customers,
    products,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    loadData,
    createOrder,
    updateStatus,
    fetchOrder,
  } = useOrders();

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState(createEmptyOrderForm);

  const openCreateModal = () => {
    setForm(createEmptyOrderForm());
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        { product_id: "", quantity: 1 },
      ],
    }));
  };

  const removeItem = (index) => {
    setForm((previous) => {
      if (previous.items.length === 1) return previous;

      return {
        ...previous,
        items: previous.items.filter((_, i) => i !== index),
      };
    });
  };

  const updateItem = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();

    const created = await createOrder(form);

    if (created) {
      setShowModal(false);
      setForm(createEmptyOrderForm());
    }
  };

  const viewOrder = async (order) => {
    setShowModal(false);
    setShowViewModal(false);
    setSelectedOrder(null);

    const result = await fetchOrder(order);

    setSelectedOrder(result);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders and order status.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          New Order
        </button>
      </div>

      <OrderToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onRefresh={loadData}
        loading={loading}
      />

      <OrderTable
        orders={filteredOrders}
        loading={loading}
        onView={viewOrder}
        onStatusChange={updateStatus}
      />

      <OrderForm
        open={showModal}
        customers={customers}
        products={products}
        form={form}
        onChange={handleChange}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onUpdateItem={updateItem}
        onDiscountChange={(value) =>
          setForm((previous) => ({
            ...previous,
            discount: value,
          }))
        }
        onSubmit={handleCreateOrder}
        onClose={() => setShowModal(false)}
      />

      <OrderDetails
        order={selectedOrder}
        open={showViewModal}
        onClose={closeViewModal}
      />
    </div>
  );
}