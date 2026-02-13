import React from "react";
import { Eye, Edit, File, Trash2, Package } from "lucide-react";
import { Client } from "../../types/client.types";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../context/ClientContext";

interface ClientActionsMenuProps {
  client: Client;
  onView: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export const ClientActionsMenu: React.FC<ClientActionsMenuProps> = ({
  client,
  onView,
  onEdit,
  onClose,
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
        className="absolute right-8 top-12 z-50 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
          onClick={() => {
            onView();
            onClose();
          }}
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        <button
          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <Edit className="w-4 h-4" />
          Edit Client
        </button>

        <button
          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
          onClick={() => {
            setSelectedClientId(client.id);
            navigate(`/clients/products`);
            onClose();
          }}
        >
          <Package className="w-4 h-4" />
          View Products
        </button>

        {/* <hr className="my-1 border-slate-100" />

        <button className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3">
          <Trash2 className="w-4 h-4" />
          Delete
        </button> */}
      </div>
    </>
  );
};
