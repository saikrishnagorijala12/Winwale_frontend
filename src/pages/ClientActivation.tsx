import React, { useState, useEffect, useRef, JSX } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Building2,
  Loader2,
  Edit,
  MoreVertical,
  Check,
  X,
  Mail,
  Phone,
  User,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";
import { ClientDetailsModal } from "../components/clients/ClientDetailsModal";
import { ClientFormModal } from "../components/clients/ClientFormModal";
import {
  Client,
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../types/client.types";
import { validateStep1, validateStep2 } from "../utils/clientValidations";
import {
  normalizeClientFromAPI,
  updateClientFromResponse,
} from "../utils/clientUtils";

type TabType = "all" | "pending" | "approved" | "rejected";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  client: any;
  action: "approve" | "reject";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  client,
  action,
}) => {
  if (!isOpen) return null;
  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 h-full">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-left">
        <div className="p-6 sm:p-8">
          <p className="text-slate-500 mb-6 text-sm sm:text-base">
            Are you sure you want to {isApprove ? "approve" : "reject"}{" "}
            <span className="font-bold text-slate-700">
              {client?.company_name}
            </span>
            ?
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Company:</span>
              <span className="text-sm font-semibold text-slate-700 truncate ml-2">
                {client?.company_name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Email:</span>
              <span className="text-sm font-semibold text-slate-700 truncate ml-2">
                {client?.company_email}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-sm ${
                isApprove
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-rose-500 hover:bg-rose-600"
              }`}
            >
              {isApprove ? "Approve" : "Reject"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionDropdownProps {
  client: any;
  onView: () => void;
  onEdit: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  client,
  onView,
  onEdit,
  onApprove,
  onReject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isPending = !["approved", "rejected"].includes(client.status);
  const isApproved = client.status === "approved";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-slate-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Client
          </button>

          <div className="border-t border-slate-100 my-2"></div>

          {isPending ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                isApproved ? onReject() : onApprove();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm font-medium flex items-center gap-2 transition-colors ${
                isApproved
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              {isApproved ? (
                <>
                  <X className="w-4 h-4" />
                  Reject
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Approve
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface ClientCardProps {
  client: any;
  onView: () => void;
  onEdit: () => void;
  onApprove: () => void;
  onReject: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onView,
  onEdit,
  onApprove,
  onReject,
  getStatusBadge,
}) => {
  return (
    <div
      onClick={onView}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-base truncate">
              {client.company_name}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {client.company_email}
            </p>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionDropdown
            client={client}
            onView={onView}
            onEdit={onEdit}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">
            {client.contact_officer_name || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">
            {client.company_city}, {client.company_state}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {new Date(client.created_time).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {getStatusBadge(client.status)}
      </div>
    </div>
  );
};

const ClientActivation = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    client: null,
    action: "approve" as "approve" | "reject",
  });

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<EditingClient | null>(
    null,
  );
  const [editErrors, setEditErrors] = useState<ClientFormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients");
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      handleApiError(err, "load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleApiError = (err: any, context: string = "operation") => {
    const status = err.response?.status;
    const message = err.response?.data?.detail || err.response?.data?.message;
    let errorMessage = message || `Failed to ${context}. Please try again.`;

    if (status === 409) {
      setCurrentStep(1);
    }

    setBackendError(errorMessage);
    toast.error(errorMessage);
  };

  const trimClientPayload = (data: EditingClient): any => {
    const trimmed: any = {};
    Object.entries(data).forEach(([key, value]) => {
      trimmed[key] = typeof value === "string" ? value.trim() : value;
    });
    return trimmed;
  };

  const openConfirmModal = (client: any, action: "approve" | "reject") => {
    setConfirmModal({ isOpen: true, client, action });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, client: null, action: "approve" });
  };

  const handleStatusUpdate = async () => {
    if (!confirmModal.client) return;
    const { client_id } = confirmModal.client;
    const { action } = confirmModal;

    try {
      await api.patch(`/clients/${client_id}/approve`, null, {
        params: { action },
      });
      toast.success(
        `Client ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
      await fetchClients();
      closeConfirmModal();
    } catch (err) {
      handleApiError(err, `${action} client`);
    }
  };

  const handleViewClient = (backendClient: any) => {
    const client = normalizeClientFromAPI(backendClient);
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient({
      id: client.id,
      company_name: client.name,
      company_email: client.email,
      company_phone_no: client.phone,
      company_address: client.address.split(", ")[0] || "",
      company_city: client.address.split(", ")[1] || "",
      company_state: client.address.split(", ")[2] || "",
      company_zip: client.address.split(", ")[3] || "",
      contact_officer_name: client.contact?.name || "",
      contact_officer_email: client.contact?.email || "",
      contact_officer_phone_no: client.contact?.phone || "",
      contact_officer_address: client.contact?.address?.split(", ")[0] || "",
      contact_officer_city: client.contact?.address?.split(", ")[1] || "",
      contact_officer_state: client.contact?.address?.split(", ")[2] || "",
      contact_officer_zip: client.contact?.address?.split(", ")[3] || "",
      status: client.status,
      products: client.products,
    });
    setIsEditModalOpen(true);
    setCurrentStep(1);
    setEditErrors({});
    setBackendError("");
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient && validateStep1(editingClient, setEditErrors)) {
      setCurrentStep(2);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const step1Valid = validateStep1(editingClient, setEditErrors);
    if (!step1Valid) {
      setCurrentStep(1);
      return;
    }

    const step2Result = validateStep2(editingClient);
    if (!step2Result.isValid) {
      setEditErrors((prev) => ({ ...prev, ...step2Result.errors }));
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = trimClientPayload(editingClient);
      await api.put(`/clients/${editingClient.id}`, payload);
      toast.success("Client updated successfully");
      await fetchClients();
      setIsEditModalOpen(false);
    } catch (err: any) {
      handleApiError(err, "update client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (client: any) => {
    handleViewClient(client);
  };

  const pendingClients = clients.filter(
    (c) => !["approved", "rejected"].includes(c.status),
  );
  const approvedClients = clients.filter((c) => c.status === "approved");
  const rejectedClients = clients.filter((c) => c.status === "rejected");

  const getFilteredClients = () => {
    let list = [];
    if (activeTab === "pending") list = pendingClients;
    else if (activeTab === "approved") list = approvedClients;
    else if (activeTab === "rejected") list = rejectedClients;
    else list = clients;

    return list.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contact_officer_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  };

  const filteredClients = getFilteredClients();

  const totalItems = filteredClients.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getStatusBadge = (status: string) => {
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-600 border-rose-100">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    } else if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-orange-50 text-orange-600 border-orange-100">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "all":
        return "All Clients";
      case "pending":
        return "Pending Client Requests";
      case "approved":
        return "Approved Clients";
      case "rejected":
        return "Rejected Clients";
      default:
        return "Clients";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "all":
        return "Complete list of all client profiles";
      case "pending":
        return "Client Profiles awaiting approval";
      case "approved":
        return "Approved Client Profiles";
      case "rejected":
        return "Client Profiles that are registration";
      default:
        return "";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
        <p className="mt-4 text-slate-500">Loading clients ...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleStatusUpdate}
        client={confirmModal.client}
        action={confirmModal.action}
      />

      <ClientDetailsModal
        client={selectedClient}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedClient(null);
        }}
        onEdit={handleEditClient}
      />

      {editingClient && (
        <ClientFormModal
          isOpen={isEditModalOpen}
          title="Edit Client"
          subtitle="Update client information"
          formData={editingClient}
          errors={editErrors}
          backendError={backendError}
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          onNext={handleNextStep}
          onBack={() => setCurrentStep(1)}
          onChange={(field, value) => {
            setEditingClient({ ...editingClient, [field]: value });
            if (editErrors[field])
              setEditErrors({ ...editErrors, [field]: "" });
          }}
          onClearError={(field) =>
            setEditErrors({ ...editErrors, [field]: "" })
          }
          onClearBackendError={() => setBackendError("")}
          submitButtonText="Update Client"
        />
      )}

      {/* Header */}
      <div className="mx-auto">
        <h1 className="text-3xl  font-extrabold tracking-tight text-slate-800">
          Client Management
        </h1>
        <p className="text-slate-500 font-medium mt-1 ">
          Manage client registrations, approvals, and accounts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            label: "Total Clients",
            count: clients.length,
            icon: Building2,
            color: "blue",
          },
          {
            label: "Pending Requests",
            count: pendingClients.length,
            icon: Clock,
            color: "orange",
          },
          {
            label: "Approved Clients",
            count: approvedClients.length,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "Rejected",
            count: rejectedClients.length,
            icon: XCircle,
            color: "rose",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 border border-slate-100"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-${stat.color}-50 rounded-full flex items-center justify-center shrink-0`}
            >
              <stat.icon
                className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-${stat.color}-600`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {stat.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 ">
        <div className="border-b border-slate-100 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 ">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {[
              {
                id: "all",
                label: "All Clients",
                count: clients.length,
                color: "blue",
              },
              {
                id: "pending",
                label: "Pending",
                count: pendingClients.length,
                color: "orange",
              },
              {
                id: "approved",
                label: "Approved",
                count: approvedClients.length,
                color: "emerald",
              },
              {
                id: "rejected",
                label: "Rejected",
                count: rejectedClients.length,
                color: "rose",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-50 text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search Header */}
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{getTabTitle()}</h2>
            <p className="text-slate-500 text-sm">{getTabDescription()}</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company or contact..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Card View (< lg) */}
        <div className="lg:hidden px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
          {paginatedClients.map((client) => (
            <ClientCard
              key={client.client_id}
              client={client}
              onView={() => handleViewClient(client)}
              onEdit={() => handleEditClient(normalizeClientFromAPI(client))}
              onApprove={() => openConfirmModal(client, "approve")}
              onReject={() => openConfirmModal(client, "reject")}
              getStatusBadge={getStatusBadge}
            />
          ))}
          {paginatedClients.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              No clients found.
            </div>
          )}
        </div>

        {/* Desktop Table View  */}
        <div className="hidden lg:block  px-6 pb-6 ">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widerral Information">
                  Company
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widerral Information">
                  Contact Officer
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widerral Information">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widerral Information">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widerral Information">
                  Created Date
                </th>
                <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClients.map((client) => (
                <tr
                  key={client.client_id}
                  onClick={() => handleRowClick(client)}
                  className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">
                          {client.company_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {client.company_email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-sm font-semibold text-slate-700">
                      {client.contact_officer_name || "N/A"}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {client.company_city}, {client.company_state}
                    </div>
                  </td>
                  <td className="px-4 py-5">{getStatusBadge(client.status)}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(client.created_time).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        client={client}
                        onView={() => handleViewClient(client)}
                        onEdit={() =>
                          handleEditClient(normalizeClientFromAPI(client))
                        }
                        onApprove={() => openConfirmModal(client, "approve")}
                        onReject={() => openConfirmModal(client, "reject")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedClients.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              No clients found.
            </div>
          )}
        </div>
        {totalItems > itemsPerPage && (
          <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 font-medium">
              Showing{" "}
              <span className="text-slate-900 font-semibold">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-900 font-semibold">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 font-semibold">{totalItems}</span>{" "}
              users
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const delta = 1;
                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= currentPage - delta && i <= currentPage + delta)
                    ) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== "...") {
                      pages.push("...");
                    }
                  }
                  return pages.map((pageNum, idx) => (
                    <React.Fragment key={idx}>
                      {pageNum === "..." ? (
                        <span className="px-2 text-slate-400 font-medium">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(Number(pageNum))}
                          className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                            ${
                              currentPage === pageNum
                                ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ));
                })()}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientActivation;
