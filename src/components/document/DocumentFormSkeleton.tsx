import React from "react";

export const DocumentFormSkeleton = () => {
    return (
        <div className="animate-fade-in mx-auto">
            {/* Tabs Skeleton */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="px-6 py-4 border-b-2 border-transparent"
                    >
                        <div className="h-4 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Form Content Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
                <div className="p-8 flex flex-wrap -mx-4 gap-y-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="w-full md:w-1/2 px-4 space-y-3">
                            <div className="h-3 w-20 bg-slate-100 rounded ml-1 animate-pulse"></div>
                            <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
                        </div>
                    ))}
                    <div className="w-full px-4 space-y-3">
                        <div className="h-3 w-32 bg-slate-100 rounded ml-1 animate-pulse"></div>
                        <div className="h-32 w-full bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-8 flex items-center justify-between pb-10">
                <div className="h-11 w-28 bg-white border border-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-11 w-40 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
        </div>
    );
};
