import React, {useEffect, useState} from 'react';
import {Drawer, message, Tooltip} from "antd";
import dayjs from "dayjs";
import TaskDetailDescription from "@/features/project/components/TaskDetailDescription";
import {AttachmentCard} from "@/features/project/components/AttachementCard";
import {Button} from "@/components/ui/button";
import {
    XIcon,
    Edit2Icon,
    CheckIcon,
    FileTextIcon,
    UsersIcon,
    PaperclipIcon,
    MessageSquareIcon,
    ChevronLeftIcon,
    InfoIcon
} from "lucide-react";
import {TaskDto} from "@/features/project/types/projects.types";
import {useGetFilesByIdQuery, useUpdateTaskMutation} from "@/stores/redux/api/taskApi";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TaskAddAssignees from "@/features/project/components/TaskAddAssignees";
import UploadTaskFile from "@/features/project/components/UploadAttachment";
import AddTaskComponent from "@/components/Protect/Home/Projects/[id]/AddTaskComponent";
import { motion, AnimatePresence } from "framer-motion";
import {slideLeft,fadeIn, slideRight, slideUp} from "@/features/project/utils/animationUtils";
import MessageComponent from "@/features/project/components/MessageComponent";


interface TaskComponentProps {
    selectedTask: TaskDto | null;
    setSelectedTask: (task: TaskDto | null) => void;
}

const TaskComponent = ({selectedTask, setSelectedTask} : TaskComponentProps) => {
    const [updateTask, { isLoading, isSuccess }] = useUpdateTaskMutation();
    const [editDescription, setEditDescription] = useState(false);
    const [desc, setDesc] = useState<string | null>(null);
    const [isHoveringDesc, setIsHoveringDesc] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [showSidebar, setShowSidebar] = useState(false);



    const [isMobile, setIsMobile] = useState(false);

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




    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <Drawer
            open={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            width={isMobile ? "100%" : "100%"}
            closeIcon={false}
            title={null}
            styles={{
                body: { padding: 0, backgroundColor: '#f9fafb' },
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
            }}
            className="task-detail-drawer"
        >
            <AnimatePresence>
            {selectedTask && (
                <motion.div
                    className="flex flex-col h-full"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    {/* Mobile Back Header (only on mobile) */}
                    {isMobile && (
                        <div className="px-4 py-3 bg-white border-b flex items-center justify-between sticky top-0 z-20 shadow-sm">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="flex items-center text-gray-700"
                            >
                                <ChevronLeftIcon size={20} className="mr-1" />
                                <span className="font-medium">Back</span>
                            </button>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <InfoIcon size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Main Header */}
                    <motion.div
                        className="bg-white border-b sticky top-0 z-10 shadow-sm"
                        variants={slideUp}
                    >
                        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between">
                            <motion.div
                                className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4"
                                variants={slideRight}
                            >
                                <h2 className="text-lg md:text-xl font-semibold break-words pr-12 md:pr-0">{selectedTask?.Title}</h2>
                            </motion.div>

                            {!isMobile && (
                                <motion.div
                                    className="flex items-center space-x-2 mt-2 md:mt-0"
                                    variants={slideLeft}
                                >
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <MessageSquareIcon size={16} className="mr-1" />
                                            Messages
                                        </Button>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setSelectedTask(null)}
                                        >
                                            <XIcon size={16} className="mr-1" />
                                            Close
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                    {/* Main content */}
                    <div className="flex flex-1 overflow-hidden relative container mx-auto">
                        {/* Left panel - Task details */}
                        <motion.div className={`${isMobile ? 'w-full' : 'w-2/3'} p-4 md:p-6 overflow-y-auto`}>
                            <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-6 md:space-y-8">
                                    {/* Task meta info - Grid on desktop, Column on mobile */}
                                    <TaskDetailDescription task={selectedTask}/>

                                    {/* Description */}
                                    <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b bg-gray-50">
                                            <h3 className="text-sm font-medium text-gray-700">Description</h3>
                                            {!editDescription && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditDescription(true)}
                                                    className="h-8 px-2 text-gray-500 hover:text-blue-500"
                                                >
                                                    <Edit2Icon size={14} className="mr-1" />
                                                    <span className="hidden md:inline">Edit</span>
                                                </Button>
                                            )}
                                        </div>

                                        <div className="p-1">
                                            {!editDescription ? (
                                                <div
                                                    className={`p-3 md:p-4 min-h-[120px] text-sm text-gray-600 transition-all duration-200 ${isHoveringDesc ? 'bg-blue-50/30' : ''}`}
                                                    onMouseEnter={() => setIsHoveringDesc(true)}
                                                    onMouseLeave={() => setIsHoveringDesc(false)}
                                                    onClick={() => setEditDescription(true)}
                                                >
                                                    {desc || selectedTask.Description ? (
                                                        <div className="prose prose-sm max-w-none">
                                                            {desc || selectedTask.Description}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-6 md:py-8 text-gray-400">
                                                            <FileTextIcon size={28} className="mb-2 opacity-60" />
                                                            <p>No description added yet</p>
                                                            <p className="text-blue-500 text-xs mt-1">Tap to add one</p>
                                                        </div>
                                                    )}

                                                    {isHoveringDesc && !editDescription && !isMobile && (
                                                        <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 rounded-full p-1 shadow-sm">
                                                            <Edit2Icon size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-3 md:p-4">
                                                    <Textarea
                                                        defaultValue={desc || selectedTask.Description}
                                                        className="min-h-32 p-3 md:p-4 focus:ring-blue-500 focus:border-blue-500 border-gray-200"
                                                        placeholder="Add a detailed description of this task..."
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2 mt-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditDescription(false)}
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
                                                        >
                                                            {isLoading ? 'Saving...' : 'Save'}
                                                            {!isLoading && <CheckIcon size={14} className="ml-1" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* Assignees */}

                                        <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b bg-gray-50">
                                                <div className="flex items-center">
                                                    <UsersIcon size={16} className="mr-2 text-gray-500" />
                                                    <h3 className="text-sm font-medium text-gray-700">Assignees</h3>
                                                </div>
                                                <TaskAddAssignees task={selectedTask} />
                                            </div>
                                            {selectedTask.Assignees && (
                                            <div className="p-3 md:p-4">
                                                <div className="flex flex-wrap gap-2 md:gap-3">
                                                    {selectedTask.Assignees.map((a, idx) => (
                                                        <Tooltip key={idx} title={a.EmpName} placement="top">
                                                            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors">
                                                                <Avatar className="h-6 w-6 md:h-8 md:w-8 bg-gray-200">
                                                                    <AvatarFallback className="bg-gray-400 text-white text-xs md:text-sm">
                                                                        {a.EmpName?.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-xs md:text-sm font-medium text-gray-700">{a.EmpName}</span>
                                                            </div>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                            )}
                                        </section>


                                    {/* Attachments */}
                                    <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b bg-gray-50">
                                            <div className="flex items-center">
                                                <PaperclipIcon size={16} className="mr-2 text-gray-500" />
                                                <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
                                            </div>
                                            <UploadTaskFile taskId={selectedTask.Id} project_id={selectedTask.ProjectId} />
                                        </div>

                                        <div className="p-3 md:p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                {files && files.length > 0 ? (
                                                    files.map((file) => (
                                                        <AttachmentCard
                                                            key={file.id}
                                                            id={file.id}
                                                            name={file.path.split(/[/\\]/).pop() || 'Unnamed file'}
                                                            size="—" // 🔁 ถ้ามีขนาดใน DB ให้ใส่ตรงนี้
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="text-gray-400 col-span-2 text-center text-sm">No attachments yet.</div>
                                                )}
                                            </div>
                                        </div>

                                    </section>

                                    <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b bg-gray-50">
                                            <div className="flex items-center">
                                                <FileTextIcon size={16} className="mr-2 text-gray-500" />
                                                <h3 className="text-sm font-medium text-gray-700">Sub-Tasks</h3>
                                            </div>
                                            <AddTaskComponent  projectId={selectedTask.ProjectId as unknown as string} parent_id={selectedTask.Id} />
                                        </div>

                                        <div className="p-3 md:p-4 space-y-3" >
                                            {selectedTask.SubTasks && selectedTask.SubTasks.length > 0 ? (
                                                selectedTask.SubTasks.map((sub) => (
                                                    <div
                                                        key={sub.Id}
                                                        className="border border-gray-200 rounded-md px-3 py-2 flex flex-col md:flex-row justify-between hover:bg-gray-50 transition"
                                                        onClick={() => {
                                                            setSelectedTask(sub)
                                                        }}
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{sub.Title}</p>
                                                            {sub.Status && (
                                                                <p className="text-xs text-gray-500 mt-1">Status: {sub.Status}</p>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 md:mt-0 md:text-right text-xs text-gray-400 flex flex-col">
                                                            {sub.CreatedAt && (
                                                                <p>Created: {dayjs(sub.CreatedAt).format('DD MMM YYYY')}</p>
                                                            )}
                                                            {sub.Assignees && sub.Assignees.length > 0 && (
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    {sub.Assignees.map((a, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700"
                                                                        >
                                                                            <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center text-white mr-1 text-xs font-medium">
                                                                                {a.EmpName?.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            {a.EmpName}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400 text-sm text-center">No sub-tasks available.</div>
                                            )}
                                        </div>
                                    </section>
                                </TabsContent>

                                <TabsContent value="activity" className="space-y-6">
                                    {/* Placeholder for activity tab content */}
                                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px]">
                                        <div className="text-gray-400 mb-4">
                                            <MessageSquareIcon size={36} className="mx-auto opacity-50" />
                                        </div>
                                        <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Activity Timeline</h3>
                                        <p className="text-gray-500 text-center text-sm md:text-base max-w-md">
                                            View all comments, changes and updates to this task in chronological order
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                        {/* Right panel - Messages */}
                        {selectedTask &&
                            <MessageComponent task_id={selectedTask.Id} project_id={selectedTask.ProjectId} isMobile={isMobile} />}
                    </div>



                </motion.div>
            )}
                </AnimatePresence>
        </Drawer>
    );
};

export default TaskComponent;