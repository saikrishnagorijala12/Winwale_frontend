import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../context/ClientContext";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  ExternalLink,
  Inbox,
  Loader2,
  Check,
} from "lucide-react";
import { Product } from "../types/product.types";
import { productService } from "../services/productService";
import { toast } from "sonner";
import { useDebounce } from "../hooks/useDebounce";

export default function ClientProducts() {
  const navigate = useNavigate();
  const { selectedClientId } = useClient();

  const clientId = selectedClientId;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const itemsPerPage = 50;

  useEffect(() => {
    if (clientId) {
      fetchProducts(currentPage, debouncedSearchTerm);
    } else {
      setLoading(false);
    }
  }, [clientId, currentPage, debouncedSearchTerm]);

  const fetchProducts = async (page: number, search: string) => {
    if (!clientId) return;
    try {
      setLoading(true);
      const data = await productService.getProductsByClient(clientId, {
        page,
        page_size: itemsPerPage,
        search: search || undefined
      });
      setProducts(data.items);
      setTotalItems(data.total);
      setTotalPages(data.total_pages);
    } catch (err: any) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };



  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto">
        {/* Navigation & Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {products[0]?.client_name ||
                  (clientId ? "Client" : "No Client Selected")}{" "}
                Products
              </h1>
              <p className="text-slate-500">
                {clientId
                  ? `Managing ${products.length} catalog items`
                  : "Please select a client from the Clients page"}
              </p>
            </div>
          </div>
          <div className="mx-auto bg-white p-4 rounded-4xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Search by name, manufacturer, or part number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20  outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-5 font-semibold text-slate-600 text-sm">
                    Item Name
                  </th>
                  <th className="text-left p-5 font-semibold text-slate-600 text-sm">
                    Type
                  </th>
                  <th className="text-left p-5 font-semibold text-slate-600 text-sm">
                    Manufacturer
                  </th>
                  <th className="text-left p-5 font-semibold text-slate-600 text-sm">
                    MFR Part #
                  </th>
                  <th className="text-left p-5 font-semibold text-slate-600 text-sm">
                    Price
                  </th>
                  <th className="text-left p-5 font-semibold text-slate-600 text-sm">
                    UOM
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                        <span className="text-sm text-slate-500 font-medium">Loading Products...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                          <Inbox className="w-8 h-8 text-slate-300" />
                        </div>

                        <h3 className="text-base font-bold text-slate-500">
                          No products found
                        </h3>

                        {searchTerm && (
                          <p className="text-xs text-slate-400">
                            Try adjusting your search or filters
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.product_id}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {product.item_name}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-50">
                          {product.item_description}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {product.item_type === "B" ? (
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                            Base
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                            Accessory
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.manufacturer}
                      </td>

                      <td className="px-6 py-4 text-sm font-mono text-slate-500">
                        {product.manufacturer_part_number}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {formatCurrency(product.commercial_list_price)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.uom || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-slate-100">
              {/* Left Side: Summary */}
              <div className="hidden sm:block">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(
                      startIndex + itemsPerPage,
                      totalItems,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {totalItems}
                  </span>{" "}
                  products
                </p>
              </div>

              {/* Right Side: Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5 mx-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-slate-400 font-medium">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${page === currentPage
                            ? "bg-[#3399cc] text-white shadow-blue-200 "
                            : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* RIGHT DRAWER */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedProduct.item_type === "A" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {selectedProduct.item_type === "A"
                      ? "Accessory"
                      : "Base Product"}
                  </span>
                  {selectedProduct.hazmat && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase">
                      Hazmat
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedProduct.item_name}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium italic">
                  {selectedProduct.item_description}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
              {/* Product Photo - If available */}
              {selectedProduct.photo_path && (
                <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedProduct.photo_path}
                    alt={selectedProduct.item_name}
                    className="h-full w-full object-contain p-4"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}

              <DrawerSection title="Core Identifiers">
                <DrawerField
                  label="Client"
                  value={selectedProduct.client_name}
                />
                <DrawerField
                  label="Client Part #"
                  value={selectedProduct.client_part_number}
                />
                <DrawerField
                  label="Mfr Part #"
                  value={selectedProduct.manufacturer_part_number}
                />
                <DrawerField
                  label="Manufacturer"
                  value={selectedProduct.manufacturer}
                />
              </DrawerSection>

              <DrawerSection title="Physical Specifications">
                <DrawerField
                  label="Dimensions (L x W x H)"
                  value={
                    selectedProduct.length
                      ? `${selectedProduct.length} x ${selectedProduct.width} x ${selectedProduct.height} ${selectedProduct.physical_uom || ""}`
                      : null
                  }
                />
                <DrawerField
                  label="Weight"
                  value={
                    selectedProduct.weight_lbs
                      ? `${selectedProduct.weight_lbs} lbs`
                      : null
                  }
                />
                <DrawerField
                  label="Warranty"
                  value={selectedProduct.warranty_period}
                />
                <DrawerField
                  label="Quantity per Pack"
                  value={`${selectedProduct.quantity_per_pack || 1} ${selectedProduct.quantity_unit_uom || ""}`}
                />
              </DrawerSection>

              <DrawerSection title="Pricing & Classification">
                <DrawerField
                  label="Commercial List Price"
                  value={formatCurrency(selectedProduct.commercial_list_price)}
                />
                <DrawerField label="UOM" value={selectedProduct.uom} />
                <DrawerField label="SIN" value={selectedProduct.sin} />
                <DrawerField label="NSN" value={selectedProduct.nsn} />
                <DrawerField label="UPC" value={selectedProduct.upc} />
                <DrawerField label="UNSPSC" value={selectedProduct.unspsc} />
              </DrawerSection>

              <DrawerSection title="Compliance & Environment">
                <DrawerField
                  label="Country of Origin"
                  value={selectedProduct.country_of_origin}
                />
                <DrawerField
                  label="Recycled Content"
                  value={
                    selectedProduct.recycled_content_percent
                      ? `${selectedProduct.recycled_content_percent}%`
                      : "0%"
                  }
                />
                <DrawerField
                  label="Hazmat Status"
                  value={selectedProduct.hazmat ? "Yes" : "No"}
                />
                <DrawerField
                  label="Product Info Code"
                  value={selectedProduct.product_info_code}
                />
              </DrawerSection>

              <DrawerSection title="Resources & Links">
                <div className="col-span-2 flex flex-col gap-3">
                  {selectedProduct.product_url && (
                    <a
                      href={selectedProduct.product_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 text-slate-700 hover:text-[#3399cc] font-semibold text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:border-[#3399cc]/30"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink size={16} /> Product Page
                      </span>
                      <ChevronRight size={14} className="text-slate-400" />
                    </a>
                  )}
                  {selectedProduct.url_508 && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 text-slate-700 hover:text-[#3399cc] font-semibold text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:border-[#3399cc]/30"
                    >
                      <span className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-500" /> 508
                        Compliance Link
                      </span>
                      <ChevronRight size={14} className="text-slate-400" />
                    </a>
                  )}
                </div>
              </DrawerSection>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                  <span>
                    Created:{" "}
                    {selectedProduct.created_time
                      ? new Date(
                        selectedProduct.created_time,
                      ).toLocaleDateString("en-US")
                      : "N/A"}
                  </span>
                  <span>
                    Last Updated:{" "}
                    {selectedProduct.updated_time
                      ? new Date(
                        selectedProduct.updated_time,
                      ).toLocaleDateString("en-US")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-y-8 gap-x-4">{children}</div>
    </div>
  );
}

function DrawerField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wide">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800">{value ?? "—"}</p>
    </div>
  );
}
