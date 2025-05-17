'use client'

import React from 'react';
import {Typography, Tag, Steps} from "antd";
import { getStatusColor } from "@/features/task/utils/TaskActionUtils";
import {
    ClockCircleOutlined,
} from "@ant-design/icons";
import { ActionDetails } from "@/features/action/dto/ActionDtoSchema";
import { calculateDelay } from "@/features/action/utils/ActionUtils";
const { Step } = Steps;
const { Title, Text } = Typography;

const ActionHeader = ({ taskData } : { taskData: ActionDetails }) => {
    const calculate = calculateDelay(taskData);

    const getCurrentStep = () => {
        switch(taskData.status) {
            case 'Not start': return 0;
            case 'On Progress': return 1;
            case 'Review': return 2;
            case 'Completed': return 3;
            case 'Rejected': return 1; // Goes back to In Progress
            default: return 0;
        }
    };
    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Not start': return '🔄';
            case 'In Progress': return '⏳';
            case 'Review': return '👀';
            case 'Completed': return '✅';
            case 'Rejected': return '❌';
            default: return '🔄';
        }
    };

    return (
        <div className="rounded-xl p-5 shadow border border-gray-300/10 bg-white/40 backdrop-blur-xs mb-6">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                <div>
                    <Title level={3} className="!mb-3 !text-gray-800 font-semibold">
                        {taskData.title}
                    </Title>
                    <Text className="text-gray-600 text-[15px] block leading-relaxed">
                        {taskData.description}
                    </Text>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Tag color={getStatusColor(taskData.status)} className="text-[14px] px-3 py-1 rounded-full font-medium">
                        {getStatusIcon(taskData.status)} {taskData.status}
                    </Tag>
                    {calculate > 0 && (
                        <Tag color="error" className="mt-2 px-2.5 py-0.5 rounded-full">
                            <ClockCircleOutlined /> ล่าช้า {calculate} วัน
                        </Tag>
                    )}
                </div>
            </div>

            <Steps current={getCurrentStep()} className={`my-6`}>
                <Step title="Not Start" />
                <Step title="On Progress" />
                <Step title="Waiting Review" />
                <Step title="Completed" />
            </Steps>
        </div>
    );
};

export default ActionHeader;
