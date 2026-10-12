import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { productsApi } from "../../../services/api";

import {
  createEmptyProductForm,
  filterProducts,
} from "../utils/productUtils";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await productsApi.getAll();

      setProducts(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(
    () => filterProducts(products, search, categoryFilter),
    [products, search, categoryFilter]
  );

  const saveProduct = async (form, editingProduct) => {
    if (!form.name.trim()) {
      alert("Product name is required.");
      return false;
    }

    if (!form.sku.trim()) {
      alert("SKU is required.");
      return false;
    }

    if (
      form.selling_price === "" ||
      !Number.isFinite(Number(form.selling_price)) ||
      Number(form.selling_price) < 0
    ) {
      alert("Enter a valid selling price.");
      return false;
    }

    try {
      const productData = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category.trim(),
        selling_price: Number(form.selling_price),
        purchase_price: Number(form.purchase_price || 0),
        gst: Number(form.gst || 0),
        stock: Number(form.stock || 0),
        low_stock_limit: Number(form.low_stock_limit || 0),
      };

      if (editingProduct) {
        await productsApi.update(
          editingProduct.id,
          productData
        );
      } else {
        await productsApi.create(productData);
      }

      await loadProducts();

      alert(
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully."
      );

      return true;
    } catch (error) {
      console.error("Failed to save product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save product."
      );

      return false;
    }
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return false;

    try {
      await productsApi.delete(product.id);
      await loadProducts();

      alert("Product deleted successfully.");
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );

      return false;
    }
  };

  return {
    products,
    filteredProducts,
    categories: [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ],
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    loadProducts,
    saveProduct,
    deleteProduct,
    createEmptyProductForm,
  };
}