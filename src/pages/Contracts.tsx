// import React, { useState, useEffect, useMemo, useRef } from "react";
// import {
//   Search,
//   Plus,
//   MoreVertical,
//   Building2,
//   Mail,
//   Phone,
//   MapPin,
//   Edit,
//   Trash2,
//   Eye,
//   X,
//   User,
//   CheckCircle2,
//   Loader2,
//   FileText,
//   Settings,
//   Truck,
//   ShieldCheck,
//   Globe,
//   Info,
//   AlertCircle,
// } from "lucide-react";
// import api from "../lib/axios";

// interface ClientContractBase {
//   contract_number: string;
//   contract_officer_name?: string;
//   contract_officer_address?: string;
//   contract_officer_city?: string;
//   contract_officer_state?: string;
//   contract_officer_zip?: string;
//   origin_country?: string;
//   gsa_proposed_discount?: number;
//   q_v_discount?: string;
//   additional_concessions?: string;
//   normal_delivery_time?: number;
//   expedited_delivery_time?: number;
//   fob_term?: string;
//   energy_star_compliance?: string;
// }

// interface ClientContractRead extends ClientContractBase {
//   client: string;
//   client_profile_id: number;
//   client_id: number;
//   is_deleted: boolean;
//   created_time: string;
//   updated_time: string;
// }

// interface ClientContractCreate extends ClientContractBase {
//   client_id?: number;
//   is_deleted?: boolean;
// }

// interface ClientContractUpdate extends ClientContractBase {
//   is_deleted?: boolean;
// }

// interface ClientListRead {
//   client_id: number;
//   company_name: string;
// }

// const apiService = {
//   async getAllContracts(): Promise<ClientContractRead[]> {
//     const response = await api.get("/contracts");
//     return response.data;
//   },

//   async getContractByClientId(clientId: number): Promise<ClientContractRead> {
//     const response = await api.get(`/contracts/${clientId}`);
//     return response.data;
//   },

//   async createContract(
//     clientId: number,
//     data: Omit<ClientContractCreate, "client_id">
//   ): Promise<ClientContractRead> {
//     const response = await api.post(`/contracts/${clientId}`, data);
//     return response.data;
//   },

//   async updateContract(
//     clientId: number,
//     data: Partial<ClientContractBase>
//   ): Promise<ClientContractRead> {
//     const response = await api.put(`/contracts/${clientId}`, data);
//     return response.data;
//   },

//   async deleteContract(clientId: number): Promise<void> {
//     await api.delete(`/contracts/${clientId}`);
//   },
// };

// const clientApiService = {
//   async getAllClients(): Promise<ClientListRead[]> {
//     const response = await api.get("/clients");
//     return response.data;
//   },
// };

// export default function ContractsPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedContract, setSelectedContract] = useState<ClientContractRead | null>(null);
//   const [contracts, setContracts] = useState<ClientContractRead[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [addStep, setAddStep] = useState(1);
//   const [editStep, setEditStep] = useState(1);
//   const [openContractId, setOpenContractId] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [clients, setClients] = useState<ClientListRead[]>([]);
//   const [clientSearch, setClientSearch] = useState("");
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const clientDropdownRef = useRef<HTMLDivElement>(null);

//   const initialForm: ClientContractCreate = {
//     client_id: undefined,
//     contract_number: "",
//     contract_officer_name: "",
//     contract_officer_address: "",
//     contract_officer_city: "",
//     contract_officer_state: "",
//     contract_officer_zip: "",
//     origin_country: "USA",
//     gsa_proposed_discount: 0,
//     q_v_discount: "",
//     additional_concessions: "",
//     normal_delivery_time: 30,
//     expedited_delivery_time: 10,
//     fob_term: "Origin",
//     energy_star_compliance: "Yes",
//     is_deleted: false,
//   };

//   const [newContract, setNewContract] = useState<ClientContractCreate>(initialForm);
//   const [editContract, setEditContract] = useState<ClientContractUpdate>({
//     contract_number: "",
//     contract_officer_name: "",
//     contract_officer_address: "",
//     contract_officer_city: "",
//     contract_officer_state: "",
//     contract_officer_zip: "",
//     origin_country: "USA",
//     gsa_proposed_discount: 0,
//     q_v_discount: "",
//     additional_concessions: "",
//     normal_delivery_time: 30,
//     expedited_delivery_time: 10,
//     fob_term: "Origin",
//     energy_star_compliance: "Yes",
//   });
//   const [editingClientId, setEditingClientId] = useState<number | null>(null);

//   useEffect(() => {
//     fetchContracts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
//         setShowClientDropdown(false);
//       }
//     };

//     if (showClientDropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showClientDropdown]);

//   const fetchContracts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await apiService.getAllContracts();
//       setContracts(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load contracts");
//       console.error("Error fetching contracts:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchClients = async () => {
//     try {
//       const data = await clientApiService.getAllClients();
//       setClients(data);
//     } catch (err) {
//       console.error("Failed to load clients", err);
//     }
//   };

//   const filteredClients = useMemo(() => {
//     return clients.filter(
//       (c) =>
//         c.client_id.toString().includes(clientSearch) ||
//         c.company_name.toLowerCase().includes(clientSearch.toLowerCase())
//     );
//   }, [clients, clientSearch]);

//   const filteredContracts = useMemo(() => {
//     return contracts.filter((c) => {
//       if (c.is_deleted) return false;
//       const matchesSearch =
//         c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         c.contract_officer_name?.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesSearch;
//     });
//   }, [contracts, searchQuery]);

//   const handleAddContract = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (addStep !== 2) {
//       console.warn("Submit blocked: not on step 2");
//       return;
//     }

//     if (!newContract.client_id) {
//       setError("Please select a client");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setShowClientDropdown(false);

//     try {
//       const { client_id, ...payload } = newContract;
//       const createdContract = await apiService.createContract(client_id!, payload);
//       setContracts((prev) => [createdContract, ...prev]);
//       setShowAddDialog(false);
//       setAddStep(1);
//       setClientSearch("");
//       setNewContract(initialForm);
//     } catch (err: any) {
//       if (err?.response?.status === 409 || err?.message?.includes("already exists")) {
//         setError("Contract already exists for this client");
//       } else {
//         setError(err?.response?.data?.detail || "Failed to create contract");
//       }
//       console.error("Error creating contract:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEditContract = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (editStep !== 2) {
//       console.warn("Submit blocked: not on step 2");
//       return;
//     }

//     if (!editingClientId) {
//       setError("No client selected for editing");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const updatedContract = await apiService.updateContract(editingClientId, editContract);
//       setContracts((prev) =>
//         prev.map((c) => (c.client_id === editingClientId ? updatedContract : c))
//       );
//       setShowEditDialog(false);
//       setEditStep(1);
//       setEditingClientId(null);
//     } catch (err: any) {
//       setError(err?.response?.data?.detail || "Failed to update contract");
//       console.error("Error updating contract:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (clientId: number) => {
//     if (!confirm("Are you sure you want to delete this contract?")) return;

//     try {
//       await apiService.deleteContract(clientId);
//       setContracts((prev) =>
//         prev.map((c) => (c.client_id === clientId ? { ...c, is_deleted: true } : c))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to delete contract");
//       console.error("Error deleting contract:", err);
//     }
//   };

//   const openEditDialog = (contract: ClientContractRead) => {
//     setEditContract({
//       contract_number: contract.contract_number,
//       contract_officer_name: contract.contract_officer_name || "",
//       contract_officer_address: contract.contract_officer_address || "",
//       contract_officer_city: contract.contract_officer_city || "",
//       contract_officer_state: contract.contract_officer_state || "",
//       contract_officer_zip: contract.contract_officer_zip || "",
//       origin_country: contract.origin_country || "USA",
//       gsa_proposed_discount: contract.gsa_proposed_discount || 0,
//       q_v_discount: contract.q_v_discount || "",
//       additional_concessions: contract.additional_concessions || "",
//       normal_delivery_time: contract.normal_delivery_time || 30,
//       expedited_delivery_time: contract.expedited_delivery_time || 10,
//       fob_term: contract.fob_term || "Origin",
//       energy_star_compliance: contract.energy_star_compliance || "Yes",
//     });
//     setEditingClientId(contract.client_id);
//     setShowEditDialog(true);
//     setEditStep(1);
//   };

//   const ContactRow = ({ icon: Icon, value }: { icon: any; value: any }) => {
//     if (!value) return null;
//     return (
//       <div className="flex items-center gap-3 text-slate-600">
//         <Icon className="w-4 h-4 text-slate-400" />
//         <span className="text-sm">{value}</span>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-8">
//       {error && (
//         <div className="mx-auto  mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
//           <div className="flex-1">
//             <p className="text-sm font-semibold text-red-800">{error}</p>
//           </div>
//           <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto">
//         <div>
//           <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Contracts</h1>
//           <p className="text-slate-500 font-medium mt-1">
//             Manage your GSA contract profiles and logistics information
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setShowAddDialog(true);
//             fetchClients();
//           }}
//           className="flex items-center justify-center gap-2 bg-[#38A1DB] hover:bg-[#2D8BBF] text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
//         >
//           <Plus className="w-5 h-5 stroke-[3px]" />
//           Add Contract
//         </button>
//       </div>

//       <div className="mx-auto bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-6 items-center">
//         <div className="relative flex-1 w-full">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search contracts by number or officer name..."
//             className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none bg-white text-slate-700 placeholder:text-slate-400"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="mx-auto bg-white rounded-2xl shadow-xs border border-slate-100">
//         <table className="w-full">
//           <thead className="border-b-2 border-slate-200">
//             <tr>
//               <th className="text-left p-5 font-bold text-slate-700">Contract</th>
//               <th className="text-left p-5 font-bold text-slate-700">Client</th>
//               <th className="text-left p-5 font-bold text-slate-700">Officer</th>
//               <th className="text-left p-5 font-bold text-slate-700">Location</th>
//               <th className="text-left p-5 font-bold text-slate-700">Last Modified</th>
//               <th className="w-16"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-12">
//                   <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#38A1DB]" />
//                 </td>
//               </tr>
//             ) : filteredContracts.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-12 text-slate-500">
//                   No contracts found
//                 </td>
//               </tr>
//             ) : (
//               filteredContracts.map((contract) => (
//                 <tr
//                   key={contract.client_profile_id}
//                   onClick={() => setSelectedContract(contract)}
//                   className="border-b border-slate-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
//                 >
//                   <td className="p-5">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38A1DB] to-[#2D8BBF] flex items-center justify-center text-white font-bold uppercase">
//                         {contract.contract_number.slice(0, 2)}
//                       </div>
//                       <div>
//                         <span className="font-semibold text-slate-800 block">
//                           {contract.contract_number}
//                         </span>
//                         <span className="text-xs text-slate-400">ID: {contract.client_id}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-5 text-slate-600 font-medium">{contract.client}</td>
//                   <td className="p-5 text-slate-600 font-medium">
//                     {contract.contract_officer_name || "—"}
//                   </td>
//                   <td className="p-5 text-slate-600 text-sm">
//                     {contract.contract_officer_city && contract.contract_officer_state
//                       ? `${contract.contract_officer_city}, ${contract.contract_officer_state}`
//                       : "—"}
//                   </td>

//                   <td className="p-5 text-slate-600">
//                     {new Date(contract.updated_time).toLocaleDateString("en-US")}
//                   </td>

//                   <td className="p-5 relative">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenContractId(
//                           openContractId === contract.client_id ? null : contract.client_id
//                         );
//                       }}
//                       className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
//                     >
//                       <MoreVertical className="w-5 h-5 text-slate-500" />
//                     </button>

//                     {openContractId === contract.client_id && (
//                       <>
//                         <div
//                           className="fixed inset-0 z-40"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setOpenContractId(null);
//                           }}
//                         />
//                         <div
//                           className="absolute right-8 top-12 z-50 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <button
//                             className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedContract(contract);
//                               setOpenContractId(null);
//                             }}
//                           >
//                             <Eye className="w-4 h-4" /> View Details
//                           </button>
//                           <button
//                             className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openEditDialog(contract);
//                               setOpenContractId(null);
//                             }}
//                           >
//                             <Edit className="w-4 h-4" /> Edit Contract
//                           </button>
//                           <hr className="my-1 border-slate-100" />
//                           <button
//                             className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(contract.client_id);
//                               setOpenContractId(null);
//                             }}
//                           >
//                             <Trash2 className="w-4 h-4" /> Delete
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {selectedContract && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0" onClick={() => setSelectedContract(null)} />

//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-gradient-to-br from-[#38A1DB] to-[#2D8BBF] px-8 py-6 rounded-t-3xl z-10">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-5">
//                   <div className="relative">
//                     <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner text-white">
//                       <FileText className="w-7 h-7" />
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
//                       Contract {selectedContract.contract_number}
//                     </h2>
//                     <p className="text-sm md:text-base text-blue-100 font-medium mt-1">
//                       Origin Country:{" "}
//                       <span className="font-semibold text-white/90">
//                         {selectedContract.origin_country || "—"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedContract(null)}
//                   className="p-3 rounded-full hover:bg-white/20 transition-colors"
//                 >
//                   <X className="w-6 h-6 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-8 grid md:grid-cols-2 gap-6">
//               <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
//                 <div className="flex items-center gap-3 mb-6">
//                   <User className="w-6 h-6 text-[#38A1DB]" />
//                   <h3 className="text-xl font-bold text-slate-800">Contract Officer</h3>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                       Officer Name
//                     </label>
//                     <p className="text-slate-800 font-semibold mt-1">
//                       {selectedContract.contract_officer_name || "—"}
//                     </p>
//                   </div>
//                   <ContactRow
//                     icon={MapPin}
//                     value={`${selectedContract.contract_officer_address || ""}, ${
//                       selectedContract.contract_officer_city || ""
//                     }, ${selectedContract.contract_officer_state || ""} ${
//                       selectedContract.contract_officer_zip || ""
//                     }`
//                       .trim()
//                       .replace(/^,\s*/, "")}
//                   />
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
//                 <div className="flex items-center gap-3 mb-6">
//                   <Settings className="w-6 h-6 text-[#38A1DB]" />
//                   <h3 className="text-xl font-bold text-slate-800">Terms & Logistics</h3>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center border-b border-blue-100 pb-2">
//                     <span className="text-sm text-slate-500 font-medium uppercase tracking-tight">
//                       FOB Term
//                     </span>
//                     <span className="font-bold text-slate-800">{selectedContract.fob_term}</span>
//                   </div>
//                   <div className="flex justify-between items-center border-b border-blue-100 pb-2">
//                     <span className="text-sm text-slate-500 font-medium uppercase tracking-tight">
//                       GSA Discount
//                     </span>
//                     <span className="font-bold text-[#38A1DB]">
//                       {selectedContract.gsa_proposed_discount}%
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 pt-2">
//                     <div>
//                       <label className="text-[10px] font-bold text-slate-400 uppercase">
//                         Normal Deliv.
//                       </label>
//                       <p className="text-sm font-bold text-slate-700">
//                         {selectedContract.normal_delivery_time} Days
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-[10px] font-bold text-slate-400 uppercase">
//                         Expedited
//                       </label>
//                       <p className="text-sm font-bold text-slate-700">
//                         {selectedContract.expedited_delivery_time} Days
//                       </p>
//                     </div>
//                   </div>
//                   <div className="pt-2">
//                     <label className="text-[10px] font-bold text-slate-400 uppercase">
//                       Energy Star Compliance
//                     </label>
//                     <div className="flex items-center gap-2 mt-1">
//                       <ShieldCheck
//                         className={`w-4 h-4 ${
//                           selectedContract.energy_star_compliance === "Yes"
//                             ? "text-emerald-500"
//                             : "text-slate-300"
//                         }`}
//                       />
//                       <span className="text-sm font-bold text-slate-700">
//                         {selectedContract.energy_star_compliance}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Info className="w-6 h-6 text-slate-400" />
//                   <h3 className="text-xl font-bold text-slate-800">Additional Terms</h3>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-8">
//                   <div>
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                       Additional Concessions
//                     </label>
//                     <p className="text-slate-700 mt-2 text-sm leading-relaxed">
//                       {selectedContract.additional_concessions || "None specified"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                       Q/V Discount Details
//                     </label>
//                     <p className="text-slate-700 mt-2 text-sm leading-relaxed">
//                       {selectedContract.q_v_discount || "None specified"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-3xl flex justify-between border-t border-slate-200 z-10">
//               <button
//                 onClick={() => setSelectedContract(null)}
//                 className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
//               >
//                 Dismiss
//               </button>
//               <button
//                 onClick={() => {
//                   if (selectedContract) {
//                     openEditDialog(selectedContract);
//                     setSelectedContract(null);
//                   }
//                 }}
//                 className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[#38A1DB] to-[#2D8BBF] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
//               >
//                 Edit Contract
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showAddDialog && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             <div className="bg-gradient-to-br from-[#38A1DB] to-[#2D8BBF] py-4 px-8 shrink-0">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Add Contract</h2>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddDialog(false);
//                     setAddStep(1);
//                     setNewContract(initialForm);
//                     setClientSearch("");
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-full"
//                   disabled={isSubmitting}
//                 >
//                   <X className="w-6 h-6 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 border-b border-slate-200 shrink-0">
//               {["Officer Info", "Logistics & Terms"].map((label, i) => {
//                 const stepNum = i + 1;
//                 const active = addStep >= stepNum;
//                 const completed = addStep > stepNum;

//                 return (
//                   <div key={stepNum} className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                           active ? "bg-[#38A1DB] text-white" : "bg-slate-200 text-slate-400"
//                         }`}
//                       >
//                         {completed ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
//                       </div>
//                       <span className={`font-semibold ${active ? "text-[#38A1DB]" : "text-slate-400"}`}>
//                         {label}
//                       </span>
//                     </div>
//                     {i < 1 && (
//                       <div className={`w-16 h-1 rounded-full ${completed ? "bg-[#38A1DB]" : "bg-slate-200"}`} />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <form onSubmit={handleAddContract} noValidate className="flex-1 overflow-y-auto">
//               <div className="py-4 px-8 space-y-6">
//                 {addStep === 1 && (
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="md:col-span-2">
//                       <label className="text-sm font-bold text-slate-700">Contract Number *</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.contract_number}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, contract_number: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div className="md:col-span-2 relative" ref={clientDropdownRef}>
//                       <label className="text-sm font-bold text-slate-700">Client *</label>
//                       <input
//                         type="text"
//                         placeholder="Search by Client ID or Company Name"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={clientSearch}
//                         onFocus={() => setShowClientDropdown(true)}
//                         onChange={(e) => {
//                           setClientSearch(e.target.value);
//                           setShowClientDropdown(true);
//                         }}
//                       />

//                       {showClientDropdown && (
//                         <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
//                           {filteredClients.length === 0 ? (
//                             <div className="px-4 py-3 text-slate-500 text-sm">No clients found</div>
//                           ) : (
//                             filteredClients.map((client) => (
//                               <button
//                                 key={client.client_id}
//                                 type="button"
//                                 className="w-full px-4 py-3 text-left hover:bg-blue-50 flex justify-between items-center"
//                                 onClick={() => {
//                                   setNewContract({ ...newContract, client_id: client.client_id });
//                                   setClientSearch(`${client.client_id} - ${client.company_name}`);
//                                   setShowClientDropdown(false);
//                                 }}
//                               >
//                                 <span className="font-semibold text-slate-700">{client.company_name}</span>
//                                 <span className="text-xs text-slate-400">ID: {client.client_id}</span>
//                               </button>
//                             ))
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Officer Name</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.contract_officer_name}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, contract_officer_name: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Officer Address</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.contract_officer_address}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, contract_officer_address: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">City</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.contract_officer_city}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, contract_officer_city: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <label className="text-sm font-bold text-slate-700">State</label>
//                         <input
//                           type="text"
//                           className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                           value={newContract.contract_officer_state}
//                           onChange={(e) =>
//                             setNewContract({ ...newContract, contract_officer_state: e.target.value })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="text-sm font-bold text-slate-700">ZIP</label>
//                         <input
//                           type="text"
//                           className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                           value={newContract.contract_officer_zip}
//                           onChange={(e) =>
//                             setNewContract({ ...newContract, contract_officer_zip: e.target.value })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {addStep === 2 && (
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Origin Country</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.origin_country}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, origin_country: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">FOB Term</label>
//                       <select
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
//                         value={newContract.fob_term}
//                         onChange={(e) => setNewContract({ ...newContract, fob_term: e.target.value })}
//                       >
//                         <option value="Origin">Origin</option>
//                         <option value="Destination">Destination</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">GSA Proposed Discount (%)</label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.gsa_proposed_discount}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, gsa_proposed_discount: parseFloat(e.target.value) || 0 })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Energy Star Compliance</label>
//                       <select
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
//                         value={newContract.energy_star_compliance}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, energy_star_compliance: e.target.value })
//                         }
//                       >
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                         <option value="N/A">N/A</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Normal Delivery (Days)</label>
//                       <input
//                         type="number"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.normal_delivery_time}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, normal_delivery_time: parseInt(e.target.value) || 0 })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Expedited Delivery (Days)</label>
//                       <input
//                         type="number"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={newContract.expedited_delivery_time}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, expedited_delivery_time: parseInt(e.target.value) || 0 })
//                         }
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="text-sm font-bold text-slate-700">Quantity/Volume Discounts</label>
//                       <textarea
//                         rows={2}
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
//                         value={newContract.q_v_discount}
//                         onChange={(e) => setNewContract({ ...newContract, q_v_discount: e.target.value })}
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="text-sm font-bold text-slate-700">Additional Concessions</label>
//                       <textarea
//                         rows={2}
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
//                         value={newContract.additional_concessions}
//                         onChange={(e) =>
//                           setNewContract({ ...newContract, additional_concessions: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-200 shrink-0 z-20">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (addStep === 1) {
//                       setShowAddDialog(false);
//                       setNewContract(initialForm);
//                       setClientSearch("");
//                     } else {
//                       setAddStep(1);
//                     }
//                   }}
//                   className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
//                   disabled={isSubmitting}
//                 >
//                   {addStep === 1 ? "Cancel" : "Back"}
//                 </button>

//                 {addStep === 1 ? (
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       if (!newContract.contract_number.trim()) {
//                         setError("Contract number is required");
//                         return;
//                       }
//                       if (!newContract.client_id) {
//                         setError("Please select a client");
//                         return;
//                       }
//                       setError(null);
//                       setAddStep(2);
//                     }}
//                     className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF]"
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF] shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
//                     {isSubmitting ? "Saving..." : "Create Contract Profile"}
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showEditDialog && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             <div className="bg-gradient-to-br from-[#38A1DB] to-[#2D8BBF] py-4 px-8 shrink-0">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-white">Edit Contract</h2>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditDialog(false);
//                     setEditStep(1);
//                     setEditingClientId(null);
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-full"
//                   disabled={isSubmitting}
//                 >
//                   <X className="w-6 h-6 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 border-b border-slate-200 shrink-0">
//               {["Officer Info", "Logistics & Terms"].map((label, i) => {
//                 const stepNum = i + 1;
//                 const active = editStep >= stepNum;
//                 const completed = editStep > stepNum;

//                 return (
//                   <div key={stepNum} className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                           active ? "bg-[#38A1DB] text-white" : "bg-slate-200 text-slate-400"
//                         }`}
//                       >
//                         {completed ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
//                       </div>
//                       <span className={`font-semibold ${active ? "text-[#38A1DB]" : "text-slate-400"}`}>
//                         {label}
//                       </span>
//                     </div>
//                     {i < 1 && (
//                       <div className={`w-16 h-1 rounded-full ${completed ? "bg-[#38A1DB]" : "bg-slate-200"}`} />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <form onSubmit={handleEditContract} noValidate className="flex-1 overflow-y-auto">
//               <div className="py-4 px-8 space-y-6">
//                 {editStep === 1 && (
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="md:col-span-2">
//                       <label className="text-sm font-bold text-slate-700">Contract Number *</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.contract_number}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, contract_number: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Officer Name</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.contract_officer_name}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, contract_officer_name: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Officer Address</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.contract_officer_address}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, contract_officer_address: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">City</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.contract_officer_city}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, contract_officer_city: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <label className="text-sm font-bold text-slate-700">State</label>
//                         <input
//                           type="text"
//                           className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                           value={editContract.contract_officer_state}
//                           onChange={(e) =>
//                             setEditContract({ ...editContract, contract_officer_state: e.target.value })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="text-sm font-bold text-slate-700">ZIP</label>
//                         <input
//                           type="text"
//                           className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                           value={editContract.contract_officer_zip}
//                           onChange={(e) =>
//                             setEditContract({ ...editContract, contract_officer_zip: e.target.value })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {editStep === 2 && (
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Origin Country</label>
//                       <input
//                         type="text"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.origin_country}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, origin_country: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">FOB Term</label>
//                       <select
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
//                         value={editContract.fob_term}
//                         onChange={(e) => setEditContract({ ...editContract, fob_term: e.target.value })}
//                       >
//                         <option value="Origin">Origin</option>
//                         <option value="Destination">Destination</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">GSA Proposed Discount (%)</label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.gsa_proposed_discount}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, gsa_proposed_discount: parseFloat(e.target.value) || 0 })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Energy Star Compliance</label>
//                       <select
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
//                         value={editContract.energy_star_compliance}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, energy_star_compliance: e.target.value })
//                         }
//                       >
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                         <option value="N/A">N/A</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Normal Delivery (Days)</label>
//                       <input
//                         type="number"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.normal_delivery_time}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, normal_delivery_time: parseInt(e.target.value) || 0 })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-bold text-slate-700">Expedited Delivery (Days)</label>
//                       <input
//                         type="number"
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
//                         value={editContract.expedited_delivery_time}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, expedited_delivery_time: parseInt(e.target.value) || 0 })
//                         }
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="text-sm font-bold text-slate-700">Quantity/Volume Discounts</label>
//                       <textarea
//                         rows={2}
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
//                         value={editContract.q_v_discount}
//                         onChange={(e) => setEditContract({ ...editContract, q_v_discount: e.target.value })}
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="text-sm font-bold text-slate-700">Additional Concessions</label>
//                       <textarea
//                         rows={2}
//                         className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
//                         value={editContract.additional_concessions}
//                         onChange={(e) =>
//                           setEditContract({ ...editContract, additional_concessions: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-200 shrink-0 z-20">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (editStep === 1) {
//                       setShowEditDialog(false);
//                       setEditingClientId(null);
//                     } else {
//                       setEditStep(1);
//                     }
//                   }}
//                   className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
//                   disabled={isSubmitting}
//                 >
//                   {editStep === 1 ? "Cancel" : "Back"}
//                 </button>

//                 {editStep === 1 ? (
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       if (!editContract.contract_number?.trim()) {
//                         setError("Contract number is required");
//                         return;
//                       }
//                       setError(null);
//                       setEditStep(2);
//                     }}
//                     className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF]"
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF] shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
//                     {isSubmitting ? "Updating..." : "Update Contract"}
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/ContractsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, AlertCircle, X } from "lucide-react";
import { ClientContractRead } from "../types/contract.types";
import { contractService } from "../services/contractService";
import ContractTable from "../components/contracts/ContractsTable";
import ContractDetailsModal from "../components/contracts/ContractDetailsModal";
import AddContractModal from "../components/contracts/AddContractModal";
import EditContractModal from "../components/contracts/EditContractModal";

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<ClientContractRead | null>(null);
  const [contracts, setContracts] = useState<ClientContractRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [contractToEdit, setContractToEdit] = useState<ClientContractRead | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getAllContracts();
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contracts");
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

  const handleDelete = async (clientId: number) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;

    try {
      await contractService.deleteContract(clientId);
      setContracts((prev) =>
        prev.map((c) => (c.client_id === clientId ? { ...c, is_deleted: true } : c))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contract");
      console.error("Error deleting contract:", err);
    }
  };

  const handleEdit = (contract: ClientContractRead) => {
    setContractToEdit(contract);
    setShowEditDialog(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 p-8">
      {error && (
        <div className="mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto ">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Contracts</h1>
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

      <div className="mx-auto bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts by number, officer name, or client..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#38A1DB] bg-white text-slate-700 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mx-auto ">
        <ContractTable
          contracts={filteredContracts}
          loading={loading}
          onView={setSelectedContract}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
    </div>
  );
}