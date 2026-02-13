import React, { createContext, useContext, useState, ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface ClientContextType {
    selectedClientId: number | null;
    setSelectedClientId: (id: number | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    return (
        <ClientContext.Provider value={{ selectedClientId, setSelectedClientId }}>
            {children || <Outlet />}
        </ClientContext.Provider>
    );
};

export const useClient = () => {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error("useClient must be used within a ClientProvider");
    }
    return context;
};
