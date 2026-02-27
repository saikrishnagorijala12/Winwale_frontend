import React from "react";
import { X, ExternalLink, ChevronRight, Check } from "lucide-react";
import { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/productUtils";

interface ProductDrawerProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDrawer({
  product,
  onClose,
}: ProductDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${product.item_type === "A" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
              >
                {product.item_type === "A" ? "Accessory" : "Base Product"}
              </span>
              {product.hazmat && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase">
                  Hazmat
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {product.item_name}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium italic">
              {product.item_description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
          {product.photo_path && (
            <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
              <img
                src={product.photo_path}
                alt={product.item_name}
                className="h-full w-full object-contain p-4"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          <DrawerSection title="Core Identifiers">
            <DrawerField label="Client" value={product.client_name} />
            <DrawerField
              label="Client Part #"
              value={product.client_part_number}
            />
            <DrawerField
              label="Mfr Part #"
              value={product.manufacturer_part_number}
            />
            <DrawerField label="Manufacturer" value={product.manufacturer} />
          </DrawerSection>

          <DrawerSection title="Physical Specifications">
            <DrawerField
              label="Dimensions (L x W x H)"
              value={
                product.length
                  ? `${product.length} x ${product.width} x ${product.height} ${product.physical_uom || ""}`
                  : null
              }
            />
            <DrawerField
              label="Weight"
              value={product.weight_lbs ? `${product.weight_lbs} lbs` : null}
            />
            <DrawerField label="Warranty" value={product.warranty_period} />
            <DrawerField
              label="Quantity per Pack"
              value={`${product.quantity_per_pack || 1} ${product.quantity_unit_uom || ""}`}
            />
          </DrawerSection>

          <DrawerSection title="Pricing & Classification">
            <DrawerField
              label="Commercial List Price"
              value={formatCurrency(product.commercial_list_price)}
            />
            <DrawerField label="UOM" value={product.uom} />
            <DrawerField label="SIN" value={product.sin} />
            <DrawerField label="NSN" value={product.nsn} />
            <DrawerField label="UPC" value={product.upc} />
            <DrawerField label="UNSPSC" value={product.unspsc} />
          </DrawerSection>

          <DrawerSection title="Compliance & Environment">
            <DrawerField
              label="Country of Origin"
              value={product.country_of_origin}
            />
            <DrawerField
              label="Recycled Content"
              value={
                product.recycled_content_percent
                  ? `${product.recycled_content_percent}%`
                  : "0%"
              }
            />
            <DrawerField
              label="Hazmat Status"
              value={product.hazmat ? "Yes" : "No"}
            />
            <DrawerField
              label="Product Info Code"
              value={product.product_info_code}
            />
          </DrawerSection>

          <DrawerSection title="Resources & Links">
            <div className="col-span-2 flex flex-col gap-3">
              {product.product_url && (
                <a
                  href={product.product_url}
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
              {product.url_508 && (
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
                {product.created_time
                  ? new Date(product.created_time).toLocaleDateString("en-US")
                  : "N/A"}
              </span>
              <span>
                Last Updated:{" "}
                {product.updated_time
                  ? new Date(product.updated_time).toLocaleDateString("en-US")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
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