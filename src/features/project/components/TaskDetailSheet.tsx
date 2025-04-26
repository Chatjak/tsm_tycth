'use client'

import React, { useState } from 'react';
import { TaskDto } from '@/features/project/types/projects.types';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface TaskDetailSheetProps {
    task: TaskDto | null;
    onClose: () => void;
}

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({ task, onClose }) => {
    const [activeTab, setActiveTab] = useState<string>('subtasks');

    if (!task) return null;

    // Calculate subtask completion percentage
    const completedSubtasks = task.SubTasks?.filter(st => st.Status === "Completed")?.length || 0;
    const totalSubtasks = task.SubTasks?.length || 0;
    const completionPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        const colors: Record<string, { bg: string, text: string, border: string }> = {
            "Not start": { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
            "On Progress": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
            "In Review": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
            "Completed": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }
        };
        return colors[status] || colors["Not start"];
    };

    // Helper function for priority colors
    const getPriorityColor = (priority: string) => {
        const colors: Record<string, { bg: string, text: string, border: string }> = {
            "High": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
            "Medium": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
            "Low": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
            "Normal": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" }
        };
        return colors[priority] || colors["Normal"];
    };

    // Helper function to generate avatar colors
    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-gradient-to-br from-blue-500 to-blue-600",
            "bg-gradient-to-br from-emerald-500 to-emerald-600",
            "bg-gradient-to-br from-purple-500 to-purple-600",
            "bg-gradient-to-br from-amber-500 to-amber-600",
            "bg-gradient-to-br from-pink-500 to-pink-600",
            "bg-gradient-to-br from-indigo-500 to-indigo-600",
            "bg-gradient-to-br from-rose-500 to-rose-600",
            "bg-gradient-to-br from-cyan-500 to-cyan-600",
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    // Status icon component
    const StatusIcon = ({ status }: { status: string }) => {
        switch(status) {
            case "Not start":
                return (
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                    </svg>
                );
            case "On Progress":
                return (
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                );
            case "In Review":
                return (
                    <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                );
            case "Completed":
                return (
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={!!task} onOpenChange={onClose}>
            <DialogContent style={{minWidth: '80%'}}>
                <div className='border'   >
dfasfasfasdfasdfasdfasdfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                </div>
            {/*    <div className="overflow-y-auto flex-grows">*/}
            {/*    <DialogHeader className="pb-4 border-b mb-4">*/}
            {/*        sss*/}
            {/*        <div className="flex justify-between items-start">*/}
            {/*            <DialogTitle className="text-xl font-bold text-gray-900">*/}
            {/*                {task.Title}*/}
            {/*            </DialogTitle>*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <Badge variant="outline" className={`${getPriorityColor(task.Priority || "Normal").bg} ${getPriorityColor(task.Priority || "Normal").text} border ${getPriorityColor(task.Priority || "Normal").border}`}>*/}
            {/*                    {task.Priority || "Normal"}*/}
            {/*                </Badge>*/}
            {/*                <div className="text-gray-400 text-xs px-2 py-1 bg-gray-100 rounded font-mono">*/}
            {/*                    #{task.Id.toString().padStart(3, '0')}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <DialogDescription className="mt-2">*/}
            {/*            <div className="flex flex-col gap-4 mt-4">*/}
            {/*                <div className="grid grid-cols-2 gap-4">*/}
            {/*                    <div className="flex items-center space-x-2">*/}
            {/*                        <div className="w-24 text-xs text-gray-500 font-medium uppercase">Status</div>*/}
            {/*                        <Badge className={`${getStatusColor(task.Status).bg} ${getStatusColor(task.Status).text} border ${getStatusColor(task.Status).border} inline-flex items-center space-x-1 px-2.5 py-1`}>*/}
            {/*                            <StatusIcon status={task.Status} />*/}
            {/*                            <span>{task.Status}</span>*/}
            {/*                        </Badge>*/}
            {/*                    </div>*/}
            {/*                    <div className="flex items-center space-x-2">*/}
            {/*                        <div className="w-24 text-xs text-gray-500 font-medium uppercase">Due Date</div>*/}
            {/*                        <div className="flex items-center gap-1.5 text-sm">*/}
            {/*                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
            {/*                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />*/}
            {/*                                <line x1="16" y1="2" x2="16" y2="6" />*/}
            {/*                                <line x1="8" y1="2" x2="8" y2="6" />*/}
            {/*                                <line x1="3" y1="10" x2="21" y2="10" />*/}
            {/*                            </svg>*/}
            {/*                            <span className="font-medium">{task.TaskEnd ? dayjs(task.TaskEnd).format('D MMMM YYYY') : '-'}</span>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </DialogDescription>*/}
            {/*    </DialogHeader>*/}

            {/*    <div className="px-6  ">*/}
            {/*        /!* Assignees *!/*/}
            {/*        {task.Assignees && task.Assignees.length > 0 && (*/}
            {/*            <div className="mb-6">*/}
            {/*                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">*/}
            {/*                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
            {/*                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>*/}
            {/*                        <circle cx="9" cy="7" r="4"></circle>*/}
            {/*                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>*/}
            {/*                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>*/}
            {/*                    </svg>*/}
            {/*                    Assignees*/}
            {/*                </h4>*/}
            {/*                <div className="flex flex-wrap gap-2">*/}
            {/*                    {task.Assignees.map((a, idx) => (*/}
            {/*                        <div key={idx} className="flex items-center px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border shadow-sm">*/}
            {/*                            <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center ${getAvatarColor(a.EmpName || 'User')} mr-2 shadow-sm`}>*/}
            {/*                                {a.EmpName?.charAt(0).toUpperCase()}*/}
            {/*                            </div>*/}
            {/*                            <span>{a.EmpName}</span>*/}
            {/*                        </div>*/}
            {/*                    ))}*/}
            {/*                    <Button variant="outline" size="sm" className="rounded-full h-9">*/}
            {/*                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />*/}
            {/*                        </svg>*/}
            {/*                        Invite*/}
            {/*                    </Button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}

            {/*        /!* Description *!/*/}
            {/*        {task.Description && (*/}
            {/*            <div className="mb-6">*/}
            {/*                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">*/}
            {/*                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />*/}
            {/*                    </svg>*/}
            {/*                    Description*/}
            {/*                </h4>*/}
            {/*                <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">*/}
            {/*                    {task.Description}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}

            {/*        /!* Attachments *!/*/}
            {/*        <div className="mb-6">*/}
            {/*            <div className="flex justify-between items-center mb-2">*/}
            {/*                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">*/}
            {/*                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />*/}
            {/*                    </svg>*/}
            {/*                    Attachments (2)*/}
            {/*                </h4>*/}
            {/*                <Button variant="ghost" size="sm" className="text-blue-600 flex items-center gap-1">*/}
            {/*                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />*/}
            {/*                    </svg>*/}
            {/*                    Download All*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*            <div className="grid grid-cols-2 gap-3">*/}
            {/*                <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 shadow-sm transition">*/}
            {/*                    <div className="h-10 w-10 flex-shrink-0 bg-red-50 rounded-md flex items-center justify-center text-red-500">*/}
            {/*                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />*/}
            {/*                        </svg>*/}
            {/*                    </div>*/}
            {/*                    <div className="ml-3">*/}
            {/*                        <p className="text-sm font-medium">Design brief.pdf</p>*/}
            {/*                        <p className="text-xs text-gray-500">1.5 MB • <span className="text-blue-500 hover:underline cursor-pointer">Download</span></p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 shadow-sm transition">*/}
            {/*                    <div className="h-10 w-10 flex-shrink-0 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">*/}
            {/*                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                            <path d="M11.1913 8.07813C11.0511 8.92968 10.1886 9.48438 9.30086 9.34375C8.44931 9.20313 7.89461 8.34063 8.03523 7.48907C8.17586 6.63752 9.03836 6.08282 9.89991 6.22345C10.7648 6.36391 11.3319 7.22641 11.1913 8.07813Z" />*/}
            {/*                            <path d="M5.52786 2.52344C8.52786 1.375 11.8975 2.21875 14.0057 4.32813C16.1139 6.4375 16.9561 9.80468 15.8084 12.8047L11.0995 17.5156C10.4053 18.1328 9.33836 18.1328 8.67786 17.5156L3.9689 12.8047C2.82278 9.80468 3.66411 6.4375 5.77231 4.32813C5.8894 4.21029 6.00966 4.09635 6.13298 3.98631C5.9181 4.83838 5.83523 5.73438 5.89461 6.64063C5.89931 6.69922 5.93054 6.75782 5.98914 6.78907C6.04774 6.82032 6.11724 6.82032 6.17583 6.78907C7.07208 6.28907 8.08209 6.03907 9.11724 6.0625C11.0213 6.10938 12.7044 7.10938 13.5854 8.77344C13.6088 8.82032 13.6557 8.85157 13.7026 8.85157C13.7495 8.87313 13.8073 8.85157 13.8424 8.82032C14.3542 8.30859 14.7357 7.69525 14.9863 7.02344C15.1288 6.60938 15.2245 6.17969 15.2713 5.75C16.0057 7.35938 16.0838 9.23438 15.4443 10.9766C15.4088 11.0781 15.4088 11.1953 15.4443 11.2969L16.7748 14.7031C16.8893 15.0234 16.6944 15.375 16.3592 15.4219C16.303 15.4301 16.2458 15.4262 16.1915 15.4105C15.946 15.3359 15.7682 15.0938 15.761 14.8359L15.6592 12.1641L4.53211 11.2969C4.56758 11.1953 4.56758 11.0781 4.53211 10.9766C3.90852 9.27188 3.97379 7.44873 4.6529 5.82813C4.9356 4.68657 5.18366 3.52344 5.52786 2.52344Z" />*/}
            {/*                        </svg>*/}
            {/*                    </div>*/}
            {/*                    <div className="ml-3">*/}
            {/*                        <p className="text-sm font-medium">Craftboard logo.ai</p>*/}
            {/*                        <p className="text-xs text-gray-500">2.5 MB • <span className="text-blue-500 hover:underline cursor-pointer">Download</span></p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <Button variant="outline" className="flex items-center justify-center p-2 border border-dashed rounded-lg text-gray-400 hover:text-gray-700 hover:border-gray-400 col-span-2">*/}
            {/*                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />*/}
            {/*                    </svg>*/}
            {/*                    Add Attachment*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* Tags *!/*/}
            {/*        <div className="mb-6">*/}
            {/*            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">*/}
            {/*                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
            {/*                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />*/}
            {/*                </svg>*/}
            {/*                Tags*/}
            {/*            </h4>*/}
            {/*            <div className="flex flex-wrap gap-2">*/}
            {/*                <Badge className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-none flex items-center gap-1 py-1.5 px-3">*/}
            {/*                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">*/}
            {/*                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />*/}
            {/*                    </svg>*/}
            {/*                    Dashboard*/}
            {/*                </Badge>*/}
            {/*                <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-none py-1.5 px-3">*/}
            {/*                    • Medium*/}
            {/*                </Badge>*/}
            {/*                <Button variant="outline" size="sm" className="rounded-full h-8 text-xs">*/}
            {/*                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />*/}
            {/*                    </svg>*/}
            {/*                    Add Tag*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <Separator className="my-6" />*/}

            {/*        /!* Tabs for subtasks, comments, and activities *!/*/}
            {/*        <Tabs defaultValue="subtasks" value={activeTab} onValueChange={setActiveTab} className="w-full">*/}
            {/*            <TabsList className="grid w-full grid-cols-3 mb-8">*/}
            {/*                <TabsTrigger value="subtasks" className="text-sm">Subtasks</TabsTrigger>*/}
            {/*                <TabsTrigger value="comments" className="text-sm">*/}
            {/*                    Comments*/}
            {/*                    <span className="ml-1.5 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">3</span>*/}
            {/*                </TabsTrigger>*/}
            {/*                <TabsTrigger value="activities" className="text-sm">Activities</TabsTrigger>*/}
            {/*            </TabsList>*/}

            {/*            /!* Subtasks Tab *!/*/}
            {/*            <TabsContent value="subtasks" className="space-y-4 focus:outline-none">*/}
            {/*                <div className="mb-4">*/}
            {/*                    <div className="flex justify-between items-center mb-2">*/}
            {/*                        <h3 className="text-base font-medium">Our Design Process</h3>*/}
            {/*                        <div className="text-sm text-gray-500">*/}
            {/*                            {completedSubtasks}/{totalSubtasks}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <Progress value={completionPercentage} className="h-2" />*/}
            {/*                </div>*/}

            {/*                <div className="space-y-4">*/}
            {/*                    {task.SubTasks?.map((subtask, idx) => (*/}
            {/*                        <div key={idx} className="bg-white border rounded-lg p-3 shadow-sm">*/}
            {/*                            <div className="flex items-start gap-3">*/}
            {/*                                <div className="mt-0.5">*/}
            {/*                                    <div className={`w-5 h-5 rounded-full ${subtask.Status === 'Completed' ? 'bg-blue-100 border-2 border-blue-500 flex items-center justify-center' : 'bg-white border-2 border-gray-300'}`}>*/}
            {/*                                        {subtask.Status === 'Completed' && (*/}
            {/*                                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />*/}
            {/*                                            </svg>*/}
            {/*                                        )}*/}
            {/*                                    </div>*/}
            {/*                                </div>*/}
            {/*                                <div className="flex-grow">*/}
            {/*                                    <div className="flex items-center">*/}
            {/*                                        <div className="text-sm font-medium text-gray-900">{subtask.Title}</div>*/}
            {/*                                        {subtask.Title === 'Meeting & Mind Mapping with Tyler' && (*/}
            {/*                                            <div className="ml-2">*/}
            {/*                                                <div*/}
            {/*                                                    className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold bg-gradient-to-br from-indigo-500 to-indigo-600">*/}
            {/*                                                    T*/}
            {/*                                                </div>*/}
            {/*                                            </div>*/}
            {/*                                        )}*/}
            {/*                                    </div>*/}

            {/*                                    /!* Notes or issues *!/*/}
            {/*                                    {subtask.Title === 'Understanding client design brief' && (*/}
            {/*                                        <div className="mt-1.5 bg-gray-50 rounded-md p-3 text-sm text-gray-600">*/}
            {/*                                            <div className="flex items-start space-x-2">*/}
            {/*                                                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />*/}
            {/*                                                </svg>*/}
            {/*                                                <div>*/}
            {/*                                                    <p className="font-medium text-gray-700">Blocker: The brief from client was not clear so it took time to understand it 😕</p>*/}
            {/*                                                </div>*/}
            {/*                                            </div>*/}
            {/*                                        </div>*/}
            {/*                                    )}*/}

            {/*                                    {subtask.Title === 'Meeting & Mind Mapping with Tyler' && (*/}
            {/*                                        <div className="mt-1.5 bg-gray-50 rounded-md p-3 text-sm text-gray-600">*/}
            {/*                                            <p>Note: Some employees have different KPI cases</p>*/}
            {/*                                        </div>*/}
            {/*                                    )}*/}
            {/*                                </div>*/}

            {/*                                <div>*/}
            {/*                                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">*/}
            {/*                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />*/}
            {/*                                        </svg>*/}
            {/*                                    </button>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    ))}*/}
            {/*                </div>*/}

            {/*                <Button variant="ghost" className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">*/}
            {/*                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />*/}
            {/*                    </svg>*/}
            {/*                    Add subtask*/}
            {/*                </Button>*/}
            {/*            </TabsContent>*/}

            {/*            /!* Comments Tab *!/*/}
            {/*            <TabsContent value="comments" className="focus:outline-none">*/}
            {/*                <div className="space-y-4 mb-4">*/}
            {/*                    /!* Comment *!/*/}
            {/*                    <div className="flex gap-3">*/}
            {/*                        <div className="flex-shrink-0">*/}
            {/*                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">*/}
            {/*                                T*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div className="flex-grow bg-gray-50 rounded-lg p-4 shadow-sm">*/}
            {/*                            <div className="flex justify-between items-start mb-1">*/}
            {/*                                <div>*/}
            {/*                                    <span className="font-medium text-gray-900">Tyler Durden</span>*/}
            {/*                                    <span className="ml-2 text-xs text-gray-500">3 days ago</span>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <p className="text-sm text-gray-700">I think we should focus more on the performance metrics that are directly tied to revenue. Let's highlight those in the dashboard.</p>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    /!* Comment with replies *!/*/}
            {/*                    <div className="space-y-3">*/}
            {/*                        <div className="flex gap-3">*/}
            {/*                            <div className="flex-shrink-0">*/}
            {/*                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-xs font-bold flex items-center justify-center">*/}
            {/*                                    D*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex-grow bg-gray-50 rounded-lg p-4 shadow-sm">*/}
            {/*                                <div className="flex justify-between items-start mb-1">*/}
            {/*                                    <div>*/}
            {/*                                        <span className="font-medium text-gray-900">Dawson Tarman</span>*/}
            {/*                                        <span className="ml-2 text-xs text-gray-500">2 days ago</span>*/}
            {/*                                    </div>*/}
            {/*                                </div>*/}
            {/*                                <p className="text-sm text-gray-700">Good point! I'll make sure our key revenue metrics are front and center. Any specific KPIs you'd like to prioritize?</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        /!* Reply *!/*/}
            {/*                        <div className="flex gap-3 pl-11">*/}
            {/*                            <div className="flex-shrink-0">*/}
            {/*                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">*/}
            {/*                                    T*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex-grow bg-gray-50 rounded-lg p-4 shadow-sm">*/}
            {/*                                <div className="flex justify-between items-start mb-1">*/}
            {/*                                    <div>*/}
            {/*                                        <span className="font-medium text-gray-900">Tyler Durden</span>*/}
            {/*                                        <span className="ml-2 text-xs text-gray-500">1 day ago</span>*/}
            {/*                                    </div>*/}
            {/*                                </div>*/}
            {/*                                <p className="text-sm text-gray-700">Yes, let's focus on conversion rate, customer acquisition cost, and monthly recurring revenue.</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    /!* Add comment box *!/*/}
            {/*                    <div className="mt-4 pt-3 border-t">*/}
            {/*                        <div className="flex gap-3">*/}
            {/*                            <div className="flex-shrink-0">*/}
            {/*                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-xs font-bold flex items-center justify-center">*/}
            {/*                                    D*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex-grow">*/}
            {/*                                    <textarea*/}
            {/*                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"*/}
            {/*                                        placeholder="Add a comment..."*/}
            {/*                                        rows={3}*/}
            {/*                                    ></textarea>*/}
            {/*                                <div className="mt-2 flex justify-between items-center">*/}
            {/*                                    <div className="flex space-x-2">*/}
            {/*                                        <button className="p-1 text-gray-500 hover:text-gray-700 rounded">*/}
            {/*                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />*/}
            {/*                                            </svg>*/}
            {/*                                        </button>*/}
            {/*                                        <button className="p-1 text-gray-500 hover:text-gray-700 rounded">*/}
            {/*                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />*/}
            {/*                                            </svg>*/}
            {/*                                        </button>*/}
            {/*                                    </div>*/}
            {/*                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">*/}
            {/*                                        Comment*/}
            {/*                                    </Button>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </TabsContent>*/}

            {/*            /!* Activities Tab *!/*/}
            {/*            <TabsContent value="activities" className="focus:outline-none">*/}
            {/*                <div className="relative pb-4">*/}
            {/*                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>*/}

            {/*                    <div className="space-y-6">*/}
            {/*                        /!* Activity item *!/*/}
            {/*                        <div className="relative pl-10">*/}
            {/*                            <div className="absolute left-0 top-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 border-4 border-white shadow-sm">*/}
            {/*                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />*/}
            {/*                                </svg>*/}
            {/*                            </div>*/}
            {/*                            <div className="bg-white p-3 rounded-lg shadow-sm border">*/}
            {/*                                <div className="flex items-center space-x-2">*/}
            {/*                                    <span className="font-medium">Task created</span>*/}
            {/*                                    <span className="text-gray-500 text-sm">by Tyler Durden</span>*/}
            {/*                                </div>*/}
            {/*                                <p className="text-sm text-gray-500 mt-1">March 5, 2024 at 10:30 AM</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        /!* Activity item *!/*/}
            {/*                        <div className="relative pl-10">*/}
            {/*                            <div className="absolute left-0 top-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 border-4 border-white shadow-sm">*/}
            {/*                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />*/}
            {/*                                </svg>*/}
            {/*                            </div>*/}
            {/*                            <div className="bg-white p-3 rounded-lg shadow-sm border">*/}
            {/*                                <div className="flex items-center space-x-2">*/}
            {/*                                    <span className="font-medium">Description updated</span>*/}
            {/*                                    <span className="text-gray-500 text-sm">by Dawson Tarman</span>*/}
            {/*                                </div>*/}
            {/*                                <p className="text-sm text-gray-500 mt-1">March 8, 2024 at 2:15 PM</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        /!* Activity item *!/*/}
            {/*                        <div className="relative pl-10">*/}
            {/*                            <div className="absolute left-0 top-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-500 border-4 border-white shadow-sm">*/}
            {/*                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />*/}
            {/*                                </svg>*/}
            {/*                            </div>*/}
            {/*                            <div className="bg-white p-3 rounded-lg shadow-sm border">*/}
            {/*                                <div className="flex items-center space-x-2">*/}
            {/*                                    <span className="font-medium">Status changed</span>*/}
            {/*                                    <span className="text-gray-500 text-sm">from "Not start" to "On Progress"</span>*/}
            {/*                                </div>*/}
            {/*                                <p className="text-sm text-gray-500 mt-1">Today at 9:40 AM</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        /!* Activity item *!/*/}
            {/*                        <div className="relative pl-10">*/}
            {/*                            <div className="absolute left-0 top-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-500 border-4 border-white shadow-sm">*/}
            {/*                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />*/}
            {/*                                </svg>*/}
            {/*                            </div>*/}
            {/*                            <div className="bg-white p-3 rounded-lg shadow-sm border">*/}
            {/*                                <div className="flex items-center space-x-2">*/}
            {/*                                    <span className="font-medium">Dawson Tarman assigned</span>*/}
            {/*                                    <span className="text-gray-500 text-sm">by Tyler Durden</span>*/}
            {/*                                </div>*/}
            {/*                                <p className="text-sm text-gray-500 mt-1">Today at 11:23 AM</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </TabsContent>*/}
            {/*        </Tabs>*/}
            {/*    </div>*/}
            {/*</div>*/}
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailSheet;