'use client'

import React, { useState } from 'react';
import {
    Card,
    Typography,
    Button,
    Input,
    Select,
    DatePicker,
    Space,
    Divider,
    Tag,
    Row,
    Col,
    Avatar,
    Modal,
    Form,
    List,
    Upload,
    Steps,
    Tabs,
    message,
    Comment,
    Tooltip,
    Badge
} from 'antd';
import {
    PaperClipOutlined,
    SendOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    MessageOutlined,
    LinkOutlined,
    PictureOutlined,
    FileOutlined,
    CalendarOutlined,
    SyncOutlined,
    UploadOutlined,
    InboxOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('th');

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Dragger } = Upload;

// Purple theme colors
const theme = {
    primaryColor: '#7b61ff',
    secondaryColor: '#f6f5ff'
};

const TaskAction = ({ task, currentUser = 'Chatjak', isAssigner = false }) => {
    // Current date from the user's input
    const currentDate = dayjs('2025-05-15 15:57:59');

    // Demo task data
    const [taskData, setTaskData] = useState(task || {
        id: 'TASK-2025-001',
        title: 'Create Q2 Marketing Campaign',
        description: 'Develop a comprehensive marketing campaign for the second quarter focusing on our new product line.',
        status: 'Not Started', // Not Started, In Progress, Waiting Review, Completed, Rejected
        dueDate: '2025-05-30T10:00:00Z',
        createdAt: '2025-05-10T09:00:00Z',
        assignee: {
            id: 'user123',
            name: 'Chatjak',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male'
        },
        assigner: {
            id: 'manager456',
            name: 'Somchai',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&i=2'
        },
        activities: [
            {
                type: 'status_change',
                from: null,
                to: 'Not Started',
                timestamp: '2025-05-10T09:00:00Z',
                user: 'Somchai'
            }
        ],
        comments: []
    });

    const [activeTab, setActiveTab] = useState('1'); // '1' for action tab, '2' for review tab
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

    // Status management
    const updateStatus = (newStatus) => {
        const timestamp = currentDate.toISOString();

        setTaskData(prev => ({
            ...prev,
            status: newStatus,
            activities: [
                ...prev.activities,
                {
                    type: 'status_change',
                    from: prev.status,
                    to: newStatus,
                    timestamp,
                    user: currentUser
                }
            ]
        }));

        message.success(`สถานะถูกเปลี่ยนเป็น ${newStatus} เรียบร้อยแล้ว`);
    };

    // Calculate delay in days
    const calculateDelay = () => {
        if (!taskData.dueDate) return 0;

        const dueDate = dayjs(taskData.dueDate);

        if (currentDate <= dueDate) return 0;

        const diffDays = currentDate.diff(dueDate, 'day');
        return diffDays;
    };

    // Handle file upload
    const handleFileUpload = (info) => {
        let newFileList = [...info.fileList];

        // Limit the number of files if needed
        // newFileList = newFileList.slice(-5);

        setFileList(newFileList);
    };

    // Handle link addition
    const handleAddLink = () => {
        if (newLink.trim()) {
            setLinks([...links, { url: newLink.trim(), addedAt: currentDate.toISOString() }]);
            setNewLink('');
            setShowLinkModal(false);
            message.success('เพิ่มลิงก์เรียบร้อยแล้ว');
        }
    };

    // Handle submit for review
    const handleSubmitForReview = () => {
        // Update progress and status
        const timestamp = currentDate.toISOString();

        setTaskData(prev => ({
            ...prev,
            status: 'Waiting Review',
            activities: [
                ...prev.activities,
                {
                    type: 'action_completed',
                    details: progress,
                    attachments: fileList.length,
                    links: links.length,
                    timestamp,
                    user: currentUser
                },
                {
                    type: 'status_change',
                    from: prev.status,
                    to: 'Waiting Review',
                    timestamp,
                    user: currentUser
                }
            ]
        }));

        message.success('ส่งงานเพื่อตรวจสอบเรียบร้อยแล้ว');
    };

    // Handle approval
    const handleApprove = () => {
        const timestamp = currentDate.toISOString();

        setTaskData(prev => ({
            ...prev,
            status: 'Completed',
            activities: [
                ...prev.activities,
                {
                    type: 'approval',
                    timestamp,
                    user: currentUser
                },
                {
                    type: 'status_change',
                    from: prev.status,
                    to: 'Completed',
                    timestamp,
                    user: currentUser
                }
            ]
        }));

        message.success('อนุมัติงานเรียบร้อยแล้ว');
    };

    // Handle rejection
    const handleReject = () => {
        if (!rejectionReason.trim()) return;

        const timestamp = currentDate.toISOString();

        setTaskData(prev => ({
            ...prev,
            status: 'In Progress',
            activities: [
                ...prev.activities,
                {
                    type: 'rejection',
                    reason: rejectionReason,
                    timestamp,
                    user: currentUser
                },
                {
                    type: 'status_change',
                    from: prev.status,
                    to: 'In Progress',
                    timestamp,
                    user: currentUser
                }
            ]
        }));

        setRejectionReason('');
        setShowRejectionModal(false);
        message.error('งานถูกส่งกลับเพื่อแก้ไข');
    };

    // Handle extension request
    const handleExtensionRequest = () => {
        if (!extensionRequest.reason.trim() || !extensionRequest.newDate) return;

        const timestamp = currentDate.toISOString();

        setTaskData(prev => ({
            ...prev,
            activities: [
                ...prev.activities,
                {
                    type: 'extension_request',
                    reason: extensionRequest.reason,
                    requestedDate: extensionRequest.newDate.format('YYYY-MM-DD'),
                    timestamp,
                    user: currentUser
                }
            ]
        }));

        setExtensionRequest({ reason: '', newDate: null });
        setShowExtensionModal(false);
        message.info('ส่งคำขอขยายเวลาเรียบร้อยแล้ว');
    };

    // Handle adding comment
    const handleAddComment = () => {
        if (!comment.trim()) return;

        const timestamp = currentDate.toISOString();

        setTaskData(prev => ({
            ...prev,
            comments: [
                ...prev.comments,
                {
                    id: `comment-${Date.now()}`,
                    text: comment,
                    timestamp,
                    user: {
                        name: currentUser,
                        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male'
                    }
                }
            ]
        }));

        setComment('');
        message.success('เพิ่มความคิดเห็นเรียบร้อยแล้ว');
    };

    // Format date for display
    const formatDate = (dateString) => {
        return dayjs(dateString).format('D MMMM YYYY เวลา HH:mm น.');
    };

    // Get current step number for stepper
    const getCurrentStep = () => {
        switch(taskData.status) {
            case 'Not Started': return 0;
            case 'In Progress': return 1;
            case 'Waiting Review': return 2;
            case 'Completed': return 3;
            case 'Rejected': return 1; // Goes back to In Progress
            default: return 0;
        }
    };

    // Get status tag color
    const getStatusColor = (status) => {
        switch(status) {
            case 'Not Started': return 'default';
            case 'In Progress': return 'processing';
            case 'Waiting Review': return 'warning';
            case 'Completed': return 'success';
            case 'Rejected': return 'error';
            default: return 'default';
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <Title level={4} style={{ marginBottom: '8px' }}>{taskData.title}</Title>
                            <Paragraph type="secondary">{taskData.description}</Paragraph>
                        </div>
                        <Tag color={getStatusColor(taskData.status)} style={{ fontSize: '14px' }}>
                            {taskData.status}
                        </Tag>
                    </div>
                }
                style={{ borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
                {/* Task Info */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={12}>
                        <Text strong>มอบหมายโดย:</Text> {taskData.assigner.name}
                        <br />
                        <Text strong>ผู้รับผิดชอบ:</Text> {taskData.assignee.name}
                    </Col>
                    <Col span={12}>
                        <Text strong>สร้างเมื่อ:</Text> {formatDate(taskData.createdAt)}
                        <br />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text strong>กำหนดส่ง:</Text> {formatDate(taskData.dueDate)}
                            {calculateDelay() > 0 && (
                                <Tag color="error" style={{ marginLeft: '8px' }}>
                                    <ClockCircleOutlined /> ล่าช้า {calculateDelay()} วัน
                                </Tag>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Workflow Steps */}
                <Steps current={getCurrentStep()} style={{ marginBottom: '32px' }}>
                    <Step title="Not Started" />
                    <Step title="In Progress" />
                    <Step title="Waiting Review" />
                    <Step title="Completed" />
                </Steps>

                {/* Tabs */}
                <Tabs
                    defaultActiveKey="1"
                    onChange={setActiveTab}
                    style={{
                        marginBottom: '24px',
                        '& .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn': { color: theme.primaryColor },
                        '& .ant-tabs-ink-bar': { backgroundColor: theme.primaryColor }
                    }}
                >
                    <TabPane tab="ดำเนินการงาน" key="1">
                        {/* Status Controls - only show for non-completed tasks */}
                        {taskData.status !== 'Completed' && (
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={5}>ปรับสถานะงาน</Title>
                                <Space>
                                    {taskData.status === 'Not Started' && (
                                        <Button
                                            type="primary"
                                            onClick={() => updateStatus('In Progress')}
                                            style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                                        >
                                            เริ่มดำเนินการ
                                        </Button>
                                    )}

                                    {(taskData.status === 'In Progress' || taskData.status === 'Rejected') && (
                                        <Button
                                            type="primary"
                                            onClick={handleSubmitForReview}
                                            disabled={!progress.trim()}
                                            style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                                        >
                                            ส่งตรวจสอบ
                                        </Button>
                                    )}

                                    {taskData.status !== 'Completed' && taskData.status !== 'Waiting Review' && (
                                        <Button
                                            icon={<CalendarOutlined />}
                                            onClick={() => setShowExtensionModal(true)}
                                        >
                                            ขอขยายเวลา
                                        </Button>
                                    )}
                                </Space>
                            </div>
                        )}

                        {/* Task Progress Input - only show for in progress tasks */}
                        {(taskData.status === 'In Progress' || taskData.status === 'Rejected') && (
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={5}>บันทึกผลการดำเนินงาน</Title>
                                <TextArea
                                    rows={4}
                                    value={progress}
                                    onChange={(e) => setProgress(e.target.value)}
                                    placeholder="รายละเอียดผลการดำเนินงาน"
                                    style={{ marginBottom: '16px' }}
                                />

                                {/* File attachments */}
                                <div style={{ marginBottom: '16px' }}>
                                    <Title level={5}>แนบไฟล์/ภาพ</Title>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Upload
                                            fileList={fileList}
                                            onChange={handleFileUpload}
                                            multiple={true}
                                            beforeUpload={() => false} // Prevent auto upload
                                            showUploadList={false}
                                        >
                                            <Button icon={<PaperClipOutlined />}>เลือกไฟล์</Button>
                                        </Upload>
                                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                                            สามารถแนบได้หลายไฟล์
                                        </Text>
                                    </div>

                                    {/* Display attachments */}
                                    {fileList.length > 0 && (
                                        <List
                                            bordered
                                            dataSource={fileList}
                                            renderItem={(file, index) => (
                                                <List.Item
                                                    actions={[
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<CloseOutlined />}
                                                            onClick={() => setFileList(fileList.filter((_, i) => i !== index))}
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
                                </div>

                                {/* Link attachments */}
                                <div style={{ marginBottom: '16px' }}>
                                    <Title level={5}>แนบลิงก์</Title>
                                    <Button
                                        icon={<LinkOutlined />}
                                        onClick={() => setShowLinkModal(true)}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        เพิ่มลิงก์
                                    </Button>

                                    {/* Display links */}
                                    {links.length > 0 && (
                                        <List
                                            bordered
                                            dataSource={links}
                                            renderItem={(link, index) => (
                                                <List.Item
                                                    actions={[
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<CloseOutlined />}
                                                            onClick={() => setLinks(links.filter((_, i) => i !== index))}
                                                        />
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={<Avatar icon={<LinkOutlined />} style={{ backgroundColor: theme.primaryColor }} />}
                                                        title={
                                                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                                {link.url}
                                                            </a>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Extension Request Modal */}
                        <Modal
                            title="ขอขยายเวลาดำเนินการ"
                            open={showExtensionModal}
                            onCancel={() => setShowExtensionModal(false)}
                            footer={[
                                <Button key="cancel" onClick={() => setShowExtensionModal(false)}>
                                    ยกเลิก
                                </Button>,
                                <Button
                                    key="submit"
                                    type="primary"
                                    onClick={handleExtensionRequest}
                                    disabled={!extensionRequest.reason || !extensionRequest.newDate}
                                    style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                                >
                                    ส่งคำขอ
                                </Button>
                            ]}
                        >
                            <Form layout="vertical">
                                <Form.Item label="เหตุผลที่ขอขยายเวลา" required>
                                    <TextArea
                                        rows={3}
                                        value={extensionRequest.reason}
                                        onChange={(e) => setExtensionRequest({ ...extensionRequest, reason: e.target.value })}
                                    />
                                </Form.Item>
                                <Form.Item label="วันที่ต้องการขยายเวลา" required>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        value={extensionRequest.newDate}
                                        onChange={(date) => setExtensionRequest({ ...extensionRequest, newDate: date })}
                                        format="DD/MM/YYYY"
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>

                        {/* Link Modal */}
                        <Modal
                            title="เพิ่มลิงก์"
                            open={showLinkModal}
                            onCancel={() => setShowLinkModal(false)}
                            footer={[
                                <Button key="cancel" onClick={() => setShowLinkModal(false)}>
                                    ยกเลิก
                                </Button>,
                                <Button
                                    key="submit"
                                    type="primary"
                                    onClick={handleAddLink}
                                    disabled={!newLink.trim()}
                                    style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                                >
                                    เพิ่ม
                                </Button>
                            ]}
                        >
                            <Form layout="vertical">
                                <Form.Item label="URL" required>
                                    <Input
                                        placeholder="https://example.com"
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        prefix={<LinkOutlined />}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </TabPane>

                    <TabPane tab="Review & Approval" key="2">
                        {/* Review Controls - Only for assigner and when task is waiting review */}
                        {isAssigner && taskData.status === 'Waiting Review' && (
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={5}>ตรวจสอบและอนุมัติ</Title>
                                <Space>
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                        icon={<CheckOutlined />}
                                        onClick={handleApprove}
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
                                    onClick={handleReject}
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
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={5}>ความคิดเห็น</Title>
                            <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                                <TextArea
                                    rows={2}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="เพิ่มความคิดเห็น..."
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleAddComment}
                                    disabled={!comment.trim()}
                                    style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                                />
                            </div>

                            {/* Display comments */}
                            {taskData.comments.length > 0 ? (
                                <List
                                    className="comment-list"
                                    itemLayout="horizontal"
                                    dataSource={taskData.comments}
                                    renderItem={(item) => (
                                        <Comment
                                            author={<Text strong>{item.user.name}</Text>}
                                            avatar={<Avatar src={item.user.avatar} />}
                                            content={<p>{item.text}</p>}
                                            datetime={
                                                <Tooltip title={formatDate(item.timestamp)}>
                                                    <span>{dayjs(item.timestamp).fromNow()}</span>
                                                </Tooltip>
                                            }
                                        />
                                    )}
                                />
                            ) : (
                                <Text type="secondary" style={{ textAlign: 'center', display: 'block', padding: '16px 0' }}>
                                    ยังไม่มีความคิดเห็น
                                </Text>
                            )}
                        </div>
                    </TabPane>
                </Tabs>

                {/* Activity Timeline */}
                <div style={{ marginTop: '32px' }}>
                    <Divider orientation="center">ประวัติการดำเนินการ</Divider>
                    <List
                        itemLayout="horizontal"
                        dataSource={taskData.activities}
                        renderItem={(activity, index) => (
                            <List.Item>
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
                      <Text strong>{activity.user}</Text>
                                            {activity.type === 'status_change' &&
                                                ` เปลี่ยนสถานะจาก ${activity.from || 'เริ่มต้น'} เป็น ${activity.to}`}
                                            {activity.type === 'extension_request' &&
                                                ` ขอขยายเวลาถึง ${activity.requestedDate}`}
                                            {activity.type === 'approval' &&
                                                ` อนุมัติงาน`}
                                            {activity.type === 'rejection' &&
                                                ` ไม่อนุมัติงาน: ${activity.reason}`}
                                            {activity.type === 'action_completed' &&
                                                ` บันทึกผลการดำเนินงาน`}
                    </span>
                                    }
                                    description={formatDate(activity.timestamp)}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Card>
        </div>
    );
};

export default TaskAction;