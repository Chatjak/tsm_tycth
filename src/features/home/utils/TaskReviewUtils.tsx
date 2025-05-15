import {QueryTaskByMe} from "@/features/task/dto/QueryTaskByMe";
import React from "react";

export const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getTaskStatusBadge = (task: QueryTaskByMe) => {
    const currentDate = new Date();
    const isOverdue = task.taskend && new Date(task.taskend) < currentDate &&
        task.status !== 'Completed' && task.status !== 'Approved';

    if (isOverdue) {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">Overdue</span>;
    }

    switch (task.status) {
        case 'Completed':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Completed</span>;
        case 'Approved':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Approved</span>;
        case 'Review':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">Review</span>;
        case 'On Progress':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">On Progress</span>;
        case 'Not start':
        default:
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Not Started</span>;
    }
};


export const createAvatar = (name?: string, email?: string) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';
    return (
        <div
            className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-medium"
            title={name || email || ''}
        >
            {initial}
        </div>
    );
};

