import React from "react";
import { Loader2, Inbox } from "lucide-react";
import { Product, Client } from "../../types/product.types";
import ProductTableRow from "./ProductTableRow";
import Pagination from "../shared/Pagination";

interface ProductsTableProps {
  products: Product[];
  totalItems: number;
  loading: boolean;
  selectedClient: Client | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  onProductClick: (product: Product) => void;
  onPageChange: (page: number) => void;
}

export default function ProductsTable({
  products,
  totalItems,
  loading,
  selectedClient,
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  onProductClick,
  onPageChange,
}: ProductsTableProps) {
  return (
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
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                    <p className="text-sm text-slate-500 font-medium">
                      Loading Products...
                    </p>
                  </div>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductTableRow
                  key={product.product_id}
                  product={product}
                  onClick={() => onProductClick(product)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                      <Inbox className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-base font-bold text-slate-500">
                      {selectedClient
                        ? "No products found for this client"
                        : "No products found"}
                    </h3>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        label="products"
      />
    </div>
  );
}