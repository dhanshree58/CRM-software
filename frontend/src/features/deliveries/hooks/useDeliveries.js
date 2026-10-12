import { useCallback, useEffect, useMemo, useState } from "react";
import { deliveriesApi } from "../../../services/api";
import {
  emptyDeliveryForm,
  filterDeliveries,
} from "../utils/deliveryUtils";

export default function useDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadDeliveries = useCallback(async () => {
    try {
      setLoading(true);

      const response = await deliveriesApi.getAll();

      setDeliveries(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to load deliveries:", error);
      alert("Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const filteredDeliveries = useMemo(
    () => filterDeliveries(deliveries, search, statusFilter),
    [deliveries, search, statusFilter]
  );

  const saveDelivery = async (form, editingDelivery) => {
    if (!form.order_id) {
      alert("Order ID is required.");
      return false;
    }

    if (!form.delivery_person.trim()) {
      alert("Delivery person is required.");
      return false;
    }

    if (!form.phone.trim()) {
      alert("Delivery phone number is required.");
      return false;
    }

    if (!form.address.trim()) {
      alert("Delivery address is required.");
      return false;
    }

    try {
      const deliveryData = {
        order_id: Number(form.order_id),
        delivery_person: form.delivery_person.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        status: form.status,
      };

      if (editingDelivery) {
        await deliveriesApi.update(
          editingDelivery.id,
          deliveryData
        );
      } else {
        await deliveriesApi.create(deliveryData);
      }

      await loadDeliveries();

      alert(
        editingDelivery
          ? "Delivery updated successfully."
          : "Delivery assigned successfully."
      );

      return true;
    } catch (error) {
      console.error("Failed to save delivery:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save delivery."
      );

      return false;
    }
  };

  return {
    deliveries,
    filteredDeliveries,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loadDeliveries,
    saveDelivery,
    emptyDeliveryForm,
  };
}