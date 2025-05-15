'use client'

import React from 'react';
import { AlertOctagon, Clock3, LineChart, AlertCircle, Loader2 } from "lucide-react";
import { PerformanceMetrics } from "@/features/home/components/HomePageComponent";
import { QueryTaskByMe } from "@/features/task/dto/QueryTaskByMe";

const HomePagePerformance = ({performance, allTasks} : {performance: PerformanceMetrics, allTasks: QueryTaskByMe[]}) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <LineChart className="w-4 h-4" />
                    </div>
                    Performance Overview
                </h2>
            </div>

            <div className="p-6 flex items-center justify-center min-h-[280px] bg-gray-50/50">
                <div className="text-center max-w-sm p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Data Not Available</h3>
                    <p className="text-gray-600 text-sm">
                        Performance metrics are currently not available. This data will appear once there is sufficient task activity to analyze.
                    </p>
                    <div className="mt-6">
                        {/*<button*/}
                        {/*    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"*/}
                        {/*    onClick={() => window.location.reload()}*/}
                        {/*>*/}
                        {/*    <div className="flex items-center justify-center gap-2">*/}
                        {/*        <Loader2 className="w-4 h-4 animate-spin" />*/}
                        {/*        Refresh Data*/}
                        {/*    </div>*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>

            {/* The commented out code is preserved but not displayed */}
            {/* Task Completion Stats */}
            {/*<div className="mb-6">*/}
            {/*    <h3 className="text-sm font-medium text-gray-700 mb-2">Task Completion</h3>*/}
            {/*    <div className="flex justify-between items-center mb-1.5">*/}
            {/*        <span className="text-xs text-gray-500">Completed</span>*/}
            {/*        <span className="text-xs font-medium text-gray-700">*/}
            {/*                        {performance.completedTasks} of {performance.totalTasks}*/}
            {/*                    </span>*/}
            {/*    </div>*/}
            {/*    <div className="h-2 bg-gray-100 rounded-full mb-3">*/}
            {/*        <div*/}
            {/*            className="h-full rounded-full bg-emerald-500"*/}
            {/*            style={{*/}
            {/*                width: `${performance.totalTasks > 0 ?*/}
            {/*                    (performance.completedTasks / performance.totalTasks) * 100 : 0}%`*/}
            {/*            }}*/}
            {/*        ></div>*/}
            {/*    </div>*/}

            {/*    <div className="grid grid-cols-2 gap-4 mb-4">*/}
            {/*        <div className="bg-gray-50 p-3 rounded-lg">*/}
            {/*            <div className="text-xs text-gray-500 mb-1">Average Time per Task</div>*/}
            {/*            <div className="flex items-center">*/}
            {/*                <Clock3 className="w-4 h-4 text-blue-600 mr-1.5" />*/}
            {/*                <span className="text-lg font-semibold">*/}
            {/*                                {performance.averageTime}hr*/}
            {/*                            </span>*/}
            {/*                {performance.averageTime < performance.teamAverageTime ? (*/}
            {/*                    <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">*/}
            {/*                                    {Math.round((1 - performance.averageTime / performance.teamAverageTime) * 100)}% faster*/}
            {/*                                </span>*/}
            {/*                ) : (*/}
            {/*                    <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">*/}
            {/*                                    {Math.round((performance.averageTime / performance.teamAverageTime - 1) * 100)}% slower*/}
            {/*                                </span>*/}
            {/*                )}*/}
            {/*            </div>*/}
            {/*            <div className="mt-1 text-xs text-gray-500">Team avg: {performance.teamAverageTime}hr</div>*/}
            {/*        </div>*/}

            {/*        <div className="bg-gray-50 p-3 rounded-lg">*/}
            {/*            <div className="text-xs text-gray-500 mb-1">Rejection Rate</div>*/}
            {/*            <div className="flex items-center">*/}
            {/*                <AlertOctagon className="w-4 h-4 text-rose-600 mr-1.5" />*/}
            {/*                <span className="text-lg font-semibold">*/}
            {/*                                {performance.rejectionRate}%*/}
            {/*                            </span>*/}
            {/*                {performance.rejectionRate < performance.teamRejectionRate ? (*/}
            {/*                    <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">*/}
            {/*                                    {Math.round((1 - performance.rejectionRate / performance.teamRejectionRate) * 100)}% better*/}
            {/*                                </span>*/}
            {/*                ) : (*/}
            {/*                    <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">*/}
            {/*                                    {Math.round((performance.rejectionRate / performance.teamRejectionRate - 1) * 100)}% higher*/}
            {/*                                </span>*/}
            {/*                )}*/}
            {/*            </div>*/}
            {/*            <div className="mt-1 text-xs text-gray-500">Team avg: {performance.teamRejectionRate}%</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*/!* Task Status Summary *!/*/}
            {/*<div>*/}
            {/*    <h3 className="text-sm font-medium text-gray-700 mb-3">Task Status</h3>*/}
            {/*    <div className="space-y-2">*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>*/}
            {/*                <span className="text-sm text-gray-600">Completed</span>*/}
            {/*            </div>*/}
            {/*            <span className="text-sm font-medium text-gray-700">*/}
            {/*                            {performance.completedTasks}*/}
            {/*                        </span>*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>*/}
            {/*                <span className="text-sm text-gray-600">Delayed</span>*/}
            {/*            </div>*/}
            {/*            <span className="text-sm font-medium text-gray-700">*/}
            {/*                            {performance.delayedTasks}*/}
            {/*                        </span>*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>*/}
            {/*                <span className="text-sm text-gray-600">In Progress</span>*/}
            {/*            </div>*/}
            {/*            <span className="text-sm font-medium text-gray-700">*/}
            {/*                            {allTasks.filter(t => t.status === 'On progress').length}*/}
            {/*                        </span>*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>*/}
            {/*                <span className="text-sm text-gray-600">Not Started</span>*/}
            {/*            </div>*/}
            {/*            <span className="text-sm font-medium text-gray-700">*/}
            {/*                            {allTasks.filter(t => t.status === 'Not start').length}*/}
            {/*                        </span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default HomePagePerformance;