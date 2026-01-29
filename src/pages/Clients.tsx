import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../lib/axios";
import {
  Client,
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../types/client.types";
import { validateStep1, validateAllSteps } from "../utils/validationUtils";
import {
  normalizeClientFromAPI,
  createClientFromResponse,
  updateClientFromResponse,
  getInitialFormData,
} from "../utils/clientUtils";
import { ClientHeader } from "../components/clients/ClientHeader";
import { SearchBar } from "../components/clients/SearchBar";
import { ClientTable } from "../components/clients/ClientTable";
import { ClientDetailsModal } from "../components/clients/ClientDetailsModal";
import { ClientFormModal } from "../components/clients/ClientFormModal";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [backendError, setBackendError] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editStep, setEditStep] = useState(1);
  const [openClientId, setOpenClientId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<EditingClient | null>(
    null,
  );
  const [newClient, setNewClient] =
    useState<ClientFormData>(getInitialFormData());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.contact?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || client.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalClients = filteredClients.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1(newClient, setErrors)) {
      setAddStep(2);
    }
  };

  const handleEditNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient && validateStep1(editingClient, setErrors)) {
      setEditStep(2);
    }
  };
  

  const handleApiError = (err: any, context: string = "operation") => {
    console.error(`Error during ${context}:`, err);

    const status = err.response?.status;
    const message = err.response?.data?.detail || err.response?.data?.message;
    let errorMessage = "";

    switch (status) {
      case 400:
        errorMessage = message || "Invalid data provided. Please check your inputs.";
        break;

      case 401:
        errorMessage = message || "You are not authorized. Please log in again.";
        break;

      case 403:
        errorMessage = message || "You don't have permission to perform this action.";
        break;

      case 404:
        errorMessage = message || "Client not found.";
        break;

      case 409:
        errorMessage =
          message ||
          "A client with this email or phone number already exists. Please use different contact information.";
        if (context === "create client") {
          setAddStep(1);
        } else if (context === "update client") {
          setEditStep(1);
        }
        break;

      case 422:
        errorMessage = message || "Validation error. Please check all required fields.";
        break;

      case 500:
        errorMessage = message || "Server error occurred. Please try again later.";
        break;

      case 503:
        errorMessage = message || "Service temporarily unavailable. Please try again later.";
        break;

      default:
        if (err.message === "Network Error") {
        } else {
          errorMessage = message || `Failed to ${context}. Please try again.`;
        }
    }

    setBackendError(errorMessage);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllSteps(newClient, setErrors)) {
      toast.error("Please fix all validation errors before submitting.");
      if (!validateStep1(newClient, setErrors)) {
        setAddStep(1);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/clients", newClient);
      const createdClient = createClientFromResponse(res);
      setClients((prev) => [createdClient, ...prev]);
      setShowAddDialog(false);
      resetAddClientForm();
      toast.success("Client created successfully");
    } catch (err: any) {
      handleApiError(err, "create client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingClient) {
      return;
    }

    if (!validateAllSteps(editingClient, setErrors)) {
      toast.error("Please fix all validation errors before submitting.");
      if (!validateStep1(editingClient, setErrors)) {
        setEditStep(1);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.put(`/clients/${editingClient.id}`, editingClient);
      const updatedClient = updateClientFromResponse(
        res,
        editingClient.products || 0,
      );
      setClients((prev) =>
        prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)),
      );
      if (selectedClient?.id === updatedClient.id)
        setSelectedClient(updatedClient);
      setShowEditDialog(false);
      setEditingClient(null);
      setEditStep(1);
      setErrors({});
      toast.success("Client updated successfully");
    } catch (err: any) {
      handleApiError(err, "update client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const resetAddClientForm = () => {
    setNewClient(getInitialFormData());
    setAddStep(1);
    setErrors({});
    setBackendError("");
  };

  const openEditDialog = (client: Client) => {
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
    setEditStep(1);
    setErrors({});
    setBackendError("");
    setShowEditDialog(true);
  };

  const handleFormChange = (
    formData: ClientFormData | EditingClient,
    setFormData: React.Dispatch<React.SetStateAction<any>>,
    field: keyof ClientFormData,
    value: string,
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleClearError = (field: keyof ClientFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get("/clients");
        const normalized = res.data.map(normalizeClientFromAPI);
        setClients(normalized);
      } catch (err: any) {
        handleApiError(err, "load clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      <ClientHeader onAddClick={() => setShowAddDialog(true)} />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <ClientTable
        clients={paginatedClients}
        loading={loading}
        openClientId={openClientId}
        onClientClick={setSelectedClient}
        onMenuToggle={(clientId) =>
          setOpenClientId(openClientId === clientId ? null : clientId)
        }
        onView={setSelectedClient}
        onEdit={openEditDialog}
        currentPage={currentPage}
        totalClients={totalClients}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <ClientDetailsModal
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
        onEdit={openEditDialog}
      />

      <ClientFormModal
        isOpen={showAddDialog}
        title="Add Client"
        formData={newClient}
        errors={errors}
        backendError={backendError}
        currentStep={addStep}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowAddDialog(false);
          resetAddClientForm();
        }}
        onSubmit={handleAddClient}
        onNext={handleNextStep}
        onBack={() => setAddStep(1)}
        onChange={(field, value) =>
          handleFormChange(newClient, setNewClient, field, value)
        }
        onClearError={handleClearError}
        onClearBackendError={() => setBackendError("")}
        submitButtonText="Create Client Profile"
      />

      {editingClient && (
        <ClientFormModal
          isOpen={showEditDialog}
          title="Edit Client"
          formData={editingClient}
          errors={errors}
          backendError={backendError}
          currentStep={editStep}
          isSubmitting={isSubmitting}
          onClose={() => {
            setShowEditDialog(false);
            setEditStep(1);
            setErrors({});
            setBackendError("");
          }}
          onSubmit={handleEditClient}
          onNext={handleEditNextStep}
          onBack={() => setEditStep(1)}
          onChange={(field, value) =>
            handleFormChange(editingClient, setEditingClient, field, value)
          }
          onClearError={handleClearError}
          onClearBackendError={() => setBackendError("")}
          submitButtonText="Update Client"
        />
      )}
    </div>
  );
}