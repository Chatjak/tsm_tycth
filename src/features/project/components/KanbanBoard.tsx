'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { TaskDto } from '@/features/project/types/projects.types';
import TaskDetailSheet from '@/features/project/components/TaskDetailSheet';
import { EmptyIcon, StatusIcon } from '@/features/project/utils/iconUtils';
import {Drawer, message} from 'antd';
import TaskDetailDescription from '@/features/project/components/TaskDetailDescription';
import dayjs from "dayjs";
import {AttachmentCard} from "@/features/project/components/AttachementCard";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import TaskComponent from "@/features/project/components/TaskComponent";
import {useUpdateTaskMutation} from "@/stores/redux/api/taskApi";

const statusColors: Record<string,any> = {
    'Not start': {
        bg: 'bg-gray-50',
        header: 'bg-gray-100',
        border: 'border-gray-200',
        icon: 'text-gray-400',
    },
    'On Progress': {
        bg: 'bg-blue-50',
        header: 'bg-blue-100',
        border: 'border-blue-200',
        icon: 'text-blue-400',
    },
    Completed: {
        bg: 'bg-green-50',
        header: 'bg-green-100',
        border: 'border-green-200',
        icon: 'text-green-400',
    },
};

const statusColumns = Object.keys(statusColors);

interface KanbanBoardProps {
    tasks: TaskDto[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    const [columns, setColumns] = useState<Record<string, TaskDto[]>>({});
    const [showScrollShadows, setShowScrollShadows] = useState<Record<string, boolean>>({});
    const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
    const [updateTask, {  isSuccess }] = useUpdateTaskMutation();
    useEffect(() => {
        const grouped = statusColumns.reduce((acc, status) => {
            acc[status] = tasks.filter((task) => task.Status === status);
            return acc;
        }, {} as Record<string, TaskDto[]>);
        setColumns(grouped);
        setSelectedTask((e) => {
            if (!e) return null;

            const mainTask = tasks.find((task) => task.Id === e.Id);
            if (mainTask) return mainTask;

            for (const task of tasks) {
                const subTask = task.SubTasks?.find((sub) => sub.Id === e.Id);
                if (subTask) return subTask;
            }

            return null;
        });

    }, [tasks]);

    useEffect(() => {
        if(isSuccess){
            message.success('Update task successfully');
        }
    }, [isSuccess]);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCol = source.droppableId;
        const destCol = destination.droppableId;

        const sourceTasks = Array.from(columns[sourceCol]);
        const destTasks = Array.from(columns[destCol]);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (sourceCol === destCol) {
            sourceTasks.splice(destination.index, 0, movedTask);
            setColumns((prev) => ({ ...prev, [sourceCol]: sourceTasks }));
        } else {
            const updatedTask = { ...movedTask, Status: destCol };
            destTasks.splice(destination.index, 0, updatedTask);
            setColumns((prev) => ({
                ...prev,
                [sourceCol]: sourceTasks,
                [destCol]: destTasks,
            }));

            await updateTask({
                params: { id: updatedTask.Id },
                body: {
                    column: 'status',
                    value: destCol,
                    project_id: updatedTask.ProjectId,
                    id: updatedTask.Id
                }
            });
        }
    };


    const handleScroll = (e: React.UIEvent<HTMLDivElement>, status: string) => {
        const target = e.currentTarget;
        const isScrolled = target.scrollTop > 5;
        setShowScrollShadows((prev) => ({ ...prev, [status]: isScrolled }));
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statusColumns.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`${statusColors[status].bg} rounded-lg overflow-hidden shadow-md transition-all h-full ${snapshot.isDraggingOver ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                                >
                                    <div
                                        className={`${statusColors[status].header} px-4 py-3 flex justify-between items-center border-b ${statusColors[status].border}`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <StatusIcon status={status} />
                                            <h3 className="font-bold text-gray-800">{status}</h3>
                                            <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full text-xs font-medium shadow-sm">
                        {columns[status]?.length || 0}
                      </span>
                                        </div>
                                    </div>

                                    <div
                                        className="p-3 min-h-[600px] max-h-[calc(100vh-120px)] overflow-y-auto relative"
                                        onScroll={(e) => handleScroll(e, status)}
                                    >
                                        {showScrollShadows[status] && (
                                            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                                        )}
                                        <div className="space-y-3">
                                            {columns[status]?.map((task, index) => (
                                                <TaskDetailSheet key={index} task={task} index={index}/>
                                            ))}
                                            {provided.placeholder}

                                            {columns[status]?.length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-lg bg-white bg-opacity-50 text-center p-4">
                                                    <EmptyIcon className={statusColors[status].icon} />
                                                    <p className="text-sm text-gray-500 mt-2">No tasks yet</p>
                                                    <p className="text-xs text-gray-400">Drag tasks here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

           <TaskComponent
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
           />
        </>
    );
};

export default KanbanBoard;
