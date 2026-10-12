import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ordersApi } from "../../../services/api";
import { filterInvoices } from "../utils/invoiceUtils";

export default function useInvoices() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await ordersApi.getAll();

      setOrders(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to load invoices:", error);
      alert("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredOrders = useMemo(
    () => filterInvoices(orders, search),
    [orders, search]
  );

  const fetchInvoice = async (order) => {
    try {
      const response = await ordersApi.getOne(order.id);

      const result = response.data;
      const invoice = result?.data ?? result;

      if (!invoice || typeof invoice !== "object") {
        throw new Error("Invalid invoice response");
      }

      return invoice;
    } catch (error) {
      console.error("Failed to fetch invoice details:", error);

      alert(
        "Could not fetch invoice details. Please check the console."
      );

      return null;
    }
  };

  return {
    orders,
    filteredOrders,
    loading,
    search,
    setSearch,
    loadInvoices,
    fetchInvoice,
  };
}