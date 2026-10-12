import React from "react"
import { useState } from "react";
import { Plus } from "lucide-react";

import useDeliveries from "./hooks/useDeliveries";
import DeliveryToolbar from "./components/DeliveryToolbar";
import DeliveryTable from "./components/DeliveryTable";
import DeliveryForm from "./components/DeliveryForm";
import DeliveryDetails from "./components/DeliveryDetails";

export default function Deliveries() {
  const {
    filteredDeliveries,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loadDeliveries,
    saveDelivery,
    emptyDeliveryForm,
  } = useDeliveries();

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [form, setForm] = useState({ ...emptyDeliveryForm });

  const openAddModal = () => {
    setEditingDelivery(null);
    setForm({ ...emptyDeliveryForm });
    setShowModal(true);
  };

  const openEditModal = (delivery) => {
    setEditingDelivery(delivery);

    setForm({
      order_id: delivery.order_id || "",
      delivery_person: delivery.delivery_person || "",
      phone: delivery.phone || "",
      address: delivery.address || "",
      status: delivery.status || "ASSIGNED",
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

    const saved = await saveDelivery(form, editingDelivery);

    if (saved) {
      setShowModal(false);
      setEditingDelivery(null);
      setForm({ ...emptyDeliveryForm });
    }
  };

  const viewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Deliveries</h1>
          <p>
            Manage delivery assignments and delivery status.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Assign Delivery
        </button>
      </div>

      <DeliveryToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onRefresh={loadDeliveries}
        loading={loading}
      />

      <DeliveryTable
        deliveries={filteredDeliveries}
        loading={loading}
        onView={viewDelivery}
        onEdit={openEditModal}
      />

      <DeliveryForm
        open={showModal}
        editingDelivery={editingDelivery}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />

      <DeliveryDetails
        delivery={selectedDelivery}
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEdit={openEditModal}
      />
    </div>
  );
}