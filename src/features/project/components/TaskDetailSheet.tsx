'use client'

import React from 'react';
import { TaskDto } from '@/features/project/types/projects.types';
import dayjs from 'dayjs';
import {CalendarIcon, } from "lucide-react";
import {DocumentIcon} from "@/features/project/utils/iconUtils";
import {Draggable} from "@hello-pangea/dnd";
import {
    adjustColor,
    getAvatarColor,
    priorityColors
} from "@/features/project/utils/colorUtils";
import {useRouter} from "next/navigation";



interface TaskDetailSheetProps {
    task: TaskDto  | null;
    index: number;
}

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({ task, index }) => {
    const router = useRouter();
    if (!task) return null;

    return (
        <>
            <Draggable key={task.Id.toString()} draggableId={task.Id.toString()} index={index}>
                {(provided, snapshot) => (
                    <div
                        className={`bg-white border rounded-lg p-4 shadow-sm text-sm space-y-2 transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => {
                            router.push(`/t/${task.Id}`);
                        }}

                    >
                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${priorityColors[task.Priority || 'Normal'].badge}`}>
                                                                {task.Priority || 'Normal'}
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

            </>
    );
};



export default TaskDetailSheet;