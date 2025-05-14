'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useGetProjectByIdQuery } from '@/stores/redux/api/projectApi';
import { TaskDto, AssigneeDto } from '@/features/project/types/projects.types';
import { Gantt, Task as GanttTask, ViewMode} from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { List, Loader2, AlertTriangle, Users, Flag, BarChart2, Clock, Tag } from 'lucide-react';
import ProjectTimelineHeader from "@/features/project/components/gantt/ProjectTimelineHeader";
import TaskDetailPanel from "@/features/project/components/gantt/TaskDetailPanel";
export interface ExtendedTask extends GanttTask {
    htmlName?: string; // for custom display
    description?: string;
    priority?: string;
    category?: string;
    taskFinish?: string;
    assignees?: AssigneeDto[];
    tooltip:string
}
const TaskGantt = ({ id }: { id: string }) => {
    const { data, isLoading, error } = useGetProjectByIdQuery({ id });
    const [tasks, setTasks] = useState<ExtendedTask[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);


    const viewModes = useMemo(() => [
        { label: 'Day', value: ViewMode.Day },
        { label: 'Week', value: ViewMode.Week },
        { label: 'Month', value: ViewMode.Month },
    ], []);

    // Avatar helper function
    const getAvatarElement = (assignee: AssigneeDto, size = 'sm') => {
        const initial = assignee.EmpName ? assignee.EmpName.charAt(0).toUpperCase() : 'U';
        const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

        return `
            <div class="inline-flex items-center justify-center ${sizeClass} rounded-full bg-blue-100 text-blue-700" 
                 title="${assignee.EmpName || assignee.EmpNo || 'Unnamed'}">
                ${initial}
            </div>
        `;
    };
    const [tasksfilter , setTaksfilter] = useState<TaskDto[] | null>(null)

    useEffect(() => {
        if (data && data[0]?.TasksJson) {


            setTaksfilter(data[0].TasksJson)

            const toGanttTask = (task: TaskDto, parentId?: string): ExtendedTask | null => {
                const startStr = task.TaskStart ?? task.CreatedAt;
                const endStr = task.TaskEnd ?? task.TaskStart ?? task.CreatedAt;

                if (!startStr || !endStr) return null;

                const start = new Date(startStr);
                const end = new Date(endStr);

                if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

                // Ensure end date is at least 1 day after start date for visibility
                if (end.getTime() <= start.getTime()) {
                    end.setDate(start.getDate() + 1);
                }

                let progressValue = 0;
                if (task.Status?.toLowerCase() === 'completed') {
                    progressValue = 100;
                } else if (task.Status?.toLowerCase() === 'on progress') {
                    progressValue = 50;
                }


                // Create avatars for assignees (for task name)
                const getAssigneeAvatars = (assignees?: AssigneeDto[]) => {
                    if (!assignees || assignees.length === 0) return '';

                    if (assignees.length === 1) {
                        return getAvatarElement(assignees[0], 'sm');
                    }

                    const firstAvatar = getAvatarElement(assignees[0], 'sm');
                    return `${firstAvatar} <span class="ml-1 text-xs bg-gray-200 rounded-full px-1">+${assignees.length - 1}</span>`;
                };

                // Custom tooltip content with avatars
                const tooltipContent = `
                    <div class="p-3">
                        <div class="font-bold">${task.Title || `Task ${task.Id}`}</div>
                        ${task.Description ? `<div class="text-sm mt-1">${task.Description}</div>` : ''}
                        <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <div><span class="font-bold">Status:</span> ${task.Status || 'Not Set'}</div>
                            <div><span class="font-bold">Priority:</span> ${task.Priority || 'Not Set'}</div>
                            ${task.Category ? `<div><span class="font-bold">Category:</span> ${task.Category}</div>` : ''}
                            <div><span class="font-bold">Start:</span> ${start.toLocaleDateString()}</div>
                            <div><span class="font-bold">End:</span> ${end.toLocaleDateString()}</div>
                        </div>
                        ${task.Assignees && task.Assignees.length > 0 ?
                    `<div class="mt-2 border-t pt-1">
                                <div class="font-bold text-xs">Assignees:</div>
                                <div class="mt-1 flex flex-wrap gap-1">
                                    ${task.Assignees.map(a =>
                        `<div class="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs">
                                            ${getAvatarElement(a, 'sm')}
                                            <span class="ml-1">${a.EmpName || a.EmpNo || 'Unnamed'}</span>
                                        </div>`
                    ).join('')}
                                </div>
                            </div>`
                    : ''
                }
                    </div>
                `;

                const assigneeAvatars = getAssigneeAvatars(task.Assignees);
                const displayName = `
                    <div class="flex items-center">
                        <span class="mr-2">${task.Title || `Task ${task.Id}`}</span>
                        ${assigneeAvatars ? `<div class="flex items-center">${assigneeAvatars}</div>` : ''}
                    </div>
                `;

                return {
                    id: String(task.Id),
                    name: task.Title || `Task ${task.Id}`,  // Plain text for internal use
                    htmlName: displayName,  // HTML content for display
                    type: task.SubTasks?.length ? 'project' : 'task',
                    start,
                    end,
                    progress: progressValue,
                    isDisabled: false,
                    styles: {
                        backgroundColor:
                            task.Status?.toLowerCase() === 'completed'
                                ? '#4ade80'
                                : task.Status?.toLowerCase() === 'on progress'
                                    ? '#60a5fa'
                                    : '#facc15',
                        progressColor: '#1e293b',
                        progressSelectedColor: '#0f172a',
                        backgroundSelectedColor: '#e2e8f0',
                    },
                    dependencies: parentId ? [parentId] : [],
                    project: parentId ?? undefined,
                    hideChildren: false,
                    tooltip: tooltipContent,
                    // Store additional data for our custom tooltip
                    assignees: task.Assignees,
                    description: task.Description,
                    priority: task.Priority,
                    category: task.Category,
                    taskFinish: task.TaskFinish
                };
            };

            const flattenTasks = (tasks: TaskDto[], parentId?: string): ExtendedTask[] =>
                tasks.flatMap(task => {
                    const current = toGanttTask(task, parentId);
                    const subs = task.SubTasks?.length ? flattenTasks(task.SubTasks, String(task.Id)) : [];
                    return current ? [current, ...subs] : subs;
                });

            const flat = flattenTasks(data[0]?.TasksJson || []);
            setTasks(flat);
        }
    }, [data]);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    // Calculate project stats
    const projectStats = useMemo(() => {
        if (!tasks.length) return { total: 0, completed: 0, inProgress: 0, pending: 0 };

        const completed = tasks.filter(t => t.progress === 100).length;
        const inProgress = tasks.filter(t => t.progress > 0 && t.progress < 100).length;
        const pending = tasks.filter(t => t.progress === 0).length;

        return {
            total: tasks.length,
            completed,
            inProgress,
            pending,
            completionPercentage: Math.round((completed / tasks.length) * 100)
        };
    }, [tasks]);

    // Function to create avatar element for React component
    const createAvatar = (assignee: AssigneeDto, size: 'sm' | 'md' = 'sm') => {
        const initial = assignee.EmpName ? assignee.EmpName.charAt(0).toUpperCase() : 'U';
        const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

        return (
            <div
                className={`flex-shrink-0 flex items-center justify-center ${sizeClass} bg-blue-100 text-blue-700 rounded-full`}
                title={assignee.EmpName || assignee.EmpNo || 'Unnamed'}
            >
                {initial}
            </div>
        );
    };

    if (isLoading) return (
        <div className="flex items-center justify-center bg-white shadow rounded-xl p-8 min-h-64">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600 font-medium">Loading Gantt chart...</span>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 shadow rounded-xl p-6 border border-red-100">
            <div className="flex items-center text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="ml-2 font-semibold">Error loading tasks</h3>
            </div>
            <p className="mt-2 text-gray-600">Please check your connection or try again later.</p>
        </div>
    );

    return (
        <div className={`bg-white shadow rounded-xl overflow-hidden transition-all duration-300 ${isFullScreen ? 'fixed inset-4 z-50' : ''}`}>
            {/* Header with controls */}
            <ProjectTimelineHeader
                tasks={tasks}
                projectStats={projectStats}
                viewMode={viewMode}
                setViewMode={setViewMode}
                toggleFullScreen={toggleFullScreen}
                isFullScreen={isFullScreen}
              viewModes={viewModes}/>


            {/* Main content */}
            <div className="p-4">
                {tasks.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <Gantt
                                tasks={tasks.map(t => ({
                                    ...t,
                                    start: new Date(t.start),
                                    end: new Date(t.end),
                                }))}
                                viewMode={viewMode}
                                locale="en-GB"
                                columnWidth={viewMode === ViewMode.Day ? 60 : viewMode === ViewMode.Week ? 120 : 300}
                                listCellWidth=""
                                ganttHeight={isFullScreen ? window.innerHeight - 350 : 400}
                                todayColor="rgba(96, 165, 250, 0.15)"
                                barCornerRadius={4}
                                handleWidth={10}
                                barFill={75}
                                onSelect={(task:any) => setSelectedTask(task)}
                                onDoubleClick={(task:any) => setSelectedTask(task)}
                                TooltipContent={({ task } : {task:any}) => (
                                    <div className="p-3 min-w-64 bg-white shadow-lg rounded-md border border-gray-200">
                                        <div className="font-bold text-lg">{task.name}</div>
                                        {task.description && <div className="text-sm mt-1 text-gray-600">{task.description}</div>}
                                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                            <div><span className="font-medium text-gray-500">Status:</span> {task.progress === 100 ? 'Completed' : task.progress > 0 ? 'In Progress' : 'Pending'}</div>
                                            {task.priority && <div><span className="font-medium text-gray-500">Priority:</span> {task.priority}</div>}
                                            {task.category && <div><span className="font-medium text-gray-500">Category:</span> {task.category}</div>}
                                            <div><span className="font-medium text-gray-500">Start:</span> {task.start.toLocaleDateString()}</div>
                                            <div><span className="font-medium text-gray-500">End:</span> {task.end.toLocaleDateString()}</div>
                                        </div>
                                        {task.assignees && task.assignees.length > 0 && (
                                            <div className="mt-3 border-t border-gray-100 pt-2">
                                                <div className="font-medium text-sm text-gray-500">Assignees:</div>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {task.assignees.map((a, i) => (
                                                        <div key={i} className="flex items-center">
                                                            {createAvatar(a)}
                                                            <span className="ml-1 text-xs">{a.EmpName || a.EmpNo || 'Unnamed'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                TaskListHeader={
                                    () => <div className="font-medium px-3 py-2 bg-gray-100">Tasks</div>
                                }

                                TaskListTable={
                                    () =>     <div className="gantt-task-list-wrapper">
                                        {tasks.map(task => (
                                            <div
                                                key={task.id}
                                                className={`gantt-task-list-item px-3 py-2 border-b border-gray-200 ${
                                                    selectedTask?.id === task.id ? 'bg-blue-50' : ''
                                                }`}
                                                onClick={() => setSelectedTask(task)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="mr-2">{task.name}</div>
                                                    {task.assignees && task.assignees.length > 0 && (
                                                        <div className="flex -space-x-1">
                                                            {task.assignees.slice(0, 3).map((assignee, idx) => (
                                                                <div key={idx} className="relative z-10">
                                                                    {createAvatar(assignee, 'sm')}
                                                                </div>
                                                            ))}
                                                            {task.assignees.length > 3 && (
                                                                <div className="flex items-center justify-center w-6 h-6 text-xs bg-gray-200 text-gray-700 rounded-full">
                                                                    +{task.assignees.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />
                        </div>

                        {/* Task details panel */}
                        {selectedTask &&   <TaskDetailPanel setSelectedTask={setSelectedTask} selectedTask={selectedTask}
                                                            tasks={
                             data[0]?.TasksJson}
                        />}

                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <List className="h-12 w-12 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No tasks available</h3>
                        <p className="text-gray-500 mt-1">There are no tasks to display in the Gantt chart.</p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default TaskGantt;