'use client'

import React, { useState, useEffect } from 'react';
import { useGetAllProjectsQuery } from "@/stores/redux/api/projectApi";
import {
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    CheckSquare,
    Circle,
    BarChart2,
    PlusCircle,
    Star,
    StarOff,
    UserPlus,
    MessageSquare,
    ArrowUpRight,
    ChevronRight,
    Search,
    Filter,
    X,
    BellRing,
    PinIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Assuming these types are defined elsewhere
interface TaskDto {
    Id: number;
    Title: string;
    Description?: string;
    Status?: string;
    Priority?: string;
    TaskStart?: string;
    TaskEnd?: string;
    CreatedAt: string;
    Assignees?: AssigneeDto[];
    Category?: string;
}

interface AssigneeDto {
    EmpNo: string;
    EmpName?: string;
    EmpEmail?: string;
}

interface ProjectWithTasksDto {
    Id: number;
    Name: string;
    Description: string;
    OwnerId: number;
    CreatedAt: string;
    ProjectStart?: string;
    ProjectEnd?: string;
    Duration?: number;
    Priority?: string;
    EmpNo: string;
    EmpName: string;
    EmpEmail: string;
    TasksJson: TaskDto[];
    isPinned?: boolean; // Added for UI functionality
}

const HomePageComponent = () => {
    const { data: projects, isLoading } = useGetAllProjectsQuery();
    const [pinnedProjects, setPinnedProjects] = useState<ProjectWithTasksDto[]>([]);
    const [myTasks, setMyTasks] = useState<TaskDto[]>([]);
    const [upcomingTasks, setUpcomingTasks] = useState<TaskDto[]>([]);
    const [assignedToMe, setAssignedToMe] = useState<TaskDto[]>([]);
    const [taskStats, setTaskStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0,
        completionRate: 0
    });
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');

    // Mock user for demo (would normally come from authentication context)
    const currentUser = {
        EmpNo: 'Chatjak1',
        EmpName: 'Chatjak',
        EmpEmail: 'chatjak@example.com'
    };

    // Process data once it loads
    useEffect(() => {
        if (projects) {
            // Get current date for calculations
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            // Track all tasks for the current user
            let allMyTasks: TaskDto[]
            let upcomingTaskList: TaskDto[]
            let assignedTaskList: TaskDto[]

            // Process each project
            projects.forEach(project => {
                if (project.TasksJson) {
                    // Find tasks relevant to current user
                    project.TasksJson.forEach(task => {
                        // Add project reference to each task for UI display
                        const taskWithProject = {
                            ...task,
                            projectId: project.Id,
                            projectName: project.Name
                        };

                        // Check if this task belongs to current user
                        const isMyTask = task.Assignees?.some(assignee =>
                            assignee.EmpNo === currentUser.EmpNo
                        );

                        if (isMyTask) {
                            // Add to my tasks
                            allMyTasks.push(taskWithProject);

                            // Check for upcoming tasks (due within a week)
                            if (task.TaskEnd) {
                                const dueDate = new Date(task.TaskEnd);
                                if (dueDate >= today && dueDate <= nextWeek) {
                                    upcomingTaskList.push(taskWithProject);
                                }
                            }

                            // Check if assigned by someone else
                            if (task.Assignees && task.Assignees.length > 0) {
                                if (project.OwnerId !== parseInt(currentUser.EmpNo)) {
                                    assignedTaskList.push(taskWithProject);
                                }
                            }
                        }
                    });
                }
            });

            // Sort by due date
            upcomingTaskList.sort((a, b) => {
                if (!a.TaskEnd) return 1;
                if (!b.TaskEnd) return -1;
                return new Date(a.TaskEnd).getTime() - new Date(b.TaskEnd).getTime();
            });

            // Default to 3 pinned projects (would normally be stored in user preferences)
            setPinnedProjects(
                projects.slice(0, 3).map(p => ({ ...p, isPinned: true }))
            );

            // Calculate task statistics
            const completed = allMyTasks.filter(t => t.Status?.toLowerCase() === 'completed').length;
            const inProgress = allMyTasks.filter(t => t.Status?.toLowerCase() === 'on progress').length;
            const overdue = allMyTasks.filter(t => {
                if (!t.TaskEnd) return false;
                const dueDate = new Date(t.TaskEnd);
                return dueDate < today && t.Status?.toLowerCase() !== 'completed';
            }).length;

            setMyTasks(allMyTasks);
            setUpcomingTasks(upcomingTaskList);
            setAssignedToMe(assignedTaskList);
            setTaskStats({
                total: allMyTasks.length,
                completed,
                inProgress,
                overdue,
                completionRate: allMyTasks.length ? Math.round((completed / allMyTasks.length) * 100) : 0
            });
        }
    }, [projects]);

    // Filter tasks based on status and search
    const filteredTasks = myTasks.filter(task => {
        // Apply status filter
        if (statusFilter.length > 0) {
            const taskStatus = task.Status?.toLowerCase() || '';

            // Special case for overdue
            if (statusFilter.includes('overdue')) {
                const isOverdue = task.TaskEnd && new Date(task.TaskEnd) < new Date() &&
                    task.Status?.toLowerCase() !== 'completed';

                if (isOverdue && statusFilter.includes('overdue')) {
                    return true;
                }

                if (!statusFilter.some(s => s === 'in progress' && taskStatus === 'on progress' ||
                    s === 'not started' && taskStatus === 'not start')) {
                    return false;
                }
            } else if (!statusFilter.some(s => s === 'in progress' && taskStatus === 'on progress' ||
                s === 'not started' && taskStatus === 'not start')) {
                return false;
            }
        }

        // Apply text search
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            return task.Title.toLowerCase().includes(searchLower) ||
                task.Description?.toLowerCase().includes(searchLower) ||
                task.Category?.toLowerCase().includes(searchLower);
        }

        return true;
    });

    // Calculate days until due
    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else {
            return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
        }
    };

    // Function to format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Get task status icon and color
    const getTaskStatusInfo = (task: TaskDto) => {
        const isOverdue = task.TaskEnd && new Date(task.TaskEnd) < new Date() &&
            task.Status?.toLowerCase() !== 'completed';

        if (isOverdue) {
            return {
                label: 'Overdue',
                icon: <AlertCircle className="w-4 h-4" />,
                color: 'text-rose-600 bg-rose-50'
            };
        }

        const status = task.Status?.toLowerCase();

        if (status === 'completed') {
            return {
                label: 'Completed',
                icon: <CheckCircle2 className="w-4 h-4" />,
                color: 'text-emerald-600 bg-emerald-50'
            };
        } else if (status === 'on progress') {
            return {
                label: 'In Progress',
                icon: <Clock className="w-4 h-4" />,
                color: 'text-blue-600 bg-blue-50'
            };
        } else {
            return {
                label: 'Not Started',
                icon: <Circle className="w-4 h-4" />,
                color: 'text-amber-600 bg-amber-50'
            };
        }
    };

    // Function to create avatar
    const createAvatar = (assignee: AssigneeDto) => {
        const initial = assignee.EmpName ? assignee.EmpName.charAt(0).toUpperCase() : 'U';
        return (
            <div
                className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-medium"
                title={assignee.EmpName || assignee.EmpNo}
            >
                {initial}
            </div>
        );
    };

    // Toggle pinned status of a project
    const togglePinProject = (project: ProjectWithTasksDto) => {
        setPinnedProjects(prev => {
            const isPinned = prev.some(p => p.Id === project.Id);

            if (isPinned) {
                return prev.filter(p => p.Id !== project.Id);
            } else {
                return [...prev, { ...project, isPinned: true }];
            }
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4 md:p-6">
                <div className="animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Page header */}
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Welcome back, {currentUser.EmpName || currentUser.EmpNo}
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search tasks..."
                            className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        {searchText && (
                            <button
                                onClick={() => setSearchText('')}
                                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Link
                        href="/create-task"
                        className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4 mr-1.5" />
                        New Task
                    </Link>
                </div>
            </header>

            {/* Dashboard layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Task summary and calendar */}
                <div className="lg:col-span-2">
                    {/* Task Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Total Tasks</span>
                                <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckSquare className="h-4 w-4 text-purple-600" />
                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{taskStats.total}</p>
                            <div className="mt-2 text-xs text-gray-500">
                <span className="flex items-center">
                  <BarChart2 className="h-3 w-3 mr-1" />
                    {taskStats.completionRate}% completion rate
                </span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Completed</span>
                                <span className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{taskStats.completed}</p>
                            <div className="mt-2 text-xs text-emerald-600 flex items-center">
                                {taskStats.total ? (
                                    <>
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        {Math.round((taskStats.completed / taskStats.total) * 100)}% of total
                                    </>
                                ) : 'No tasks yet'}
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">In Progress</span>
                                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{taskStats.inProgress}</p>
                            <div className="mt-2 text-xs text-blue-600 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Active tasks
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Overdue</span>
                                <span className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{taskStats.overdue}</p>
                            <div className="mt-2 text-xs text-rose-600 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Needs attention
                            </div>
                        </div>
                    </div>

                    {/* My Tasks */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <CheckSquare className="w-5 h-5 text-purple-600 mr-2" />
                                My Tasks
                            </h2>

                            <div className="flex items-center gap-1">
                                {['in progress', 'not started', 'overdue'].map(status => (
                                    <button
                                        key={status}
                                        className={`px-2.5 py-1 text-xs rounded-full flex items-center whitespace-nowrap ${
                                            statusFilter.includes(status)
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        onClick={() => {
                                            setStatusFilter(prev =>
                                                prev.includes(status)
                                                    ? prev.filter(s => s !== status)
                                                    : [...prev, status]
                                            );
                                        }}
                                    >
                                        {status === 'in progress' && <Clock className="w-3 h-3 mr-1" />}
                                        {status === 'not started' && <Circle className="w-3 h-3 mr-1" />}
                                        {status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                                        {status === 'overdue'
                                            ? 'Overdue'
                                            : status === 'in progress'
                                                ? 'In Progress'
                                                : 'Not Started'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredTasks.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredTasks.slice(0, 5).map(task => {
                                    const statusInfo = getTaskStatusInfo(task);
                                    return (
                                        <div key={task.Id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 flex-grow">
                                                    <div className="flex-shrink-0">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color}`}>
                                                            {statusInfo.icon}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-grow">
                                                        <Link
                                                            href={`/project/${task.projectId}/task/${task.Id}`}
                                                            className="text-sm font-medium text-gray-900 hover:text-purple-700 truncate block"
                                                        >
                                                            {task.Title}
                                                        </Link>
                                                        <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500 truncate">
                                {(task as any).projectName || 'Project'}
                              </span>
                                                            {task.Priority && (
                                                                <>
                                                                    <span className="mx-1.5 h-0.5 w-0.5 rounded-full bg-gray-300"></span>
                                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                                                        task.Priority?.toLowerCase() === 'high'
                                                                            ? 'bg-rose-50 text-rose-600'
                                                                            : task.Priority?.toLowerCase() === 'medium'
                                                                                ? 'bg-amber-50 text-amber-600'
                                                                                : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                    {task.Priority}
                                  </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center ml-4">
                                                    {task.TaskEnd && (
                                                        <span className={`text-xs ${
                                                            new Date(task.TaskEnd) < new Date() && task.Status?.toLowerCase() !== 'completed'
                                                                ? 'text-rose-600'
                                                                : 'text-gray-500'
                                                        }`}>
                              {getDaysUntilDue(task.TaskEnd)}
                            </span>
                                                    )}

                                                    {task.Assignees && task.Assignees.length > 0 && (
                                                        <div className="flex -space-x-1 ml-3">
                                                            {task.Assignees.slice(0, 3).map((assignee, idx) => (
                                                                <div key={idx} className="relative">
                                                                    {createAvatar(assignee)}
                                                                </div>
                                                            ))}
                                                            {task.Assignees.length > 3 && (
                                                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs">
                                                                    +{task.Assignees.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {filteredTasks.length > 5 && (
                                    <div className="p-3 text-center">
                                        <Link
                                            href="/tasks"
                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
                                        >
                                            View all {filteredTasks.length} tasks
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <CheckCircle2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <h3 className="text-gray-500 text-sm">
                                    {searchText || statusFilter.length > 0
                                        ? 'No tasks match your filters'
                                        : 'You have no tasks yet'}
                                </h3>
                                {(searchText || statusFilter.length > 0) && (
                                    <button
                                        className="mt-2 text-purple-600 text-sm"
                                        onClick={() => {
                                            setSearchText('');
                                            setStatusFilter([]);
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Calendar / Timeline View */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                                Timeline View
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="flex overflow-x-auto pb-2">
                                {/* Simple calendar timeline - can be enhanced with a calendar library */}
                                {Array.from({ length: 14 }, (_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + i);
                                    const isToday = i === 0;
                                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                                    const dayNum = date.getDate();
                                    const month = i === 0 || date.getDate() === 1
                                        ? date.toLocaleDateString('en-US', { month: 'short' })
                                        : '';

                                    // Find tasks due on this date
                                    const tasksOnDay = myTasks.filter(t => {
                                        if (!t.TaskEnd) return false;
                                        const taskDate = new Date(t.TaskEnd);
                                        return taskDate.getDate() === date.getDate() &&
                                            taskDate.getMonth() === date.getMonth() &&
                                            taskDate.getFullYear() === date.getFullYear();
                                    });

                                    return (
                                        <div
                                            key={i}
                                            className={`min-w-[80px] mx-1 rounded-lg border ${
                                                isToday
                                                    ? 'border-purple-300 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                                            } transition-colors`}
                                        >
                                            <div className={`text-center py-2 px-1 ${isToday ? 'bg-purple-100 rounded-t-lg' : ''}`}>
                                                <div className="text-xs text-gray-500">{day}</div>
                                                <div className="font-bold text-gray-800">{dayNum}</div>
                                                {month && <div className="text-xs text-gray-500">{month}</div>}
                                            </div>
                                            {tasksOnDay.length > 0 && (
                                                <div className="p-2 border-t border-gray-100">
                                                    {tasksOnDay.slice(0, 3).map((task, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="mb-1 last:mb-0 bg-white p-1.5 rounded text-xs border border-gray-100 shadow-sm"
                                                        >
                                                            <div className="font-medium truncate">{task.Title}</div>
                                                            <div className="flex items-center justify-between mt-1">
                                <span className={`w-2 h-2 rounded-full ${
                                    task.Status?.toLowerCase() === 'completed'
                                        ? 'bg-emerald-500'
                                        : task.Status?.toLowerCase() === 'on progress'
                                            ? 'bg-blue-500'
                                            : 'bg-amber-500'
                                }`}></span>
                                                                <span className="text-gray-500">
                                  {task.Assignees?.[0]?.EmpName?.split(' ')[0] || 'Unassigned'}
                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {tasksOnDay.length > 3 && (
                                                        <div className="text-center text-xs text-purple-600 mt-1">
                                                            +{tasksOnDay.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column - Sidebar content */}
                <div className="space-y-6">
                    {/* Upcoming Tasks */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                                Due Soon
                            </h2>
                        </div>

                        {upcomingTasks.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {upcomingTasks.slice(0, 5).map(task => {
                                    const isOverdue = task.TaskEnd && new Date(task.TaskEnd) < new Date();
                                    return (
                                        <div key={task.Id} className="p-3 hover:bg-gray-50">
                                            <Link
                                                href={`/project/${task.projectId}/task/${task.Id}`}
                                                className="block"
                                            >
                                                <div className="text-sm font-medium text-gray-800">{task.Title}</div>
                                                {task.TaskEnd && (
                                                    <div className={`text-xs mt-1 flex items-center ${
                                                        isOverdue ? 'text-rose-600' : 'text-gray-500'
                                                    }`}>
                                                        {isOverdue && <AlertCircle className="w-3 h-3 mr-1" />}
                                                        {getDaysUntilDue(task.TaskEnd)}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            task.Priority?.toLowerCase() === 'high'
                                                                ? 'bg-rose-500'
                                                                : task.Priority?.toLowerCase() === 'medium'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-gray-400'
                                                        }`}></div>
                                                        <span className="text-xs text-gray-500 ml-1.5">
                              {(task as any).projectName || 'Project'}
                            </span>
                                                    </div>

                                                    {task.Assignees && task.Assignees[0] && (
                                                        <div>{createAvatar(task.Assignees[0])}</div>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}

                                {upcomingTasks.length > 5 && (
                                    <div className="p-3 text-center">
                                        <Link
                                            href="/upcoming"
                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
                                        >
                                            View all {upcomingTasks.length} upcoming tasks
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm">No upcoming tasks</p>
                            </div>
                        )}
                    </div>

                    {/* Pinned Projects */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <PinIcon className="w-5 h-5 text-purple-600 mr-2" />
                                Pinned Projects
                            </h2>
                        </div>

                        {pinnedProjects.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {pinnedProjects.map(project => (
                                    <div key={project.Id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <Link
                                                href={`/project/${project.Id}`}
                                                className="block flex-grow"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-100 text-purple-700 font-medium">
                                                        {project.Name}
                                                    </div>
                                                    <span className="text-gray-800 font-medium ml-2.5">{project.Name}</span>
                                                </div>

                                                <div className="mt-1.5">
                                                    {project.TasksJson && (
                                                        <div className="text-xs text-gray-500">
                                                            {project.TasksJson.length} tasks · {project.TasksJson.filter(t =>
                                                            t.Status?.toLowerCase() === 'completed'
                                                        ).length} completed
                                                        </div>
                                                    )}

                                                    {project.TasksJson && project.TasksJson.length > 0 && (
                                                        <div className="mt-1.5 h-1 bg-gray-100 rounded-full w-full">
                                                            <div
                                                                className="h-full rounded-full bg-purple-500"
                                                                style={{
                                                                    width: `${project.TasksJson.filter(t =>
                                                                        t.Status?.toLowerCase() === 'completed'
                                                                    ).length / project.TasksJson.length * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>

                                            <button
                                                onClick={() => togglePinProject(project)}
                                                className="ml-2 text-gray-400 hover:text-purple-600"
                                            >
                                                <Star className="h-4 w-4 fill-current" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <Star className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm">No pinned projects</p>

                                {projects && projects.length > 0 && (
                                    <button
                                        onClick={() => togglePinProject(projects[0])}
                                        className="mt-2 text-sm text-purple-600"
                                    >
                                        Pin a project
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Assigned to Me */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <UserPlus className="w-5 h-5 text-purple-600 mr-2" />
                                Assigned to Me
                            </h2>
                        </div>

                        {assignedToMe.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {assignedToMe.slice(0, 3).map(task => (
                                    <div key={task.Id} className="p-3 hover:bg-gray-50">
                                        <Link
                                            href={`/project/${task.projectId}/task/${task.Id}`}
                                            className="block"
                                        >
                                            <div className="text-sm font-medium text-gray-800">{task.Title}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                From {(task as any).projectName || 'Project'}
                                            </div>
                                            {task.TaskEnd && (
                                                <div className="flex items-center mt-1.5">
                                                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                                                    <span className="text-xs text-gray-500">
                            Due {formatDate(task.TaskEnd)}
                          </span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                ))}

                                {assignedToMe.length > 3 && (
                                    <div className="p-3 text-center">
                                        <Link
                                            href="/assigned"
                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
                                        >
                                            View all {assignedToMe.length} assigned tasks
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <UserPlus className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm">No tasks assigned to you</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity - simplified version */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <BellRing className="w-5 h-5 text-purple-600 mr-2" />
                                Recent Activity
                            </h2>
                        </div>
                        <div className="p-4">
                            {/* This would typically be populated with actual activity data */}
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-800">Alex</span>
                                            <span className="text-gray-600"> commented on </span>
                                            <span className="font-medium text-gray-800">Website Redesign</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-800">Sara</span>
                                            <span className="text-gray-600"> completed </span>
                                            <span className="font-medium text-gray-800">Create API documentation</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <UserPlus className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-800">John</span>
                                            <span className="text-gray-600"> assigned you to </span>
                                            <span className="font-medium text-gray-800">Fix login bug</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">2 days ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 text-center">
                                <Link
                                    href="/activity"
                                    className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
                                >
                                    View all activity
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageComponent;