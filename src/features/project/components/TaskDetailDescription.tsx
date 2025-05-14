'use client'

import React, {useEffect} from 'react';
import { TaskDto } from "@/features/project/types/projects.types";
import {DatePicker, Select, Divider, message} from "antd";
import { AlertTriangle, Calendar, LayoutList } from 'lucide-react';
import dayjs from "dayjs";
import {useUpdateTaskDueMutation, useUpdateTaskMutation} from "@/stores/redux/api/taskApi";


const { RangePicker } = DatePicker;

const TaskDetailDescription = ({ task }: { task: TaskDto }) => {

    const [updateTask, { isLoading, isSuccess }] = useUpdateTaskMutation();

    const [updateTaskDue, { isSuccess: isSuccessDue }] = useUpdateTaskDueMutation();

    useEffect(() => {
        if (isSuccess || isSuccessDue) {
            message.success("Task updated successfully");
        }
    }, [isSuccess,isSuccessDue]);


    const statusIcons = {
        'Not start': <div className="h-2 w-2 rounded-full bg-gray-400 mr-2" />,
        'On Progress': <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />,
        'In Review': <div className="h-2 w-2 rounded-full bg-amber-500 mr-2" />,
        'Completed': <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
    };

    const priorityColors = {
        'High': 'text-red-600',
        'Medium': 'text-amber-600',
        'Low': 'text-blue-600',
        'Normal': 'text-gray-600'
    };


    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6 transition-all hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-5 flex items-center">
                <LayoutList className="h-5 w-5 mr-2 text-indigo-600" />
                Task Details
            </h3>
            <Divider className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-1 2xl:grid-cols-3 gap-x-8 gap-y-6">
                <div className="flex flex-col space-y-3">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center">
                        Status
                    </div>
                    <Select
                        defaultValue={task.Status}
                        className="w-full"
                        onChange={async(value) => await updateTask({
                            params : {id : task.Id},
                            body: {
                                column : 'status',
                                id : task.Id,
                                value,
                                project_id : task.ProjectId
                            }
                        })}
                        loading={isLoading}
                        size="large"
                        options={[
                            { value: 'Not start', label: (
                                    <div className="flex items-center">
                                        {statusIcons['Not start']}
                                        <span>Not start</span>
                                    </div>
                                )},
                            { value: 'On Progress', label: (
                                    <div className="flex items-center">
                                        {statusIcons['On Progress']}
                                        <span>On Progress</span>
                                    </div>
                                )},
                            { value: 'Completed', label: (
                                    <div className="flex items-center">
                                        {statusIcons['Completed']}
                                        <span>Completed</span>
                                    </div>
                                )},
                        ]}
                        dropdownStyle={{ padding: '8px' }}
                    />
                </div>
                <div className="flex flex-col space-y-3">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center">
                        Priority
                    </div>
                    <Select
                        defaultValue={task.Priority || 'Normal'}
                        className="w-full"
                        size="large"
                        onChange={async(value) => await updateTask({
                            params : {id : task.Id},

                            body: {
                                column : 'priority',
                                id : task.Id,
                                value,
                                project_id : task.ProjectId
                            }
                        })}
                        options={[
                            { value: 'High', label: (
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                        <span className={priorityColors['High']}>High</span>
                                    </div>
                                )},
                            { value: 'Medium', label: (
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                        <span className={priorityColors['Medium']}>Medium</span>
                                    </div>
                                )},
                            { value: 'Low', label: (
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className={priorityColors['Low']}>Low</span>
                                    </div>
                                )},
                            { value: 'Normal', label: (
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className={priorityColors['Normal']}>Normal</span>
                                    </div>
                                )},
                        ]}
                        dropdownStyle={{ padding: '8px' }}
                    />
                </div>

                <div className="flex flex-col space-y-3">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center">
                        Timeline
                    </div>
                    <RangePicker
                        className="w-full"
                        size="large"
                        placeholder={['Start Date', 'End Date']}
                        value={[
                            task.TaskStart ? dayjs(task.TaskStart) : null,
                            task.TaskEnd ? dayjs(task.TaskEnd) : null,
                        ]}
                        suffixIcon={<Calendar className="h-4 w-4 text-indigo-600" />}
                        onChange={async (dates) => {
                            if (!dates || !dates[0] || !dates[1]) return;

                            await updateTaskDue({
                                params: { id: task.Id },
                                body: {
                                    id: task.Id,
                                    project_id: task.ProjectId,
                                    start_date: dates[0].format('YYYY-MM-DD'),
                                    end_date: dates[1].format('YYYY-MM-DD'),
                                },
                            });
                        }}

                    />
                </div>
            </div>
        </div>
    );
};

export default TaskDetailDescription;