'use client'

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const KanbanLoading = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(col => (
                <div key={col} className="bg-white rounded-md p-4">
                    <div className="flex justify-between mb-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="mb-4">
                            <Skeleton className="h-20 w-full rounded-md mb-2" />
                            <Skeleton className="h-4 w-3/4 rounded-md mb-1" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default KanbanLoading;
