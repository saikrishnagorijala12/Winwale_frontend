import { useState, useCallback, DragEvent } from "react";

const VALID_EXCEL_MIME_TYPES = new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel", 
]);

const VALID_EXCEL_EXTENSIONS = /\.(xlsx|xls)$/i;

export interface UseFileDropOptions {
    onFileDrop: (file: File) => void;
    onInvalidFile?: (reason: string) => void;
}

export interface UseFileDropReturn {
    isDragging: boolean;
    handleDragOver: (e: DragEvent<HTMLElement>) => void;
    handleDragLeave: (e: DragEvent<HTMLElement>) => void;
    handleDrop: (e: DragEvent<HTMLElement>) => void;
}


export function useFileDrop({
    onFileDrop,
    onInvalidFile,
}: UseFileDropOptions): UseFileDropReturn {
    const [isDragging, setIsDragging] = useState(false);

    const isValidExcelFile = (file: File): boolean => {
        if (file.type && VALID_EXCEL_MIME_TYPES.has(file.type)) {
            return true;
        }
        return VALID_EXCEL_EXTENSIONS.test(file.name);
    };

    const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Only clear dragging state when leaving the element itself, not a child
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const file = e.dataTransfer.files?.[0];
            if (!file) return;

            if (!isValidExcelFile(file)) {
                onInvalidFile?.(
                    "Invalid file type. Please drop an Excel (.xlsx or .xls) file."
                );
                return;
            }

            onFileDrop(file);
        },
        [onFileDrop, onInvalidFile]
    );

    return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
