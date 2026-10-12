import React from "react"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ordersApi,
  customersApi,
  productsApi,
} from "../../../services/api";

import {
  createEmptyOrderForm,
  filterOrders,
} from "../utils/orderUtils";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [ordersRes, customersRes, productsRes] =
        await Promise.all([
          ordersApi.getAll(),
          customersApi.getAll(),
          productsApi.getAll(),
        ]);

      setOrders(
        Array.isArray(ordersRes.data) ? ordersRes.data : []
      );
      setCustomers(
        Array.isArray(customersRes.data) ? customersRes.data : []
      );
      setProducts(
        Array.isArray(productsRes.data) ? productsRes.data : []
      );
    } catch (error) {
      console.error("Failed to load orders:", error);
      alert("Failed to load order data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredOrders = useMemo(
    () => filterOrders(orders, search, statusFilter),
    [orders, search, statusFilter]
  );

  const createOrder = async (form) => {
    if (!form.customer_id) {
      alert("Please select a customer.");
      return false;
    }

    const validItems = form.items.filter(
      (item) => item.product_id && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one product.");
      return false;
    }

    try {
      await ordersApi.create({
        customer_id: Number(form.customer_id),
        payment_method: form.payment_method,
        discount: Number(form.discount),
        items: validItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });

      await loadData();
      alert("Order created successfully.");
      return true;
    } catch (error) {
      console.error("Failed to create order:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create order."
      );

      return false;
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      await loadData();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    }
  };

  const fetchOrder = async (order) => {
    try {
      const response = await ordersApi.getOne(order.id);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      return order;
    }
  };

  return {
    orders,
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
    createEmptyOrderForm,
  };
}