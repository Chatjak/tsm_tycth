'use client';

import { Calendar, PieChart, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { PieChart as ReChartPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import {ExtendedTask} from "@/features/project/components/gantt/TaskGantt";
import {ViewMode} from "gantt-task-react";

const ProjectTimelineHeader = ({
                                   viewModes,
                                   viewMode,
                                   setViewMode,
                                   toggleFullScreen,
                                   isFullScreen,
                                   tasks,
                                   projectStats,
                               }: {
    viewModes: { label: string; value: string }[];
    viewMode: string;
    setViewMode: (value: any) => void;
    toggleFullScreen: () => void;
    isFullScreen: boolean;
    tasks: ExtendedTask[];
    projectStats: { total: number; completed: number; inProgress: number; pending: number } | {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
        completionPercentage : number;
    };
}) => {
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    // Prepare chart data
    const chartData = [
        { name: 'Completed', value: projectStats.completed, color: '#16a34a' }, // green-600
        { name: 'In Progress', value: projectStats.inProgress, color: '#2563eb' }, // blue-600
        { name: 'Pending', value: projectStats.pending, color: '#ca8a04' }, // yellow-600
    ];

    return (
        <div className="bg-slate-50 border-b px-6 py-5 rounded-t-xl shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight">Project Timeline</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View Modes */}
                    <div className="inline-flex rounded-md border bg-background shadow-sm">
                        {viewModes.map((mode, index) => (
                            <Button
                                key={mode.value}
                                variant={viewMode === mode.value ? 'default' : 'ghost'}
                                className={cn(
                                    'rounded-none',
                                    index === 0 && 'rounded-l-md',
                                    index === viewModes.length - 1 && 'rounded-r-md'
                                )}
                                onClick={() => setViewMode(mode.value)}
                            >
                                {mode.label}
                            </Button>
                        ))}
                    </div>

                    {/* Fullscreen toggle */}
                    <Button variant="outline" onClick={toggleFullScreen}>
                        {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </Button>
                </div>
            </div>

            {tasks.length > 0 && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Task Overview</h3>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant={chartType === 'pie' ? 'default' : 'outline'}
                                onClick={() => setChartType('pie')}
                                className="h-8 px-3"
                            >
                                <PieChart className="w-4 h-4 mr-1" />
                                <span>Pie</span>
                            </Button>
                            <Button
                                size="sm"
                                variant={chartType === 'bar' ? 'default' : 'outline'}
                                onClick={() => setChartType('bar')}
                                className="h-8 px-3"
                            >
                                <BarChart2 className="w-4 h-4 mr-1" />
                                <span>Bar</span>
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        {chartType === 'pie' ? (
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="w-full md:w-2/3 h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ReChartPie>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [`${value} Tasks`, 'Count']}
                                                labelFormatter={() => ''}
                                            />
                                            <Legend />
                                        </ReChartPie>
                                    </ResponsiveContainer>
                                </div>

                                <div className="w-full md:w-1/3 grid grid-cols-1 gap-3 px-4">
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className="text-sm text-gray-500">Total Tasks</div>
                                        <div className="text-2xl font-bold text-gray-800">{projectStats.total}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="text-center p-2 rounded-lg bg-green-50">
                                            <div className="text-xs text-gray-500">Completed</div>
                                            <div className="text-xl font-bold text-green-600">{projectStats.completed}</div>
                                        </div>

                                        <div className="text-center p-2 rounded-lg bg-blue-50">
                                            <div className="text-xs text-gray-500">In Progress</div>
                                            <div className="text-xl font-bold text-blue-600">{projectStats.inProgress}</div>
                                        </div>

                                        <div className="text-center p-2 rounded-lg bg-yellow-50">
                                            <div className="text-xs text-gray-500">Not start</div>
                                            <div className="text-xl font-bold text-yellow-600">{projectStats.pending}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 px-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className="text-sm text-gray-500">Total Tasks</div>
                                        <div className="text-2xl font-bold text-gray-800">{projectStats.total}</div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Completed</span>
                                        <span className="text-sm font-bold text-green-600">{projectStats.completed}</span>
                                    </div>
                                    <div className="h-4 mt-1 overflow-hidden bg-gray-100 rounded-full">
                                        <div
                                            className="h-4 bg-green-500 rounded-full text-xs flex items-center justify-center text-white"
                                            style={{ width: `${(projectStats.completed / projectStats.total) * 100}%` }}
                                        >
                                            {projectStats.completed > 0 &&
                                                `${Math.round((projectStats.completed / projectStats.total) * 100)}%`
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">In Progress</span>
                                        <span className="text-sm font-bold text-blue-600">{projectStats.inProgress}</span>
                                    </div>
                                    <div className="h-4 mt-1 overflow-hidden bg-gray-100 rounded-full">
                                        <div
                                            className="h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white"
                                            style={{ width: `${(projectStats.inProgress / projectStats.total) * 100}%` }}
                                        >
                                            {projectStats.inProgress > 0 &&
                                                `${Math.round((projectStats.inProgress / projectStats.total) * 100)}%`
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Not start</span>
                                        <span className="text-sm font-bold text-yellow-600">{projectStats.pending}</span>
                                    </div>
                                    <div className="h-4 mt-1 overflow-hidden bg-gray-100 rounded-full">
                                        <div
                                            className="h-4 bg-yellow-500 rounded-full text-xs flex items-center justify-center text-white"
                                            style={{ width: `${(projectStats.pending / projectStats.total) * 100}%` }}
                                        >
                                            {projectStats.pending > 0 &&
                                                `${Math.round((projectStats.pending / projectStats.total) * 100)}%`
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {tasks.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-y border-gray-200 mt-6 rounded-b-xl">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 bg-green-400 rounded-sm mr-2"></span>
                            <span>Completed</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 bg-blue-400 rounded-sm mr-2"></span>
                            <span>In Progress</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm mr-2"></span>
                            <span>Pending</span>
                        </div>

                        {/* Priority indicators */}
                        <div className="border-l border-gray-300 pl-4 ml-2">
                            <span className="text-xs font-medium text-gray-500 mr-2">Priority:</span>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-red-500 rounded-sm mr-1"></span>
                                    <span>High</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-orange-500 rounded-sm mr-1"></span>
                                    <span>Medium</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm mr-1"></span>
                                    <span>Low</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 text-right">
                            <span className="font-medium">Project Completion:</span>
                            <span className="ml-2 font-bold">{Math.round((projectStats.completed / projectStats.total) * 100)}%</span>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{ width: `${Math.round((projectStats.completed / projectStats.total) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTimelineHeader;