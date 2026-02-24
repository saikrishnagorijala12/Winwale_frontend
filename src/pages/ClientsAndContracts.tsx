import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";
import { Client } from "../types/client.types";
import { ClientContractRead } from "../types/contract.types";
import {
    normalizeClientFromAPI,
} from "../utils/clientUtils";
import { contractService } from "../services/contractService";
import { SearchBar } from "../components/clients/SearchBar";
import { ClientContractDetailsModal } from "../components/clientscontracts/ClientContractDetailsModal";
import { ClientContractTable } from "../components/clientscontracts/ClientContractTable";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import AddClientContractModal from "../components/clientscontracts/AddClientContractModal";
import EditClientContractModal from "../components/clientscontracts/EditClientContractModal";

export default function ClientsAndContractsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [clientLoading, setClientLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openClientId, setOpenClientId] = useState<number | null>(null);

    const [contracts, setContracts] = useState<ClientContractRead[]>([]);

    const [detailsClient, setDetailsClient] = useState<Client | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    const [showDeleteContractDialog, setShowDeleteContractDialog] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<number | null>(null);
    const [deletingContract, setDeletingContract] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchClients = async () => {
        try {
            setClientLoading(true);
            const res = await api.get("/clients");
            setClients(res.data.map(normalizeClientFromAPI));
        } catch {
            toast.error("Failed to load clients");
        } finally {
            setClientLoading(false);
        }
    };

    const fetchContracts = async () => {
        try {
            const data = await contractService.getAllContracts();
            setContracts(data.filter((c) => !c.is_deleted));
        } catch {
            toast.error("Failed to load contracts");
        }
    };

    const refreshData = () => {
        fetchClients();
        fetchContracts();
    };

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    const getContractForClient = (clientId: number) =>
        contracts.find((c) => c.client_id === clientId) ?? null;

    const filteredClients = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return clients.filter((c) => {
            const contract = getContractForClient(c.id);
            const matchSearch =
                c.name.toLowerCase().includes(q) ||
                (c.contact?.name || "").toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                (contract?.contract_number || "").toLowerCase().includes(q) ||
                (contract?.fob_term || "").toLowerCase().includes(q);
            const matchFilter = filterStatus === "all" || c.status === filterStatus;
            return matchSearch && matchFilter;
        });
    }, [clients, contracts, searchQuery, filterStatus]);

    const totalClients = filteredClients.length;
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const openEditModal = (client: Client) => {
        setClientToEdit(client);
        setShowEditModal(true);
    };

    const confirmDeleteContract = async () => {
        if (!contractToDelete) return;
        setDeletingContract(true);
        try {
            await contractService.deleteContract(contractToDelete);
            setContracts((prev) => prev.filter((c) => c.client_id !== contractToDelete));
            toast.success("Contract deleted");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete contract");
        } finally {
            setDeletingContract(false);
            setShowDeleteContractDialog(false);
            setContractToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                        Clients &amp; Contracts
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Manage client profiles and their GSA contract details
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 bg-[#38A1DB] hover:bg-[#2D8BBF] text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Add Client &amp; Contract
                </button>
            </div>

            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
            />

            <ClientContractTable
                clients={paginatedClients}
                contracts={contracts}
                loading={clientLoading}
                openClientId={openClientId}
                onRowClick={setDetailsClient}
                onMenuToggle={(id) => setOpenClientId(openClientId === id ? null : id)}
                onView={setDetailsClient}
                onEdit={openEditModal}
                currentPage={currentPage}
                totalClients={totalClients}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            <ClientContractDetailsModal
                client={detailsClient}
                contract={detailsClient ? getContractForClient(detailsClient.id) : null}
                onClose={() => setDetailsClient(null)}
                onEdit={(client) => {
                    setDetailsClient(null);
                    openEditModal(client);
                }}
            />

            <AddClientContractModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={refreshData}
            />

            <EditClientContractModal
                isOpen={showEditModal}
                client={clientToEdit}
                contract={clientToEdit ? getContractForClient(clientToEdit.id) : null}
                onClose={() => {
                    setShowEditModal(false);
                    setClientToEdit(null);
                }}
                onSuccess={refreshData}
            />

            <ConfirmationModal
                isOpen={showDeleteContractDialog}
                onClose={() => {
                    setShowDeleteContractDialog(false);
                    setContractToDelete(null);
                }}
                onConfirm={confirmDeleteContract}
                title="Delete Contract"
                message={
                    <>
                        Are you sure you want to delete contract{" "}
                        <span className="font-bold text-slate-700">
                            {contracts.find((c) => c.client_id === contractToDelete)?.contract_number}
                        </span>
                        ?
                    </>
                }
                variant="rose"
                confirmText="Delete"
                isSubmitting={deletingContract}
            />
        </div>
    );
}
