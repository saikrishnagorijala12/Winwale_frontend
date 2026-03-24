import React from "react";
import { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/productUtils";
import { Tooltip } from "../shared/Tooltip";


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
        <div className="flex flex-col items-start">
          <Tooltip content={product.item_name} position="top">
            <div className="text-sm font-bold text-slate-800 group-hover:text-[#3399cc] transition-colors truncate max-w-[200px]">
              {product.item_name}
            </div>
          </Tooltip>
          {product.item_description && (
            <Tooltip content={product.item_description} position="top">
              <div className="text-xs text-slate-500 mt-1 truncate max-w-62.5 font-medium">
                {product.item_description}
              </div>
            </Tooltip>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${product.item_type === "A" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
        >
          {product.item_type === "A" ? "Accessory" : "Base"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 font-semibold truncate max-w-[150px]">
        <Tooltip content={product.client_name} position="top">
          {product.client_name}
        </Tooltip>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[150px]">
        <Tooltip content={product.manufacturer || ""} disabled={!product.manufacturer} position="top">
          {product.manufacturer || "—"}
        </Tooltip>
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