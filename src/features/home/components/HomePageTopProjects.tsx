'use client'

import React from 'react';
import { ChevronRight, Star, FolderOpen } from "lucide-react";
import Link from "next/link";
import { QueryTaskByMe } from "@/features/task/dto/QueryTaskByMe";
import { motion } from "framer-motion";

const HomePageTopProjects = ({allTasks} : {allTasks:QueryTaskByMe[]}) => {
    // Extract projects data with proper typing
    const projectsData = Object.entries(
        allTasks.reduce<Record<string, { name: string, count: number, completed: number }>>((acc, task) => {
            if (task.projectid && task.projectname) {
                const projectId = task.projectid.toString();
                if (!acc[projectId]) {
                    acc[projectId] = {
                        name: task.projectname,
                        count: 0,
                        completed: 0
                    };
                }
                acc[projectId].count++;
                if (task.status === 'Completed') {
                    acc[projectId].completed++;
                }
            }
            return acc;
        }, {})
    )
        .sort((a, b) => b[1].count - a[1].count);

    // Generate random gradient colors for project avatars
    const getProjectColor = (index: number) => {
        const colors = [
            'from-purple-500 to-indigo-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
            'from-indigo-500 to-violet-600'
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="bg-white/40 backdrop-blur-xs rounded-xl shadow-md border border-slate-200/50 overflow-hidden">
            <div className="p-5 border-b border-slate-200/50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <Star className="w-4 h-4" />
                    </div>
                    Projects
                </h2>

                {projectsData.length > 0 && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {projectsData.length} {projectsData.length === 1 ? 'Project' : 'Projects'}
                    </span>
                )}
            </div>

            <div className="bg-white/50">
                {allTasks?.length > 0 && projectsData.length > 0 ? (
                    <div className="divide-y divide-slate-200/50 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {projectsData.map(([projectId, { name, count, completed }], index) => {
                            const percentComplete = count > 0 ? (completed / count) * 100 : 0;

                            return (
                                <motion.div
                                    key={projectId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="p-4 hover:bg-slate-50/80 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${getProjectColor(index)} text-white font-medium shadow-sm`}>
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800 line-clamp-1">{name}</div>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {count} {count === 1 ? 'task' : 'tasks'}
                                                    </span>
                                                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-xs font-medium" style={{
                                                        color: percentComplete === 100 ? '#047857' : // emerald-700
                                                            percentComplete > 70 ? '#0369a1' : // blue-700
                                                                percentComplete > 30 ? '#b45309' : // amber-700
                                                                    '#be123c' // rose-700
                                                    }}>
                                                        {Math.round(percentComplete)}% complete
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/project/${projectId}`}
                                            className="p-2 rounded-full hover:bg-purple-100 text-purple-600 hover:text-purple-800 transition-colors"
                                            aria-label={`View ${name} project details`}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    </div>

                                    <div className="mt-3 h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                percentComplete === 100 ? 'bg-emerald-500' :
                                                    percentComplete > 70 ? 'bg-blue-500' :
                                                        percentComplete > 30 ? 'bg-amber-500' :
                                                            'bg-rose-500'
                                            }`}
                                            style={{ width: `${percentComplete}%` }}
                                        ></div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                            <FolderOpen className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-gray-700 font-medium mb-1">No Projects</h3>
                        <p className="text-gray-500 text-sm">
                            No projects have been assigned to you yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePageTopProjects;