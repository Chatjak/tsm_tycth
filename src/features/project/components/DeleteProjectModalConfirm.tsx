'use client';

import React, { useState } from 'react';
import { Trash2 } from "lucide-react";
import { Modal, message } from "antd";
import { useDeleteProjectMutation } from "@/stores/redux/api/projectApi";

const DeleteProjectModalConfirm = ({ id }: { id: number }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteProject, { isLoading }] = useDeleteProjectMutation();

    const handleDelete = async () => {
        try {
            await deleteProject({ id }).unwrap();
            message.success('Project deleted successfully');
        } catch (error) {
            message.error(`${error}` || 'Failed to delete project');
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <div
                className=" flex items-center gap-4 cursor-pointer text-destructive hover:bg-destructive/10"
                onClick={() => setIsModalOpen(true)}
            >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete Project</span>
            </div>

            <Modal
                title="ยืนยันการลบโปรเจกต์"
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                okText="ลบเลย"
                cancelText="ยกเลิก"
                okButtonProps={{ danger: true, loading: isLoading }}
            >
                <p>คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </Modal>
        </>
    );
};

export default DeleteProjectModalConfirm;
