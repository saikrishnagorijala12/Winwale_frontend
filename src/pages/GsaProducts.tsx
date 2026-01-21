import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import { ROLES } from "@/src/types/roles.types";
import { getCurrentUser } from "../api/user";
import api from "../lib/axios";

interface Product {
  product_id: number;
  client_name: string;
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

export default function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string>("");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    const fetchUserRole = async () => {
      try {
        const user = await getCurrentUser();
        setUserRole(user.role);
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    fetchUserRole();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer_part_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleUploadClick = () => {
    navigate("/upload-gsa");
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3399cc] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Products</h1>
              <p className="text-slate-600">
                Manage and view all product information
              </p>
            </div>
            {userRole === ROLES.ADMIN && (
              <button onClick={handleUploadClick} className="btn-primary">
                <Upload size={20} />
                Upload GSA
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
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
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-transparent outline-none transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="mx-auto bg-white rounded-2xl shadow-xs border border-slate-100">
          <table className="w-full">
            <thead className="border-b-2 border-slate-200">
              <tr>
                <th className="text-left p-5 font-bold text-slate-700">
                  Item Name
                </th>
                <th className="text-left p-5 font-bold text-slate-700">Type</th>
                <th className="text-left p-5 font-bold text-slate-700">
                  Client
                </th>
                <th className="text-left p-5 font-bold text-slate-700">
                  Manufacturer
                </th>
                <th className="text-left p-5 font-bold text-slate-700">
                  MFR Part #
                </th>
                <th className="text-left p-5 font-bold text-slate-700">
                  Price
                </th>
                <th className="text-left p-5 font-bold text-slate-700">UOM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedProducts.map((product) => (
                <tr
                  key={product.product_id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {product.item_name}
                    </div>
                    {product.item_description && (
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-xs">
                        {product.item_description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.item_type === "A" && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        Accessory
                      </span>
                    )}
                    {product.item_type === "B" && (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        Base Product
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {product.client_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {product.manufacturer}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-mono">
                    {product.manufacturer_part_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {formatCurrency(product.commercial_list_price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {product.uom || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT DRAWER */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
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
                className="p-2 hover:bg-slate-200 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <Section title="Classification">
                <Field label="Client" value={selectedProduct.client_name} />
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
                <Field
                  label="Country of Origin"
                  value={selectedProduct.country_of_origin}
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
