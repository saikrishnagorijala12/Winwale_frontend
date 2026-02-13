import React, { createContext, useContext, useState, ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface AnalysisContextType {
    selectedJobId: number | null;
    setSelectedJobId: (id: number | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

    return (
        <AnalysisContext.Provider value={{ selectedJobId, setSelectedJobId }}>
            {children || <Outlet />}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error("useAnalysis must be used within an AnalysisProvider");
    }
    return context;
};
