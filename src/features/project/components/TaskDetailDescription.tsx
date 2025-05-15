'use client'

import React, { useEffect, useState } from 'react';
import { TaskDto } from "@/features/project/types/projects.types";
import { DatePicker, Select, message, Tooltip } from "antd";
import { AlertTriangle, Calendar, LayoutList, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import dayjs from "dayjs";
import { useUpdateTaskDueMutation, useUpdateTaskMutation } from "@/stores/redux/api/taskApi";
import { motion, AnimatePresence } from "framer-motion";

const { RangePicker } = DatePicker;

const TaskDetailDescription = ({ task }: { task: TaskDto }) => {
    const [updateTask, { isLoading, isSuccess }] = useUpdateTaskMutation();
    const [updateTaskDue, { isSuccess: isSuccessDue }] = useUpdateTaskDueMutation();
    const [hoverState, setHoverState] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState(task.Status || 'Not start');
    const [currentPriority, setCurrentPriority] = useState(task.Priority || 'Normal');

    useEffect(() => {
        if (isSuccess || isSuccessDue) {
            message.success("Task updated successfully");
        }
    }, [isSuccess, isSuccessDue]);

    const statusOptions = [
        {
            value: 'Not start',
            label: 'Not start',
            color: '#9CA3AF',
            icon: <Clock className="h-4 w-4 mr-2" />
        },
        {
            value: 'On Progress',
            label: 'On Progress',
            color: '#6366F1',
            icon: <AlertCircle className="h-4 w-4 mr-2" />
        },
        {
            value: 'Completed',
            label: 'Completed',
            color: '#10B981',
            icon: <CheckCircle className="h-4 w-4 mr-2" />
        }
    ];

    const priorityOptions = [
        {
            value: 'High',
            label: 'High',
            color: '#EF4444',
            icon: <AlertTriangle className="h-4 w-4 mr-2" />
        },
        {
            value: 'Medium',
            label: 'Medium',
            color: '#F59E0B',
            icon: <AlertTriangle className="h-4 w-4 mr-2" />
        },
        {
            value: 'Low',
            label: 'Low',
            color: '#3B82F6',
            icon: <AlertTriangle className="h-4 w-4 mr-2" />
        },
        {
            value: 'Normal',
            label: 'Normal',
            color: '#6B7280',
            icon: <AlertTriangle className="h-4 w-4 mr-2" />
        }
    ];

    const getStatusColor = (status: string) => {
        const option = statusOptions.find(o => o.value === status);
        return option ? option.color : '#9CA3AF';
    };

    const getPriorityColor = (priority: string) => {
        const option = priorityOptions.find(o => o.value === priority);
        return option ? option.color : '#6B7280';
    };

    const handleStatusChange = async (value: string) => {
        setCurrentStatus(value);
        await updateTask({
            params: { id: task.Id },
            body: {
                column: 'status',
                id: task.Id,
                value,
                project_id: task.ProjectId
            }
        });
    };

    const handlePriorityChange = async (value: string) => {
        setCurrentPriority(value);
        await updateTask({
            params: { id: task.Id },
            body: {
                column: 'priority',
                id: task.Id,
                value,
                project_id: task.ProjectId
            }
        });
    };

    return (
        <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="bg-gradient-to-r from-violet-50 to-white px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 flex items-center">
                    <LayoutList className="h-5 w-5 mr-2 text-violet-600" />
                    Task Details
                </h3>
            </div>

            <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Section */}
                    <motion.div
                        className="flex flex-col space-y-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        onMouseEnter={() => setHoverState('status')}
                        onMouseLeave={() => setHoverState(null)}
                    >
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center">
                            Status
                            <span
                                className="ml-2 w-2 h-2 rounded-full"
                                style={{ backgroundColor: getStatusColor(currentStatus) }}
                            />
                        </div>

                        <Select
                            value={currentStatus}
                            className="w-full"
                            onChange={handleStatusChange}
                            loading={isLoading}
                            size="large"
                            bordered={true}
                            popupClassName="modern-select-dropdown"
                            dropdownStyle={{
                                borderRadius: '0.75rem',
                                padding: '8px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                            }}
                            options={statusOptions.map(option => ({
                                value: option.value,
                                label: (
                                    <div className="flex items-center py-1">
                                        <div className="h-3 w-3 rounded-full mr-3" style={{ backgroundColor: option.color }} />
                                        <span style={{ color: option.color, fontWeight: 500 }}>{option.label}</span>
                                    </div>
                                )
                            }))}
                        />

                        <AnimatePresence>
                            {hoverState === 'status' && (
                                <motion.div
                                    className="text-xs text-slate-500 mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Update the task status to track progress
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Priority Section */}
                    <motion.div
                        className="flex flex-col space-y-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        onMouseEnter={() => setHoverState('priority')}
                        onMouseLeave={() => setHoverState(null)}
                    >
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center">
                            Priority
                            <Tooltip title={`Current: ${currentPriority}`}>
                                <span
                                    className="ml-2 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: getPriorityColor(currentPriority) }}
                                />
                            </Tooltip>
                        </div>

                        <Select
                            value={currentPriority}
                            className="w-full"
                            size="large"
                            onChange={handlePriorityChange}
                            bordered={true}
                            popupClassName="modern-select-dropdown"
                            dropdownStyle={{
                                borderRadius: '0.75rem',
                                padding: '8px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                            }}
                            options={priorityOptions.map(option => ({
                                value: option.value,
                                label: (
                                    <div className="flex items-center py-1">
                                        <AlertTriangle className="h-4 w-4 mr-3" style={{ color: option.color }} />
                                        <span style={{ color: option.color, fontWeight: 500 }}>{option.label}</span>
                                    </div>
                                )
                            }))}
                        />

                        <AnimatePresence>
                            {hoverState === 'priority' && (
                                <motion.div
                                    className="text-xs text-slate-500 mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Set the importance level of this task
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Timeline Section */}
                    <motion.div
                        className="flex flex-col space-y-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        onMouseEnter={() => setHoverState('timeline')}
                        onMouseLeave={() => setHoverState(null)}
                    >
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center">
                            <span>Timeline</span>
                            {task.TaskStart && task.TaskEnd && (
                                <Tooltip title={`${dayjs(task.TaskStart).format('MMM D')} - ${dayjs(task.TaskEnd).format('MMM D, YYYY')}`}>
                                    <span className="ml-2 px-2 py-0.5 text-[10px] bg-violet-100 text-violet-700 rounded-full">
                                        {dayjs(task.TaskEnd).diff(dayjs(task.TaskStart), 'day')} days
                                    </span>
                                </Tooltip>
                            )}
                        </div>

                        <RangePicker
                            className="w-full rounded-lg shadow-sm border-slate-200 focus:border-violet-500 hover:border-violet-400"
                            size="large"
                            placeholder={['Start Date', 'End Date']}
                            value={[
                                task.TaskStart ? dayjs(task.TaskStart) : null,
                                task.TaskEnd ? dayjs(task.TaskEnd) : null,
                            ]}
                            suffixIcon={<Calendar className="h-4 w-4 text-violet-600" />}
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
                            popupStyle={{
                                borderRadius: '0.75rem',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                            }}
                        />

                        <AnimatePresence>
                            {hoverState === 'timeline' && (
                                <motion.div
                                    className="text-xs text-slate-500 mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Set start and end dates for task scheduling
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
};

export default TaskDetailDescription;