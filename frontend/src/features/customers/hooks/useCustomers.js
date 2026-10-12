import { useCallback, useEffect, useMemo, useState } from "react";
import { customersApi } from "../../../services/api";
import {
  emptyCustomerForm,
  filterCustomers,
} from "../utils/customerUtils";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await customersApi.getAll();

      setCustomers(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to load customers:", error);
      alert("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(
    () => filterCustomers(customers, search),
    [customers, search]
  );

  const saveCustomer = async (form, editingCustomer) => {
    if (!form.name.trim()) {
      alert("Customer name is required.");
      return false;
    }

    if (!form.phone.trim()) {
      alert("Phone number is required.");
      return false;
    }

    try {
      if (editingCustomer) {
        await customersApi.update(editingCustomer.id, form);
      } else {
        await customersApi.create(form);
      }

      await loadCustomers();

      alert(
        editingCustomer
          ? "Customer updated successfully."
          : "Customer added successfully."
      );

      return true;
    } catch (error) {
      console.error("Failed to save customer:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save customer."
      );

      return false;
    }
  };

  const createEmptyForm = () => ({ ...emptyCustomerForm });

  return {
    customers,
    filteredCustomers,
    loading,
    search,
    setSearch,
    loadCustomers,
    saveCustomer,
    createEmptyForm,
  };
}