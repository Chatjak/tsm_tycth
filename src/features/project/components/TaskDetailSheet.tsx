'use client'

import React, { useState } from 'react';
import { TaskDto } from '@/features/project/types/projects.types';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import {CalendarIcon, PaperclipIcon, PlusIcon} from "lucide-react";
import {DocumentIcon} from "@/features/project/utils/iconUtils";
import {Draggable} from "@hello-pangea/dnd";
import {
    adjustColor,
    getAvatarColor,
    priorityColors
} from "@/features/project/utils/colorUtils";
import TaskDetailDescription from "@/features/project/components/TaskDetailDescription";
import {Drawer} from "antd";
import {AttachmentCard} from "@/features/project/components/AttachementCard";



interface TaskDetailSheetProps {
    task: TaskDto  | null;
    index: number
}

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({ task, index }) => {
    const  [TasksDetailOpen,setTasksDetailOpen] = useState(false)

    if (!task) return null;


    if(!task) return null;


    return (
        <>
            <Draggable key={task.Id.toString()} draggableId={task.Id.toString()} index={index}>
                {(provided, snapshot) => (
                    <div
                        className={`bg-white border rounded-lg p-4 shadow-sm text-sm space-y-2 transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setTasksDetailOpen(true)}

                    >
                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${priorityColors[task.Priority || 'Normal'].badge}`}>
                                                                {task.Priority || 'Normal'}
                                                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                                                                #{task.Id.toString().padStart(3, '0')}
                                                            </span>
                        </div>

                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2">
                            {task.Title}
                        </h4>

                        {task.Description && (
                            <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded border border-gray-100">
                                {task.Description}
                            </p>
                        )}

                        {task.TaskStart && task.TaskEnd && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <CalendarIcon />
                                <span>
                                    {dayjs(task.TaskStart).format('MMM DD')} - {dayjs(task.TaskEnd).format('MMM DD, YYYY')}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t mt-2">
                            <div className="flex items-center space-x-2 text-gray-500 text-xs">
                                <div className="flex items-center space-x-1">
                                    <DocumentIcon />
                                    <span>{task.SubTasks?.length || 0} subtasks</span>
                                </div>
                            </div>

                            <div className="flex -space-x-2">
                                {task.Assignees?.slice(0, 3).map((assignee, idx) => (
                                    <div key={idx}
                                         className="w-8 h-8 rounded-full text-xs flex items-center justify-center text-white font-bold border-2 border-white shadow-md"
                                         style={{
                                             backgroundColor: getAvatarColor(assignee.EmpName || 'User'),
                                             backgroundImage: `linear-gradient(45deg, ${getAvatarColor(assignee.EmpName || 'User')}, ${adjustColor(getAvatarColor(assignee.EmpName || 'User'), -20)})`
                                         }}>
                                        {assignee.EmpName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                ))}
                                {(task.Assignees?.length || 0) > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-xs flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-md"
                                         style={{
                                             backgroundImage: 'linear-gradient(45deg, #e5e7eb, #d1d5db)'
                                         }}>
                                        +{task.Assignees!.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
            <Drawer
                open={TasksDetailOpen}
                onClose={() => setTasksDetailOpen(false)}
                width="100%"
                closeIcon={false}
                bodyStyle={{ padding: '24px', backgroundColor: '#f9fafb' }}

            >
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-2xl font-bold">{task.Title}</h2>
                        <div className="text-xs text-gray-500">
                            Created at: {dayjs(task.CreatedAt).format('DD/MM/YYYY')}
                        </div>
                    </div>
                    <TaskDetailDescription task={task} />
                    {task.Assignees && (
                        <section className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-700">Assignees</h3>
                            <div className="flex flex-wrap gap-2">
                                {task.Assignees.map((a, idx) => (
                                    <div key={idx} className="flex items-center px-3 py-1.5 bg-white rounded-full border text-gray-700 text-sm">
                                        <div className="w-7 h-7 rounded-full text-white bg-gray-400 flex items-center justify-center mr-2">
                                            {a.EmpName?.charAt(0).toUpperCase()}
                                        </div>
                                        {a.EmpName}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {task.Description && (
                        <section className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                            <p className="p-4 bg-white rounded-md border text-sm text-gray-600">{task.Description}</p>
                        </section>
                    )}
                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700">Attachments</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <AttachmentCard name="Design brief.pdf" size="1.5 MB" />
                            <AttachmentCard name="Craftboard logo.ai" size="2.5 MB" />
                            <Button variant="outline" className="col-span-2 flex justify-center border-dashed">
                                <PlusIcon size={16} className="mr-2" /> Add Attachment
                            </Button>
                        </div>
                    </section>
                </div>
            </Drawer>
            </>
    );
};



export default TaskDetailSheet;