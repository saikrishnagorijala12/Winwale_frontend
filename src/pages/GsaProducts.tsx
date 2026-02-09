import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ChevronDown,
  Check,
  Building2,
  Loader2,
  Inbox,
} from "lucide-react";
import { ROLES } from "@/src/types/roles.types";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

interface Client {
  client_id: number;
  company_name: string;
  company_email: string;
  status: string;
}

interface Product {
  product_id: number;
  client_id: number;
  client_name: string;
  item_type: string;
  item_name: string;
  item_description?: string;
  manufacturer: string;
  manufacturer_part_number: string;
  client_part_number?: string;
  commercial_list_price?: number;
  uom?: string;
  sin?: string;
  nsn?: string;
  upc?: string;
  unspsc?: string;
  quantity_per_pack?: number;
  quantity_unit_uom?: string;
  country_of_origin?: string;
  recycled_content_percent?: number;
  hazmat?: boolean;
  product_info_code?: string;
  product_url?: string;
  url_508?: string;
  length?: number;
  width?: number;
  height?: number;
  physical_uom?: string;
  weight_lbs?: number;
  warranty_period?: string;
  photo_path?: string;
  created_time?: string;
  updated_time?: string;
}

export default function ProductsPage() {
  const { user, status } = useAuth();
  const userRole = user?.role;
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const itemsPerPage = 10;

  const handleClientSelect = async (client: Client | null) => {
    setSelectedClient(client);
    setIsDropdownOpen(false);
    setClientSearch("");
    setCurrentPage(1);
    setError("");

    try {
      setLoading(true);
      if (!client) {
        const res = await api.get("/products");
        setProducts(res.data);
      } else {
        const res = await api.get(`/products/client/${client.client_id}`);
        setProducts(res.data);
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

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        setError("");

        const [prodRes, clientRes] = await Promise.allSettled([
          api.get("/products"),
          api.get("/clients/approved"),
        ]);

        if (prodRes.status === "fulfilled") {
          setProducts(prodRes.value.data);
        } else if (prodRes.reason?.response?.status === 404) {
          setProducts([]);
        } else {
          setError("Failed to load products");
        }

        if (clientRes.status === "fulfilled") {
          setClients(clientRes.value.data);
        }
      } catch {
        setError("Failed to initialize page data");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturer_part_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const filteredClients = clients.filter((c) =>
    c.company_name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center md:justify-between gap-6 mb-12 mx-auto">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Products
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Catalog management and inventory overview
            </p>
          </div>
            <button
              onClick={() => navigate("/gsa-products/upload")}
              className="flex items-center justify-center gap-2 bg-[#3399cc] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#2b82ad] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Upload size={18} />
              Upload GSA
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, manufacturer, or part number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all bg-white shadow-sm placeholder:text-slate-400"
            />
          </div>

          <div className="relative w-full md:w-80" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-4 py-3.5 bg-white border rounded-2xl cursor-pointer transition-all shadow-sm hover:border-slate-300 ${isDropdownOpen ? "border-[#3399cc] ring-4 ring-[#3399cc]/10" : "border-slate-200"}`}
            >
              <div className="flex items-center gap-3 overflow-hidden text-slate-700">
                <Building2 size={18} className="text-slate-400 shrink-0" />
                <span
                  className={`truncate font-medium ${!selectedClient ? "text-slate-400" : "text-slate-900"}`}
                >
                  {selectedClient ? selectedClient.company_name : "All Clients"}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={14}
                    />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Filter by company name..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#3399cc] bg-white transition-colors"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                  <div
                    onClick={() => handleClientSelect(null)}
                    className="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-slate-600">
                      Show All
                    </span>
                    {!selectedClient && (
                      <Check size={16} className="text-[#3399cc]" />
                    )}
                  </div>
                  {filteredClients.map((client) => (
                    <div
                      key={client.client_id}
                      onClick={() => handleClientSelect(client)}
                      className="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">
                          {client.company_name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tight">
                          {client.status}
                        </span>
                      </div>
                      {selectedClient?.client_id === client.client_id && (
                        <Check size={16} className="text-[#3399cc]" />
                      )}
                    </div>
                  ))}
                  {filteredClients.length === 0 && (
                    <div className="px-4 py-10 text-center text-slate-400 text-sm italic">
                      No companies found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative transition-all">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Item Description
                  </th>
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Client
                  </th>
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Manufacturer
                  </th>
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    MFR Part #
                  </th>
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Price
                  </th>
                  <th className="text-left px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    UOM
                  </th>
                </tr>
              </thead>
               <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-32">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-12 h-12 animate-spin text-[#24578f]" />
                        <span className="text-slate-400 font-bold tracking-widest text-[10px]">
                          Loading Products...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr
                      key={product.product_id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800 group-hover:text-[#3399cc] transition-colors">
                          {product.item_name}
                        </div>
                        {product.item_description && (
                          <div className="text-xs text-slate-500 mt-1 truncate max-w-62.5 font-medium">
                            {product.item_description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${product.item_type === "A" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
                        >
                          {product.item_type === "A" ? "Accessory" : "Base"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{product.client_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product.manufacturer}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600 font-medium">{product.manufacturer_part_number}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{formatCurrency(product.commercial_list_price)}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">{product.uom}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                          <Inbox className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-bold text-slate-500">
                          {selectedClient ? "No products found for this client" : "No products match your search"}
                        </h3>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredProducts.length > itemsPerPage && (
            <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500 font-medium">
                Showing{" "}
                <span className="text-slate-900 font-semibold">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="text-slate-900 font-semibold">
                  {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-semibold">
                  {filteredProducts.length}
                </span>{" "}
                products
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, idx) => (
                    <React.Fragment key={idx}>
                      {pageNum === "..." ? (
                        <span className="px-2 text-slate-400 font-medium">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(Number(pageNum))}
                          className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                  ${
                    currentPage === pageNum
                      ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Drawer */}
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
