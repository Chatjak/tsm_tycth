'use client'

import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Clock, ChevronRight, User, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProjectWithTasksDto, TaskDto, AssigneeDto } from "@/features/project/types/projects.types";
import { Badge, Empty, Spin, Tooltip, Avatar } from "antd";
import HomeAddNewProject from "@/components/Protect/Home/HomeAddNewProject";
import dayjs from "dayjs";
import Link from "next/link";

const getProjects = async (ownerId: number): Promise<ProjectWithTasksDto[]> => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/api/projects/assignee/${ownerId}`
    );
    return response.data;
};

const ProjectsComponent = () => {
    const [selectedProject, setSelectedProject] = useState<ProjectWithTasksDto | null>(null);
    const [showDetails, setShowDetails] = useState(false); // For mobile toggle view

    const {
        data: projects,
        error,
        isLoading,
        isError,
    } = useQuery<ProjectWithTasksDto[]>({
        queryKey: ['projects', 1],
        queryFn: () => getProjects(1),
    });

    const handleProjectClick = (project: ProjectWithTasksDto) => {
        setSelectedProject(project);
        setShowDetails(true);
    };

    const handleBackToList = () => {
        setShowDetails(false);
    };


    const getStatusIcon = (status: string | undefined) => {
        if (!status) return <Circle size={16} className="text-gray-400" />;

        switch(status.toLowerCase()) {
            case 'completed':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'in progress':
                return <Clock size={16} className="text-blue-500" />;
            case 'pending':
                return <Circle size={16} className="text-orange-500" />;
            case 'delayed':
                return <AlertCircle size={16} className="text-red-500" />;
            default:
                return <Circle size={16} className="text-gray-400" />;
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'numeric', year: 'numeric' });
        } catch  {
            return dateString;
        }
    };

    const getAvatarColor = (name: string | undefined) => {
        if (!name) return '#1890ff';
        const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#f56a00', '#7265e6'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const getInitials = (name: string | undefined) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase();
    };

    return (
        <div className="flex flex-col md:flex-row h-full min-h-[calc(100svh-64px)]">
            <div className={`w-full md:w-1/2 lg:w-2/5 border-r border-gray-200 overflow-auto p-4 
                ${showDetails ? 'hidden md:block' : 'block'}`}>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">List of related projects</h3>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Project..."
                                className="border rounded-md pl-9 pr-4 py-2 w-36 sm:w-48 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button className="border rounded-md p-2 text-gray-600 hover:bg-gray-50">
                            <Filter size={16} />
                        </button>
                        <HomeAddNewProject/>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p className="font-medium">เกิดข้อผิดพลาด</p>
                        <p className="text-sm">{(error as Error).message}</p>
                    </div>
                )}

                {projects && projects.length === 0 && (
                    <Empty description="ไม่พบข้อมูลโปรเจกต์" className="my-8" />
                )}

                {projects && projects.length > 0 && (
                    <div className="space-y-2">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={`border rounded-lg p-3 sm:p-4 hover:shadow-md cursor-pointer transition-all ${selectedProject?.id === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                onClick={() => handleProjectClick(project)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description || 'ไม่มีคำอธิบาย'}</p>
                                    </div>
                                    <Badge count={project.tasks.length} className="ml-2" />
                                </div>
                                <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-3 text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        <span className="truncate">Created: {dayjs(project.createdAt).format('DD/MM/YY')}</span>
                                    </div>
                                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                        <User size={14} className="mr-1 text-gray-400" />
                                        <span className="truncate">Owner: {project.empName || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Project Details Panel - Full width on mobile when shown */}
            <div className={`w-full md:w-1/2 lg:w-3/5 overflow-auto bg-gray-50 
                ${!showDetails ? 'hidden md:block' : 'block'}`}>
                {/* Back button only visible on mobile */}
                {selectedProject && showDetails && (
                    <button
                        className="md:hidden flex items-center p-4 text-blue-600"
                        onClick={handleBackToList}
                    >
                        <ChevronRight className="rotate-180 mr-1" size={16} />
                        <span>Back to projects</span>
                    </button>
                )}

                {selectedProject ? (
                    <div className="p-3 sm:p-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 shadow-sm">
                            <div className={`flex items-center justify-between`}>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{selectedProject.name}</h3>
                                <Link  href={`/home/projects/${selectedProject.id}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                className={`text-blue-600 hover:text-blue-700 rounded-md transition-all duration-200`}
                                >More details</Link>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">{selectedProject.description || 'ไม่มีคำอธิบาย'}</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <Calendar size={14} className="mr-1 text-gray-400" />
                                    <span>Start: {dayjs(selectedProject.projectStart).format('DD/MM/YY')}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <Calendar size={14} className="mr-1 text-gray-400" />
                                    <span>End: {dayjs(selectedProject.projectEnd).format('DD/MM/YY')}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <User size={14} className="mr-1 text-gray-400" />
                                    <span>Owner: {selectedProject.empName || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-700">งานในโปรเจกต์</h4>
                                <span className="text-xs sm:text-sm text-gray-500">Total {selectedProject.tasks.length} งาน</span>
                            </div>

                            {selectedProject.tasks.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                    <p className="text-gray-500">ไม่มีงานในโปรเจกต์นี้</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedProject.tasks.map((task: TaskDto) => (
                                        <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-all">
                                            <div className="flex items-start">
                                                <div className="mr-2 sm:mr-3 mt-1">
                                                    {getStatusIcon(task.status)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start flex-wrap gap-1">
                                                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                                                        <span className={`px-2 py-0.5 text-xs rounded-full bg-${task.priority?.toLowerCase() === 'high' ? 'red' : task.priority?.toLowerCase() === 'medium' ? 'yellow' : 'green'}-100 text-${task.priority?.toLowerCase() === 'high' ? 'red' : task.priority?.toLowerCase() === 'medium' ? 'yellow' : 'green'}-800`}>
                                                            {task.priority || 'Normal'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-2">{task.description || 'ไม่มีคำอธิบาย'}</p>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Calendar size={14} className="mr-1" />
                                                        <span>Due: {formatDate(task.taskEnd)}</span>
                                                    </div>

                                                    {/* Assignees for this task */}
                                                    {task.assignees && task.assignees.length > 0 && (
                                                        <div className="mt-3 flex items-center">
                                                            <span className="text-xs text-gray-500 mr-2">Assignee:</span>
                                                            <div className="flex -space-x-2">
                                                                {task.assignees.map((assignee: AssigneeDto) => (
                                                                    <Tooltip key={assignee.id} title={assignee.empName || 'ไม่ระบุชื่อ'}>
                                                                        <Avatar
                                                                            size="small"
                                                                            style={{ backgroundColor: getAvatarColor(assignee.empName) }}
                                                                        >
                                                                            {getInitials(assignee.empName)}
                                                                        </Avatar>
                                                                    </Tooltip>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                        <ChevronRight size={40} className="mb-4 text-gray-300" />
                        <p>กรุณาเลือกโปรเจกต์เพื่อดูรายละเอียด</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsComponent;