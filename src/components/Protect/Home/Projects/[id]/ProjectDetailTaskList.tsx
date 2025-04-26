'use client'

import React, { useState } from 'react';
import {
    Avatar,
    Empty,
    Spin,
    Table,
    TableProps,
    Tag,
    Tooltip,
    Input,
    Select,
    Button,
    Dropdown,
    Menu,
    message
} from "antd";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { AssigneeDto, ProjectWithTasksDto, TaskDto } from "@/features/project/types/projects.types";
import { getProjects } from "@/components/Protect/Home/Projects/[id]/ProjectDetailOverviewComponent";
import dayjs from "dayjs";
import {
    AlertCircle,
    CheckCircle2,
    Circle,
    Clock,
    Search,
    Filter,
    SortAsc,
    ArrowUpDown,
    MoreHorizontal,
    Plus,
    Download,
    Calendar,
    CheckCheck,
    Clock8, PlusCircle,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import AddTaskComponent from "@/components/Protect/Home/Projects/[id]/AddTaskComponent";
import axios from "axios";
import AddSubTaskComponent from "@/components/Protect/Home/Projects/[id]/AddSubTaskComponent";

const { Option } = Select;

const ProjectDetailTaskList = ({id} : {id:string}) => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const queryClient = useQueryClient()
    const {
        data: project,
        isLoading,
        error,
        isError
    } = useQuery<ProjectWithTasksDto>({
        queryKey: ['project', id],
        queryFn: () => getProjects(id),
    });

    const getAvatarColor = (name: string | undefined) => {
        if (!name) return '#1890ff';
        const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#f56a00', '#7265e6'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };


    const {mutate:DeleteTask} = useMutation({
        mutationFn : async(id:number) => {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_IP}/api/tasks/${id}`)

            return res.data;
        },
        onSuccess:async () => {
            message.success('Task deleted successfully')
            await  queryClient.invalidateQueries({
                queryKey:['project', id]
            })
        },
        onError:async () => {
            message.error('Error deleting task')
        }
    })

    const getInitials = (name: string | undefined) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase();
    };

    const getPriorityColor = (priority: string | undefined) => {
        if (!priority) return '';

        switch(priority?.toLowerCase()) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        if (!status) return <Circle size={16} className="text-gray-400" />;

        switch(status.toLowerCase()) {
            case 'complete':
                return <CheckCheck size={16} className="text-green-500" />;
            case 'in progress':
                return <Clock size={16} className="text-blue-500" />;
            case 'not start':
                return <Clock8 size={16} className="text-gray-500" />;
            case 'over due':
                return <AlertCircle size={16} className="text-red-500" />;
            default:
                return <Circle size={16} className="text-gray-400" />;
        }
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return '';

        switch(status.toLowerCase()) {
            case 'complete':
                return 'success';
            case 'in progress':
                return 'processing';
            case 'not start':
                return 'default';
            case 'over due':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';

        const now = dayjs();
        const date = dayjs(dateString);
        const diffDays = date.diff(now, 'day');

        // Format the date
        const formattedDate = date.format('MMM D, YYYY');

        // Add a relative indicator for dates in next 7 days
        if (diffDays < 0) {
            return (
                <div className="flex flex-col">
                    <span className="text-red-600 font-medium">{formattedDate}</span>
                    <span className="text-xs text-red-500">{Math.abs(diffDays)} days overdue</span>
                </div>
            );
        } else if (diffDays === 0) {
            return (
                <div className="flex flex-col">
                    <span className="text-orange-600 font-medium">{formattedDate}</span>
                    <span className="text-xs text-orange-500">Due today</span>
                </div>
            );
        } else if (diffDays <= 3) {
            return (
                <div className="flex flex-col">
                    <span className="text-orange-600 font-medium">{formattedDate}</span>
                    <span className="text-xs text-orange-500">In {diffDays} days</span>
                </div>
            );
        } else if (diffDays <= 7) {
            return (
                <div className="flex flex-col">
                    <span className="text-blue-600 font-medium">{formattedDate}</span>
                    <span className="text-xs text-blue-500">In {diffDays} days</span>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col">
                    <span className="text-gray-600">{formattedDate}</span>
                    <span className="text-xs text-gray-500">In {diffDays} days</span>
                </div>
            );
        }
    };

    // Process tasks to include their subtasks properly for the table
    const processTasksWithSubtasks = (tasks: TaskDto[]) => {
        if (!tasks) return [];

        // Only include top-level tasks (no parentTaskId)
        return tasks.filter(task => !task.parentTaskId);
    };

    const filteredTasks = () => {
        if (!project || !project.tasks) return [];

        const allTasks = project.tasks;

        // First apply filters to all tasks
        const filteredAllTasks = allTasks.filter(task => {
            // Filter by search text
            const matchesSearch = searchText === '' ||
                task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchText.toLowerCase());

            // Filter by status
            const matchesStatus = statusFilter === null ||
                (task.status?.toLowerCase() === statusFilter.toLowerCase());

            // Filter by priority
            const matchesPriority = priorityFilter === null ||
                (task.priority?.toLowerCase() === priorityFilter.toLowerCase());

            return matchesSearch && matchesStatus && matchesPriority;
        });

        // Then get only the top-level tasks
        return processTasksWithSubtasks(filteredAllTasks);
    };

    const getStatusOptions = () => {
        const statuses = ['Not start', 'In progress', 'Over due', 'Complete'];
        return statuses.map(status => (
            <Option key={status.toLowerCase()} value={status.toLowerCase()}>
                <div className="flex items-center">
                    {getStatusIcon(status)}
                    <span className="ml-2">{status}</span>
                </div>
            </Option>
        ));
    };

    const getPriorityOptions = () => {
        const priorities = ['High', 'Medium', 'Low'];
        return priorities.map(priority => (
            <Option key={priority.toLowerCase()} value={priority.toLowerCase()}>
                <Tag color={getPriorityColor(priority)}>{priority}</Tag>
            </Option>
        ));
    };

    // Handle expanding/collapsing subtasks
    const handleExpand = (expanded: boolean, record: TaskDto) => {
        if (expanded) {
            setExpandedRowKeys([...expandedRowKeys, record.id]);
        } else {
            setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id));
        }
    };

    // Get subtasks for a task
    const getSubtasks = (parentId: number) => {
        if (!project || !project.tasks) return [];
        return project.tasks.filter(task => task.parentTaskId === parentId);
    };

    // Create expandable config for subtasks
    const expandableConfig = {
        expandedRowKeys,
        onExpand: handleExpand,
        expandIcon: ({ expanded, onExpand, record }: any) => {
            const hasSubtasks = getSubtasks(record.id).length > 0;
            if (!hasSubtasks) return <span className="w-5" />;

            return expanded ? (
                <ChevronDown
                    size={16}
                    className="cursor-pointer text-gray-500"
                    onClick={(e) => onExpand(record, e)}
                />
            ) : (
                <ChevronRight
                    size={16}
                    className="cursor-pointer text-gray-500"
                    onClick={(e) => onExpand(record, e)}
                />
            );
        },
        expandedRowRender: (record: TaskDto) => {
            const subtasks = getSubtasks(record.id);
            if (subtasks.length === 0) return null;

            return (
                <div className="pl-8 py-2">
                    <Table
                        dataSource={subtasks}
                        columns={taskColumns}
                        rowKey="id"
                        pagination={false}
                        rowClassName="hover:bg-gray-50 bg-gray-50/30"
                        className="subtask-table"
                        showHeader={false}
                    />
                </div>
            );
        },
        rowExpandable: (record: TaskDto) => getSubtasks(record.id).length > 0,
    };

    const taskColumns: TableProps<TaskDto>['columns'] = [
        {
            title: (
                <div className="flex items-center">
                    <span>Status</span>
                </div>
            ),
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: string) => (
                <Tag
                    className="px-2 py-1 flex items-center w-fit"
                    color={getStatusColor(status)}
                    icon={getStatusIcon(status)}
                >
                    <span className="ml-1">{status || 'Not start'}</span>
                </Tag>
            ),
            filters: [
                { text: 'Not start', value: 'not start' },
                { text: 'In progress', value: 'in progress' },
                { text: 'Over due', value: 'over due' },
                { text: 'Complete', value: 'complete' },
            ],
            onFilter: (value, record) => record.status?.toLowerCase() === value,
        },
        {
            title: 'Title / Description',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record) => (
                <div className="py-1">
                    <div className="font-medium text-gray-900">
                        {record.parentTaskId && (
                            <Tag color="blue" className="mr-2 text-xs">Sub-task</Tag>
                        )}
                        {title}
                    </div>
                    {record.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{record.description}</div>
                    )}
                </div>
            ),
            sorter: (a, b) => (a.title?.localeCompare(b.title || '') || 0),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            render: (priority: string) => (
                <Tag
                    className="px-2 py-1 border-0"
                    color={getPriorityColor(priority)}
                >
                    {priority || 'Normal'}
                </Tag>
            ),
            filters: [
                { text: 'High', value: 'high' },
                { text: 'Medium', value: 'medium' },
                { text: 'Low', value: 'low' },
            ],
            onFilter: (value, record) => record.priority?.toLowerCase() === value,
        },
        {
            title: (
                <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>Due Date</span>
                </div>
            ),
            dataIndex: 'taskEnd',
            key: 'taskEnd',
            width: 160,
            render: (date: string) => formatDate(date),
            sorter: (a, b) => {
                if (!a.taskEnd && !b.taskEnd) return 0;
                if (!a.taskEnd) return 1;
                if (!b.taskEnd) return -1;
                return new Date(a.taskEnd).getTime() - new Date(b.taskEnd).getTime();
            },
        },
        {
            title: 'Assignees',
            dataIndex: 'assignees',
            key: 'assignees',
            width: 150,
            render: (assignees: AssigneeDto[]) => (
                <div className="flex -space-x-2">
                    {assignees && assignees.length > 0 ? (
                        <>
                            {assignees.slice(0, 3).map((assignee) => (
                                <Tooltip key={assignee.id} title={assignee.empName || 'Unknown'}>
                                    <Avatar
                                        size="small"
                                        style={{
                                            backgroundColor: getAvatarColor(assignee.empName),
                                            border: '2px solid white'
                                        }}
                                    >
                                        {getInitials(assignee.empName)}
                                    </Avatar>
                                </Tooltip>
                            ))}
                            {assignees.length > 3 && (
                                <Tooltip title={`${assignees.length - 3} more assignees`}>
                                    <Avatar
                                        size="small"
                                        style={{
                                            backgroundColor: '#1890ff',
                                            border: '2px solid white'
                                        }}
                                    >
                                        +{assignees.length - 3}
                                    </Avatar>
                                </Tooltip>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-400 text-sm">No assignees</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_,record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <AddSubTaskComponent projectId={record.projectId} taskId={record.id}/>
                            <Menu.Divider />
                            <Menu.Item key="1" icon={<CheckCircle2 size={14} />}>
                                Mark as complete
                            </Menu.Item>
                            <Menu.Item key="2" icon={<Clock size={14} />}>
                                Change status
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="4" icon={<AlertCircle size={14} className="text-red-500" />} danger
                                       onClick={() => DeleteTask(record.id)}

                            >
                                Delete task
                            </Menu.Item>
                        </Menu>
                    }
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Button
                        type="text"
                        icon={<MoreHorizontal size={18} />}
                        className="flex items-center justify-center hover:bg-gray-100 rounded-full"
                    />
                </Dropdown>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100svh-64px)]">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg my-4 mx-auto max-w-3xl">
                <h3 className="text-lg font-semibold text-red-700">Error Loading Project</h3>
                <p className="text-red-600">{(error as Error).message}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100svh-64px)]">
                <Empty description="Project not found" />
            </div>
        );
    }

    // Count all tasks including subtasks
    const countAllTasks = project.tasks?.length || 0;
    const countCompleteTasks = project.tasks?.filter(t => t.status?.toLowerCase() === 'complete').length || 0;
    const countInProgressTasks = project.tasks?.filter(t => t.status?.toLowerCase() === 'in progress').length || 0;
    const countOverdueTasks = project.tasks?.filter(t => t.status?.toLowerCase() === 'over due').length || 0;

    const renderSubTasksRecursive = (parentTask: TaskDto): React.ReactNode => {
        const subtasks = getSubtasks(parentTask.id);
        if (subtasks.length === 0) return null;

        return (
            <Table
                dataSource={subtasks}
                columns={taskColumns}
                rowKey="id"
                pagination={false}
                showHeader={false}
                expandable={{
                    expandedRowRender: renderSubTasksRecursive,
                    rowExpandable: (record) => getSubtasks(record.id).length > 0
                }}
            />
        );
    };


    return (
        <div className="bg-white rounded-b-lg shadow-sm p-4 md:p-6 flex-1 overflow-auto">
            {/* Table filters and search */}
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Input
                            placeholder="Search tasks..."
                            prefix={<Search size={16} className="text-gray-400" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="rounded-md py-1 border-gray-300"
                        />
                    </div>

                    <Select
                        placeholder={
                            <div className="flex items-center">
                                <Filter size={14} className="mr-1" />
                                <span>Status</span>
                            </div>
                        }
                        allowClear
                        style={{ minWidth: 140 }}
                        onChange={(value) => setStatusFilter(value)}
                        className="rounded-md"
                    >
                        {getStatusOptions()}
                    </Select>

                    <Select
                        placeholder={
                            <div className="flex items-center">
                                <ArrowUpDown size={14} className="mr-1" />
                                <span>Priority</span>
                            </div>
                        }
                        allowClear
                        style={{ minWidth: 140 }}
                        onChange={(value) => setPriorityFilter(value)}
                        className="rounded-md"
                    >
                        {getPriorityOptions()}
                    </Select>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <AddTaskComponent projectId={id}/>
                </div>
            </div>

            {/* Task table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <Table
                    dataSource={filteredTasks()}
                    columns={taskColumns}
                    rowKey="id"
                    expandable={expandableConfig}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} parent tasks`
                    }}
                    rowClassName="hover:bg-gray-50"
                    className="custom-table"
                    locale={{
                        emptyText: (
                            <div className="py-8">
                                <Empty
                                    description={
                                        <div>
                                            <p className="text-gray-500 mb-1">No tasks found</p>
                                            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    }
                                />
                            </div>
                        )
                    }}
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={6}>
                                    <div className="flex justify-between items-center p-3 text-sm bg-gray-50">
                                        <div className="font-medium text-gray-600">
                                            Total Tasks: {countAllTasks} (including subtasks)
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <CheckCheck size={14} className="text-green-500" />
                                                <span>Complete: {countCompleteTasks}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-blue-500" />
                                                <span>In Progress: {countInProgressTasks}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <AlertCircle size={14} className="text-red-500" />
                                                <span>Overdue: {countOverdueTasks}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            {/* Add some custom styles for the table */}
            <style jsx global>{`
                .custom-table .ant-table-thead > tr > th {
                  background-color: #f9fafb;
                  font-weight: 500;
                  color: #374151;
                  border-bottom: 1px solid #e5e7eb;
                  padding: 12px 16px;
                }
                
                .custom-table .ant-table-tbody > tr > td {
                  padding: 12px 16px;
                  border-bottom: 1px solid #e5e7eb;
                }
                
                .custom-table .ant-table-row:last-child > td {
                  border-bottom: none;
                }
                
                .custom-table .ant-table-pagination {
                  margin: 16px;
                }
                
                .custom-table .ant-table-content {
                  border-radius: 8px;
                  overflow: hidden;
                }
                
                .subtask-table .ant-table-tbody > tr:last-child > td {
                  border-bottom: none;
                }
                
                .subtask-table .ant-table {
                  margin-bottom: 0;
                }
                
                .subtask-table .ant-table-cell-fix-left {
                  background-color: transparent !important;
                }
            `}</style>
        </div>
    );
};

export default ProjectDetailTaskList;