import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./features/customers/Customers";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Deliveries from "./pages/Deliveries";
import Reports from "./pages/Reports";

function App() {
  return (
    <div className="app">

      <Sidebar />

      <div className="main">

        <Header />

        <main className="content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/invoices"
              element={<Invoices />}
            />

            <Route
              path="/deliveries"
              element={<Deliveries />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;

