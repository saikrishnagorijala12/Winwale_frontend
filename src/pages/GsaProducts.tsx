import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Client, Product } from "../types/product.types";
import { productService } from "../services/productService";
import { clientService } from "../services/clientService";
import ProductsHeader from "../components/products/ProductsHeader";
import ProductsFilters from "../components/products/ProductsFilters";
import ProductsTable from "../components/products/ProductsTable";
import ProductDrawer from "../components/products/ProductDrawer";
import { useDebounce } from "../hooks/useDebounce";
import ConfirmationModal from "../components/shared/ConfirmationModal";

export default function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isConfirmExportOpen, setIsConfirmExportOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [exportableCount, setExportableCount] = useState(0);

  const itemsPerPage = 50;

  const fetchProducts = async (page: number, search: string, clientId?: number) => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts({
        page,
        page_size: itemsPerPage,
        search: search || undefined,
        client_id: clientId,
      });
      setProducts(data.items);
      setTotalItems(data.total);
      setTotalPages(data.total_pages);
    } catch (err: any) {
      if (err?.status === 404) {
        setProducts([]);
        setTotalItems(0);
      } else {
        toast.error(err?.message || "Failed to load products.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExportableCount = async (clientId?: number) => {
    try {
      const data = await productService.getAllProducts({
        page: 1,
        page_size: 1,
        client_id: clientId,
      });
      setExportableCount(data.total);
    } catch (err: any) {
      console.error("Failed to fetch exportable count:", err);
      setExportableCount(0);
    }
  };

  useEffect(() => {
    const initClients = async () => {
      try {
        setLoadingClients(true);
        const clientRes = await clientService.getApprovedClients();
        setClients(clientRes);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load clients.");
      } finally {
        setLoadingClients(false);
      }
    };

    initClients();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchTerm, selectedClient?.client_id);
  }, [currentPage, debouncedSearchTerm, selectedClient]);

  useEffect(() => {
    fetchExportableCount(selectedClient?.client_id);
  }, [selectedClient]);

  const handleClientSelect = (client: Client | null) => {
    setSelectedClient(client);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const blob = await productService.exportProducts(
        selectedClient?.client_id
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const dateStr = new Date().toISOString().split("T")[0];

      if (selectedClient) {
        a.download = `${selectedClient.company_name}_products_${dateStr}.xlsx`;
      } else {
        a.download = `all_products_${dateStr}.xlsx`;
      }

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Export completed successfully.");
      setIsConfirmExportOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to export products.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      <div className="mx-auto">
        <ProductsHeader
          onUploadClick={() => navigate("/gsa-products/upload")}
          onExportClick={() => setIsConfirmExportOpen(true)}
          isExporting={isExporting}
          totalCount={totalItems}
        />

        <ProductsFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          clients={clients}
          selectedClient={selectedClient}
          onClientSelect={handleClientSelect}
          isLoading={loadingClients}
        />

        <ProductsTable
          products={products}
          totalItems={totalItems}
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

      <ConfirmationModal
        isOpen={isConfirmExportOpen}
        onClose={() => setIsConfirmExportOpen(false)}
        onConfirm={handleExport}
        title="Export GSA Products"
        message={
          selectedClient
            ? <>Export all products for <span className="font-bold text-slate-800">{selectedClient.company_name}</span> to Excel?</>
            : "Export all products across all clients to Excel?"
        }
        details={[
          { label: "Client", value: selectedClient?.company_name ?? "All Clients" },
          { label: "Total Products", value: exportableCount.toLocaleString() },
        ]}
        confirmText="Yes, Export"
        cancelText="Cancel"
        isSubmitting={isExporting}
        variant="blue"
      />
    </div>
  );
}
