'use client'

import React from 'react';
import { useGetProjectByIdQuery } from "@/stores/redux/api/projectApi";
import KanbanBoard from '@/features/project/components/KanbanBoard';
import KanbanLoading from "@/features/project/components/KanbanLoading";
import Link from "next/link";

const ProjectDetailComponent = ({ id }: { id: string }) => {
    const { data, isLoading, error } = useGetProjectByIdQuery({ id });
    const tasks = data?.[0]?.TasksJson || []

    if (error) {
        return (
            <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-red-600">Error loading project</h3>
                <p className="text-gray-500">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {isLoading ? <KanbanLoading /> : <KanbanBoard tasks={tasks} />}
        </div>
    );
};

export default ProjectDetailComponent;
