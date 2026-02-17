import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Product, ProductsList } from "../types/product.types";
import { productService } from "../services/productService";
import { clientService } from "../services/clientService";
import ProductsHeader from "../components/products/ProductsHeader";
import ProductsFilters from "../components/products/ProductsFilters";
import ProductsTable from "../components/products/ProductsTable";
import ProductDrawer from "../components/products/ProductDrawer";

export default function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        setError("");

        const [prodRes, clientRes] = await Promise.allSettled([
          productService.getAllProducts(),
          clientService.getApprovedClients(),
        ]);

        if (prodRes.status === "fulfilled") {
          setProducts(prodRes.value.items);
        } else if (prodRes.reason?.response?.status === 404) {
          setProducts([]);
        } else {
          setError("Failed to load products");
        }

        if (clientRes.status === "fulfilled") {
          setClients(clientRes.value);
        }
      } catch {
        setError("Failed to initialize page data");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleClientSelect = async (client: Client | null) => {
    setSelectedClient(client);
    setCurrentPage(1);
    setError("");

    try {
      setLoading(true);
      if (!client) {
        const data = await productService.getAllProducts();
        setProducts(data.items);
      } else {
        const data = await productService.getProductsByClient(client.client_id);
        setProducts(data.items);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setProducts([]);
      } else {
        console.error("Filtering error", err);
        setError("Failed to fetch products for this client");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.manufacturer_part_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, startIndex, itemsPerPage]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await productService.exportProducts(selectedClient?.client_id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const dateStr = new Date().toISOString().split('T')[0];
      if (selectedClient) {
        a.download = `${selectedClient.company_name}_products_${dateStr}.xlsx`;
      } else {
        a.download = `all_products_${dateStr}.xlsx`;
      }

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      <div className="mx-auto">
        <ProductsHeader
          onUploadClick={() => navigate("/gsa-products/upload")}
          onExportClick={handleExport}
          isExporting={isExporting}
          totalCount={products.length}
        />

        <ProductsFilters
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          clients={clients}
          selectedClient={selectedClient}
          onClientSelect={handleClientSelect}
        />

        <ProductsTable
          products={paginatedProducts}
          filteredProducts={filteredProducts}
          loading={loading}
          selectedClient={selectedClient}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          onProductClick={setSelectedProduct}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}