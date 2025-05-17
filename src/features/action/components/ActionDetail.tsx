'use client'

import React from 'react';
import {Avatar,Image} from "antd";
import {CalendarOutlined, FieldTimeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {calculateDelay, formatDate} from "@/features/action/utils/ActionUtils";
import {ActionDetails} from "@/features/action/dto/ActionDtoSchema";


const ActionDetailComponent = ({taskData}:{taskData:ActionDetails}) => {
    const calculate = calculateDelay(taskData);

    return (
        <div className={`w-1/3 shadow rounded-xl border border-gray-300/10  mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center">
                        <Avatar icon={<TeamOutlined />} className="bg-[#7b61ff] mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Assigned by</p>
                            <div className={`flex items-center`}>
                                {taskData.assigner.profile ? <div className="w-8 h-8 p-0">
                                    <Image
                                        src={taskData.assigner.profile}
                                        alt={taskData.assigner.emp_name}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover object-top rounded-full"
                                    />
                                </div>
                                 : (
                                <Avatar className="w-8 h-8">
                                    {taskData.assigner.emp_name?.charAt(0).toUpperCase()}
                                </Avatar>
                                )}
                                <p className="text-xs text-gray-600 mt-1 ml-2"><span>{taskData.assigner.emp_no}</span> {taskData.assigner.emp_name || 'Unassigned'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Avatar icon={<UserOutlined />} className="bg-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Assignees</p>
                            <div className="mt-2 flex flex-col gap-2">
                                {taskData.assignee.map((user, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        {user.profile ? (
                                            <div className="w-8 h-8 p-0">
                                                <Image
                                                    src={user.profile}
                                                    alt={user.emp_name}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover object-top rounded-full"
                                                />
                                            </div>
                                        ) : (
                                            <Avatar className="w-8 h-8">
                                                {user.emp_name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        )}
                                        <p className="text-xs text-gray-600  ml-2"><span>{user.emp_no}</span> {user.emp_name || 'Unassigned'}</p>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center">
                        <Avatar icon={<FieldTimeOutlined />} className="bg-blue-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Created on</p>
                            <p className="text-xs text-gray-600 mt-1">{formatDate(taskData.created_at)}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Avatar icon={<CalendarOutlined />} className={`${calculate > 0 ? 'bg-red-500' : 'bg-yellow-500'} mr-3`} />
                        <div>
                            <p className="text-sm text-gray-500">Due date</p>
                            <p className={`text-xs text-gray-600 mt-1 ${calculate > 0 ? 'text-red-500' : ''}`}>
                                {formatDate(taskData.due_date)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionDetailComponent;