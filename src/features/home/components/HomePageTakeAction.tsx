'use client'

import React, { useState } from 'react';
import {
    CheckCircle2,
    Clock,
    User,
    Briefcase,
    ArrowUpRight,
    Calendar,
    Search,
    X,
    SlidersHorizontal,
    ChevronDown,
    AlertTriangle,
    Timer
} from "lucide-react";
import Link from "next/link";
import { QueryTaskByMe } from "@/features/task/dto/QueryTaskByMe";
import {getTaskDueStatus, StatusBadge} from "@/features/home/utils/TakeActionUtils";
import { motion, AnimatePresence } from "framer-motion";

type FilterOptions = {
    status: string[];
    priority: string | null;
    projectId: string | null;
    searchText: string;
};

const HomePageTakeAction = ({ actionTasks }: {
    actionTasks: QueryTaskByMe[];
}) => {
    const currentDate = new Date("2025-05-15T09:25:09Z");

    const [actionStatusFilter, setActionStatusFilter] = useState<string>('all');

    const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        status: [],
        priority: null,
        projectId: null,
        searchText: ''
    });

    const uniqueProjectsMap = new Map<string, { id: string, name: string }>();
    actionTasks.forEach(task => {
        if (task.projectid && task.projectname) {
            uniqueProjectsMap.set(task.projectid, { id: task.projectid, name: task.projectname });
        }
    });
    const uniqueProjects = Array.from(uniqueProjectsMap.values());

    const uniquePriorities = Array.from(
        new Set((actionTasks ?? []).map(task => task.priority).filter(Boolean))
    ) as string[];

    const filteredActionTasks = actionTasks.filter(task => {
        if (actionStatusFilter !== 'all') {
            if (actionStatusFilter === 'overdue') {
                if (!(task.taskend && new Date(task.taskend) < currentDate)) return false;
            } else if (actionStatusFilter === 'incoming') {
                if (!task.taskend) return false;
                const today = new Date(currentDate);
                today.setHours(0, 0, 0, 0);
                const incomingThreshold = new Date(today);
                incomingThreshold.setDate(today.getDate() + 3);
                const dueDate = new Date(task.taskend);
                if (!(dueDate >= today && dueDate <= incomingThreshold)) return false;
            } else if (actionStatusFilter === 'normal') {
                if (task.taskend) {
                    const today = new Date(currentDate);
                    today.setHours(0, 0, 0, 0);
                    const incomingThreshold = new Date(today);
                    incomingThreshold.setDate(today.getDate() + 3);
                    const dueDate = new Date(task.taskend);
                    if (!(dueDate > incomingThreshold)) return false;
                }
            }
        }

        if (filterOptions.status.length > 0 && !filterOptions.status.includes(task.status || '')) {
            return false;
        }

        if (filterOptions.priority && task.priority !== filterOptions.priority) {
            return false;
        }

        if (filterOptions.projectId && task.projectid !== filterOptions.projectId) {
            return false;
        }

        if (filterOptions.searchText) {
            const searchLower = filterOptions.searchText.toLowerCase();
            return (
                (task.title?.toLowerCase().includes(searchLower)) ||
                (task.description?.toLowerCase().includes(searchLower)) ||
                (task.projectname?.toLowerCase().includes(searchLower))
            );
        }

        return true;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPriorityBadge = (priority?: string) => {
        if (!priority) return null;

        let colorClass = '';
        let icon = null;

        switch (priority.toLowerCase()) {
            case 'high':
                colorClass = 'bg-gradient-to-r from-rose-500 to-rose-600 text-white';
                icon = <ArrowUpRight className="w-3 h-3 mr-1" />;
                break;
            case 'medium':
                colorClass = 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
                break;
            case 'low':
                colorClass = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-700';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${colorClass}`}>
                {icon}
                {priority}
            </span>
        );
    };

    const createAvatar = (name?: string) => {
        if (!name) return null;

        const initials = name.split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');

        return (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xs flex items-center justify-center font-medium shadow-sm">
                {initials}
            </div>
        );
    };

    const toggleStatusFilter = (status: string) => {
        setFilterOptions(prev => {
            if (prev.status.includes(status)) {
                return { ...prev, status: prev.status.filter(s => s !== status) };
            } else {
                return { ...prev, status: [...prev.status, status] };
            }
        });
    };

    const clearAllFilters = () => {
        setActionStatusFilter('all');
        setFilterOptions({
            status: [],
            priority: null,
            projectId: null,
            searchText: ''
        });
    };

    const isFiltered = actionStatusFilter !== 'all' ||
        filterOptions.status.length > 0 ||
        filterOptions.priority !== null ||
        filterOptions.projectId !== null ||
        filterOptions.searchText !== '';

    const filterTabs = [
        { id: 'all', label: 'All Tasks', icon: <Clock className="w-4 h-4" /> },
        { id: 'overdue', label: 'Overdue', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'incoming', label: 'Next 3 Days', icon: <Timer className="w-4 h-4" /> },
        { id: 'normal', label: 'Upcoming', icon: <Calendar className="w-4 h-4" /> }
    ];

    return (
        <div className="bg-white/40 backdrop-blur-xs rounded-xl shadow border border-slate-200/5 mb-6 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="font-semibold text-lg text-gray-800 flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mr-3">
                            <Clock className="w-4 h-4" />
                        </div>
                        Take Action
                    </h2>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow sm:flex-grow-0">
                            <input
                                type="text"
                                value={filterOptions.searchText}
                                onChange={(e) => setFilterOptions(prev => ({ ...prev, searchText: e.target.value }))}
                                placeholder="Search tasks..."
                                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-gray-50"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            {filterOptions.searchText && (
                                <button
                                    onClick={() => setFilterOptions(prev => ({ ...prev, searchText: '' }))}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isFiltered
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="hidden sm:inline">Filter</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterMenu ? 'transform rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-5 overflow-x-auto pb-1">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActionStatusFilter(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                actionStatusFilter === tab.id
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showFilterMenu && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-gray-100 overflow-hidden"
                    >
                        <div className="p-5 bg-gray-50">
                            <div className="flex flex-wrap gap-6">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => toggleStatusFilter('Not start')}
                                            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                                filterOptions.status.includes('Not start')
                                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            Not Started
                                        </button>
                                        <button
                                            onClick={() => toggleStatusFilter('On Progress')}
                                            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                                filterOptions.status.includes('On Progress')
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            On Progress
                                        </button>
                                        <button
                                            onClick={() => toggleStatusFilter('Completed')}
                                            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                                filterOptions.status.includes('Completed')
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            Completed
                                        </button>
                                    </div>
                                </div>

                                {/* Priority filter */}
                                {uniquePriorities.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Priority</p>
                                        <select
                                            value={filterOptions.priority || ''}
                                            onChange={(e) => setFilterOptions(prev => ({
                                                ...prev,
                                                priority: e.target.value || null
                                            }))}
                                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                                        >
                                            <option value="">All Priorities</option>
                                            {uniquePriorities.map(priority => (
                                                <option key={priority} value={priority}>{priority}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Project filter */}
                                {uniqueProjects.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Project</p>
                                        <select
                                            value={filterOptions.projectId || ''}
                                            onChange={(e) => setFilterOptions(prev => ({
                                                ...prev,
                                                projectId: e.target.value || null
                                            }))}
                                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                                        >
                                            <option value="">All Projects</option>
                                            {uniqueProjects.map(project => (
                                                <option key={project.id} value={project.id}>{project.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Clear filters button */}
                                {isFiltered && (
                                    <div className="ml-auto self-end">
                                        <button
                                            onClick={clearAllFilters}
                                            className="bg-white text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-200 transition-colors shadow-sm"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredActionTasks.length > 0 ? (
                <div className="p-5 overflow-y-auto max-h-[calc(100vh-300px)]">
                    <div className="grid gap-4">
                        {filteredActionTasks.map((task, index) => {
                            const dueStatus = getTaskDueStatus(task);
                                task.status === 'Completed' ? 100 : 0;

                            return (
                                <motion.div
                                    key={task.taskid}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`p-5 border rounded-xl transition-all hover:shadow-md ${dueStatus.className} `}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="flex-grow">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 flex flex-col flex-shrink-0 gap-2">
                                                    <StatusBadge status={task.status || 'Not start'} />
                                                    {task.priority && (
                                                        <div className="flex-shrink-0">
                                                            {getPriorityBadge(task.priority)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-grow">
                                                    <Link
                                                        href={`/t/${task.taskid}`}
                                                        className="text-base font-semibold text-gray-900 hover:text-purple-700 transition-colors line-clamp-2"
                                                    >
                                                        {task.title}
                                                    </Link>

                                                    {/* Task description - truncated */}
                                                    {task.description && (
                                                        <p className="text-sm text-gray-600 mt-1.5 whitespace-pre-line line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Priority badge if available */}

                                            </div>



                                            {/* Detailed metadata grid */}
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {/* Project info */}
                                                <div className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg">
                                                    <Briefcase className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                    <div>
                                                        <span className="text-gray-500">Project</span>
                                                        <p className="text-gray-700 font-medium truncate">
                                                            {task.projectname || 'Unassigned'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Assignee info */}
                                                <div className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg">
                                                    <User className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                    <div>
                                                        <span className="text-gray-500">Assigned by</span>
                                                        <p className="text-gray-700 font-medium truncate">
                                                            {task?.userassignname || '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Due date info */}
                                                {task.taskend && (
                                                    <div className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg">
                                                        <Calendar className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                        <div>
                                                            <span className="text-gray-500">Due Date</span>
                                                            <p className={`font-medium ${dueStatus.textColorClass}`}>
                                                                {formatDate(task.taskend)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Creation date if available */}
                                                {task.taskcreatedat && (
                                                    <div className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg">
                                                        <Clock className="w-3.5 h-3.5 mr-2 text-gray-500" />
                                                        <div>
                                                            <span className="text-gray-500">Created</span>
                                                            <p className="text-gray-700 font-medium">
                                                                {formatDate(task.taskcreatedat)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Due status display */}
                                                <div className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg">
                                                    {dueStatus.icon}
                                                    <div className="ml-2">
                                                        <span className="text-gray-500">Status</span>
                                                        <p className={`font-medium ${dueStatus.textColorClass}`}>
                                                            {dueStatus.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex  items-center lg:items-start my-4 gap-4">
                                        <p className={`text-gray-500 text-xs`}>Assignee:</p>
                                        {task.empname && (
                                            <div className="flex items-center gap-2">
                                                {createAvatar(task.empname)}
                                                <span className="text-xs text-gray-500 lg:hidden">
                                                        {task.empname}
                                                    </span>
                                            </div>
                                        )}
                                    </div>
                                    {task.parenttaskid && (
                                        <div className="mt-3 text-xs flex items-center text-gray-500 border-t border-gray-100 pt-3">
                                            <span>Parent Task: </span>
                                            <Link href={`/task/${task.parenttaskid}`} className="ml-1 text-purple-600 hover:underline font-medium">
                                                View Parent Task
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-5 text-sm">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                            {filteredActionTasks.length === 1
                                ? '1 task'
                                : `${filteredActionTasks.length} tasks`}
                            {isFiltered ? ' matching your filters' : ''}
                        </span>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 text-center"
                >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{`You're all caught up!`}</h3>
                    <p className="text-gray-600 mb-5">No tasks require your action right now.</p>
                    {isFiltered && (
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors shadow-sm text-sm font-medium"
                        >
                            Clear all filters
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default HomePageTakeAction;