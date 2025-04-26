'use client'

import React, { useState } from 'react';
import { ProjectWithTasksDto, TaskDto } from "@/features/project/types/projects.types";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/components/Protect/Home/Projects/[id]/ProjectDetailOverviewComponent";
import { Empty, Spin, Select, Badge, Tooltip, Popover, Button, Tag } from "antd";
import {
    AlertCircle,
    CheckCircle2,
    Circle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckCheck,
    Clock8,
    Users,
    Filter,
    BarChart
} from "lucide-react";
import dayjs from "dayjs";

const { Option } = Select;

const ProjectDetailCalendar = ({id} : {id:string}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const {
        data: project,
        isLoading,
        error,
        isError
    } = useQuery<ProjectWithTasksDto>({
        queryKey: ['project', id],
        queryFn: () => getProjects(id),
    });

    // Organize tasks by date
    const organizeTasksByDate = () => {
        if (!project || !project.tasks) return {};

        const tasksByDate: Record<string, TaskDto[]> = {};

        project.tasks
            // Apply status filter if set
            .filter(task => statusFilter ?
                (task.status?.toLowerCase() === statusFilter.toLowerCase()) : true)
            .forEach(task => {
                if (task.taskEnd) {
                    const dateKey = new Date(task.taskEnd).toISOString().split('T')[0];
                    if (!tasksByDate[dateKey]) {
                        tasksByDate[dateKey] = [];
                    }
                    tasksByDate[dateKey].push(task);
                }
            });
        return tasksByDate;
    };

    // Get status icon based on task status
    const getStatusIcon = (status: string | undefined) => {
        if (!status) return <Circle size={16} className="text-gray-400" />;

        switch(status?.toLowerCase()) {
            case 'complete':
                return <CheckCheck size={16} className="text-green-500" />;
            case 'in progress':
                return <Clock size={16} className="text-blue-500" />;
            case 'not start':
                return <Clock8 size={16} className="text-gray-500" />;
            case 'over due':
                return <AlertCircle size={16} className="text-red-500" />;
            default:
                return <Circle size={16} className="text-gray-400" />;
        }
    };

    // Get status color for task items
    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'gray';

        switch(status?.toLowerCase()) {
            case 'complete':
                return 'green';
            case 'in progress':
                return 'blue';
            case 'not start':
                return 'gray';
            case 'over due':
                return 'red';
            default:
                return 'gray';
        }
    };

    // Get priority color for tags
    const getPriorityColor = (priority: string | undefined) => {
        if (!priority) return '';

        switch(priority?.toLowerCase()) {
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

    // Format date for display
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('MMM D, YYYY');
    };

    // Navigate to previous month
    const previousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
        setSelectedDate(null);
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
        setSelectedDate(null);
    };

    // Navigate to today
    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(null);
    };

    // Task detail popover content
    const taskPopoverContent = (task: TaskDto) => (
        <div className="w-72 max-w-full">
            <div className="mb-2 flex items-center justify-between">
                <Tag color={getStatusColor(task.status)} className="flex items-center gap-1.5 px-2 py-1">
                    {getStatusIcon(task.status)}
                    <span>{task.status || 'Not start'}</span>
                </Tag>
                <Tag color={getPriorityColor(task.priority)}>{task.priority || 'Normal'}</Tag>
            </div>
            <h4 className="text-sm font-semibold mb-1 text-gray-800">{task.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{task.description || 'No description'}</p>
            <div className="text-xs text-gray-500 flex items-center gap-4">
                <div className="flex items-center">
                    <CalendarIcon size={12} className="mr-1" />
                    <span>Due: {formatDate(task.taskEnd || '')}</span>
                </div>
                {task.assignees && task.assignees.length > 0 && (
                    <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        <span>{task.assignees.length} assignee{task.assignees.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>
        </div>
    );

    // Generate status options for filter
    const getStatusOptions = () => {
        return [
            { value: 'not start', label: 'Not Started', icon: <Clock8 size={14} className="mr-1 text-gray-500" /> },
            { value: 'in progress', label: 'In Progress', icon: <Clock size={14} className="mr-1 text-blue-500" /> },
            { value: 'over due', label: 'Overdue', icon: <AlertCircle size={14} className="mr-1 text-red-500" /> },
            { value: 'complete', label: 'Complete', icon: <CheckCheck size={14} className="mr-1 text-green-500" /> }
        ];
    };

    // Get task count for each status
    const getTaskStatusCounts = () => {
        if (!project || !project.tasks) return { complete: 0, inProgress: 0, notStart: 0, overDue: 0 };

        return project.tasks.reduce((acc, task) => {
            const status = task.status?.toLowerCase() || 'not start';

            if (status === 'complete') acc.complete++;
            else if (status === 'in progress') acc.inProgress++;
            else if (status === 'not start') acc.notStart++;
            else if (status === 'over due') acc.overDue++;

            return acc;
        }, { complete: 0, inProgress: 0, notStart: 0, overDue: 0 });
    };

    // Generate day tasks
    const renderDayTasks = (dayTasks: TaskDto[]) => {
        // Sort tasks by priority (high to low)
        const priorityOrder: {[key: string]: number} = { 'high': 1, 'medium': 2, 'low': 3 };
        const sortedTasks = [...dayTasks].sort((a, b) => {
            const priorityA = a.priority?.toLowerCase() || 'low';
            const priorityB = b.priority?.toLowerCase() || 'low';
            return (priorityOrder[priorityA] || 999) - (priorityOrder[priorityB] || 999);
        });

        return (
            <div className="space-y-1 overflow-auto max-h-28">
                {sortedTasks.slice(0, 3).map((task, index) => (
                    <Popover
                        key={`task-${task.id}-${index}`}
                        content={() => taskPopoverContent(task)}
                        title={null}
                        placement="right"
                        trigger="hover"
                    >
                        <div
                            className={`text-xs p-1.5 rounded-md border-l-4 bg-white border border-${getStatusColor(task.status)}-300 border-l-${getStatusColor(task.status)}-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center truncate mr-1">
                                    {getStatusIcon(task.status)}
                                    <span className="ml-1 truncate font-medium">{task.title}</span>
                                </div>
                                {task.priority && (
                                    <div className={`w-2 h-2 rounded-full bg-${getPriorityColor(task.priority)}-500`}></div>
                                )}
                            </div>
                        </div>
                    </Popover>
                ))}
                {sortedTasks.length > 3 && (
                    <div className="text-xs text-center text-gray-500 hover:text-gray-700 py-0.5 cursor-pointer">
                        +{sortedTasks.length - 3} more tasks
                    </div>
                )}
            </div>
        );
    };

    // Render calendar view
    const renderCalendarView = () => {
        const tasksByDate = organizeTasksByDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const today = new Date();

        // Get first day of month (day of week)
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        // Get number of days in month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Create calendar grid
        const calendarDays = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Add day headers
        for (let i = 0; i < 7; i++) {
            calendarDays.push(
                <div key={`header-${i}`} className="p-2 font-medium text-center text-gray-600 border-b border-r border-gray-200 last:border-r-0">
                    {dayNames[i]}
                </div>
            );
        }

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="p-2 border-b border-r border-gray-200 bg-gray-50 min-h-28 last:border-r-0"></div>
            );
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toISOString().split('T')[0];
            const isToday = date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
            const isSelected = selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
            const dayTasks = tasksByDate[dateString] || [];
            const hasOverdueTasks = dayTasks.some(task => task.status?.toLowerCase() === 'over due');

            calendarDays.push(
                <div
                    key={`day-${day}`}
                    className={`
                        relative p-2 border-b border-r border-gray-200 min-h-28 last:border-r-0
                        ${isToday ? 'bg-blue-50' : ''}
                        ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}
                        ${hasOverdueTasks ? 'bg-red-50 bg-opacity-30' : ''}
                        hover:bg-gray-50 cursor-pointer transition-colors
                    `}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className="absolute top-1 right-2">
                        {dayTasks.length > 0 && (
                            <Badge count={dayTasks.length} size="small" />
                        )}
                    </div>
                    <div className={`
                        font-semibold mb-2 text-center rounded-full w-6 h-6 flex items-center justify-center mx-auto
                        ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}
                    `}>
                        {day}
                    </div>
                    {dayTasks.length > 0 && renderDayTasks(dayTasks)}
                </div>
            );
        }

        // Fill in any remaining cells to complete the grid
        const totalCells = calendarDays.length - 7; // Subtract the header row
        const cellsToAdd = (Math.ceil(totalCells / 7) * 7) - totalCells;

        for (let i = 0; i < cellsToAdd; i++) {
            calendarDays.push(
                <div key={`empty-end-${i}`} className="p-2 border-b border-r border-gray-200 bg-gray-50 min-h-28 last:border-r-0"></div>
            );
        }

        return (
            <div className="grid grid-cols-7 border-t border-l border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {calendarDays}
            </div>
        );
    };

    // Render selected day details
    const renderSelectedDayDetails = () => {
        if (!selectedDate) return null;

        const dateString = selectedDate.toISOString().split('T')[0];
        const tasksByDate = organizeTasksByDate();
        const dayTasks = tasksByDate[dateString] || [];

        if (dayTasks.length === 0) {
            return (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="text-center py-8">
                        <CalendarIcon size={32} className="mx-auto text-gray-400 mb-3" />
                        <h4 className="text-gray-700 font-medium">No tasks on {formatDate(dateString)}</h4>
                        <p className="text-gray-500 text-sm mt-1">Select a different day or add a task for this date</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Tasks for {formatDate(dateString)}
                    </h3>
                    <Button type="primary" size="small" className="bg-blue-500">
                        Add Task
                    </Button>
                </div>
                <div className="space-y-2">
                    {dayTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-3 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start">
                                <div className="mr-3 mt-1">
                                    {getStatusIcon(task.status)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                                        <Tag color={getPriorityColor(task.priority)}>{task.priority || 'Normal'}</Tag>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                                    {task.assignees && task.assignees.length > 0 && (
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <Users size={12} className="mr-1" />
                                            <span>Assignees: {task.assignees.map(a => a.empName).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100svh-64px)]">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg my-4 mx-auto max-w-3xl">
                <h3 className="text-lg font-semibold text-red-700">Error Loading Project</h3>
                <p className="text-red-600">{(error as Error).message}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100svh-64px)]">
                <Empty description="Project not found" />
            </div>
        );
    }

    const taskStatusCounts = getTaskStatusCounts();

    return (
        <div className="bg-white rounded-b-lg shadow-sm p-4 md:p-6 flex-1 overflow-auto">
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Button
                        type="text"
                        icon={<ChevronLeft size={18} />}
                        onClick={previousMonth}
                        className="flex items-center justify-center hover:bg-gray-100 rounded-full h-9 w-9 p-0"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 min-w-32 text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <Button
                        type="text"
                        icon={<ChevronRight size={18} />}
                        onClick={nextMonth}
                        className="flex items-center justify-center hover:bg-gray-100 rounded-full h-9 w-9 p-0"
                    />
                    <Button onClick={goToToday} className="ml-2">
                        Today
                    </Button>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-1.5">
                        <BarChart size={16} className="text-indigo-500" />
                        <span className="whitespace-nowrap">{project.tasks?.length || 0} total tasks</span>
                    </div>

                    <Select
                        placeholder={
                            <div className="flex items-center">
                                <Filter size={14} className="mr-1" />
                                <span>Filter by status</span>
                            </div>
                        }
                        allowClear
                        style={{ minWidth: 170 }}
                        onChange={(value) => setStatusFilter(value)}
                        defaultValue={null}
                    >
                        {getStatusOptions().map(option => (
                            <Option key={option.value} value={option.value}>
                                <div className="flex items-center">
                                    {option.icon}
                                    <span>{option.label}</span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-1.5 rounded-md bg-gray-200 mr-2">
                            <Clock8 size={16} className="text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-700">Not Started</span>
                    </div>
                    <span className="font-semibold text-gray-700">{taskStatusCounts.notStart}</span>
                </div>

                <div className="flex items-center justify-between bg-blue-50 rounded-md px-3 py-2 border border-blue-200">
                    <div className="flex items-center">
                        <div className="p-1.5 rounded-md bg-blue-200 mr-2">
                            <Clock size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-blue-700">In Progress</span>
                    </div>
                    <span className="font-semibold text-blue-700">{taskStatusCounts.inProgress}</span>
                </div>

                <div className="flex items-center justify-between bg-red-50 rounded-md px-3 py-2 border border-red-200">
                    <div className="flex items-center">
                        <div className="p-1.5 rounded-md bg-red-200 mr-2">
                            <AlertCircle size={16} className="text-red-600" />
                        </div>
                        <span className="text-sm text-red-700">Overdue</span>
                    </div>
                    <span className="font-semibold text-red-700">{taskStatusCounts.overDue}</span>
                </div>

                <div className="flex items-center justify-between bg-green-50 rounded-md px-3 py-2 border border-green-200">
                    <div className="flex items-center">
                        <div className="p-1.5 rounded-md bg-green-200 mr-2">
                            <CheckCheck size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm text-green-700">Complete</span>
                    </div>
                    <span className="font-semibold text-green-700">{taskStatusCounts.complete}</span>
                </div>
            </div>

            {/* Calendar and Selected Day Details in a flex container */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendar View */}
                <div className="w-full lg:w-3/5">
                    {renderCalendarView()}
                </div>

                {/* Selected Day Details */}
                <div className="w-full lg:w-2/5">
                    {renderSelectedDayDetails() || (
                        <div className="h-full flex items-center justify-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="text-center">
                                <CalendarIcon size={32} className="mx-auto text-gray-400 mb-3" />
                                <h4 className="text-gray-700 font-medium">Select a day to view tasks</h4>
                                <p className="text-gray-500 text-sm mt-1">Click on any day in the calendar to see details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailCalendar;