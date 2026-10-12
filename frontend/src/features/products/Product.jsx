import React  from "react";
import { useState } from "react";
import { Plus } from "lucide-react";

import useProducts from "./hooks/useProducts";
import ProductToolbar from "./components/ProductToolbar";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";

import { createEmptyProductForm } from "./utils/productUtils";

export default function Products() {
  const {
    filteredProducts,
    categories,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    loadProducts,
    saveProduct,
    deleteProduct,
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(createEmptyProductForm);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(createEmptyProductForm());
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      selling_price: product.selling_price ?? "",
      purchase_price: product.purchase_price ?? "",
      gst: product.gst ?? 18,
      stock: product.stock ?? "",
      low_stock_limit: product.low_stock_limit ?? 5,
    });

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

    const saved = await saveProduct(form, editingProduct);

    if (saved) {
      setShowModal(false);
      setEditingProduct(null);
      setForm(createEmptyProductForm());
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage products, pricing and inventory levels.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
        onRefresh={loadProducts}
        loading={loading}
      />

      <ProductTable
        products={filteredProducts}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteProduct}
      />

      <ProductForm
        open={showModal}
        editingProduct={editingProduct}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}