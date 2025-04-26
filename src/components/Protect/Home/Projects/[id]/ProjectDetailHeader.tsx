'use client'

import React from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle } from "lucide-react";
import { Empty, Progress, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { ProjectWithTasksDto } from "@/features/project/types/projects.types";
import axios from "axios";
import dayjs from "dayjs";

const getProjects = async (id: string): Promise<ProjectWithTasksDto> => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/api/projects/${id}`
    );
    return response.data;
};

const ProjectDetailHeader = ({id} : {id:string}) => {
    const {
        data: project,
        isLoading,
        error,
        isError
    } = useQuery<ProjectWithTasksDto>({
        queryKey: ['project', id],
        queryFn: () => getProjects(id),
    });

    const calculateProgress = () => {
        if (!project || !project.tasks || project.tasks.length === 0) return 0;

        const completedTasks = project.tasks.filter(task =>
            task.status?.toLowerCase() === 'complete'
        ).length;

        return Math.round((completedTasks / project.tasks.length) * 100);
    };

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
                text: `${diffDays} days remaining`
            };
        } else if (diffDays === 0) {
            return { days: 0, isOverdue: false, text: 'Due today' };
        } else {
            return {
                days: Math.abs(diffDays),
                isOverdue: true,
                text: `${Math.abs(diffDays)} days overdue`
            };
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('MMM D, YYYY');
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

    const daysRemaining = getDaysRemaining();
    const progress = calculateProgress();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{project.name}</h1>
                    <p className="text-gray-600 mb-6">{project.description || 'No description provided'}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon size={16} className="mr-2 text-gray-400" />
                                <span>Start Date</span>
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                                {formatDate(project.projectStart)}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon size={16} className="mr-2 text-gray-400" />
                                <span>End Date</span>
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                                {formatDate(project.projectEnd)}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                <span>Timeline</span>
                            </div>
                            <div className={`text-sm font-medium ${daysRemaining.isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                                {daysRemaining.text}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                                <User size={16} className="mr-2 text-gray-400" />
                                <span>Owner</span>
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                                {project.empName || 'Not assigned'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-64 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">Progress</span>
                        <div className="flex items-center text-sm">
                            <CheckCircle size={14} className="text-green-500 mr-1" />
                            <span className="text-gray-500">{project.tasks?.filter(t => t.status?.toLowerCase() === 'complete').length || 0}/{project.tasks?.length || 0}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-800 w-16 text-center">{progress}%</div>
                        <div className="flex-1">
                            <Progress
                                percent={progress}
                                showInfo={false}
                                strokeColor={progress >= 100 ? '#10B981' : '#3B82F6'}
                                trailColor="#E5E7EB"
                                strokeWidth={10}
                                className="custom-progress"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailHeader;