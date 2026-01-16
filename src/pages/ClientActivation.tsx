import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  MapPin,
  Calendar,
  Eye,
  Building2,
  Loader2,
} from "lucide-react";
import api from "../lib/axios";

const ClientActivation = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients");
      // Ensure we handle the response correctly if it's wrapped
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
      // action = 'approve' | 'reject'
      await api.patch(`/clients/${clientId}/approve`, null, {
        params: { action }, 
      });

      // Optimistically update the UI by removing the processed client from the pending list
      setClients((prev) =>
        prev.filter((c) => c.client_id !== clientId)
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} client`);
    }
  };

  // Logic to identify pending clients (anything not approved/rejected)
  const pendingClients = clients.filter(
    (c) => !["approved", "rejected"].includes(c.status)
  );

  const filteredClients = pendingClients.filter(
    (client) =>
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact_officer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans text-slate-900">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0f172a]">Client Activation</h1>
        <p className="text-slate-500 mt-1">Review and approve pending client registration requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending Requests</p>
            <p className="text-4xl font-bold">{pendingClients.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Records</p>
            <p className="text-4xl font-bold">{clients.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Approved Clients</p>
            <p className="text-4xl font-bold">{clients.filter(c => c.status === "approved").length}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Registration Queue</h2>
            <p className="text-slate-500 text-sm">Reviewing {filteredClients.length} entries</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company or contact..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-100">
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Officer</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Request Date</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.client_id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{client.company_name}</p>
                        <p className="text-xs text-slate-400">{client.company_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {client.contact_officer_name || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {client.company_city}, {client.company_state}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(client.created_time).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(client.client_id, "approve")}
                        className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(client.client_id, "reject")}
                        className="flex items-center gap-2 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              No pending requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientActivation;