'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useGetProjectByIdQuery } from "@/stores/redux/api/projectApi";
import { TaskDto, AssigneeDto } from "@/features/project/types/projects.types";
import {
    Calendar,
    Clock,
    ChevronDown,
    ChevronRight,
    User,
    CheckCircle,
    ListTree,
    Search,
    Filter,
    ArrowUpDown,
    AlertCircle,
    X,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskComponent from "@/features/project/components/TaskComponent";
import dayjs from 'dayjs';
import {useRouter} from "next/navigation";

const ProjectTable = ({ id }: { id: string }) => {
    const { data, isLoading, error } = useGetProjectByIdQuery({ id });
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const router = useRouter()

    useEffect(() => {
        if (data) {
            setTasks(data[0].TasksJson || []);
        }
    }, [data]);

    const toggleExpand = (taskId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const handleTaskClick = (task: TaskDto) => {
         router.push(`/t/${task.Id}`);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'on progress':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'not start':
                return 'bg-slate-50 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />;
            case 'on progress':
                return <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" />;
            case 'not start':
                return <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />;
            default:
                return <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'medium':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'low':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    // Get unique statuses for filter dropdown
    const statuses = useMemo(() => {
        const statusSet = new Set<string>();
        tasks.forEach(task => {
            statusSet.add(task.Status.toLowerCase());
            task.SubTasks?.forEach(subTask => {
                statusSet.add(subTask.Status.toLowerCase());
            });
        });
        return Array.from(statusSet);
    }, [tasks]);

    // Apply filters and sorting
    const filteredTasks = useMemo(() => {
        let filtered = tasks.filter(task =>
            (task.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.Category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.Status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.Assignees?.some(assignee => assignee.EmpName?.toLowerCase().includes(searchTerm.toLowerCase())))
        );

        if (statusFilter) {
            filtered = filtered.filter(task =>
                task.Status.toLowerCase() === statusFilter.toLowerCase() ||
                task.SubTasks?.some(subTask => subTask.Status.toLowerCase() === statusFilter.toLowerCase())
            );
        }

        if (sortField) {
            filtered = [...filtered].sort((a, b) => {
                let valueA: any;
                let valueB: any;

                switch (sortField) {
                    case 'title':
                        valueA = a.Title || '';
                        valueB = b.Title || '';
                        break;
                    case 'status':
                        valueA = a.Status || '';
                        valueB = b.Status || '';
                        break;
                    case 'priority':
                        valueA = a.Priority || '';
                        valueB = b.Priority || '';
                        break;
                    case 'start':
                        valueA = a.TaskStart ? new Date(a.TaskStart).getTime() : 0;
                        valueB = b.TaskStart ? new Date(b.TaskStart).getTime() : 0;
                        break;
                    default:
                        return 0;
                }

                if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [tasks, searchTerm, statusFilter, sortField, sortDirection]);

    // Format date in a cleaner way
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('MMM D, YYYY');
    };

    if (isLoading) return (
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b">
                <div className="h-8 bg-slate-200 rounded-md w-1/3 animate-pulse mb-4"></div>
                <div className="h-10 bg-slate-100 rounded-lg w-full animate-pulse"></div>
            </div>
            <div className="p-8 flex justify-center">
                <div className="w-10 h-10 border-2 border-violet-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 flex items-center justify-center gap-3 text-red-500">
                <AlertCircle />
                <p>Failed to load project data. Please try again later.</p>
            </div>
        </div>
    );

    if (!tasks || tasks.length === 0) return (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-slate-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ListTree className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No tasks found</h3>
            <p className="text-sm text-slate-500 mb-4">There are no tasks available for this project.</p>
            <button className="inline-flex items-center rounded-lg px-3 py-2 text-sm bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add first task
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Title */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500">
                            <ListTree className="h-4 w-4" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Project Tasks
                            <span className="ml-2 text-sm font-normal text-slate-500">({filteredTasks.length})</span>
                        </h2>
                    </div>

                    {/* Search and filters */}
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                        {/* Status filter */}
                        <div className="relative">
                            <select
                                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                value={statusFilter || ''}
                                onChange={(e) => setStatusFilter(e.target.value || null)}
                            >
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="pl-9 pr-3 py-2 w-full text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            {searchTerm && (
                                <button
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors"
                            onClick={() => handleSort('title')}
                        >
                            <div className="flex items-center gap-1">
                                Title
                                {sortField === 'title' && (
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                )}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center gap-1">
                                Status
                                {sortField === 'status' && (
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                )}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors"
                            onClick={() => handleSort('priority')}
                        >
                            <div className="flex items-center gap-1">
                                Priority
                                {sortField === 'priority' && (
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                )}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors"
                            onClick={() => handleSort('start')}
                        >
                            <div className="flex items-center gap-1">
                                Timeline
                                {sortField === 'start' && (
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Assignees
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                    {filteredTasks.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Search className="h-5 w-5 text-slate-300" />
                                    <span>No tasks match your search criteria</span>
                                    {(searchTerm || statusFilter) && (
                                        <button
                                            className="mt-2 text-violet-500 text-sm hover:text-violet-700 hover:underline"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setStatusFilter(null);
                                            }}
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredTasks.map((task) => (
                            <React.Fragment key={task.Id}>
                                <motion.tr
                                    className={`group ${hoveredRow === task.Id ? 'bg-violet-50' : 'hover:bg-slate-50'} transition-colors cursor-pointer`}
                                    onClick={() => handleTaskClick(task)}
                                    onMouseEnter={() => setHoveredRow(task.Id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {task.SubTasks?.length > 0 ? (
                                                <button
                                                    className="w-5 h-5 flex items-center justify-center rounded-full text-violet-500 hover:bg-violet-100 transition-colors"
                                                    onClick={(e) => toggleExpand(task.Id, e)}
                                                >
                                                    {expandedTasks[task.Id] ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="w-5"></div>
                                            )}
                                            <div className="font-medium text-slate-800 group-hover:text-violet-700 transition-colors">
                                                {task.Title}
                                            </div>
                                            {task.SubTasks?.length > 0 && (
                                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600">
                                                        {task.SubTasks.length}
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 inline-flex items-center text-xs leading-none font-medium rounded-full ${getStatusColor(task.Status)}`}>
                                                {getStatusIcon(task.Status)}
                                                {task.Status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.Priority ? (
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-none font-medium rounded-full ${getPriorityColor(task.Priority)}`}>
                                                    {task.Priority}
                                                </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.TaskStart || task.TaskEnd ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                    {formatDate(task.TaskStart)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                    {formatDate(task.TaskEnd)}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.Assignees && task.Assignees.length > 0 ? (
                                            <div className="flex -space-x-1">
                                                {task.Assignees.slice(0, 3).map((assignee: AssigneeDto, idx: number) => (
                                                    <div
                                                        key={`${assignee.Id}-${idx}`}
                                                        className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-medium border border-white"
                                                        style={{
                                                            backgroundColor: `hsl(${(assignee.EmpName.charCodeAt(0) * 10) % 360}, 70%, 90%)`,
                                                            color: `hsl(${(assignee.EmpName.charCodeAt(0) * 10) % 360}, 70%, 30%)`
                                                        }}
                                                        title={assignee.EmpName}
                                                    >
                                                        {assignee.EmpName.charAt(0).toUpperCase()}
                                                    </div>
                                                ))}
                                                {task.Assignees.length > 3 && (
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-medium border border-white">
                                                        +{task.Assignees.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">Unassigned</span>
                                        )}
                                    </td>
                                </motion.tr>

                                {/* Subtasks */}
                                <AnimatePresence>
                                    {expandedTasks[task.Id] && task.SubTasks && (
                                        <>
                                            {task.SubTasks.map((subTask, idx) => (
                                                <motion.tr
                                                    key={`${task.Id}-${subTask.Id}`}
                                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                                    onClick={() => handleTaskClick(subTask)}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                >
                                                    <td className="px-6 py-3 pl-12">
                                                        <div className="flex items-center">
                                                            <div className="w-4 h-px bg-slate-300 mr-2"></div>
                                                            <div className="font-medium text-slate-700 text-sm">
                                                                {subTask.Title}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                            <span className={`px-2.5 py-1 inline-flex items-center text-xs leading-none font-medium rounded-full ${getStatusColor(subTask.Status)}`}>
                                                                {getStatusIcon(subTask.Status)}
                                                                {subTask.Status}
                                                            </span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {subTask.Priority ? (
                                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-none font-medium rounded-full ${getPriorityColor(subTask.Priority)}`}>
                                                                    {subTask.Priority}
                                                                </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {subTask.TaskStart || subTask.TaskEnd ? (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                                    {formatDate(subTask.TaskStart)}
                                                                </div>
                                                                {subTask.TaskEnd && (
                                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                                        {formatDate(subTask.TaskEnd)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {subTask.Assignees && subTask.Assignees.length > 0 ? (
                                                            <div className="flex -space-x-1">
                                                                {subTask.Assignees.slice(0, 3).map((assignee: AssigneeDto, idx: number) => (
                                                                    <div
                                                                        key={`${assignee.Id}-${idx}`}
                                                                        className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-medium border border-white"
                                                                        style={{
                                                                            backgroundColor: `hsl(${(assignee.EmpName.charCodeAt(0) * 10) % 360}, 70%, 90%)`,
                                                                            color: `hsl(${(assignee.EmpName.charCodeAt(0) * 10) % 360}, 70%, 30%)`
                                                                        }}
                                                                        title={assignee.EmpName}
                                                                    >
                                                                        {assignee.EmpName.charAt(0).toUpperCase()}
                                                                    </div>
                                                                ))}
                                                                {subTask.Assignees.length > 3 && (
                                                                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-medium border border-white">
                                                                        +{subTask.Assignees.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">Unassigned</span>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Task Detail Component */}
            <TaskComponent selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
        </div>
    );
};

export default ProjectTable;