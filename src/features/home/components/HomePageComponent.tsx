'use client'

import React, { useState, useEffect } from 'react';
import { useQueryTaskByMeQuery } from "@/stores/redux/api/taskApi";
import { QueryTaskByMe } from "@/features/task/dto/QueryTaskByMe";
import HomePageTakeAction from "@/features/home/components/HomePageTakeAction";
import HomePageHeader from "@/features/home/components/HomePageHeader";
import HomePagePerformance from "@/features/home/components/HomePagePerformance";
import HomePageTopProjects from "@/features/home/components/HomePageTopProjects";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import HomePageReviews from "@/features/home/components/HomePageReviews";

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

    const [performance, setPerformance] = useState<PerformanceMetrics>({
        totalTasks: 0,
        completedTasks: 0,
        delayedTasks: 0,
        averageTime: 0,
        rejectionRate: 5.2,
        teamAverageTime: 16.8,
        teamRejectionRate: 7.5
    });

    const [activeTab, setActiveTab] = useState('take-action');
    const currentDate = new Date();

    useEffect(() => {
        if (tasks) {
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);

            const actionableTasksList = tasks.filter(task => task.status !== 'Completed');


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
                        <TabsContent value={'review'}>
                            <HomePageReviews />
                        </TabsContent>
                    </Tabs>

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