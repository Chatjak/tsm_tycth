'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal, Input, Form, message } from "antd";
import {useCreateProjectMutation} from "@/stores/redux/api/projectApi";
import {useAppSelector} from "@/stores/redux/hooks";

const AddProjectModal = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const {user} = useAppSelector(state => state.auth);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await createProject({
                body:{
                    name: values.name,
                    description: values.description,
                    owner_id: user ? Number(user.id) : 0,
                }
            }).unwrap();
            message.success("Project created successfully");
            handleClose();
        } catch {
            message.error("Failed to create project");
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 rounded-full hover:bg-sidebar-highlight/20"
                onClick={handleOpen}
            >
                <Plus className="w-4 h-4" />
                <span className="sr-only">Add Project</span>
            </Button>

            <Modal
                open={open}
                onCancel={handleClose}
                onOk={handleSubmit}
                confirmLoading={isLoading}
                title="Create New Project"
                okText="Create"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please enter project name' }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter project description' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Enter project description" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddProjectModal;
