
import {theme} from "@/features/task/utils/StyleUtils";
import {
    CheckCircleOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
    PauseCircleOutlined,
    SyncOutlined
} from "@ant-design/icons";

export const getStatusColor = (status:string) => {
    switch (status) {
        case 'Not Started': return '#6b7280'; // Gray
        case 'On Progress': return theme.infoColor;
        case 'Waiting Review': return theme.warningColor;
        case 'Completed': return theme.successColor;
        case 'Rejected': return theme.dangerColor;
        default: return '#6b7280';
    }
};

// Get status iconexport
export const getStatusIcon = (status:string) => {
    switch (status) {
        case 'Not Started': return <PauseCircleOutlined />;
        case 'On Progress': return <SyncOutlined spin />;
        case 'Waiting Review': return <ExclamationCircleOutlined />;
        case 'Completed': return <CheckCircleOutlined />;
        case 'Rejected': return <CloseOutlined />;
        default: return <PauseCircleOutlined />;
    }
};

// Get priority color
export  const getPriorityColor = (priority:string) => {
    switch (priority) {
        case 'High': return theme.dangerColor;
        case 'Medium': return theme.warningColor;
        case 'Low': return theme.infoColor;
        default: return '#6b7280';
    }
};
