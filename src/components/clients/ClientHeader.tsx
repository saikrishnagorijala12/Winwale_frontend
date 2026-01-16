// components/clients/ClientHeader.tsx
import React from 'react';
import { Plus } from 'lucide-react';

interface ClientHeaderProps {
  onAddClick: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B]">
          Clients
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage your GSA contract clients and their information
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 bg-[#38A1DB] hover:bg-[#2D8BBF] text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
      >
        <Plus className="w-5 h-5 stroke-[3px]" />
        Add Client
      </button>
    </div>
  );
};