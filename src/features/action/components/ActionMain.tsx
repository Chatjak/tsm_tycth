'use client'

import React, { useState } from 'react';
import {
    Typography,
    Button,
    Input,
    DatePicker,
    Space,
    Divider,
    Avatar,
    Modal,
    Form,
    Upload,
    Tooltip,
    ConfigProvider, List,
} from 'antd';
import {
    PaperClipOutlined,
    SendOutlined,
    CheckOutlined,
    CloseOutlined,
    MessageOutlined,
    LinkOutlined,
    PictureOutlined,
    FileOutlined,
    CalendarOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { useGetProfileQuery } from "@/stores/redux/api/authApi";
import { ActionDetails } from "@/features/action/dto/ActionDtoSchema";
import ActionHeader from "@/features/action/components/ActionHeader";
import { formatDate } from "@/features/action/utils/ActionUtils";
import ActionDetailComponent from "@/features/action/components/ActionDetail";

// Import Shadcn UI Tabs components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Comment} from "postcss";
import ActionInformation from "@/features/action/components/ActionInformation";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Purple theme colors
const theme = {
    primaryColor: '#7b61ff',
    secondaryColor: '#f6f5ff'
};

const ActionMain = ({ taskData }:{taskData:ActionDetails}) => {
    const isAssigner = true;
    const { data: currentUser } = useGetProfileQuery();

    const [activeTab, setActiveTab] = useState('action'); // 'action' for action tab, 'review' for review tab
    const [progress, setProgress] = useState('');
    const [extensionRequest, setExtensionRequest] = useState({ reason: '', newDate: null });
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [comment, setComment] = useState('');
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: theme.primaryColor,
                },
            }}
        >
            <div className={`p-4`}>
                <ActionHeader taskData={taskData}/>

                <div className={`flex gap-4 bg-white/40 backdrop-blur-xs rounded-lg p-4 border-gray-300/10 shadow`}>
                    <div className={`w-2/3 min-h-[60vh]`}>

                        <Tabs
                            defaultValue="action"
                            value={activeTab}
                            onValueChange={(value) => setActiveTab(value)}
                            className="w-full mb-6"
                        >
                            <TabsList className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-1 w-full max-w-xs mx-auto flex justify-center">
                                <TabsTrigger value="action"    className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out">
                                    Detail
                                </TabsTrigger>
                                <TabsTrigger value="review"    className="flex-1 data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg transition-all duration-200 ease-in-out">
                                    Review & Approval
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="action" className="space-y-4 mt-4">
                                <ActionInformation taskData={taskData}/>
                            </TabsContent>

                            <TabsContent value="review" className="space-y-4 mt-4">
                                {/* Review Controls - Only for assigner and when task is waiting review */}
                                {isAssigner && taskData.status === 'Waiting Review' && (
                                    <div className="mb-6">
                                        <Title level={5}>ตรวจสอบและอนุมัติ</Title>
                                        <Space>
                                            <Button
                                                type="primary"
                                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                                icon={<CheckOutlined />}
                                            >
                                                อนุมัติ
                                            </Button>
                                            <Button
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => setShowRejectionModal(true)}
                                            >
                                                ไม่อนุมัติ
                                            </Button>
                                        </Space>
                                    </div>
                                )}

                                {/* Rejection Modal */}
                                <Modal
                                    title="เหตุผลที่ไม่อนุมัติ"
                                    open={showRejectionModal}
                                    onCancel={() => setShowRejectionModal(false)}
                                    footer={[
                                        <Button key="cancel" onClick={() => setShowRejectionModal(false)}>
                                            ยกเลิก
                                        </Button>,
                                        <Button
                                            key="submit"
                                            type="primary"
                                            danger
                                            disabled={!rejectionReason.trim()}
                                        >
                                            ไม่อนุมัติ
                                        </Button>
                                    ]}
                                >
                                    <Form layout="vertical">
                                        <Form.Item label="เหตุผล" required>
                                            <TextArea
                                                rows={3}
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                {/* Comments Section */}
                                <div className="mb-6">
                                    <Title level={5}>ความคิดเห็น</Title>
                                    <div className="flex mb-4 gap-2">
                                        <TextArea
                                            rows={2}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="เพิ่มความคิดเห็น..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            disabled={!comment.trim()}
                                        />
                                    </div>

                                    {/* Display comments */}
                                    {taskData.messages.length > 0 ? (
                                        <List
                                            className="comment-list"
                                            itemLayout="horizontal"
                                            dataSource={taskData.messages || []}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar src={item.user.profile} />}
                                                        title={
                                                            <div className="flex justify-between items-center">
                                                                <Text strong>{item.user.emp_name}</Text>
                                                                <Tooltip title={formatDate(item.created_at)}>
                                                                    <span className="text-gray-400 text-xs">{dayjs(item.created_at).format('DD MMM YYYY HH:mm')}</span>
                                                                </Tooltip>
                                                            </div>
                                                        }
                                                        description={<div className="text-sm text-gray-700">{item.comment_text}</div>}
                                                    />
                                                </List.Item>
                                            )}
                                        />

                                    ) : (
                                        <Text type="secondary" style={{ textAlign: 'center', display: 'block', padding: '16px 0' }}>
                                            ยังไม่มีความคิดเห็น
                                        </Text>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Activity Timeline */}
                        <div className="mt-8">
                            <Divider orientation="center">ประวัติการดำเนินการ</Divider>
                            <List
                                itemLayout="horizontal"
                                dataSource={taskData.activities || []}
                                renderItem={(activity, index) => (
                                    <List.Item key={index}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar style={{ backgroundColor: theme.primaryColor }}>
                                                    {activity.type === 'status_change' ? <SyncOutlined /> :
                                                        activity.type === 'extension_request' ? <CalendarOutlined /> :
                                                            activity.type === 'approval' ? <CheckOutlined /> :
                                                                activity.type === 'rejection' ? <CloseOutlined /> :
                                                                    <MessageOutlined />}
                                                </Avatar>
                                            }
                                            title={
                                                <span>
                                                    <Text strong>{activity.user.emp_name}</Text>
                                                    {activity.type === 'status_change' &&
                                                        ` เปลี่ยนสถานะจาก ${activity.from || 'เริ่มต้น'} เป็น ${activity.to}`}
                                                    {activity.type === 'extension_request' &&
                                                        ` ขอขยายเวลาถึง`}
                                                    {activity.type === 'approval' &&
                                                        ` อนุมัติงาน`}
                                                    {activity.type === 'rejection' &&
                                                        ` ไม่อนุมัติงาน: ${activity.reason}`}
                                                    {activity.type === 'action_completed' &&
                                                        ` บันทึกผลการดำเนินงาน`}
                                                </span>
                                            }
                                            description={formatDate(activity.created_at)}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>

                    <ActionDetailComponent taskData={taskData}/>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ActionMain;