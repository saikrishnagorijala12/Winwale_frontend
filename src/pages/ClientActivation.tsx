import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import api from "../lib/axios";

type TabType = "all" | "pending" | "approved" | "rejected";

const ClientActivation = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Fetch Clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients");
      setClients(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Approve / Reject
  const handleStatusUpdate = async (clientId, action) => {
    try {
      await api.patch(`/clients/${clientId}/approve`, null, {
        params: { action },
      });

      // Refresh clients after action
      await fetchClients();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} client`);
    }
  };

  // Filter clients by status
  const pendingClients = clients.filter(
    (c) => !["approved", "rejected"].includes(c.status)
  );

  const approvedClients = clients.filter((c) => c.status === "approved");

  const rejectedClients = clients.filter((c) => c.status === "rejected");

  // Get filtered clients based on active tab
  const getFilteredClients = () => {
    let clientList = [];
    switch (activeTab) {
      case "all":
        clientList = clients;
        break;
      case "pending":
        clientList = pendingClients;
        break;
      case "approved":
        clientList = approvedClients;
        break;
      case "rejected":
        clientList = rejectedClients;
        break;
      default:
        clientList = clients;
    }

    return clientList.filter(
      (client) =>
        client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contact_officer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredClients = getFilteredClients();

  const getStatusBadge = (client) => {
    if (client.status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-600 border-rose-100">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    } else if (client.status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
          <CheckCircle2 className="w-3 h-3" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-orange-50 text-orange-600 border-orange-100">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
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
        return "Complete list of all client registrations";
      case "pending":
        return "Clients awaiting approval";
      case "approved":
        return "Clients with approved accounts";
      case "rejected":
        return "Clients whose registration was rejected";
      default:
        return "";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#3399cc]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans text-slate-900">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0f172a]">Client Management</h1>
        <p className="text-slate-500 mt-1">
          Manage client registrations, approvals, and accounts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total Clients
            </p>
            <p className="text-4xl font-bold">{clients.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pending Requests
            </p>
            <p className="text-4xl font-bold">{pendingClients.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Approved Clients
            </p>
            <p className="text-4xl font-bold">{approvedClients.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
            <XCircle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Rejected
            </p>
            <p className="text-4xl font-bold">{rejectedClients.length}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-100 px-8 pt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "all"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Clients ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "pending"
                  ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Pending ({pendingClients.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "approved"
                  ? "bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Approved ({approvedClients.length})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "rejected"
                  ? "bg-rose-50 text-rose-600 border-b-2 border-rose-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Rejected ({rejectedClients.length})
            </button>
          </div>
        </div>

        {/* Table Header */}
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

        {/* Table */}
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contact Officer
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr
                  key={client.client_id}
                  className="group hover:bg-slate-50/30 transition-colors"
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
                  <td className="px-4 py-5">{getStatusBadge(client)}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(client.created_time).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-3">
                      {!["approved", "rejected"].includes(client.status) && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(client.client_id, "approve")
                            }
                            className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(client.client_id, "reject")
                            }
                            className="flex items-center gap-2 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      {client.status === "approved" && (
                        <span className="text-xs text-slate-400 italic">
                          Approved Account
                        </span>
                      )}
                      {client.status === "rejected" && (
                        <span className="text-xs text-slate-400 italic">
                          Registration Rejected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              No clients found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientActivation;