'use client';

import React, {useState} from 'react';
import { Event } from 'react-big-calendar';
import {
    CalendarIcon,
    CheckCircle2,
    Clock,
    PauseCircle,
    User,
    ListChecks,
} from 'lucide-react';
import { AssigneeDto, TaskDto } from "@/features/project/types/projects.types";
import TaskComponent from "@/features/project/components/TaskComponent";
type TaskStatus = 'completed' | 'on progress' | 'not start';

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    'completed': <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />,
    'on progress': <Clock className="w-3 h-3 text-blue-600 mr-1" />,
    'not start': <PauseCircle className="w-3 h-3 text-gray-500 mr-1" />,
};

const getInitials = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() || '?';

const CalendarEvent = ({ event }: { event: Event }) => {
    const task: TaskDto = event.resource;
    const rawStatus = task?.Status?.toLowerCase?.() || 'not start';
    const status = rawStatus as TaskStatus;
    const icon = statusIconMap[status] || <PauseCircle className="w-3 h-3 text-gray-500 mr-1" />;
    const assignees = task?.Assignees || [];
    const subTaskCount = task?.SubTasks?.length || 0;
    const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
    return (
        <div className="flex flex-col gap-0.5 text-[11px] text-gray-800 leading-tight"
            onClick={() => setSelectedTask(task)}
        >
            <div className="flex items-center gap-1">
                {icon}
                <span className="font-medium truncate">{task?.Title}</span>
                {subTaskCount > 0 && (
                    <span
                        className="ml-1 px-1.5 py-0 bg-purple-100 text-purple-800 text-[10px] rounded-full flex items-center gap-0.5"
                        title={`${subTaskCount} subtasks`}
                    >
                        <ListChecks className="w-3 h-3" />
                        {subTaskCount}
                    </span>
                )}
            </div>

            {task?.TaskStart && (
                <div className="flex items-center text-[10px] text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {new Date(task.TaskStart).toLocaleDateString()}
                </div>
            )}

            {assignees.length > 0 ? (
                <div className="flex mt-0.5 space-x-0.5">
                    {assignees.map((a: AssigneeDto) => (
                        <div
                            key={a.Id}
                            title={a.EmpName}
                            className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-semibold"
                        >
                            {getInitials(a.EmpName)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-[10px] text-gray-400 italic mt-0.5 flex items-center gap-0.5">
                    <User className="w-3 h-3" /> Unassigned
                </div>
            )}
            <TaskComponent selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
        </div>
    );
};

export default CalendarEvent;
