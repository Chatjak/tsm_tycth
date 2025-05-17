'use client'

import React, { useState } from 'react';
import {
    Drawer,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Typography,
    Divider,
    Upload,
    message,
    TimePicker,
    Switch,

    Tag,
    Row,
    Col,
    Avatar
} from 'antd';
import {
    PlusOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    InboxOutlined,
    SaveOutlined,
    CloseCircleOutlined,
    CheckOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import {buttonStyles, theme} from "@/features/task/utils/StyleUtils";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const TaskCreateDrawer = ({currentUser = 'Chatjak' }
) => {

    const [visible, setVisible] = useState(false);


    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any>([]);
    const [tags, setTags] = useState<any>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState<any>('');
    const [loading, setLoading] = useState(false);



    const onClose = () => {
        setVisible(false);
        form.resetFields();
        setFileList([]);
        setTags([]);
    }

    const onSubmit = (values) => {
        console.log('Form values:', values);
        // ส่งข้อมูลไปยัง API หรือทำการบันทึกข้อมูลที่นี่
    }

    // ตัวอย่างข้อมูลทีมและผู้ใช้
    const teamMembers = [
        { id: 'user123', name: 'Chatjak', avatar: 'https://xsgames.co/randomusers/avatar.php?g=male' },
        { id: 'user124', name: 'Somchai', avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&i=2' },
        { id: 'user125', name: 'Wichai', avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&i=3' },
        { id: 'user126', name: 'Malee', avatar: 'https://xsgames.co/randomusers/avatar.php?g=female' },
        { id: 'user127', name: 'Somying', avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&i=2' }
    ];

    // ตัวอย่างหมวดหมู่
    const categories = [
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Development', label: 'Development' },
        { value: 'Finance', label: 'Finance' },
        { value: 'HR', label: 'HR' },
        { value: 'Customer Success', label: 'Customer Success' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Operations', label: 'Operations' }
    ];

    // จัดการการอัปโหลดไฟล์
    const handleFileUpload = (info:any) => {
        let newFileList = [...info.fileList];
        setFileList(newFileList);
    };

    // จัดการแท็ก
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const handleTagClose = (removedTag) => {
        const newTags = tags.filter(tag => tag !== removedTag);
        setTags(newTags);
    };

    // สร้างงานใหม่
    const handleSubmit = async () => {
        try {
            setLoading(true);
            await form.validateFields();
            const values = form.getFieldsValue();

            // แปลงค่าวันที่และเวลาให้อยู่ในรูปแบบ ISO string
            if (values.dueDate) {
                values.dueDate = values.dueDate.format('YYYY-MM-DDTHH:mm:ss') + 'Z';
            }

            // เพิ่มข้อมูลอื่นๆ
            values.tags = tags;
            values.files = fileList;
            values.createdAt = dayjs().format('YYYY-MM-DDTHH:mm:ss') + 'Z';
            values.status = 'Not Started';
            values.activities = [
                {
                    type: 'status_change',
                    from: null,
                    to: 'Not Started',
                    timestamp: values.createdAt,
                    user: currentUser
                }
            ];
            values.comments = [];

            // ส่งข้อมูลไปยังฟังก์ชัน callback
            if (onSubmit) {
                onSubmit(values);
            }

            // รีเซ็ตฟอร์ม
            form.resetFields();
            setFileList([]);
            setTags([]);

            // แสดงข้อความสำเร็จ
            message.success({
                content: 'สร้างงานใหม่เรียบร้อยแล้ว',
                icon: <CheckOutlined style={{ color: theme.successColor }} />
            });

            // ปิด Drawer
            onClose();
        } catch (error) {
            console.error('Validation failed:', error);
            message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                    setVisible(true);
                }}
                style={buttonStyles.primary}
            >
                สร้างงานใหม่
            </Button>
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PlusOutlined style={{ color: theme.primaryColor }} />
                    <span>สร้างงานใหม่</span>
                </div>
            }
            width={720}
            onClose={onClose}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button
                        onClick={onClose}
                        icon={<CloseCircleOutlined />}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        style={buttonStyles.primary}
                        icon={<SaveOutlined />}
                    >
                        บันทึก
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    priority: 'Medium',
                    assignee: currentUser,
                    dueDate: dayjs().add(7, 'day').hour(17).minute(0).second(0),
                    dueTime: dayjs().hour(17).minute(0).second(0),
                    reminder: true
                }}
            >
                {/* ส่วนหัวของฟอร์ม */}
                <div style={{
                    background: theme.bgGradient,
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    }}></div>

                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: 'กรุณาระบุชื่องาน' }]}
                        style={{ marginBottom: '12px' }}
                    >
                        <Input
                            placeholder="ชื่องาน"
                            size="large"
                            style={{
                                border: 'none',
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                height: '46px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                            className="task-title-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        style={{ marginBottom: '0' }}
                    >
                        <TextArea
                            placeholder="รายละเอียดงาน"
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            style={{
                                border: 'none',
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                            className="task-description-input"
                        />
                    </Form.Item>
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="priority"
                            label={
                                <Text strong>ความสำคัญ</Text>
                            }
                            rules={[{ required: true, message: 'กรุณาเลือกความสำคัญ' }]}
                        >
                            <Select placeholder="เลือกความสำคัญ" style={{ width: '100%' }}>
                                <Option value="High">
                                    <Tag color={theme.dangerColor} style={{ borderRadius: '4px' }}>สูง</Tag>
                                </Option>
                                <Option value="Medium">
                                    <Tag color={theme.warningColor} style={{ borderRadius: '4px' }}>ปานกลาง</Tag>
                                </Option>
                                <Option value="Low">
                                    <Tag color={theme.infoColor} style={{ borderRadius: '4px' }}>ต่ำ</Tag>
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label={
                                <Text strong>หมวดหมู่</Text>
                            }
                        >
                            <Select
                                placeholder="เลือกหมวดหมู่"
                                allowClear
                                options={categories}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="assignee"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <UserOutlined style={{ marginRight: '8px' }} />
                                    <Text strong>ผู้รับผิดชอบ</Text>
                                </div>
                            }
                            rules={[{ required: true, message: 'กรุณาเลือกผู้รับผิดชอบ' }]}
                        >
                            <Select
                                placeholder="เลือกผู้รับผิดชอบ"
                                showSearch
                                optionFilterProp="children"
                                style={{ width: '100%' }}
                            >
                                {teamMembers.map(member => (
                                    <Option key={member.id} value={member.name}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={member.avatar}
                                                size="small"
                                                style={{ marginRight: '8px' }}
                                            />
                                            {member.name}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="assigner"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TeamOutlined style={{ marginRight: '8px' }} />
                                    <Text strong>ผู้มอบหมาย</Text>
                                </div>
                            }
                        >
                            <Select
                                placeholder="เลือกผู้มอบหมาย (ไม่บังคับ)"
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                style={{ width: '100%' }}
                            >
                                {teamMembers.map(member => (
                                    <Option key={member.id} value={member.name}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={member.avatar}
                                                size="small"
                                                style={{ marginRight: '8px' }}
                                            />
                                            {member.name}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="dueDate"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    <Text strong>วันที่ครบกำหนด</Text>
                                </div>
                            }
                            rules={[{ required: true, message: 'กรุณาเลือกวันที่ครบกำหนด' }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: '100%' }}
                                placeholder="เลือกวันที่"
                                disabledDate={(current) => {
                                    // ไม่อนุญาตให้เลือกวันที่ในอดีต
                                    return current && current < dayjs().startOf('day');
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="dueTime"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ClockCircleOutlined style={{ marginRight: '8px' }} />
                                    <Text strong>เวลาที่ครบกำหนด</Text>
                                </div>
                            }
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: '100%' }}
                                placeholder="เลือกเวลา"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="reminder"
                    label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <InfoCircleOutlined style={{ marginRight: '8px' }} />
                            <Text strong>การแจ้งเตือน</Text>
                        </div>
                    }
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="เปิดใช้งาน"
                        unCheckedChildren="ปิดใช้งาน"
                        defaultChecked
                    />
                </Form.Item>

                <Divider orientation="left">แท็ก</Divider>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        {tags.map((tag, index) => (
                            <Tag
                                key={index}
                                closable
                                onClose={() => handleTagClose(tag)}
                                style={{ marginBottom: '8px', borderRadius: '4px' }}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>

                    {inputVisible ? (
                        <Input
                            type="text"
                            size="small"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                            style={{ width: 200 }}
                            autoFocus
                        />
                    ) : (
                        <Tag
                            onClick={() => setInputVisible(true)}
                            style={{
                                background: '#fff',
                                borderStyle: 'dashed',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            <PlusOutlined /> เพิ่มแท็ก
                        </Tag>
                    )}
                </div>

                <Divider orientation="left">ไฟล์แนบ</Divider>

                <Form.Item>
                    <Dragger
                        fileList={fileList}
                        onChange={handleFileUpload}
                        multiple={true}
                        beforeUpload={() => false}
                        style={{
                            borderRadius: '8px',
                            background: theme.secondaryColor,
                            border: '1px dashed #cbd5e1'
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: theme.primaryColor, fontSize: '32px' }} />
                        </p>
                        <p className="ant-upload-text" style={{ marginBottom: '0' }}>ลากไฟล์มาที่นี่ หรือ คลิกเพื่อเลือกไฟล์</p>
                        <p className="ant-upload-hint" style={{ fontSize: '12px' }}>
                            สามารถอัพโหลดได้หลายไฟล์พร้อมกัน
                        </p>
                    </Dragger>
                </Form.Item>
            </Form>

            <style jsx global>{`
                .task-title-input::placeholder {
                    color: rgba(255, 255, 255, 0.8);
                }
                .task-description-input::placeholder {
                    color: rgba(255, 255, 255, 0.8);
                }
            `}</style>
        </Drawer>
            </>
    );
};

export default TaskCreateDrawer;