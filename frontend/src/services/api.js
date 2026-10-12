import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});


/* =========================
   DASHBOARD
========================= */

export const dashboardApi = {
  get: () =>
    api.get("/dashboard"),

  getReports: () =>
    api.get("/dashboard/reports")
};


/* =========================
   CUSTOMERS
========================= */

export const customersApi = {
  getAll: () =>
    api.get("/customers"),

  create: (data) =>
    api.post("/customers", data),

  update: (id, data) =>
    api.put(`/customers/${id}`, data)
};


/* =========================
   PRODUCTS
========================= */

export const productsApi = {
  getAll: () =>
    api.get("/products"),

  create: (data) =>
    api.post("/products", data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`)
};


/* =========================
   ORDERS
========================= */

export const ordersApi = {
  getAll: () =>
    api.get("/orders"),

   getOne: (id) => api.get(`/orders/${id}`),

  get: (id) =>
    api.get(`/orders/${id}`),

  create: (data) =>
    api.post("/orders", data),

  updateStatus: (id, data) =>
    api.put(`/orders/${id}/status`, data)
};


/* =========================
   DELIVERIES
========================= */

export const deliveriesApi = {
  getAll: () =>
    api.get("/deliveries"),

  create: (data) =>
    api.post("/deliveries", data),

  update: (id, data) =>
    api.put(`/deliveries/${id}`, data)
};


export default api;