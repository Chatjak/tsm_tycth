import React, {useState} from 'react'
import {Flag, BarChart2, Tag, X, Calendar, CheckCircle, AlertCircle, Circle, ChevronRight, Search} from 'lucide-react';
import {ExtendedTask} from "@/features/project/components/gantt/TaskGantt";
import {AssigneeDto, TaskDto} from "@/features/project/types/projects.types";
import {Button} from "@/components/ui/button";
import TaskComponent from "@/features/project/components/TaskComponent";
export default function TaskDetailPanel({
                                            selectedTask,
                                            setSelectedTask,
    tasks,
                                        }: {
    selectedTask: ExtendedTask;
    setSelectedTask: (task: ExtendedTask | null) => void;
    tasks:TaskDto[]
}) {



    const [selected , setSelected] = useState<TaskDto | null>(null)

    console.log({tasks})

    const createAvatar = (assignee:AssigneeDto, size:string) => {
        const initials = assignee.EmpName
            ? assignee.EmpName.split(' ').map(n => n[0]).join('').toUpperCase()
            : '?';

        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
        const colorIndex = initials.charCodeAt(0) % colors.length;

        return (
            <div className={`${colors[colorIndex]} text-white rounded-full flex items-center justify-center
        ${size === 'sm' ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-sm font-medium'}`}>
                {initials}
            </div>
        );
    };

    const getStatusIcon = (progress:number) => {
        if (progress === 100) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (progress > 0) return <Circle className="h-5 w-5 text-blue-500" />;
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    };

    const calculateDaysRemaining = () => {
        const today = new Date();
        const endDate = selectedTask?.end
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = calculateDaysRemaining();

    return (
        <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-5 border border-gray-100">
            <div className="bg-gradient-to-r p-5 bg-slate-50">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold flex items-center gap-4"><p>{selectedTask.name}</p>
                        <Button size={'sm'} variant={'secondary'} className={`bg-slate-100 hover:bg-slate-200`}
                                onClick={() => setSelected(tasks)}
                        >
                        <Search className={`text-blue-600 `}/>
                        </Button>
                    </div>
                    <button
                        onClick={() => setSelectedTask(null)}
                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {selectedTask.description && (
                    <div className="mb-5 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-700">{selectedTask.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Details */}
                    <div>
                        <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                            <ChevronRight className="h-5 w-5 text-blue-500" />
                            Task Details
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                    <Flag className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
                                    <div className="flex items-center">
                                        {getStatusIcon(selectedTask.progress)}
                                        <span className="ml-1 font-medium">
                      {selectedTask.progress === 100 ? 'Completed' :
                          selectedTask.progress > 0 ? 'In Progress' : 'Pending'}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {selectedTask.priority && (
                                <div className="flex items-center">
                                    <div className="bg-red-50 p-2 rounded-lg mr-3">
                                        <BarChart2 className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Priority</div>
                                        <div className="font-medium">{selectedTask.priority}</div>
                                    </div>
                                </div>
                            )}

                            {selectedTask.category && (
                                <div className="flex items-center">
                                    <div className="bg-purple-50 p-2 rounded-lg mr-3">
                                        <Tag className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Category</div>
                                        <div className="font-medium">{selectedTask.category}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <div className="bg-green-50 p-2 rounded-lg mr-3">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Timeline</div>
                                    <div className="font-medium">
                                        {selectedTask.start.toLocaleDateString()} - {selectedTask.end.toLocaleDateString()}
                                    </div>
                                    {daysRemaining > 0 && (
                                        <div className="text-xs mt-1 text-orange-500 font-medium">
                                            {daysRemaining} days remaining
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignees */}
                    {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                        <div>
                            <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                                <ChevronRight className="h-5 w-5 text-blue-500" />
                                Team Members
                            </h3>

                            <div className="bg-gray-50 rounded-lg p-4">
                                {selectedTask.assignees.map((assignee, index) => (
                                    <div key={index}
                                         className={`flex items-center p-3 bg-white rounded-lg shadow-sm mb-2 ${selectedTask.assignees !== undefined && index < selectedTask.assignees.length - 1 ? 'mb-3' : ''}`}
                                    >
                                        {createAvatar(assignee, 'md')}
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium">{assignee.EmpName || assignee.EmpNo || 'Unnamed'}</div>
                                            {assignee.EmpEmail && (
                                                <div className="text-sm text-gray-500">{assignee.EmpEmail}</div>
                                            )}
                                        </div>
                                        {assignee.AssignedAt && (
                                            <div className="text-xs bg-gray-100 py-1 px-2 rounded-full text-gray-500">
                                                Assigned: {new Date(assignee.AssignedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
            <TaskComponent selectedTask={selected} setSelectedTask={setSelected} />
        </>
    );
}