'use client'

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { AssigneeDto, ProjectWithTasksDto } from "@/features/project/types/projects.types";
import axios from "axios";
import { Spin, Empty, Tag, Avatar, Tooltip, Progress } from "antd";
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    Circle,
    AlertCircle,
    Layers,
    FileText,
    Users,
    Calendar,
    BarChart4,
    CheckCheck,
    Timer,
    Clock8
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with plugins
dayjs.extend(relativeTime);

export const getProjects = async (id: string): Promise<ProjectWithTasksDto> => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/api/projects/${id}`
    );
    return response.data;
};

const ProjectDetailOverviewComponent = ({id}: {id: string}) => {
    const {
        data: project,
        isLoading,
        error,
        isError
    } = useQuery<ProjectWithTasksDto>({
        queryKey: ['project', id],
        queryFn: () => getProjects(id),
    });

    // Format date for display
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    // Get relative time from now
    const getTimeFromNow = (dateString: string | undefined) => {
        if (!dateString) return '-';
        return dayjs(dateString).fromNow();
    };

    // Get status icon based on task status
    const getStatusIcon = (status: string | undefined) => {
        if (!status) return <Circle size={16} className="text-gray-400" />;

        switch(status.toLowerCase()) {
            case 'complete':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'in progress':
                return <Clock size={16} className="text-blue-500" />;
            case 'not start':
                return <Circle size={16} className="text-gray-500" />;
            case 'over due':
                return <AlertCircle size={16} className="text-red-500" />;
            default:
                return <Circle size={16} className="text-gray-400" />;
        }
    };

    // Get large status icon for cards
    const getStatusCardIcon = (status: string) => {
        switch(status.toLowerCase()) {
            case 'not start':
                return <Clock8 size={24} className="text-gray-500" />;
            case 'in progress':
                return <Timer size={24} className="text-blue-500" />;
            case 'over due':
                return <AlertCircle size={24} className="text-red-500" />;
            case 'complete':
                return <CheckCheck size={24} className="text-green-500" />;
            default:
                return <Circle size={24} className="text-gray-400" />;
        }
    };

    // Get background color for status cards
    const getStatusCardBg = (status: string) => {
        switch(status.toLowerCase()) {
            case 'not start':
                return "bg-gray-50";
            case 'in progress':
                return "bg-blue-50";
            case 'over due':
                return "bg-red-50";
            case 'complete':
                return "bg-green-50";
            default:
                return "bg-gray-50";
        }
    };

    // Get border color for status cards
    const getStatusCardBorder = (status: string) => {
        switch(status.toLowerCase()) {
            case 'not start':
                return "border-gray-200";
            case 'in progress':
                return "border-blue-100";
            case 'over due':
                return "border-red-100";
            case 'complete':
                return "border-green-100";
            default:
                return "border-gray-200";
        }
    };

    // Get icon background color for status cards
    const getStatusIconBg = (status: string) => {
        switch(status.toLowerCase()) {
            case 'not start':
                return "bg-gray-100";
            case 'in progress':
                return "bg-blue-100";
            case 'over due':
                return "bg-red-100";
            case 'complete':
                return "bg-green-100";
            default:
                return "bg-gray-100";
        }
    };

    // Get text color for status cards
    const getStatusTextColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'not start':
                return "text-gray-600";
            case 'in progress':
                return "text-blue-600";
            case 'over due':
                return "text-red-600";
            case 'complete':
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };

    // Get priority color for tags
    const getPriorityColor = (priority: string | undefined) => {
        if (!priority) return '';

        switch(priority.toLowerCase()) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'default';
        }
    };

    // Generate random colors for avatars based on name
    const getAvatarColor = (name: string | undefined) => {
        if (!name) return '#1890ff';
        const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#f56a00', '#7265e6'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Get initials from name
    const getInitials = (name: string | undefined) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase();
    };

    // Calculate task status counts based on the specified status types
    const getTaskStatusCounts = () => {
        if (!project || !project.tasks) return {
            complete: 0,
            inProgress: 0,
            notStart: 0,
            overDue: 0
        };

        return project.tasks.reduce((acc, task) => {
            const status = task.status?.toLowerCase() || 'not start';

            if (status === 'complete') acc.complete++;
            else if (status === 'in progress') acc.inProgress++;
            else if (status === 'not start') acc.notStart++;
            else if (status === 'over due') acc.overDue++;

            return acc;
        }, { complete: 0, inProgress: 0, notStart: 0, overDue: 0 });
    };

    // Calculate project progress percentage
    const calculateProgress = () => {
        if (!project || !project.tasks || project.tasks.length === 0) return 0;

        const taskStatusCounts = getTaskStatusCounts();
        const completedTasks = taskStatusCounts.complete;

        return Math.round((completedTasks / project.tasks.length) * 100);
    };

    // Calculate days remaining for the project
    const getDaysRemaining = () => {
        if (!project || !project.projectEnd) return { days: 0, isOverdue: false, text: 'N/A' };

        const endDate = new Date(project.projectEnd);
        const today = new Date();

        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return {
                days: diffDays,
                isOverdue: false,
                text: `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`
            };
        } else if (diffDays === 0) {
            return { days: 0, isOverdue: false, text: 'Due today' };
        } else {
            return {
                days: Math.abs(diffDays),
                isOverdue: true,
                text: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`
            };
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100svh-64px)]">
                <Spin size="large" />
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg my-4 mx-auto max-w-3xl">
                <h3 className="text-lg font-semibold text-red-700">Error Loading Project</h3>
                <p className="text-red-600">{(error as Error).message}</p>
            </div>
        );
    }

    // No project found state
    if (!project) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100svh-64px)]">
                <Empty description="Project not found" />
            </div>
        );
    }

    const taskStatusCounts = getTaskStatusCounts();
    const progressPercentage = calculateProgress();
    const daysRemaining = getDaysRemaining();

    return (
        <div className="bg-white rounded-b-lg shadow-sm p-4 md:p-6 flex-1 overflow-auto">
            <div className="space-y-8">
                {/* Project Progress Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Project Progress</h2>
                            <p className="text-gray-600 mt-1">
                                {progressPercentage === 100
                                    ? 'All tasks completed!'
                                    : `${project.tasks?.length || 0} tasks (${progressPercentage}% complete)`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium ${daysRemaining.isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                <Clock size={16} />
                                {daysRemaining.text}
                            </div>
                            <div className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1.5 text-sm font-medium">
                                <Calendar size={16} />
                                {formatDate(project.projectEnd)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
                            <span className="text-xs text-gray-500">
                                {taskStatusCounts.complete} of {project.tasks?.length} tasks
                            </span>
                        </div>
                        <Progress
                            percent={progressPercentage}
                            showInfo={false}
                            strokeColor={{
                                '0%': '#4F46E5',
                                '100%': '#10B981'
                            }}
                            strokeWidth={12}
                            trailColor="#E5E7EB"
                            className="custom-progress"
                        />
                    </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg border shadow-sm ${getStatusCardBg('not start')} ${getStatusCardBorder('not start')} transition-all duration-200 hover:shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className={`text-sm font-medium ${getStatusTextColor('not start')}`}>Not Started</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">{taskStatusCounts.notStart}</div>
                            </div>
                            <div className={`p-2 rounded-lg ${getStatusIconBg('not start')}`}>
                                {getStatusCardIcon('not start')}
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            {taskStatusCounts.notStart > 0
                                ? `${Math.round((taskStatusCounts.notStart / project.tasks.length) * 100)}% of all tasks`
                                : 'No tasks pending'}
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg border shadow-sm ${getStatusCardBg('in progress')} ${getStatusCardBorder('in progress')} transition-all duration-200 hover:shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className={`text-sm font-medium ${getStatusTextColor('in progress')}`}>In Progress</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">{taskStatusCounts.inProgress}</div>
                            </div>
                            <div className={`p-2 rounded-lg ${getStatusIconBg('in progress')}`}>
                                {getStatusCardIcon('in progress')}
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            {taskStatusCounts.inProgress > 0
                                ? `${Math.round((taskStatusCounts.inProgress / project.tasks.length) * 100)}% of all tasks`
                                : 'No tasks in progress'}
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg border shadow-sm ${getStatusCardBg('over due')} ${getStatusCardBorder('over due')} transition-all duration-200 hover:shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className={`text-sm font-medium ${getStatusTextColor('over due')}`}>Overdue</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">{taskStatusCounts.overDue}</div>
                            </div>
                            <div className={`p-2 rounded-lg ${getStatusIconBg('over due')}`}>
                                {getStatusCardIcon('over due')}
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            {taskStatusCounts.overDue > 0
                                ? `${Math.round((taskStatusCounts.overDue / project.tasks.length) * 100)}% of all tasks`
                                : 'No overdue tasks'}
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg border shadow-sm ${getStatusCardBg('complete')} ${getStatusCardBorder('complete')} transition-all duration-200 hover:shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className={`text-sm font-medium ${getStatusTextColor('complete')}`}>Completed</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">{taskStatusCounts.complete}</div>
                            </div>
                            <div className={`p-2 rounded-lg ${getStatusIconBg('complete')}`}>
                                {getStatusCardIcon('complete')}
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            {taskStatusCounts.complete > 0
                                ? `${Math.round((taskStatusCounts.complete / project.tasks.length) * 100)}% of all tasks`
                                : 'No completed tasks'}
                        </div>
                    </div>
                </div>

                {/* Project Info Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recent Tasks */}
                    <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow">
                        <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Layers size={18} className="text-indigo-500 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-800">Recent Tasks</h3>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                                    {project.tasks?.length} total
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            {project.tasks && project.tasks.length > 0 ? (
                                <div className="space-y-3">
                                    {project.tasks.slice(0, 5).map((task) => (
                                        <div key={task.id} className="group flex items-start p-3.5 border border-gray-100 rounded-md hover:bg-gray-50 hover:border-gray-200 transition-all duration-200">
                                            <div className="mr-3 mt-1">
                                                {getStatusIcon(task.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start flex-wrap gap-2">
                                                    <h5 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{task.title}</h5>
                                                    <Tag className="rounded-full" color={getPriorityColor(task.priority)}>{task.priority || 'Normal'}</Tag>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description || 'No description'}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <CalendarIcon size={12} className="mr-1" />
                                                        <span>Due: {formatDate(task.taskEnd)}</span>
                                                    </div>

                                                    {/* Assignees */}
                                                    {task.assignees && task.assignees.length > 0 && (
                                                        <div className="flex -space-x-2">
                                                            {task.assignees.slice(0, 3).map((assignee) => (
                                                                <Tooltip key={assignee.id} title={assignee.empName || 'Unknown'}>
                                                                    <Avatar
                                                                        size="small"
                                                                        style={{ backgroundColor: getAvatarColor(assignee.empName) }}
                                                                    >
                                                                        {getInitials(assignee.empName)}
                                                                    </Avatar>
                                                                </Tooltip>
                                                            ))}
                                                            {task.assignees.length > 3 && (
                                                                <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                                                                    +{task.assignees.length - 3}
                                                                </Avatar>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {project.tasks.length > 5 && (
                                        <div className="text-center pt-2">
                                            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                                                View all {project.tasks.length} tasks
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-10 px-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                        <Layers size={24} className="text-gray-500" />
                                    </div>
                                    <p className="text-gray-600 mb-2">No tasks available</p>
                                    <p className="text-gray-500 text-sm">Create tasks to track project progress</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-auto shadow-sm  transition-all duration-200 hover:shadow">
                        <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <FileText size={18} className="text-indigo-500 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-800">Project Details</h3>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="space-y-5">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1.5">Timeline</h4>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-100 p-1.5 rounded">
                                                <Calendar size={16} className="text-blue-600" />
                                            </div>
                                            <div className="text-sm">
                                                <div className="text-gray-600 font-medium">
                                                    {formatDate(project.projectStart)} - {formatDate(project.projectEnd)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {project.projectStart && project.projectEnd ?
                                                        `${Math.ceil((new Date(project.projectEnd).getTime() - new Date(project.projectStart).getTime()) / (1000 * 60 * 60 * 24))} days duration` :
                                                        'No dates specified'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1.5">Created</h4>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-sm">
                                            <div className="text-gray-600 font-medium">
                                                {dayjs(project.createdAt).format('MMM D, YYYY')}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {getTimeFromNow(project.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1.5">Team Members</h4>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        {project.tasks && project.tasks.reduce((members: AssigneeDto[], task) => {
                                            if (task.assignees) {
                                                task.assignees.forEach(assignee => {
                                                    if (!members.some(m => m.id === assignee.id)) {
                                                        members.push(assignee);
                                                    }
                                                });
                                            }
                                            return members;
                                        }, []).length > 0 ? (
                                            <div>
                                                <div className="flex flex-wrap -m-1">
                                                    {project.tasks.reduce((members: AssigneeDto[], task) => {
                                                        if (task.assignees) {
                                                            task.assignees.forEach(assignee => {
                                                                if (!members.some(m => m.id === assignee.id)) {
                                                                    members.push(assignee);
                                                                }
                                                            });
                                                        }
                                                        return members;
                                                    }, []).map((member) => (
                                                        <Tooltip key={member.id} title={member.empName || 'Unknown'}>
                                                            <div className="m-1 flex items-center bg-white rounded-full px-2 py-1 border border-gray-200">
                                                                <Avatar
                                                                    size="small"
                                                                    style={{ backgroundColor: getAvatarColor(member.empName) }}
                                                                >
                                                                    {getInitials(member.empName)}
                                                                </Avatar>
                                                                <span className="ml-1.5 text-xs font-medium text-gray-700 truncate max-w-[100px]">
                                                                    {member.empName || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    {project.tasks.reduce((members: AssigneeDto[], task) => {
                                                        if (task.assignees) {
                                                            task.assignees.forEach(assignee => {
                                                                if (!members.some(m => m.id === assignee.id)) {
                                                                    members.push(assignee);
                                                                }
                                                            });
                                                        }
                                                        return members;
                                                    }, []).length} team members total
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-3">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mb-2">
                                                    <Users size={16} className="text-gray-500" />
                                                </div>
                                                <p className="text-gray-500 text-sm">No team members assigned</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailOverviewComponent;