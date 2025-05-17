'use client'

import React, { useState, useEffect } from 'react';
import {Avatar, Button, List, Upload, Typography, Input, message, Space} from "antd";
import {
    CloseOutlined,
    FileOutlined,
    LinkOutlined,
    PaperClipOutlined,
    PictureOutlined,
    RightOutlined,
    SendOutlined,
    CheckOutlined
} from "@ant-design/icons";
import {ActionDetails} from "@/features/action/dto/ActionDtoSchema";
import {theme} from "@/features/task/utils/StyleUtils";
import {useUpdateActionStatusMutation} from "@/stores/redux/api/actionApi";

const {Text, Title} = Typography;
const {TextArea} = Input;

const ActionInformation = ({taskData} : {taskData:ActionDetails}) => {
    const [progress, setProgress] = useState<string>('');
    const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);
    const [isSubmitHovered, setIsSubmitHovered] = useState<boolean>(false);
    const [isButtonAnimating, setIsButtonAnimating] = useState<boolean>(false);
    const fileList = [];
    const [links, setLinks] = useState<{ url: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [updateActionStatus] = useUpdateActionStatusMutation()

    // Animation effect when component mounts
    useEffect(() => {
        if (taskData.status === 'Not start') {
            setIsButtonAnimating(true);
            const timer = setTimeout(() => setIsButtonAnimating(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [taskData.status]);

    // For pulse effect
    useEffect(() => {
        if (taskData.status === 'Not start') {
            const interval = setInterval(() => {
                setIsButtonAnimating(true);
                setTimeout(() => setIsButtonAnimating(false), 1000);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [taskData.status]);

    const handleSubmit = async () => {
        if (!progress.trim()) {
            message.warning('กรุณากรอกรายละเอียดผลการดำเนินงาน');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateActionStatus({
                action_id: taskData.id,
                status: 'Review',
            });
            message.success('ส่งงานเพื่อตรวจสอบเรียบร้อยแล้ว');
        } catch (error) {
            message.error('เกิดข้อผิดพลาด: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {taskData.status === 'Not start' && (
                <div className="flex items-center justify-center py-10">
                    <Button
                        type="primary"
                        className={`transition-all duration-300 ease-in-out transform ${
                            isButtonHovered ? 'scale-105' : ''
                        } ${isButtonAnimating ? 'animate-pulse' : ''}`}
                        style={{
                            background: theme.bgGradient,
                            borderColor: 'transparent',
                            fontSize: '16px',
                            padding: '8px 30px',
                            height: '52px',
                            borderRadius: '10px',
                            boxShadow: isButtonHovered
                                ? '0 8px 24px rgba(99, 102, 241, 0.45)'
                                : '0 6px 16px rgba(99, 102, 241, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                        onClick={async() => await updateActionStatus({
                            action_id : taskData.id,
                            status : 'On Progress',
                            from : taskData.status,
                            to : 'On Progress',
                            reason:null,
                            type :'status_change'
                        }).then(() => message.success('Update status success')).catch(error => message.error(error.message))
                        }
                    >
                        {/* Animated gradient overlay */}
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent)`,
                                backgroundSize: '200% 200%',
                                animation: isButtonHovered ? 'shimmer 1.5s infinite' : 'none',
                            }}
                        />

                        <span className="relative z-10 font-medium">START PROGRESS</span>
                        <RightOutlined
                            className={`relative z-10 transition-transform duration-300 ${
                                isButtonHovered ? 'translate-x-1' : ''
                            }`}
                        />
                    </Button>
                </div>
            )}
            {(taskData.status === 'On Progress' || taskData.status === 'Rejected') && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={5}>บันทึกผลการดำเนินงาน</Title>
                    </div>

                    <TextArea
                        rows={4}
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        placeholder="รายละเอียดผลการดำเนินงาน"
                        className="mb-4"
                        status={!progress.trim() && taskData.status === 'Rejected' ? 'error' : ''}
                    />

                    {/* Help text for rejected status */}
                    {taskData.status === 'Rejected' && (
                        <div className="mb-4 p-3 bg-red-50 rounded-md border border-red-100">
                            <Text type="danger">
                                <strong>งานถูกส่งกลับมาแก้ไข</strong> - กรุณาแก้ไขและกรอกรายละเอียดผลการดำเนินงานใหม่
                            </Text>
                        </div>
                    )}

                    {/* File attachments */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <Title level={5}>แนบไฟล์/ภาพ</Title>
                            <Upload
                                multiple={true}
                                beforeUpload={() => false} // Prevent auto upload
                                showUploadList={false}
                            >
                                <Button icon={<PaperClipOutlined />} type="primary" ghost>เลือกไฟล์</Button>
                            </Upload>
                        </div>
                        <Text type="secondary" className="block mb-2">
                            สามารถแนบได้หลายไฟล์
                        </Text>
                        {fileList.length > 0 && (
                            <List
                                bordered
                                dataSource={fileList}
                                renderItem={(file, index) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key={index}
                                                type="text"
                                                danger
                                                icon={<CloseOutlined />}
                                            />
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar icon={
                                                    file.type && file.type.includes('image') ?
                                                        <PictureOutlined /> : <FileOutlined />
                                                } />
                                            }
                                            title={file.name}
                                            description={`${(file.size / 1024).toFixed(1)} KB`}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                        {fileList.length === 0 && (
                            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center bg-gray-50">
                                <PaperClipOutlined style={{ fontSize: '24px', color: '#bbb', marginBottom: '8px' }} />
                                <p className="text-gray-500">ยังไม่มีไฟล์แนบ</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action buttons for On Progress status */}
            {taskData.status === 'On Progress' && (
                <div className="mt-6 flex justify-end">
                    <Space>
                        <Button>บันทึกร่าง</Button>
                        <Button
                            type="primary"
                            className={`transition-all duration-300 ease-in-out transform ${
                                isSubmitHovered ? 'scale-105' : ''
                            }`}
                            style={{
                                background: theme.successColor,
                                borderColor: 'transparent',
                                boxShadow: isSubmitHovered
                                    ? '0 6px 16px rgba(16, 185, 129, 0.4)'
                                    : '0 4px 12px rgba(16, 185, 129, 0.3)',
                            }}
                            disabled={!progress.trim()}
                            loading={isSubmitting}
                            onMouseEnter={() => setIsSubmitHovered(true)}
                            onMouseLeave={() => setIsSubmitHovered(false)}
                            onClick={handleSubmit}
                            icon={<CheckOutlined />}
                        >
                            ส่งตรวจสอบ
                        </Button>
                    </Space>
                </div>
            )}

            {/* CSS for the shimmer animation */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% {
                        background-position: -100% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
                    }
                    50% {
                        transform: scale(1.03);
                        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
                    }
                }

                .animate-pulse {
                    animation: pulse 1s ease;
                }
            `}</style>
        </>
    );
};

export default ActionInformation;