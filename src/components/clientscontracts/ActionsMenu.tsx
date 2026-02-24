import React from "react";
import { Eye, Edit, Package } from "lucide-react";
import { Client } from "../../types/client.types";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../context/ClientContext";

interface ClientActionsMenuProps {
  client: Client;
  onView: () => void;
  onEdit: () => void;
  onClose: () => void;
  openUpwards?: boolean;
}

export const ClientActionsMenu: React.FC<ClientActionsMenuProps> = ({
  client,
  onView,
  onEdit,
  onClose,
  openUpwards = false,
}) => {
  const navigate = useNavigate();
  const { setSelectedClientId } = useClient();

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div
        className={`absolute right-8 ${openUpwards ? "bottom-12" : "top-12"
          } z-50 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-2`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
          onClick={() => {
            onView();
            onClose();
          }}
        >
          <Eye className="w-4 h-4 text-[#38A1DB]" />
          View Details
        </button>

        <button
          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <Edit className="w-4 h-4 text-[#38A1DB] group-hover:text-[#2D8BBF]" />
          Edit details
        </button>

        <button
          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group"
          onClick={() => {
            setSelectedClientId(client.id);
            navigate(`/clients/products`);
            onClose();
          }}
        >
          <Package className="w-4 h-4 text-[#38A1DB] group-hover:text-[#2D8BBF]" />
          View Products
        </button>
      </div>
    </>
  );
};
