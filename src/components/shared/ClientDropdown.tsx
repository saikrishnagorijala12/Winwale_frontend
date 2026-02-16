import React, { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Search, Check } from "lucide-react";
import { Client } from "../../types/pricelist.types";

interface ClientDropdownProps {
    clients: Client[];
    selectedClient: string;
    onClientSelect: (clientId: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const ClientDropdown: React.FC<ClientDropdownProps> = ({
    clients,
    selectedClient,
    onClientSelect,
    placeholder = "Choose an approved client...",
    disabled = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState("");
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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedClientData = clients.find(
        (c) => c.client_id === selectedClient,
    );

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setClientSearch("");
            }
        }
    };

    const filteredClients = clients.filter((c) =>
        c.company_name.toLowerCase().includes(clientSearch.toLowerCase()),
    );

    return (
        <div className={`relative group/select ${className}`} ref={dropdownRef}>
            <div
                onClick={toggleDropdown}
                className={`w-full pl-6 pr-6 py-4 bg-white border rounded-2xl outline-none font-medium flex items-center justify-between transition-all ${disabled
                        ? "opacity-60 cursor-not-allowed bg-slate-50"
                        : "cursor-pointer"
                    } ${isOpen
                        ? "border-[#3399cc] ring-4 ring-[#3399cc]/10 shadow-lg shadow-[#3399cc]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
            >
                <div className="flex items-center gap-3 w-full overflow-hidden">
                    <Building2
                        className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? "text-[#3399cc]" : "text-slate-400"
                            }`}
                        size={18}
                    />
                    <span
                        className={`block truncate ${selectedClientData ? "text-slate-900" : "text-slate-400"
                            }`}
                    >
                        {selectedClientData
                            ? `${selectedClientData.company_name} (${selectedClientData.contract_number || "No Contract"
                            })`
                            : placeholder}
                    </span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#3399cc]" : ""
                        }`}
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={14}
                            />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search by company name..."
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#3399cc] bg-white transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                        {filteredClients.length === 0 ? (
                            <div className="px-4 py-8 text-slate-400 text-sm text-center italic">
                                No clients found matching "{clientSearch}"
                            </div>
                        ) : (
                            filteredClients.map((c) => (
                                <div
                                    key={c.client_id}
                                    onClick={() => {
                                        onClientSelect(c.client_id);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-3 mx-2 rounded-xl cursor-pointer transition-colors text-sm font-medium group flex items-center justify-between
                    ${selectedClient === c.client_id
                                            ? "bg-slate-100 text-[#3399cc]"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                        }
                  `}
                                >
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-semibold uppercase truncate">
                                            {c.company_name}
                                        </span>

                                        {c.contract_number && (
                                            <span
                                                className={`text-xs mt-1 transition-colors truncate ${selectedClient === c.client_id
                                                        ? "text-[#3399cc]/70"
                                                        : "text-slate-400 group-hover:text-slate-500"
                                                    }`}
                                            >
                                                Contract: {c.contract_number}
                                            </span>
                                        )}
                                    </div>
                                    {selectedClient === c.client_id && (
                                        <Check size={16} className="text-[#3399cc] shrink-0 ml-2" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
