'use client'

import React, { useEffect, useState } from 'react';
import { useGetProjectByIdQuery } from "@/stores/redux/api/projectApi";
import { TaskDto, AssigneeDto } from "@/features/project/types/projects.types";
import {Calendar, Clock, ChevronDown, ChevronRight, User, CheckCircle, ListTree} from 'lucide-react';
import TaskComponent from "@/features/project/components/TaskComponent";

const ProjectTable = ({ id }: { id: string }) => {
    const { data, isLoading, error } = useGetProjectByIdQuery({ id });
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
    useEffect(() => {
        if (data) {
            setTasks(data[0].TasksJson || []);
        }
    }, [data]);

    const toggleExpand = (taskId: number) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border border-green-300';
            case 'on progress':
                return 'bg-blue-100 text-blue-800 border border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'on progress':
                return <Clock className="w-4 h-4 mr-1" />;
            case 'not start':
                return <Calendar className="w-4 h-4 mr-1" />;
            default:
                return null;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border border-red-300';
            case 'medium':
                return 'bg-orange-100 text-orange-800 border border-orange-300';
            case 'low':
                return 'bg-green-100 text-green-800 border border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Assignees?.some(assignee => assignee.EmpName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) return (
        <div className="flex justify-center items-center p-12 h-64">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700">Error loading project data. Please try again later.</p>
                </div>
            </div>
        </div>
    );

    if (!tasks || tasks.length === 0) return (
        <div className="bg-white p-8 shadow-md rounded-lg text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no tasks available for this project.</p>
        </div>
    );

    return (
        <div className="bg-white  shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-slate-50 via-white to-indigo-50 border-b shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Headline */}
                    <div className="flex items-center gap-3">
                        <ListTree/>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            Project Tasks <span className="text-sm font-medium text-gray-500">({filteredTasks.length})</span>
                        </h2>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search tasks by title, assignee, or status..."
                            className="pl-12 pr-4 py-2.5 rounded-xl border border-gray-300 shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 w-full transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timeline
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignees
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                No tasks match your search criteria
                            </td>
                        </tr>
                    ) : (
                        filteredTasks.map((task) => (
                            <React.Fragment key={task.Id}>
                                <tr
                                    className={`hover:bg-gray-50 transition-colors ${task.SubTasks?.length > 0 ? 'cursor-pointer' : ''} ${task.Status.toLowerCase() === 'completed' ? 'bg-green-50' : ''}`}
                                    onClick={() => task.SubTasks?.length > 0 && toggleExpand(task.Id)}
                                    onDoubleClick={() => setSelectedTask(task)}
                                >

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {task.SubTasks?.length > 0 && (
                                                <span className="mr-2 text-blue-500">
                                                        {expandedTasks[task.Id] ?
                                                            <ChevronDown className="w-5 h-5" /> :
                                                            <ChevronRight className="w-5 h-5" />}
                                                    </span>
                                            )}
                                            <div className="text-sm font-medium text-gray-900">
                                                {task.Title}
                                            </div>
                                            {task.SubTasks?.length > 0 && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                                                        {task.SubTasks.length} subtasks
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full ${getStatusColor(task.Status)}`}>
                                                {getStatusIcon(task.Status)}
                                                {task.Status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {task.Priority && (
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPriorityColor(task.Priority)}`}>
                                                    {task.Priority}
                                                </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {task.TaskStart || task.TaskEnd ? (
                                            <div className="flex flex-col gap-1">
                                                {task.TaskStart && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-blue-400" />
                                                        <span className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">Start:</span> {new Date(task.TaskStart).toLocaleDateString()}
                    </span>
                                                    </div>
                                                )}
                                                {task.TaskEnd && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-red-400" />
                                                        <span className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">End:</span> {new Date(task.TaskEnd).toLocaleDateString()}
                    </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="italic text-gray-400">No schedule</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {task.Assignees && task.Assignees.length > 0 ? (
                                            <div className="flex -space-x-2">
                                                {task.Assignees.map((assignee: AssigneeDto) => (
                                                    <div
                                                        key={assignee.Id}
                                                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold border border-white shadow"
                                                        title={assignee.EmpName}
                                                    >
                                                        {assignee.EmpName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Unassigned</span>
                                        )}
                                    </td>
                                </tr>
                                {expandedTasks[task.Id] && task.SubTasks && task.SubTasks.map((subTask) => (
                                    <tr key={`${task.Id}-${subTask.Id}`} className={`bg-blue-50 hover:bg-blue-100 transition-colors ${subTask.Status.toLowerCase() === 'completed' ? 'bg-green-50 hover:bg-green-100' : ''}`}>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                            #{subTask.Id}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4 flex items-center text-sm font-medium text-gray-900">
                                                    <div className="h-px w-6 bg-gray-300 mr-2"></div>
                                                    {subTask.Title}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full ${getStatusColor(subTask.Status)}`}>
                                                    {getStatusIcon(subTask.Status)}
                                                    {subTask.Status}
                                                </span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {subTask.Priority && (
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPriorityColor(subTask.Priority)}`}>
                                                        {subTask.Priority}
                                                    </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {subTask.Category ? (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                        {subTask.Category}
                                                    </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {subTask.TaskStart || subTask.TaskEnd ? (
                                                <div className="flex flex-col gap-1">
                                                    {subTask.TaskStart && (
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                            <span className="text-xs">Start: {new Date(subTask.TaskStart).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {subTask.TaskEnd && (
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                            <span className="text-xs">End: {new Date(subTask.TaskEnd).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {subTask.Assignees && subTask.Assignees.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {subTask.Assignees.map((assignee: AssigneeDto) => (
                                                        <div key={assignee.Id} className="flex items-center text-sm text-gray-700">
                                                            <User className="w-4 h-4 mr-1 text-gray-400" />
                                                            <span className="truncate max-w-xs">{assignee.EmpName}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Unassigned</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            <TaskComponent selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
        </div>
    );
};

export default ProjectTable;