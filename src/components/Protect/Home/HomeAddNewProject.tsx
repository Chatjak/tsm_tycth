'use client'

import React from 'react';
import {Drawer, Form, Input, Typography, Button, message, FormProps, Tooltip} from "antd";
import { PlusOutlined, CloseOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import {Plus} from "lucide-react";

const { TextArea } = Input;
const { Title } = Typography;

const ProjectSchema = z.object({
    projectName: z.string().min(1, 'Project name is required'),
    projectDescription: z.string().optional(),
    projectOwner: z.string().optional()
});

export interface CreateProjectDto {
    name: string;
    description?: string;
    ownerId: number;
    projectStart?: string;
    projectEnd?: string;
    priority?: string;
}

type ProjectFormData = z.infer<typeof ProjectSchema>;
type FieldType = ProjectFormData;



const createProject = async (data: CreateProjectDto) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_IP}/api/projects`, data);
    return response.data;
};
const HomeAddNewProject = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            message.success('Project created successfully!');
            queryClient.invalidateQueries({ queryKey: ['projects', 1]});
            form.resetFields();
            setOpen(false);
        },
        onError: (e) => {
            console.log(`Error: ${e}`);
            message.error(`${e}`);
        }
    });

    const handleSubmit: FormProps<FieldType>['onFinish'] = (values) => {
        const parsed = ProjectSchema.safeParse(values);
        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            if (errors.projectName) {
                message.error(errors.projectName[0]);
            }
            return;
        }
        mutation.mutate({
            name : parsed.data.projectName,
            description : parsed.data.projectDescription,
            ownerId : 1,
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Add new project.">
                <button
                    className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"
                    onClick={() => setOpen(true)}
                >
                    <Plus size={16} />
                </button>
            </Tooltip>

            <Drawer
                open={open}
                onClose={handleCancel}
                title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <PlusOutlined className="mr-2 text-blue-500" />
                            <Title level={4} style={{ margin: 0 }}>Add New Project</Title>
                        </div>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={handleCancel}
                            className="border-none text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        />
                    </div>
                }
                closeIcon={false}
                width={420}
                footer={
                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={() => form.submit()} loading={mutation.isPending}>
                            Save
                        </Button>
                    </div>
                }
                bodyStyle={{ paddingBottom: 8 }}
                className="rounded-drawer"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-1">
                    <Form.Item
                        label="Title"
                        name="projectName"
                        rules={[{ required: true, message: 'Please enter project title' }]}
                    >
                        <Input
                            placeholder="Enter project name"
                            prefix={<FileTextOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="projectDescription"
                    >
                        <TextArea
                            placeholder="Enter project description"
                            rows={3}
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Owner"
                        name="projectOwner"
                    >
                        <Input
                            placeholder="Enter project owner"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default HomeAddNewProject;
