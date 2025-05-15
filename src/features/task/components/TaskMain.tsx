'use client'

import React, {useEffect, useState} from 'react';
import {TaskDto} from "@/features/task/dto/QueryTaskById";
import {motion, AnimatePresence} from "framer-motion";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TaskDetailDescription from "@/features/project/components/TaskDetailDescription";
import {Button} from "@/components/ui/button";
import {CheckIcon, Edit2Icon, FileTextIcon, MessageSquareIcon, PaperclipIcon, UsersIcon, CalendarIcon, ClockIcon, TagIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import TaskAddAssignees from "@/features/project/components/TaskAddAssignees";
import {message, Tooltip} from "antd";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import UploadTaskFile from "@/features/project/components/UploadAttachment";
import {AttachmentCard} from "@/features/project/components/AttachementCard";
import AddTaskComponent from "@/components/Protect/Home/Projects/[id]/AddTaskComponent";
import dayjs from "dayjs";
import {useGetFilesByIdQuery, useUpdateTaskMutation} from "@/stores/redux/api/taskApi";
import {AssigneeDto} from "@/features/project/types/projects.types";
import {useRouter} from "next/navigation";
import MessageComponent from "@/features/project/components/MessageComponent";
import TaskAction from "@/features/task/components/TaskAction";

const TaskMain = ({selectedTask} : {selectedTask:TaskDto}) => {
    const [updateTask, { isLoading, isSuccess }] = useUpdateTaskMutation();
    const [editDescription, setEditDescription] = useState(false);
    const [desc, setDesc] = useState<string | null>(null);
    const [isHoveringDesc, setIsHoveringDesc] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    const { data: files } = useGetFilesByIdQuery({id: selectedTask?.Id ||0, project_id: selectedTask?.ProjectId || 0},
        {skip: !selectedTask}
    );

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 800);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);
    useEffect(() => {
        if (isSuccess) {
            message.success("Task updated successfully");
        }
    }, [isSuccess]);

    const handleDescriptionUpdate = async (newValue: string) => {
        if (!selectedTask) return;

        try {
            await updateTask({
                params: {id: selectedTask.Id},
                body: {
                    column: 'description',
                    id: selectedTask.Id,
                    value: newValue,
                    project_id: selectedTask.ProjectId
                }
            });
            setDesc(newValue);
            setEditDescription(false);
        } catch  {
            message.error("Failed to update description");
        }
    };

    const getColorFromName = (name: string) => {
        const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
        return `hsl(${hue}, 70%, 85%)`;
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let bgColor = "bg-slate-100";
        let textColor = "text-slate-700";

        if (status?.toLowerCase().includes('done') || status?.toLowerCase().includes('complete')) {
            bgColor = "bg-emerald-100";
            textColor = "text-emerald-700";
        } else if (status?.toLowerCase().includes('progress') || status?.toLowerCase().includes('working')) {
            bgColor = "bg-amber-100";
            textColor = "text-amber-700";
        } else if (status?.toLowerCase().includes('todo') || status?.toLowerCase().includes('new')) {
            bgColor = "bg-sky-100";
            textColor = "text-sky-700";
        } else if (status?.toLowerCase().includes('review')) {
            bgColor = "bg-purple-100";
            textColor = "text-purple-700";
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {status}
            </span>
        );
    };

    return (
        // Fixed height container with flex display for the entire page
        <div className="flex h-full relative overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] container mx-auto">
            {/* Main content area with scrolling */}
            <div className={`${isMobile ? 'w-full' : 'w-2/3'} h-full`}>
                <div className="container mx-auto p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Task Header - Title and quick info */}
                        <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-tight">
                                {selectedTask.Title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {selectedTask.Status && <StatusBadge status={selectedTask.Status} />}

                                <div className="flex items-center text-xs text-slate-500">
                                    <ClockIcon size={14} className="mr-1" />
                                    {selectedTask.CreatedAt ? dayjs(selectedTask.CreatedAt).format('DD MMM YYYY') : 'No date'}
                                </div>

                                {selectedTask.ProjectName && (
                                    <div className="flex items-center text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded-md">
                                        <TagIcon size={12} className="mr-1" />
                                        {selectedTask.ProjectName}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <Tabs
                            defaultValue="details"
                            className="w-full"
                            value={activeTab}
                            onValueChange={setActiveTab}
                        >
                            <TabsList className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-1 w-full max-w-xs mx-auto flex justify-center">
                                <TabsTrigger
                                    value="details"
                                    className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out"
                                >
                                    Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="review"
                                    className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out"
                                >
                                    Action & Approve
                                </TabsTrigger>
                                <TabsTrigger
                                    disabled={true}
                                    value="activity"
                                    className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out"
                                >
                                    Activity
                                </TabsTrigger>
                            </TabsList>

                            <AnimatePresence mode="wait">
                                <TabsContent
                                    value="details"
                                    className="space-y-6 md:space-y-8"
                                >
                                    {/* Task meta info - Task Detail Description component */}
                                    <TaskDetailDescription task={selectedTask}/>

                                    {/* Description */}
                                    <motion.section
                                        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b bg-slate-50/80">
                                            <h3 className="text-sm font-semibold text-slate-700 flex items-center">
                                                <FileTextIcon size={16} className="mr-2 text-violet-500" />
                                                Description
                                            </h3>
                                            {!editDescription && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditDescription(true)}
                                                    className="h-8 px-2 text-slate-500 hover:text-violet-500 hover:bg-violet-50 rounded-lg"
                                                >
                                                    <Edit2Icon size={14} className="mr-1" />
                                                    <span className="hidden md:inline">Edit</span>
                                                </Button>
                                            )}
                                        </div>

                                        <div className="p-1">
                                            {!editDescription ? (
                                                <div
                                                    className={`p-4 md:p-5 min-h-[120px] text-sm  whitespace-pre-line text-slate-600 transition-all duration-200 ${isHoveringDesc ? 'bg-violet-50/40' : ''}`}
                                                    onMouseEnter={() => setIsHoveringDesc(true)}
                                                    onMouseLeave={() => setIsHoveringDesc(false)}
                                                    onClick={() => setEditDescription(true)}
                                                >
                                                    {desc || selectedTask.Description ? (
                                                        <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-a:text-violet-600">
                                                            {desc || selectedTask.Description}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-8 md:py-10 text-slate-400">
                                                            <FileTextIcon size={32} className="mb-3 opacity-60" />
                                                            <p className="font-medium">No description added yet</p>
                                                            <p className="text-violet-500 text-xs mt-2 flex items-center">
                                                                <Edit2Icon size={12} className="mr-1" />
                                                                Tap to add one
                                                            </p>
                                                        </div>
                                                    )}

                                                    {isHoveringDesc && !editDescription && !isMobile && (
                                                        <motion.div
                                                            className="absolute top-4 right-4 bg-violet-100 text-violet-600 rounded-full p-1.5 shadow-sm"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                        >
                                                            <Edit2Icon size={14} />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 md:p-5">
                                                    <Textarea
                                                        defaultValue={desc || selectedTask.Description}
                                                        className="min-h-32 p-3 md:p-4 focus:ring-violet-500 focus:border-violet-500 border-slate-200 bg-white rounded-lg shadow-sm"
                                                        placeholder="Add a detailed description of this task..."
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2 mt-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditDescription(false)}
                                                            className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={async(e) => {
                                                                const textarea = e.currentTarget.parentElement?.previousSibling as HTMLTextAreaElement;
                                                                if (textarea) {
                                                                    await handleDescriptionUpdate(textarea.value);
                                                                }
                                                            }}
                                                            disabled={isLoading}
                                                            className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                                                        >
                                                            {isLoading ? 'Saving...' : 'Save'}
                                                            {!isLoading && <CheckIcon size={14} className="ml-1" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.section>

                                    {/* Assignees */}
                                    <motion.section
                                        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b bg-slate-50/80">
                                            <div className="flex items-center">
                                                <UsersIcon size={16} className="mr-2 text-violet-500" />
                                                <h3 className="text-sm font-semibold text-slate-700">Assignees</h3>
                                            </div>
                                            <TaskAddAssignees task={selectedTask} />
                                        </div>
                                        {selectedTask.Assignees && (
                                            <div className="p-4 md:p-5">
                                                <div className="flex flex-wrap gap-2 md:gap-3">
                                                    {selectedTask.Assignees.map((a:AssigneeDto, idx:number) => (
                                                        <Tooltip key={idx} title={a.EmpName} placement="top">
                                                            <motion.div
                                                                className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-slate-50 hover:bg-violet-50 rounded-lg border border-slate-200 transition-colors"
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.1 * idx, duration: 0.3 }}
                                                                whileHover={{ y: -2 }}
                                                            >
                                                                <Avatar className="h-7 w-7 md:h-8 md:w-8">
                                                                    <AvatarFallback
                                                                        style={{ backgroundColor: getColorFromName(a.EmpName || 'User') }}
                                                                        className="text-white text-xs md:text-sm"
                                                                    >
                                                                        {a.EmpName?.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-xs md:text-sm font-medium text-slate-700">{a.EmpName}</span>
                                                            </motion.div>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.section>

                                    {/* Attachments */}
                                    <motion.section
                                        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b bg-slate-50/80">
                                            <div className="flex items-center">
                                                <PaperclipIcon size={16} className="mr-2 text-violet-500" />
                                                <h3 className="text-sm font-semibold text-slate-700">Attachments</h3>
                                            </div>
                                            <UploadTaskFile taskId={selectedTask.Id} project_id={selectedTask.ProjectId} />
                                        </div>

                                        <div className="p-4 md:p-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                {files && files.length > 0 ? (
                                                    files.map((file, idx) => (
                                                        <motion.div
                                                            key={file.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.1 * idx, duration: 0.3 }}
                                                        >
                                                            <AttachmentCard
                                                                id={file.id}
                                                                name={file.path.split(/[/\\]/).pop() || 'Unnamed file'}
                                                                size="—"
                                                            />
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="text-slate-400 col-span-2 text-center text-sm p-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                                        <PaperclipIcon size={24} className="mx-auto mb-2 opacity-60" />
                                                        <p>No attachments yet</p>
                                                        <p className="text-violet-500 text-xs mt-1">Upload files to share with the team</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.section>

                                    {/* Sub-Tasks */}
                                    <motion.section
                                        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                    >
                                        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b bg-slate-50/80">
                                            <div className="flex items-center">
                                                <FileTextIcon size={16} className="mr-2 text-violet-500" />
                                                <h3 className="text-sm font-semibold text-slate-700">Sub-Tasks</h3>
                                            </div>
                                            <AddTaskComponent projectId={selectedTask.ProjectId as unknown as string} parent_id={selectedTask.Id} />
                                        </div>

                                        <div className="p-4 md:p-5 space-y-3" >
                                            {selectedTask.SubTasks && selectedTask.SubTasks.length > 0 ? (
                                                selectedTask.SubTasks.map((sub:TaskDto, idx:number) => (
                                                    <motion.div
                                                        key={sub.Id}
                                                        className="border border-slate-200 rounded-lg px-4 py-3 flex flex-col md:flex-row justify-between hover:bg-violet-50/40 transition-all cursor-pointer hover:border-violet-200 hover:shadow-sm"
                                                        onClick={async() => {
                                                            await router.push(`/t/${sub.Id}`);
                                                        }}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 * idx, duration: 0.3 }}
                                                        whileHover={{ scale: 1.01 }}
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800 mb-1">{sub.Title}</p>
                                                            {sub.Status && (
                                                                <StatusBadge status={sub.Status} />
                                                            )}
                                                        </div>
                                                        <div className="mt-3 md:mt-0 md:text-right text-xs text-slate-400 flex flex-col">
                                                            {sub.CreatedAt && (
                                                                <div className="flex items-center md:justify-end mb-1.5">
                                                                    <CalendarIcon size={12} className="mr-1 text-slate-400" />
                                                                    <span>{dayjs(sub.CreatedAt).format('DD MMM YYYY')}</span>
                                                                </div>
                                                            )}
                                                            {sub.Assignees && sub.Assignees.length > 0 && (
                                                                <div className="flex items-center md:justify-end space-x-1 mt-1">
                                                                    {sub.Assignees.slice(0, 3).map((a:AssigneeDto, idx:number) => (
                                                                        <Tooltip key={idx} title={a.EmpName} placement="top">
                                                                            <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                                                                                <AvatarFallback
                                                                                    style={{ backgroundColor: getColorFromName(a.EmpName || 'User') }}
                                                                                    className="text-white text-xs"
                                                                                >
                                                                                    {a.EmpName?.charAt(0).toUpperCase()}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </Tooltip>
                                                                    ))}
                                                                    {sub.Assignees.length > 3 && (
                                                                        <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                                                                            <AvatarFallback className="bg-slate-300 text-slate-600 text-xs">
                                                                                +{sub.Assignees.length - 3}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="text-slate-400 text-sm text-center p-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                                    <FileTextIcon size={24} className="mx-auto mb-2 opacity-60" />
                                                    <p>No sub-tasks available</p>
                                                    <p className="text-violet-500 text-xs mt-1">Create sub-tasks to break down this work</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.section>
                                </TabsContent>

                                <TabsContent value="activity" className="space-y-6">
                                    <motion.div
                                        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm p-6 md:p-8 border border-slate-200 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] transition-all hover:shadow-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <motion.div
                                            className="text-violet-400 mb-4"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        >
                                            <MessageSquareIcon size={42} className="mx-auto opacity-80" />
                                        </motion.div>
                                        <h3 className="text-lg md:text-xl font-medium text-slate-700 mb-3">Activity Timeline</h3>
                                        <p className="text-slate-500 text-center text-sm md:text-base max-w-md">
                                            View all comments, changes and updates to this task in chronological order
                                        </p>
                                        <Button
                                            className="mt-5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                                        >
                                            Add Comment
                                        </Button>
                                    </motion.div>
                                </TabsContent>


                                <TabsContent value={'review'} className="space-y-6">
                                    <TaskAction/>
                                </TabsContent>
                            </AnimatePresence>
                        </Tabs>
                    </motion.div>
                </div>
            </div>

            {/* Message component - Now properly sticky */}
            {!isMobile && (
                <div className="w-1/3 h-full sticky top-5">
                    <MessageComponent task_id={selectedTask.Id} project_id={selectedTask.ProjectId}  isMobile={false}/>
                </div>
            )}
        </div>
    );
};

export default TaskMain;