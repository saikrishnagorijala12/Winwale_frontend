// components/clients/ClientActionsMenu.tsx
import React from "react";
import { Eye, Edit, File, Trash2, Package } from "lucide-react";
import { Client } from "../../types/client.types";
import { useNavigate } from "react-router-dom";

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
          className="menu-item"
          onClick={() => {
            onView();
            onClose();
          }}
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        <button
          className="menu-item"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <Edit className="w-4 h-4" />
          Edit Client
        </button>

        {/* NEW: View Products */}
        <button
          className="menu-item"
          onClick={() => {
            navigate(`/clients/${client.id}/products`);
            onClose();
          }}
        >
          <Package className="w-4 h-4" />
          View Products
        </button>

        {/* <button
          className="menu-item"
          onClick={() => navigate("/contracts")}
        >
          <File className="w-4 h-4" />
          Contract
        </button> */}

        <hr className="my-1 border-slate-100" />

        <button className="menu-item text-red-500 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  );
};
