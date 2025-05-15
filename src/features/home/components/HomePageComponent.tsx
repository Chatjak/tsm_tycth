'use client'

import React, { useState, useEffect } from 'react';
import {
    Star,
    ChevronRight,
    Search,
    X,
    ClipboardCheck,
    FileCheck,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useQueryTaskByMeQuery } from "@/stores/redux/api/taskApi";
import { QueryTaskByMe } from "@/features/task/dto/QueryTaskByMe";
import HomePageTakeAction from "@/features/home/components/HomePageTakeAction";
import HomePageHeader from "@/features/home/components/HomePageHeader";
import HomePagePerformance from "@/features/home/components/HomePagePerformance";
import HomePageTopProjects from "@/features/home/components/HomePageTopProjects";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

// For performance graph
export type PerformanceMetrics = {
    totalTasks: number;
    completedTasks: number;
    delayedTasks: number;
    averageTime: number; // in hours
    rejectionRate: number; // percentage
    teamAverageTime: number; // in hours (mock data)
    teamRejectionRate: number; // percentage (mock data)
}

const HomePageComponent = () => {
    const { data: tasks, isLoading } = useQueryTaskByMeQuery();
    const [allTasks, setAllTasks] = useState<QueryTaskByMe[]>([]);
    const [actionTasks, setActionTasks] = useState<QueryTaskByMe[]>([]);
    const [reviewTasks, setReviewTasks] = useState<QueryTaskByMe[]>([]);
    const [performance, setPerformance] = useState<PerformanceMetrics>({
        totalTasks: 0,
        completedTasks: 0,
        delayedTasks: 0,
        averageTime: 0,
        rejectionRate: 5.2,
        teamAverageTime: 16.8,
        teamRejectionRate: 7.5
    });

    const [reviewSearchText, setReviewSearchText] = useState<string>('');
    const [reviewStatusFilter, setReviewStatusFilter] = useState<string>('all');
    const [reviewTeamFilter, setReviewTeamFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState('take-action');
    const currentDate = new Date();

    useEffect(() => {
        if (tasks) {
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);

            const actionableTasksList = tasks.filter(task => task.status !== 'Completed');

            const reviewTasksList = tasks.filter(task => task.status === 'On progress');

            let completed = 0;
            let delayed = 0;
            let totalCompletionTime = 0;
            let tasksWithCompletionTime = 0;

            tasks.forEach(task => {

                if (task.status === 'Completed') {
                    completed++;

                    if (task.taskstart && task.taskfinish) {
                        const startDate = new Date(task.taskstart);
                        const finishDate = new Date(task.taskfinish);
                        const completionTimeHours = (finishDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                        totalCompletionTime += completionTimeHours;
                        tasksWithCompletionTime++;
                    }

                    if (task.taskend && task.taskfinish) {
                        const dueDate = new Date(task.taskend);
                        const finishDate = new Date(task.taskfinish);
                        if (finishDate > dueDate) {
                            delayed++;
                        }
                    }
                }
            });

            actionableTasksList.sort((a, b) => {
                if (!a.taskend) return 1;
                if (!b.taskend) return -1;
                return new Date(a.taskend).getTime() - new Date(b.taskend).getTime();
            });

            setAllTasks(tasks);
            setActionTasks(actionableTasksList);
            setReviewTasks(reviewTasksList);

            const averageTime = tasksWithCompletionTime > 0 ?
                totalCompletionTime / tasksWithCompletionTime : 0;

            setPerformance({
                totalTasks: tasks.length,
                completedTasks: completed,
                delayedTasks: delayed,
                averageTime: Math.round(averageTime * 10) / 10, // Round to 1 decimal
                rejectionRate: 5.2, // Mock data
                teamAverageTime: 16.8, // Mock data
                teamRejectionRate: 7.5 // Mock data
            });
        }
    }, [tasks]);


    const filteredReviewTasks = reviewTasks.filter(task => {
        if (reviewStatusFilter !== 'all' && task.status !== reviewStatusFilter) {
            return false;
        }

        if (reviewTeamFilter !== 'all') {
            return true;
        }

        if (reviewSearchText) {
            const searchLower = reviewSearchText.toLowerCase();
            return task.title.toLowerCase().includes(searchLower) ||
                task.description?.toLowerCase().includes(searchLower) ||
                task.projectname?.toLowerCase().includes(searchLower);
        }

        return true;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };


    const getTaskStatusBadge = (task: QueryTaskByMe) => {
        const isOverdue = task.taskend && new Date(task.taskend) < currentDate &&
            task.status !== 'Completed';

        if (isOverdue) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">Overdue</span>;
        }

        switch (task.status) {
            case 'Completed':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Completed</span>;
            case 'On progress':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">On progress</span>;
            case 'Not start':
            default:
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Not start</span>;
        }
    };

    const createAvatar = (name?: string, email?: string) => {
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

    if (isLoading) {
        return (
            <div className="p-4 md:p-6">
                <div className="animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <HomePageHeader/>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Tabs
                        defaultValue="take-action"
                        className="w-full"
                        value={activeTab}
                        onValueChange={setActiveTab}
                    >
                        <TabsList className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-1 w-full max-w-xs mx-auto flex justify-center">
                            <TabsTrigger
                                value="take-action"
                                className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out"
                            >
                                Take Action
                            </TabsTrigger>
                            <TabsTrigger
                                value="review"
                                className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out"
                            >
                                Review & Approve
                            </TabsTrigger>



                        </TabsList>
                        <TabsContent value={'take-action'}>
                            <HomePageTakeAction actionTasks={actionTasks}/>
                        </TabsContent>
                    </Tabs>


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
                </div>

                {/* Right column - Performance Graph */}
                <div className="space-y-6">
                    {/* Performance Overview */}
                    <HomePagePerformance performance={performance} allTasks={allTasks} />

                    {/* Top Projects */}
                    <HomePageTopProjects allTasks={allTasks}/>

                    {/* Team Members */}
                    {/*<div className="bg-white rounded-lg shadow-sm border border-gray-100">*/}
                    {/*    <div className="p-4 border-b border-gray-100">*/}
                    {/*        <h2 className="font-bold text-gray-800 flex items-center">*/}
                    {/*            <Users className="w-5 h-5 text-purple-600 mr-2" />*/}
                    {/*            Team Members*/}
                    {/*        </h2>*/}
                    {/*    </div>*/}
                    {/*    <div className="p-4">*/}
                    {/*        /!* Mock team members for demonstration *!/*/}
                    {/*        <div className="space-y-3">*/}
                    {/*            {[*/}
                    {/*                { name: "Chatjak", role: "Project Manager", taskCount: 12 },*/}
                    {/*                { name: "Somsak", role: "Developer", taskCount: 8 },*/}
                    {/*                { name: "Pranee", role: "Designer", taskCount: 5 }*/}
                    {/*            ].map((member, idx) => (*/}
                    {/*                <div key={idx} className="flex items-center justify-between">*/}
                    {/*                    <div className="flex items-center">*/}
                    {/*                        {createAvatar(member.name)}*/}
                    {/*                        <div className="ml-3">*/}
                    {/*                            <div className="text-sm font-medium text-gray-800">*/}
                    {/*                                {member.name}*/}
                    {/*                            </div>*/}
                    {/*                            <div className="text-xs text-gray-500">*/}
                    {/*                                {member.role}*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                    <div className="text-sm font-medium text-gray-600">*/}
                    {/*                        {member.taskCount} tasks*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*        <div className="mt-4 text-center">*/}
                    {/*            <Link*/}
                    {/*                href="/team"*/}
                    {/*                className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"*/}
                    {/*            >*/}
                    {/*                View all team members*/}
                    {/*                <ChevronRight className="w-4 h-4 ml-1" />*/}
                    {/*            </Link>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};

export default HomePageComponent;