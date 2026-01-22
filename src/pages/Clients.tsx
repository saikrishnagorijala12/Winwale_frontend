// pages/Clients.tsx
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../lib/axios";
import { Client, ClientFormData, ClientFormErrors, EditingClient } from "../types/client.types";
import { validateStep1 } from "../utils/validationUtils";
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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editStep, setEditStep] = useState(1);
  const [openClientId, setOpenClientId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<EditingClient | null>(null);
  const [newClient, setNewClient] = useState<ClientFormData>(getInitialFormData());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.contact?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" || client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const totalClients = filteredClients.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

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

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1(newClient, setErrors)) {
      setAddStep(1);
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
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !validateStep1(editingClient, setErrors)) {
      setEditStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.put(`/clients/${editingClient.id}`, editingClient);
      const updatedClient = updateClientFromResponse(res, editingClient.products || 0);
      setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
      if (selectedClient?.id === updatedClient.id) setSelectedClient(updatedClient);
      setShowEditDialog(false);
      setEditingClient(null);
      toast.success("Client updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAddClientForm = () => {
    setNewClient(getInitialFormData());
    setAddStep(1);
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
    setShowEditDialog(true);
  };

  const handleFormChange = (
    formData: ClientFormData | EditingClient,
    setFormData: React.Dispatch<React.SetStateAction<any>>,
    field: keyof ClientFormData,
    value: string
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
      } catch (err) {
        console.error("Failed to fetch clients", err);
        toast.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 p-8">
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
      />

      <ClientFormModal
        isOpen={showAddDialog}
        title="Add Client"
        formData={newClient}
        errors={errors}
        currentStep={addStep}
        isSubmitting={isSubmitting}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddClient}
        onNext={handleNextStep}
        onBack={() => setAddStep(1)}
        onChange={(field, value) =>
          handleFormChange(newClient, setNewClient, field, value)
        }
        onClearError={handleClearError}
        submitButtonText="Create Client Profile"
      />

      {editingClient && (
        <ClientFormModal
          isOpen={showEditDialog}
          title="Edit Client"
          formData={editingClient}
          errors={errors}
          currentStep={editStep}
          isSubmitting={isSubmitting}
          onClose={() => setShowEditDialog(false)}
          onSubmit={handleEditClient}
          onNext={handleEditNextStep}
          onBack={() => setEditStep(1)}
          onChange={(field, value) =>
            handleFormChange(editingClient, setEditingClient, field, value)
          }
          onClearError={handleClearError}
          submitButtonText="Update Client"
        />
      )}
    </div>
  );
}