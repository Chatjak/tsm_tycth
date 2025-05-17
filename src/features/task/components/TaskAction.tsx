'use client'

import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Button,
    Input,
    DatePicker,
    Space,
    Tag,
    Row,
    Col,
    Avatar,
    List,
    Drawer,
    Menu,
    Dropdown,
    Radio,
    Checkbox,
    ConfigProvider, Badge, Empty
} from 'antd';
import {
    CalendarOutlined,
    TeamOutlined,
    FilterOutlined,
    SearchOutlined,
    BarsOutlined,
    AppstoreOutlined,
    SortAscendingOutlined, UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import relativeTime from 'dayjs/plugin/relativeTime';
import {buttonStyles, theme} from "@/features/task/utils/StyleUtils";
import TaskCreateDrawer from "@/features/task/components/TaskCreateAction";
import { useGetActionListQuery} from "@/stores/redux/api/actionApi";
import {ActionDetails} from "@/features/action/dto/ActionDtoSchema";
import {createAvatar} from "@/features/home/utils/TaskReviewUtils";
import {getPriorityColor, getStatusColor, getStatusIcon} from "@/features/task/utils/TaskActionUtils";
import {useRouter} from "next/navigation"; // นำเข้าจากคอมโพเนนต์เดิม

dayjs.extend(relativeTime);
dayjs.locale('th');

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;


interface Filters {
    search: string;
    status: string[];
    priority: string[];
    category: string[];
    dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
    assignee: string[];
    assigner: string[];
}


const cardStyles = {
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    border: 'none'
};




const TaskActionList = ({task_id }:{task_id:string}) => {
    const currentDate = dayjs();


    const {data:tasks } = useGetActionListQuery({task_id})

    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

    // Filter states
    const [filters, setFilters] = useState<Filters>({
        search: '',
        status: [],
        priority: [],
        category: [],
        dateRange: null,
        assignee: [],
        assigner: [],
    });


    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'createdAt', 'priority'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    const [filteredTasks, setFilteredTasks] = useState<ActionDetails[]>([...(tasks ?? [])]);
    const router = useRouter();


    const uniqueStatuses: string[] = [...new Set(tasks?.map(task => task.status))];
    const uniquePriorities: string[] = [...new Set(tasks?.map(task => task.priority))];

    const uniqueAssignees: string[] = [
        ...new Set(tasks?.flatMap(task => task.assignee?.map(user => user.emp_name) || []))
    ].filter((name): name is string => Boolean(name));

    const uniqueAssigners: string[] = [
        ...new Set(tasks?.map(task => task.assigner?.emp_name).filter((name): name is string => Boolean(name)))
    ];

    useEffect(() => {
        let result = [...tasks ?? []];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                task =>
                    task.title.toLowerCase().includes(searchLower) ||
                    task.description.toLowerCase().includes(searchLower)
            );
        }

        if (filters.status.length > 0) {
            result = result.filter(task => filters.status.includes(task.status));
        }

        if (filters.priority.length > 0) {
            result = result.filter(task => filters.priority.includes(task.priority));
        }

        if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
            const startDate = filters.dateRange[0].startOf('day');
            const endDate = filters.dateRange[1].endOf('day');

            result = result.filter(task => {
                const taskDueDate = dayjs(task.due_date);
                return taskDueDate.isAfter(startDate) && taskDueDate.isBefore(endDate);
            });
        }

        if (filters.assignee.length > 0) {
            result = result.filter(task =>
                task.assignee?.some(user => filters.assignee.includes(user.emp_name))
            );
        }


        if (filters.assigner.length > 0) {
            result = result.filter(task => filters.assigner.includes(task.assigner?.emp_name));
        }

        result.sort((a, b) => {
            let valA, valB

            switch (sortBy) {
                case 'dueDate':
                    valA = new Date(a.due_date);
                    valB = new Date(b.due_date);
                    break;
                case 'createdAt':
                    valA = new Date(a.created_at);
                    valB = new Date(b.created_at);
                    break;
                case 'priority':
                    const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    valA = priorityValues[a.priority] || 0;
                    valB = priorityValues[b.priority] || 0;
                    break;
                case 'title':
                    valA = a.title;
                    valB = b.title;
                    break;
                default:
                    valA = new Date(a.due_date);
                    valB = new Date(b.due_date);
            }

            if (sortOrder === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });

        setFilteredTasks(result);
    }, [tasks, filters, sortBy, sortOrder]);
    const resetFilters = () => {
        setFilters({
            search: '',
            status: [],
            priority: [],
            category: [],
            dateRange: null,
            assignee: [],
            assigner: []
        });
    };

    const calculateDaysRemaining = (dueDate:string) => {
        if (!dueDate) return { days: 0, isOverdue: false };

        const dueDateObj = dayjs(dueDate);
        const diffDays = dueDateObj.diff(currentDate, 'day');

        return {
            days: Math.abs(diffDays),
            isOverdue: diffDays < 0
        };
    };



    const handleSortMenuClick = ({ key } ) => {
        const [field, order] = key.split('-');
        setSortBy(field);
        setSortOrder(order);
    };

    const sortMenu = (
        <Menu onClick={handleSortMenuClick}>
            <Menu.ItemGroup title="วันที่ครบกำหนด">
                <Menu.Item key="dueDate-asc">เร็วที่สุดไปช้าที่สุด</Menu.Item>
                <Menu.Item key="dueDate-desc">ช้าที่สุดไปเร็วที่สุด</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="วันที่สร้าง">
                <Menu.Item key="createdAt-asc">เก่าที่สุดไปใหม่ที่สุด</Menu.Item>
                <Menu.Item key="createdAt-desc">ใหม่ที่สุดไปเก่าที่สุด</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="ความสำคัญ">
                <Menu.Item key="priority-desc">สูงไปต่ำ</Menu.Item>
                <Menu.Item key="priority-asc">ต่ำไปสูง</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="ชื่องาน">
                <Menu.Item key="title-asc">A-Z</Menu.Item>
                <Menu.Item key="title-desc">Z-A</Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    );


    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: theme.primaryColor,
                    borderRadius: 8,
                }
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

                <Card
                    style={{
                        ...cardStyles,
                        marginBottom: '24px'
                    }}
                    bodyStyle={{ padding: '16px 20px' }}
                >
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={8} lg={10}>
                            <Input
                                placeholder="ค้นหางาน..."
                                prefix={<SearchOutlined />}
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                                style={{
                                    borderRadius: '8px',
                                    height: '40px'
                                }}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} md={16} lg={14}>
                            <Row justify="end" gutter={[12, 12]}>
                                <Col>
                                    <Button
                                        type="default"
                                        onClick={() => setShowFilterDrawer(true)}
                                        icon={<FilterOutlined />}
                                        style={{
                                            ...buttonStyles.secondary,
                                            borderColor: Object.values(filters).some(val =>
                                                Array.isArray(val) ? val.length > 0 : Boolean(val)
                                            ) ? theme.primaryColor : undefined,
                                            color: Object.values(filters).some(val =>
                                                Array.isArray(val) ? val.length > 0 : Boolean(val)
                                            ) ? theme.primaryColor : undefined
                                        }}
                                    >
                                        ตัวกรอง
                                        {Object.values(filters).some(val =>
                                            Array.isArray(val) ? val.length > 0 : Boolean(val)
                                        ) && (
                                            <Badge
                                                count={
                                                    Object.values(filters).reduce((count, val) => {
                                                        if (Array.isArray(val)) {
                                                            return count + (val.length > 0 ? 1 : 0);
                                                        }
                                                        return count + (Boolean(val) ? 1 : 0);
                                                    }, 0)
                                                }
                                                style={{
                                                    backgroundColor: theme.primaryColor,
                                                    marginLeft: '5px'
                                                }}
                                            />
                                        )}
                                    </Button>
                                </Col>
                                <Col>
                                    <Dropdown overlay={sortMenu} placement="bottomRight">
                                        <Button
                                            type="default"
                                            icon={<SortAscendingOutlined />}
                                            style={buttonStyles.secondary}
                                        >
                                            จัดเรียง
                                        </Button>
                                    </Dropdown>
                                </Col>
                                <Col>
                                    <Radio.Group
                                        value={viewMode}
                                        onChange={(e) => setViewMode(e.target.value)}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value="card">
                                            <AppstoreOutlined />
                                        </Radio.Button>
                                        <Radio.Button value="list">
                                            <BarsOutlined />
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                                <Col>
                                    <TaskCreateDrawer/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>

                {Object.values(filters).some(val => Array.isArray(val) ? val.length > 0 : Boolean(val)) && (
                    <div style={{ marginBottom: '16px' }}>
                        <Space wrap>
                            {filters.search && (
                                <Tag
                                    closable
                                    onClose={() => setFilters({...filters, search: ''})}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    <SearchOutlined /> {filters.search}
                                </Tag>
                            )}

                            {filters.status.map(status => (
                                <Tag
                                    key={status}
                                    closable
                                    color={getStatusColor(status)}
                                    onClose={() => setFilters({
                                        ...filters,
                                        status: filters.status.filter(s => s !== status)
                                    })}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    สถานะ: {status}
                                </Tag>
                            ))}

                            {filters.priority.map(priority => (
                                <Tag
                                    key={priority}
                                    closable
                                    color={getPriorityColor(priority)}
                                    onClose={() => setFilters({
                                        ...filters,
                                        priority: filters.priority.filter(p => p !== priority)
                                    })}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    ความสำคัญ: {priority}
                                </Tag>
                            ))}

                            {filters.category.map(category => (
                                <Tag
                                    key={category}
                                    closable
                                    onClose={() => setFilters({
                                        ...filters,
                                        category: filters.category.filter(c => c !== category)
                                    })}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    หมวดหมู่: {category}
                                </Tag>
                            ))}

                            {filters.dateRange && filters.dateRange[0] && filters.dateRange[1] && (
                                <Tag
                                    closable
                                    onClose={() => setFilters({...filters, dateRange: null})}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    <CalendarOutlined /> {filters.dateRange[0].format('DD/MM/YYYY')} - {filters.dateRange[1].format('DD/MM/YYYY')}
                                </Tag>
                            )}

                            {filters.assignee.map(assignee => (
                                <Tag
                                    key={assignee}
                                    closable
                                    onClose={() => setFilters({
                                        ...filters,
                                        assignee: filters.assignee.filter(a => a !== assignee)
                                    })}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    <UserOutlined /> {assignee}
                                </Tag>
                            ))}

                            {filters.assigner.map(assigner => (
                                <Tag
                                    key={assigner}
                                    closable
                                    onClose={() => setFilters({
                                        ...filters,
                                        assigner: filters.assigner.filter(a => a !== assigner)
                                    })}
                                    style={{ borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    <TeamOutlined /> {assigner}
                                </Tag>
                            ))}

                            <Button
                                type="link"
                                onClick={resetFilters}
                                style={{ padding: '0px 8px' }}
                            >
                                ล้างตัวกรองทั้งหมด
                            </Button>
                        </Space>
                    </div>
                )}

                {/* Task list or grid */}
                {filteredTasks.length > 0 ? (
                    viewMode === 'card' ? (
                        <Row gutter={[16, 16]}>
                            {filteredTasks.map(task => (
                                <Col xs={24} sm={12} lg={8} key={task.id}>
                                    <Card
                                        style={{
                                            borderRadius: '12px',
                                            height: '100%',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid #f0f0f0'
                                        }}
                                        bodyStyle={{ padding: '16px' }}
                                        hoverable
                                        onClick={() => router.push('/a/'+task.id)}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px'
                                        }}>
                                            <Tag
                                                color={getStatusColor(task.status)}
                                                style={{ borderRadius: '4px' }}
                                            >
                                                {getStatusIcon(task.status)} {task.status}
                                            </Tag>
                                            <Tag
                                                color={getPriorityColor(task.priority)}
                                                style={{ borderRadius: '4px' }}
                                            >
                                                {task.priority}
                                            </Tag>
                                        </div>

                                        <Title level={5} style={{ margin: '0 0 8px', lineHeight: '1.4' }}>
                                            {task.title}
                                        </Title>

                                        <Paragraph
                                            ellipsis={{ rows: 2 }}
                                            type="secondary"
                                            style={{ marginBottom: '16px', fontSize: '14px' }}
                                        >
                                            {task.description}
                                        </Paragraph>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px'
                                        }}>
                                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                                <CalendarOutlined style={{ marginRight: '5px' }} />
                                                {dayjs(task.due_date).format('D MMM YYYY')}
                                            </Text>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {task.assignee?.map(user => (
                                                  <>
                                                      {user.profile ? <Avatar src={user.profile || undefined} size="small" style={{ marginRight: '8px' }} />
                                                          :
                                                          createAvatar(user.emp_name,user.emp_email)
                                                      }
                                                  </>
                                                ))}
                                            </div>

                                            {calculateDaysRemaining(task.due_date).isOverdue && task.status !== 'Completed' ? (
                                                <Tag color="error" style={{ borderRadius: '4px', fontSize: '12px' }}>
                                                    ล่าช้า {calculateDaysRemaining(task.due_date).days} วัน
                                                </Tag>
                                            ) : (
                                                task.status !== 'Completed' && (
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {calculateDaysRemaining(task.due_date).days} วันที่เหลือ
                                                    </Text>
                                                )
                                            )}
                                        </div>

                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Card
                            style={{
                                ...cardStyles,
                                padding: 0,
                            }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <List
                                dataSource={filteredTasks}
                                renderItem={task => (
                                    <List.Item
                                        key={task.id}
                                        style={{
                                            padding: '16px 20px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}
                                        onClick={() => router.push('/a/'+task.id)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    style={{
                                                        backgroundColor: getStatusColor(task.status),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {getStatusIcon(task.status)}
                                                </Avatar>
                                            }
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Text strong style={{ marginRight: '12px' }}>{task.title}</Text>
                                                    <Tag color={getPriorityColor(task.priority)} style={{ borderRadius: '4px' }}>
                                                        {task.priority}
                                                    </Tag>
                                                </div>
                                            }
                                            description={
                                                <Paragraph ellipsis={{ rows: 1 }} style={{ marginBottom: 0 }}>
                                                    {task.description}
                                                </Paragraph>
                                            }
                                        />
                                        <Space size="large">
                                            <div style={{ textAlign: 'center', minWidth: '90px' }}>
                                                {task.assignee?.map(user => (
                                                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                                                        {user.profile ? <Avatar src={user.profile || undefined} size="small" style={{ marginRight: '8px' }} />
                                                        :
                                                            createAvatar(user.emp_name,user.emp_email)
                                                        }
                                                        <Text style={{ fontSize: '13px' }}>{user.emp_name}</Text>
                                                    </div>
                                                ))}
                                            </div>


                                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <CalendarOutlined style={{ marginRight: '8px', color: '#6b7280' }} />
                                                    <Text style={{ fontSize: '13px' }}>
                                                        {dayjs(task.due_date).format('D MMM YYYY')}
                                                    </Text>
                                                </div>
                                                {calculateDaysRemaining(task.due_date).isOverdue && task.status !== 'Completed' ? (
                                                    <Tag color="error" style={{
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        marginTop: '4px'
                                                    }}>
                                                        ล่าช้า {calculateDaysRemaining(task.due_date).days} วัน
                                                    </Tag>
                                                ) : (
                                                    task.status !== 'Completed' && (
                                                        <Text type="secondary" style={{
                                                            fontSize: '12px',
                                                            display: 'block',
                                                            marginTop: '4px'
                                                        }}>
                                                            {calculateDaysRemaining(task.due_date).days} วันที่เหลือ
                                                        </Text>
                                                    )
                                                )}
                                            </div>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    )
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div style={{ padding: '20px 0' }}>
                                <Text style={{ fontSize: '16px' }}>ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา</Text>
                                <div style={{ marginTop: '12px' }}>
                                    <Button type="primary" onClick={resetFilters}>ล้างตัวกรองทั้งหมด</Button>
                                </div>
                            </div>
                        }
                    />
                )}

                {/* Filter drawer */}
                <Drawer
                    title="ตัวกรอง"
                    width={320}
                    onClose={() => setShowFilterDrawer(false)}
                    open={showFilterDrawer}
                    extra={
                        <Button type="link" onClick={resetFilters}>
                            ล้างทั้งหมด
                        </Button>
                    }
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>สถานะ</Text>
                            <Checkbox.Group
                                options={uniqueStatuses.map(status => ({
                                    label: status,
                                    value: status
                                }))}
                                value={filters.status}
                                onChange={(values) => setFilters({...filters, status: values})}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>ความสำคัญ</Text>
                            <Checkbox.Group
                                options={uniquePriorities.map(priority => ({
                                    label: priority,
                                    value: priority
                                }))}
                                value={filters.priority}
                                onChange={(values) => setFilters({...filters, priority: values})}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>หมวดหมู่</Text>
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>ช่วงวันที่ครบกำหนด</Text>
                            <RangePicker
                                value={filters.dateRange}
                                onChange={(dates:any) => setFilters({...filters, dateRange: dates})}
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>ผู้รับผิดชอบ</Text>
                            <Checkbox.Group
                                options={uniqueAssignees.map(assignee => ({
                                    label: assignee,
                                    value: assignee
                                }))}
                                value={filters.assignee}
                                onChange={(values) => setFilters({...filters, assignee: values})}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>ผู้มอบหมาย</Text>
                            <Checkbox.Group
                                options={uniqueAssigners.map(assigner => ({
                                    label: assigner,
                                    value: assigner
                                }))}
                                value={filters.assigner}
                                onChange={(values) => setFilters({...filters, assigner: values})}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Space>
                </Drawer>
            </div>
        </ConfigProvider>
    );
};


export default TaskActionList;