'use client'

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, FileCheck, Search, X } from "lucide-react";
import Link from "next/link";
import { useQueryReviewByMeQuery } from "@/stores/redux/api/taskApi";
import { QueryTaskByMe } from "@/features/task/dto/QueryTaskByMe";
import { createAvatar, formatDate, getTaskStatusBadge } from "@/features/home/utils/TaskReviewUtils";

const HomePageReviews = () => {
    const [filteredTasks, setFilteredTasks] = useState<QueryTaskByMe[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const { data: reviewTasks, isLoading } = useQueryReviewByMeQuery();
    const currentDate = new Date();

    // Get unique projects for the project filter dropdown
    const uniqueProjectsMap = new Map<string, { id: string, name: string }>();
    reviewTasks?.forEach(task => {
        if (task.projectid && task.projectname) {
            uniqueProjectsMap.set(task.projectid, { id: task.projectid, name: task.projectname });
        }
    });
    const uniqueProjects = Array.from(uniqueProjectsMap.values());

    useEffect(() => {
        if (reviewTasks) {
            const filtered = reviewTasks.filter(task => {
                const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
                const matchesProject = projectFilter === 'all' || task.projectid === projectFilter;
                const matchesSearch = searchText === '' || (
                    task.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    task.description?.toLowerCase().includes(searchText.toLowerCase()) ||
                    task.projectname?.toLowerCase().includes(searchText.toLowerCase())
                );

                return matchesStatus && matchesProject && matchesSearch;
            });

            setFilteredTasks(filtered);
        }
    }, [reviewTasks, statusFilter, projectFilter, searchText]);

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin">
                    <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                </div>
                <p className="text-gray-500">Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 flex items-center">
                    <ClipboardCheck className="w-5 h-5 text-purple-600 mr-2" />
                    Review & Approve
                </h2>
            </div>
            <div className="p-3 bg-gray-50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="relative">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search tasks..."
                        className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-full focus:outline-none focus:ring-1 focus:ring-purple-400"
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

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                    <option value="all">All Statuses</option>
                    <option value="Not start">Not Started</option>
                    <option value="On Progress">On Progress</option>
                    <option value="Review">Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                    <option value="all">All Projects</option>
                    {uniqueProjects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>
            {filteredTasks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assignee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.map(task => (
                            <tr key={task.taskid} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                    <div className="text-sm text-gray-500">{task.projectname}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {createAvatar(task.empname, task.empemail)}
                                        <span className="ml-2 text-sm text-gray-700">{task.empname || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{getTaskStatusBadge(task)}</td>
                                <td className="px-6 py-4">
                                        <span className={`text-sm ${
                                            task.taskend && new Date(task.taskend) < currentDate && task.status !== 'Completed'
                                                ? 'text-rose-600 font-medium'
                                                : 'text-gray-700'
                                        }`}>
                                            {formatDate(task.taskend)}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/t/${task.taskid}?q=review`}
                                        className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700"
                                    >
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-6 text-center">
                    <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks requiring your review</p>
                </div>
            )}
        </div>
    );
};

export default HomePageReviews;