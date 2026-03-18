import { useState, useCallback, DragEvent } from "react";

const VALID_EXCEL_MIME_TYPES = new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel", 
]);

const VALID_EXCEL_EXTENSIONS = /\.(xlsx|xls)$/i;

export interface UseFileDropOptions {
    onFileDrop: (files: File[]) => void;
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

            const files = Array.from(e.dataTransfer.files);
            if (!files.length) return;

            const validFiles = files.filter(isValidExcelFile);

            if (validFiles.length === 0) {
                onInvalidFile?.(
                    "Invalid file type. Please drop Excel (.xlsx or .xls) files."
                );
                return;
            }

            if (validFiles.length < files.length) {
                onInvalidFile?.(
                    "Some files were ignored. Please drop only Excel (.xlsx or .xls) files."
                );
            }

            onFileDrop(validFiles);
        },
        [onFileDrop, onInvalidFile]
    );

    return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
