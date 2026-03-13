import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../lib/axios";
import {
  Client,
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../types/client.types";
import { validateStep1, validateStep2 } from "../utils/clientValidations";
import {
  normalizeClientFromAPI,
  createClientFromResponse,
  getInitialFormData,
} from "../utils/clientUtils";
import { normalizePhoneNumber } from "../utils/phoneUtils";
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
      client.negotiators.some((neg) =>
        neg.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

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

    const status = err.status;
    const errorMessage = err.message || `Failed to ${context}. Please try again.`;

    if (status === 409) {
      if (context === "create client") setAddStep(1);
      else if (context === "update client") setEditStep(1);
    }

    setBackendError(errorMessage);
  };


  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    const step1Valid = validateStep1(newClient, setErrors);
    if (!step1Valid) {
      setAddStep(1);
      return;
    }

    const step2Result = validateStep2(newClient);
    if (!step2Result.isValid) {
      setErrors((prev) => ({
        ...prev,
        ...step2Result.errors,
      }));
      setAddStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const { logoFile, logoUrl, ...clientPayload } = newClient;

      // Normalize phone numbers for company and all negotiators
      const finalPayload = {
        ...clientPayload,
        company_phone_no:
          normalizePhoneNumber(clientPayload.company_phone_no) ||
          clientPayload.company_phone_no,
        negotiators: clientPayload.negotiators.map((neg) => ({
          ...neg,
          phone_no: normalizePhoneNumber(neg.phone_no || "") || neg.phone_no,
        })),
      };

      const res = await api.post("/clients", finalPayload);
      const clientId = res.data.client_id;

      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("file", logoFile);
        await api.post(`/clients/${clientId}/logo`, logoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchClients();
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
    if (!editingClient) return;

    const step1Valid = validateStep1(editingClient, setErrors);
    if (!step1Valid) {
      setEditStep(1);
      return;
    }

    const step2Result = validateStep2(editingClient);
    if (!step2Result.isValid) {
      setErrors((prev) => ({
        ...prev,
        ...step2Result.errors,
      }));
      setEditStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const { logoFile, logoUrl, ...clientPayload } = editingClient;

      // Normalize phone numbers for company and all negotiators
      const finalPayload = {
        ...clientPayload,
        company_phone_no:
          normalizePhoneNumber(clientPayload.company_phone_no) ||
          clientPayload.company_phone_no,
        negotiators: clientPayload.negotiators.map((neg) => ({
          ...neg,
          phone_no: normalizePhoneNumber(neg.phone_no || "") || neg.phone_no,
        })),
      };

      const res = await api.put(`/clients/${editingClient.id}`, finalPayload);

      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("file", logoFile);
        await api.post(`/clients/${editingClient.id}/logo`, logoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchClients();
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
    const addrParts = client.address.split(", ");
    setEditingClient({
      id: client.id,
      company_name: client.name,
      company_email: client.email,
      company_phone_no: client.phone,
      company_address: addrParts[0] || "",
      company_city: addrParts[1] || "",
      company_state: addrParts[2] || "",
      company_zip: addrParts[3] || "",
      negotiators: client.negotiators.map((neg) => ({
        name: neg.name || "",
        title: neg.title || "",
        email: neg.email || "",
        phone_no: neg.phone_no || "",
        address: neg.address || "",
        city: neg.city || "",
        state: neg.state || "",
        zip: neg.zip || "",
      })),
      status: client.status,
      logoUrl: client.logoUrl || "",
      logoFile: null,
    });
    setEditStep(1);
    setErrors({});
    setBackendError("");
    setShowEditDialog(true);
  };

  const handleFormChange = (
    setFormData: React.Dispatch<React.SetStateAction<any>>,
    field: keyof ClientFormData,
    value: any,
  ) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleClearError = (field: keyof ClientFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients");
      // The API returns { clients: [...], total_count: ..., status_counts: ... }
      const fetchedClients = Array.isArray(res.data)
        ? res.data
        : res.data.clients || [];
      const normalized = fetchedClients.map(normalizeClientFromAPI);
      setClients(normalized);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        subtitle="Set up a new Client Profile "
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
          handleFormChange(setNewClient, field, value)
        }
        onClearError={handleClearError}
        onClearBackendError={() => setBackendError("")}
        submitButtonText="Create Client Profile"
      />

      {editingClient && (
        <ClientFormModal
          isOpen={showEditDialog}
          title="Edit Client"
          subtitle="Update client profile details"
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
            handleFormChange(setEditingClient, field, value)
          }
          onClearError={handleClearError}
          onClearBackendError={() => setBackendError("")}
          submitButtonText="Update Client"
        />
      )}
    </div>
  );
}
