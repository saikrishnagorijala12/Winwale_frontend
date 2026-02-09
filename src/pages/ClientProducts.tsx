import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  ExternalLink,
  Inbox,
  Loader2,
} from "lucide-react";
import api from "../lib/axios";

interface Product {
  product_id: number;
  client: string;

  item_type: string;
  item_name: string;
  item_description?: string;

  manufacturer: string;
  manufacturer_part_number: string;
  client_part_number?: string;

  sin?: string;
  commercial_list_price?: number;

  country_of_origin?: string;
  recycled_content_percent?: number;

  uom?: string;
  quantity_per_pack?: number;
  quantity_unit_uom?: string;

  nsn?: string;
  upc?: string;
  unspsc?: string;

  hazmat?: boolean;
  product_info_code?: string;

  url_508?: string;
  product_url?: string;

  created_time: string;
  updated_time: string;
}

export default function ClientProducts() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [clientId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/client/${clientId}`);
      setProducts(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturer_part_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-[#24578f]" />
          <span className="text-slate-400 font-bold">Loading Products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto">
        {/* Navigation & Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#3399cc] transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Clients
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {products[0]?.client || "Client"} Products
              </h1>
              <p className="text-slate-500">
                Managing {products.length} catalog items
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative group">
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
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
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
                {paginatedProducts.length === 0 ? (
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
                  paginatedProducts.map((product) => (
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
                      filteredProducts.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredProducts.length}
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
                          className={`inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                            page === currentPage
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
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedProduct.item_name}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedProduct.item_description}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <Section title="Classification">
                <Field label="SIN" value={selectedProduct.sin} />
                <Field label="NSN" value={selectedProduct.nsn} />
                <Field label="UPC" value={selectedProduct.upc} />
                <Field label="UNSPSC" value={selectedProduct.unspsc} />
              </Section>

              <Section title="Pricing & Shipping">
                <Field
                  label="List Price"
                  value={formatCurrency(selectedProduct.commercial_list_price)}
                />
                <Field label="UOM" value={selectedProduct.uom} />
                <Field
                  label="Qty Per Pack"
                  value={selectedProduct.quantity_per_pack}
                />
                <Field label="COO" value={selectedProduct.country_of_origin} />
              </Section>

              <Section title="Compliance">
                <Field
                  label="Country of Origin"
                  value={selectedProduct.country_of_origin}
                />
                <Field
                  label="Recycled %"
                  value={selectedProduct.recycled_content_percent}
                />
              </Section>

              <Section title="Documents & Links">
                <div className="col-span-2 space-y-2">
                  {selectedProduct.product_url && (
                    <a
                      href={selectedProduct.product_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#3399cc] hover:underline font-medium"
                    >
                      <ExternalLink size={14} /> View Product Website
                    </a>
                  )}
                  {selectedProduct.url_508 && (
                    <a
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#3399cc] hover:underline font-medium"
                    >
                      <ExternalLink size={14} /> 508 Compliance Document
                    </a>
                  )}
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-900">{value ?? "-"}</p>
    </div>
  );
}
