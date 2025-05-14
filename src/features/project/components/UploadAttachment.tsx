'use client';

import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useUploadFileMutation } from '@/stores/redux/api/taskApi';

interface UploadTaskFileProps {
    taskId: number;
    project_id: number;
}

const UploadTaskFile: React.FC<UploadTaskFileProps> = ({ taskId,project_id } : {taskId:number,project_id:number}) => {
    const [uploadFile, { isLoading }] = useUploadFileMutation();
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        customRequest: async ({ file, onSuccess, onError }) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await uploadFile({ body: {taskId, file: file as File},params:{project_id} }).unwrap();
                message.success('File uploaded successfully');
                if (onSuccess) onSuccess("ok", file);
            } catch (error) {
                console.error(error);
                message.error('File upload failed');
                if (onError)  console.error(error);
            }
        },
    };

    return (
        <Upload {...props}>
            <Button
                icon={<UploadOutlined />}
                loading={isLoading}
                type="text"
                size="middle"
            >
                Upload File
            </Button>
        </Upload>
    );
};

export default UploadTaskFile;
