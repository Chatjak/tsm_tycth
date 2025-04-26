'use client'

import React, { useState } from 'react';
import {
    X,
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    ChevronDown,
    FileText,
    CheckCircle,
    Clock8,
    PlusCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ProjectWithTasksDto, UserDto} from "@/features/project/types/projects.types";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {Menu, message} from "antd";


const getProject = async (projectId: number): Promise<ProjectWithTasksDto> => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/api/projects/${projectId}`
    );
    return response.data;
};

const createTask = async (taskData :{
    projectId: number;
    parentTaskId: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    taskStart?: string;
    taskEnd?: string;
    assignees: { id: number; empName: string }[];
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/api/tasks`,
        taskData
    );
    return response.data;
};


const getEmployee = async(): Promise<UserDto[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_IP}/api/users`);
    return response.data;
}

const AddSubTaskComponent = ({ projectId,taskId }
                             : { projectId: number,taskId:number }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Not start');
    const [priority, setPriority] = useState('Medium');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedAssignees, setSelectedAssignees] = useState<UserDto[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<{
        name: string;
        size: number;
        type: string;
    }[]>([]);

    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showAssigneesDropdown, setShowAssigneesDropdown] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const [assigneeSearch, setAssigneeSearch] = useState('');


    const queryClient = useQueryClient();

    const { data: project, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProject(projectId),
        enabled: isOpen,
    });

    const {data : employees} = useQuery({
        queryKey: ['employees'],
        queryFn: () => getEmployee(),
        enabled: isOpen,
    })

    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onSuccess: async() => {
            message.success('Task created successfully');
            await queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            resetForm();
            setIsOpen(false);
        },
        onError: () => {
            message.error('Failed to create task');
        },
    });


    const statusOptions = [
        { id: 'not_start', name: 'Not start', icon: <Clock8 size={16} className="text-gray-500" /> },
        { id: 'in_progress', name: 'In progress', icon: <Clock size={16} className="text-blue-500" /> },
        { id: 'over_due', name: 'Over due', icon: <AlertTriangle size={16} className="text-red-500" /> },
        { id: 'complete', name: 'Complete', icon: <CheckCircle size={16} className="text-green-500" /> }
    ];

    const priorityOptions = [
        { id: 'high', name: 'High', color: 'bg-red-500', textColor: 'text-red-500' },
        { id: 'medium', name: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-500' },
        { id: 'low', name: 'Low', color: 'bg-green-500', textColor: 'text-green-500' }
    ];

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus('Not start');
        setPriority('Medium');
        setStartDate('');
        setDueDate('');
        setSelectedAssignees([]);
        setAttachedFiles([]);
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase();
    };

    const handleAssigneeSelect = (user: UserDto) => {
        if (!selectedAssignees.some(assignee => assignee.id === user.id)) {
            setSelectedAssignees([...selectedAssignees, user]);
        }
        setShowAssigneesDropdown(false);
    };

    const handleRemoveAssignee = (userId: string | number) => {
        setSelectedAssignees(selectedAssignees.filter(assignee => assignee.id !== userId));
    };

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            setAttachedFiles([...attachedFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setAttachedFiles(attachedFiles.filter(file => file.name !== fileName));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('image')) return '🖼️';
        else if (fileType.includes('pdf')) return '📄';
        else if (fileType.includes('word') || fileType.includes('document')) return '📝';
        else if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
        else return '📎';
    };

    const toggleStatusDropdown = () => {
        setShowStatusDropdown(!showStatusDropdown);
        setShowPriorityDropdown(false);
        setShowAssigneesDropdown(false);
    };

    const togglePriorityDropdown = () => {
        setShowPriorityDropdown(!showPriorityDropdown);
        setShowStatusDropdown(false);
        setShowAssigneesDropdown(false);
    };

    const toggleAssigneesDropdown = () => {
        setShowAssigneesDropdown(!showAssigneesDropdown);
        setShowStatusDropdown(false);
        setShowPriorityDropdown(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const taskData = {
            projectId: projectId,
            parentTaskId: taskId,
            title,
            description,
            status,
            priority,
            taskStart: startDate || undefined,
            taskEnd: dueDate,
            assignees: selectedAssignees.map(assignee => ({
                id: assignee.id,
                empName: assignee.empName
            }))
        };

        createTaskMutation.mutate(taskData);
    };

    const getPriorityColor = (priorityName: string) => {
        const priorityOption = priorityOptions.find(opt => opt.name === priorityName);
        return priorityOption ? priorityOption.textColor : 'text-gray-500';
    };

    const getStatusIcon = (statusName: string) => {
        const statusOption = statusOptions.find(opt => opt.name === statusName);
        return statusOption ? statusOption.icon : <Clock8 size={16} className="text-gray-500" />;
    };

    const filteredAssignees = () => {
        if (!employees) return [];
        if (!assigneeSearch) return employees;

        return employees.filter(assignee =>
            assignee.empName.toLowerCase().includes(assigneeSearch.toLowerCase())
        );
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Menu.Item key="5" icon={<PlusCircle size={14}  className="text-green-600" />}>
                        <p  className="text-green-600">
                            Add subtask
                        </p>
                    </Menu.Item>
                </SheetTrigger>
                <SheetContent className="min-w-[80vw] overflow-auto ">
                    <SheetHeader>
                        <SheetTitle>Add New Task</SheetTitle>
                        <SheetDescription>
                            Create a new task for project: {project?.name || 'Loading...'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-6 relative">
                        <form onSubmit={handleSubmit}>
                            {/* Task Title */}
                            <div className="mb-6">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Task Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter task title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Task Description */}
                            <div className="mb-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe the task and provide relevant details"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            {/* Status & Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Status Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            onClick={toggleStatusDropdown}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {getStatusIcon(status)}
                                                    <span className="ml-2">{status}</span>
                                                </div>
                                                <ChevronDown size={16} />
                                            </div>
                                        </button>

                                        {showStatusDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                                                <ul className="py-1">
                                                    {statusOptions.map((option) => (
                                                        <li
                                                            key={option.id}
                                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setStatus(option.name);
                                                                setShowStatusDropdown(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                {option.icon}
                                                                <span className="ml-2">{option.name}</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Priority Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            onClick={togglePriorityDropdown}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                              priority === 'High' ? 'bg-red-500' :
                                  priority === 'Medium' ? 'bg-amber-500' :
                                      'bg-green-500'
                          }`}></span>
                                                    <span className={getPriorityColor(priority)}>{priority}</span>
                                                </div>
                                                <ChevronDown size={16} />
                                            </div>
                                        </button>

                                        {showPriorityDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                                                <ul className="py-1">
                                                    {priorityOptions.map((option) => (
                                                        <li
                                                            key={option.id}
                                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setPriority(option.name);
                                                                setShowPriorityDropdown(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                <span className={`w-3 h-3 rounded-full mr-2 ${option.color}`}></span>
                                                                <span className={option.textColor}>{option.name}</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Start Date */}
                                <div>
                                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <div className="flex">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Calendar size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="date"
                                                id="start-date"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Calendar size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="date"
                                                id="due-date"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assignees */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assignees <span className="text-red-500">*</span>
                                </label>

                                {/* Selected Assignees */}
                                {selectedAssignees.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedAssignees.map(assignee => (
                                            <div key={assignee.id} className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm">
                                                <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium mr-1">
                                                    {getInitials(assignee.empName)}
                                                </div>
                                                <span>{assignee.empName}</span>
                                                <button
                                                    type="button"
                                                    className="ml-1 text-blue-400 hover:text-blue-600"
                                                    onClick={() => handleRemoveAssignee(assignee.id)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <button
                                        type="button"
                                        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        onClick={toggleAssigneesDropdown}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Users size={16} className="text-gray-500 mr-2" />
                                                <span>{selectedAssignees.length > 0 ? 'Add more assignees' : 'Select assignees'}</span>
                                            </div>
                                            <ChevronDown size={16} />
                                        </div>
                                    </button>

                                    {showAssigneesDropdown && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                            <div className="p-2">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Search assignees..."
                                                    value={assigneeSearch}
                                                    onChange={(e) => setAssigneeSearch(e.target.value)}
                                                />
                                            </div>

                                            {isLoading ? (
                                                <div className="p-4 text-center text-gray-500">Loading assignees...</div>
                                            ) : (
                                                <ul className="py-1">
                                                    {filteredAssignees().map((user) => (
                                                        <li
                                                            key={user.id}
                                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => handleAssigneeSelect(user)}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                                                    {getInitials(user.empName)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">{user.empName}</span>
                                                                    <span className="text-xs text-gray-500">{user.empNo}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}

                                                    {filteredAssignees().length === 0 && (
                                                        <li className="px-4 py-2 text-center text-gray-500">
                                                            No assignees found
                                                        </li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedAssignees.length === 0 && (
                                    <p className="mt-1 text-xs text-red-500">At least one assignee is required</p>
                                )}
                            </div>

                            {/* File Attachments */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attachments
                                </label>

                                {/* Attached Files List */}
                                {attachedFiles.length > 0 && (
                                    <div className="mb-2 space-y-2">
                                        {attachedFiles.map((file, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md">
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-lg">{getFileIcon(file.type)}</span>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="text-gray-400 hover:text-gray-600"
                                                    onClick={() => handleRemoveFile(file.name)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FileText size={36} className="text-gray-400 mb-2" />
                                            <p className="mb-2 text-sm text-gray-700">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, PDF, DOC, XLS, CSV (max 10MB)
                                            </p>
                                        </div>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            onChange={handleFileAttach}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 sticky bg-white -bottom-5 border-t pt-2 right-0  w-full">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                    disabled={createTaskMutation.isPending || selectedAssignees.length === 0}
                                >
                                    {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>


                        </form>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default AddSubTaskComponent;