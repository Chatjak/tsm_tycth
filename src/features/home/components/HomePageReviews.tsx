'use client'

import React, {useState} from 'react';
import {ClipboardCheck, FileCheck, Search, X} from "lucide-react";
import Link from "next/link";

const HomePageReviews = () => {
    const [reviewSearchText, setReviewSearchText] = useState<string>('');
    const [reviewStatusFilter, setReviewStatusFilter] = useState<string>('all');
    const [reviewTeamFilter, setReviewTeamFilter] = useState<string>('all');

    const filteredReviewTasks = reviewTasks.filter(task
    return (
        <div className="bg-white/40 backdrop-blur-xs rounded-lg shadow-sm border border-gray-100">
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
                        value={reviewSearchText}
                        onChange={(e) => setReviewSearchText(e.target.value)}
                        placeholder="Search tasks..."
                        className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-full focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    {reviewSearchText && (
                        <button
                            onClick={() => setReviewSearchText('')}
                            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <select
                    value={reviewStatusFilter}
                    onChange={(e) => setReviewStatusFilter(e.target.value)}
                    className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                    <option value="all">All Statuses</option>
                    <option value="Not start">Not Started</option>
                    <option value="On progress">On Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <select
                    value={reviewTeamFilter}
                    onChange={(e) => setReviewTeamFilter(e.target.value)}
                    className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                    <option value="all">All Teams</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                </select>
            </div>
            {filteredReviewTasks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assignee
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReviewTasks.map(task => (
                            <tr key={task.taskid} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                    <div className="text-sm text-gray-500">{task.projectname}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {createAvatar(task.empname, task.empemail)}
                                        <span className="ml-2 text-sm text-gray-700">
                                                            {task.empname || 'Unassigned'}
                                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getTaskStatusBadge(task)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {task.taskend ? (
                                        <span className={`text-sm ${
                                            new Date(task.taskend) < currentDate && task.status !== 'Completed'
                                                ? 'text-rose-600 font-medium'
                                                : 'text-gray-700'
                                        }`}>
                                                            {formatDate(task.taskend)}
                                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-500">Not set</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/review/${task.title}`}
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