import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, AlertCircle, X } from "lucide-react";
import { ClientContractRead } from "../types/contract.types";
import { contractService } from "../services/contractService";
import ContractTable from "../components/contracts/ContractsTable";
import ContractDetailsModal from "../components/contracts/ContractDetailsModal";
import AddContractModal from "../components/contracts/AddContractModal";
import EditContractModal from "../components/contracts/EditContractModal";
import DeleteConfirmationModal from "../components/contracts/DeleteConfirmationModal";

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] =
    useState<ClientContractRead | null>(null);
  const [contracts, setContracts] = useState<ClientContractRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [contractToEdit, setContractToEdit] =
    useState<ClientContractRead | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getAllContracts();
      setContracts(data);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      if (c.is_deleted) return false;
      const query = searchQuery.toLowerCase();
      return (
        c.contract_number.toLowerCase().includes(query) ||
        c.contract_officer_name?.toLowerCase().includes(query) ||
        c.client.toLowerCase().includes(query)
      );
    });
  }, [contracts, searchQuery]);

  const totalContracts = filteredContracts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteRequest = (clientId: number) => {
    setContractToDelete(clientId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      setDeleting(true);
      await contractService.deleteContract(contractToDelete);

      setContracts((prev) =>
        prev.map((c) =>
          c.client_id === contractToDelete ? { ...c, is_deleted: true } : c,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete contract",
      );
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setContractToDelete(null);
    }
  };

  const handleEdit = (contract: ClientContractRead) => {
    setContractToEdit(contract);
    setShowEditDialog(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      {error && (
        <div className="mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto ">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Contracts
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your GSA contract profiles and logistics information
          </p>
        </div>

        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center justify-center gap-2 bg-[#38A1DB] hover:bg-[#2D8BBF] text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          Add Contract
        </button>
      </div>

      <div className="mx-auto bg-white p-4 rounded-4xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts by number, officer name, or client..."
            className="w-full pl-14 pr-6 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20  bg-slate-50/50 text-slate-700 placeholder:text-slate-400 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mx-auto ">
        <ContractTable
          contracts={paginatedContracts}
          loading={loading}
          onView={setSelectedContract}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          currentPage={currentPage}
          totalContracts={totalContracts}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <ContractDetailsModal
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
        onEdit={handleEdit}
      />

      <AddContractModal
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={fetchContracts}
      />

      <EditContractModal
        isOpen={showEditDialog}
        contract={contractToEdit}
        onClose={() => {
          setShowEditDialog(false);
          setContractToEdit(null);
        }}
        onSuccess={fetchContracts}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteDialog}
        loading={deleting}
        onCancel={() => {
          setShowDeleteDialog(false);
          setContractToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
