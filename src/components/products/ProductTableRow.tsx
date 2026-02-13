import React from "react";
import { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/productUtils";

interface ProductTableRowProps {
  product: Product;
  onClick: () => void;
}

export default function ProductTableRow({
  product,
  onClick,
}: ProductTableRowProps) {
  return (
    <tr
      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
      onClick={onClick}
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
      <td className="px-6 py-4 text-sm text-slate-600 font-semibold">
        {product.client_name}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        {product.manufacturer}
      </td>
      <td className="px-6 py-4 text-sm font-mono text-slate-600 font-medium">
        {product.manufacturer_part_number}
      </td>
      <td className="px-6 py-4 text-sm font-black text-slate-900">
        {formatCurrency(product.commercial_list_price)}
      </td>
      <td className="px-6 py-4 text-sm font-mono text-slate-600">
        {product.uom}
      </td>
    </tr>
  );
}