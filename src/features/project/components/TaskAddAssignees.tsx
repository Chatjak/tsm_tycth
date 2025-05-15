import React, { useState, useEffect } from 'react';
import { TaskDto } from "@/features/project/types/projects.types";
import { UserIcon, UserPlus, Users, Search, Check, X, UserCheck } from "lucide-react";
import { Modal, Transfer, Empty, message, Button, Input, Avatar, Spin } from "antd";
import { useGetEmployeesQuery } from "@/stores/redux/api/employeeApi";
import Image from "next/image";
import { useUpdateAssigneeMutation } from "@/stores/redux/api/assigneeApi";
import { motion, AnimatePresence } from "framer-motion";

const TaskAddAssignees = ({ task }: { task: TaskDto }) => {
    const [open, setOpen] = useState(false);
    const [targetKeys, setTargetKeys] = useState<string[] | React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const { data: employees, isLoading } = useGetEmployeesQuery();
    const [updateAssignee, { isLoading: isLoadingUpdate }] = useUpdateAssigneeMutation();

    useEffect(() => {
        if (task?.Assignees) {
            setTargetKeys(task.Assignees.map(a => String(a.AssigneeId)));
        }
    }, [task]);

    const employeeList = employees?.map((emp) => ({
        key: String(emp.id),
        title: emp.emp_name,
        description: emp.emp_no,
        avatar: null,
    })) || [];

    const handleSave = async () => {
        try {
            const assignee_ids = targetKeys.map(key => Number(key));
            await updateAssignee({
                params: { id: task.Id },
                body: {
                    id: task.Id,
                    assignee_ids,
                    project_id: task.ProjectId
                }
            });
            message.success({
                content: "Task assignees updated successfully!",
                style: {
                    borderRadius: "8px",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)"
                }
            });
            setOpen(false);
        } catch (err) {
            message.error({
                content: "Failed to update task assignees!",
                style: {
                    borderRadius: "8px",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)"
                }
            });
            console.error("Failed to update assignees:", err);
        }
    };

    // Function to generate a random pastel color based on name
    const getColorFromName = (name: string) => {
        const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
        return `hsl(${hue}, 70%, 85%)`;
    };

    const renderItem = (item: {
        key: string;
        title: string;
        description: string;
        avatar: string | null;
    }) => (
        <motion.div
            className="flex items-center gap-3 p-2 hover:bg-violet-50 rounded-lg transition-all cursor-pointer"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
        >
            {item.avatar ? (
                <Avatar
                    src={item.avatar}
                    alt={item.title}
                    className="rounded-full w-9 h-9 flex-shrink-0"
                />
            ) : (
                <Avatar
                    style={{ backgroundColor: getColorFromName(item.title) }}
                    className="rounded-full w-9 h-9 flex-shrink-0 flex items-center justify-center text-white font-medium"
                >
                    {item.title.charAt(0).toUpperCase()}
                </Avatar>
            )}
            <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-800 truncate">{item.title}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
            </div>
        </motion.div>
    );

    // Calculate if there are assignees already
    const hasAssignees = targetKeys.length > 0;

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={() => setOpen(true)}
                    type="text"
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all ${
                        hasAssignees
                            ? 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                            : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    icon={hasAssignees ? <UserCheck size={16} className="text-violet-500" /> : <UserPlus size={16} />}
                >
                    {hasAssignees ? `${targetKeys.length} Assignee${targetKeys.length > 1 ? 's' : ''}` : 'Add Assignees'}
                </Button>
            </motion.div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3 py-2">
                        <div className="bg-violet-100 rounded-full p-2">
                            <Users className="text-violet-600 w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium text-slate-800">Manage Task Assignees</span>
                    </div>
                }
                width={800}
                centered
                bodyStyle={{ padding: '20px' }}
                className="rounded-2xl overflow-hidden"
                maskStyle={{ backdropFilter: 'blur(2px)', background: 'rgba(0, 0, 0, 0.45)' }}
                footer={<div className={`flex items-center justify-end`}>
                    <Button
                        key="save"
                        onClick={async() => await handleSave()}
                        disabled={isLoadingUpdate}
                        className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white border-none shadow-sm hover:shadow min-w-[120px] flex items-center justify-center ml-2"
                        icon={isLoadingUpdate ? <Spin size="small" /> : <Check className="w-4 h-4 mr-1" />}
                    >
                        {isLoadingUpdate ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                        <Spin size="large" />
                        <p className="text-slate-500">Loading employees...</p>
                    </div>
                ) : employeeList.length === 0 ? (
                    <Empty
                        description="No employees found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="my-8"
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="text-sm text-slate-500 mb-2">
                            Select employees to assign to this task. You can search by name or employee ID.
                        </div>
                        <Transfer
                            dataSource={employeeList}
                            targetKeys={targetKeys}
                            onChange={nextKeys => setTargetKeys(nextKeys)}
                            titles={[
                                <div className="flex items-center gap-2" key="source">
                                    <UserIcon className="w-4 h-4 text-slate-500" />
                                    <span>Available Employees</span>
                                </div>,
                                <div className="flex items-center gap-2" key="target">
                                    <UserCheck className="w-4 h-4 text-violet-600" />
                                    <span>Task Assignees</span>
                                </div>
                            ]}
                            render={renderItem}
                            listStyle={{
                                width: '100%',
                                height: 400,
                                backgroundColor: '#fff',
                                borderRadius: '0.75rem',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                            }}
                            showSearch
                            oneWay={false}
                            pagination={{ pageSize: 6 }}
                            filterOption={(inputValue, item) =>
                                item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                                item.description.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            operations={['Add', 'Remove']}
                            operationStyle={{
                                color: '#6d28d9',
                            }}
                            showSelectAll={true}
                            locale={{
                                itemUnit: 'employee',
                                itemsUnit: 'employees',
                                searchPlaceholder: 'Search...',
                                notFoundContent: (
                                    <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                                        <Search className="w-5 h-5 mb-2 opacity-60" />
                                        <span>No matching employees</span>
                                    </div>
                                ),
                            }}
                        />

                        <div className="flex justify-between items-center text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                            <div>
                                {targetKeys.length} {targetKeys.length === 1 ? 'employee' : 'employees'} assigned
                            </div>
                            <div>
                                {employeeList.length} total employees
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default TaskAddAssignees;