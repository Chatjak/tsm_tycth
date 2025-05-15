'use client'


import React from 'react';
import {Skeleton, Space} from "antd";

const SkeletonLoading = () => {
    return (
        <div className="p-4">
            <Skeleton.Input active style={{ width: '60%', height: 32 }} />
            <div className="mt-4 flex gap-4">
                <Skeleton.Button active style={{ width: 80 }} />
                <Skeleton.Button active style={{ width: 100 }} />
            </div>
            <div className="mt-6">
                <Skeleton
                    active
                    paragraph={{ rows: 4 }}
                    title={false}
                />
            </div>
            <div className="mt-6">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Skeleton.Input active style={{ width: '30%' }} />
                    <Skeleton.Input active style={{ width: '40%' }} />
                    <Skeleton.Input active style={{ width: '35%' }} />
                </Space>
            </div>
            <div className="mt-8">
                <Skeleton.Input active style={{ width: '30%', marginBottom: 16 }} />
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Skeleton avatar active paragraph={{ rows: 2 }} />
                    <Skeleton avatar active paragraph={{ rows: 1 }} />
                    <Skeleton avatar active paragraph={{ rows: 2 }} />
                </Space>
            </div>
        </div>
    );
};

export default SkeletonLoading;