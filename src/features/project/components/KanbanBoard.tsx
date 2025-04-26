'use client'

import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskDto } from '@/features/project/types/projects.types';
import dayjs from 'dayjs';
import TaskDetailSheet from "@/features/project/components/TaskDetailSheet";

const statusColors: {
    [key: string]: {
        bg: string;
        header: string;
        border: string;
        icon: string;
    };
} = {
    "Not start": {
        bg: "bg-gray-50",
        header: "bg-gray-100",
        border: "border-gray-200",
        icon: "text-gray-400"
    },
    "On Progress": {
        bg: "bg-blue-50",
        header: "bg-blue-100",
        border: "border-blue-200",
        icon: "text-blue-400"
    },
    "In Review": {
        bg: "bg-amber-50",
        header: "bg-amber-100",
        border: "border-amber-200",
        icon: "text-amber-400"
    },
    "Completed": {
        bg: "bg-green-50",
        header: "bg-green-100",
        border: "border-green-200",
        icon: "text-green-400"
    }
};
const priorityColors : {
    [key: string]: {
        badge: string;
        text: string;
    };
} = {
    "High": {
        badge: "bg-red-100 text-red-800 border-red-200",
        text: "text-red-600"
    },
    "Medium": {
        badge: "bg-orange-100 text-orange-800 border-orange-200",
        text: "text-orange-600"
    },
    "Low": {
        badge: "bg-green-100 text-green-800 border-green-200",
        text: "text-green-600"
    },
    "Normal": {
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        text: "text-blue-600"
    }
};

const statusColumns = Object.keys(statusColors);

interface KanbanBoardProps {
    tasks: TaskDto[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    const [columns, setColumns] = React.useState<Record<string, TaskDto[]>>({});
    const [showScrollShadows, setShowScrollShadows] = React.useState<Record<string, boolean>>({});
    const [selectedTask, setSelectedTask] = React.useState<TaskDto | null>(null);


    const handleScroll = (e: React.UIEvent<HTMLDivElement>, status: string) => {
        const target = e.currentTarget;
        const isScrolled = target.scrollTop > 5;
        setShowScrollShadows(prev => ({...prev, [status]: isScrolled}));
    };

    React.useEffect(() => {
        const grouped = statusColumns.reduce((acc, status) => {
            acc[status] = tasks.filter(task => task.Status === status);
            return acc;
        }, {} as Record<string, TaskDto[]>);
        setColumns(grouped);
    }, [tasks]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceCol = source.droppableId;
        const destCol = destination.droppableId;

        const sourceTasks = Array.from(columns[sourceCol]);
        const destTasks = Array.from(columns[destCol]);

        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (sourceCol === destCol) {
            sourceTasks.splice(destination.index, 0, movedTask);
            setColumns(prev => ({
                ...prev,
                [sourceCol]: sourceTasks,
            }));
        } else {
            destTasks.splice(destination.index, 0, { ...movedTask, Status: destCol });
            setColumns(prev => ({
                ...prev,
                [sourceCol]: sourceTasks,
                [destCol]: destTasks,
            }));
        }
    };

    return (
        <>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statusColumns.map((status) => (
                    <Droppable key={status} droppableId={status}>
                        {(provided, snapshot) => (
                            <div
                                className={`${statusColors[status].bg} rounded-lg overflow-hidden shadow-md transition-all h-full ${snapshot.isDraggingOver ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <div className={`${statusColors[status].header} px-4 py-3 flex justify-between items-center border-b ${statusColors[status].border}`}>
                                    <div className="flex items-center space-x-2">
                                        <StatusIcon status={status} />
                                        <h3 className="font-bold text-gray-800">{status}</h3>
                                        <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full text-xs font-medium shadow-sm">
                                            {columns[status]?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`p-3 min-h-[600px] max-h-[calc(100vh-120px)] overflow-y-auto relative`}
                                    onScroll={(e) => handleScroll(e, status)}
                                >
                                    {showScrollShadows[status] && (
                                        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                                    )}
                                    <div className="space-y-3">
                                        {columns[status]?.map((task, index) => (
                                            <Draggable key={task.Id.toString()} draggableId={task.Id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`bg-white border rounded-lg p-4 shadow-sm text-sm space-y-2 transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}

                                                        onClick={() => setSelectedTask(task)}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${priorityColors[task.Priority || 'Normal'].badge}`}>
                                                                {task.Priority || 'Normal'}
                                                            </span>

                                                            {/* Task ID badge */}
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                                                                #{task.Id.toString().padStart(3, '0')}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2">
                                                            {task.Title}
                                                        </h4>

                                                        {task.Description && (
                                                            <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded border border-gray-100">
                                                                {task.Description}
                                                            </p>
                                                        )}

                                                        {task.TaskStart && task.TaskEnd && (
                                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                                <CalendarIcon />
                                                                <p>
                                                                    {dayjs(task.TaskStart).format('MMM DD')} - {dayjs(task.TaskEnd).format('MMM DD, YYYY')}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center pt-2 border-t mt-2">
                                                            <div className="flex items-center space-x-2 text-gray-500 text-xs">
                                                                <div className="flex items-center space-x-1">
                                                                    <DocumentIcon />
                                                                    <span>{task.SubTasks?.length || 0} subtasks</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex -space-x-2">
                                                                {task.Assignees?.slice(0, 3).map((assignee, idx) => (
                                                                    <div key={idx}
                                                                         className="w-8 h-8 rounded-full text-xs flex items-center justify-center text-white font-bold border-2 border-white shadow-md"
                                                                         style={{
                                                                             backgroundColor: getAvatarColor(assignee.EmpName || 'User'),
                                                                             backgroundImage: `linear-gradient(45deg, ${getAvatarColor(assignee.EmpName || 'User')}, ${adjustColor(getAvatarColor(assignee.EmpName || 'User'), -20)})`
                                                                         }}>
                                                                        {assignee.EmpName?.charAt(0).toUpperCase() || 'U'}
                                                                    </div>
                                                                ))}
                                                                {(task.Assignees?.length || 0) > 3 && (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-xs flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-md"
                                                                         style={{
                                                                             backgroundImage: 'linear-gradient(45deg, #e5e7eb, #d1d5db)'
                                                                         }}>
                                                                        +{task.Assignees!.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {columns[status]?.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-lg bg-white bg-opacity-50 text-center p-4">
                                                <EmptyIcon className={statusColors[status].icon} />
                                                <p className="text-sm text-gray-500 mt-2">No tasks yet</p>
                                                <p className="text-xs text-gray-400">Drag tasks here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
            <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} />
            </>
    );
};

// Helper functions for avatar colors
const getAvatarColor = (name: string) => {
    const colors = [
        "#4f46e5", "#0891b2", "#7c3aed", "#be123c", "#059669",
        "#ca8a04", "#c026d3", "#0284c7", "#9333ea", "#15803d",
        "#b91c1c", "#0d9488", "#6366f1", "#ea580c", "#4338ca"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

// Function to darken/lighten color for gradient effect
const adjustColor = (hex: string, percent: number) => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust color
    r = Math.max(0, Math.min(255, Math.round(r + (percent / 100) * r)));
    g = Math.max(0, Math.min(255, Math.round(g + (percent / 100) * g)));
    b = Math.max(0, Math.min(255, Math.round(b + (percent / 100) * b)));

    // Convert back to hex
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

// Icons Components
const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
        case "Not start":
            return (
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                </svg>
            );
        case "On Progress":
            return (
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
            );
        case "In Review":
            return (
                <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            );
        case "Completed":
            return (
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        default:
            return null;
    }
};

const CalendarIcon = () => (
    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const EmptyIcon = ({ className }: { className: string }) => (
    <svg className={`w-8 h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 7l-8-4-8.1 4c-.5.3-.9.8-.9 1.5v7c0 .7.4 1.2.9 1.5l8 4c.3.1.6.1.9 0l8.1-4c.5-.3.9-.8.9-1.5v-7c0-.7-.4-1.2-.9-1.5zM4 12l8 4 8-4" />
        <path d="M4 8l8 4 8-4" />
    </svg>
);

export default KanbanBoard;