import {QueryTaskByMe} from "@/features/task/dto/QueryTaskByMe";
import {AlertCircle, Calendar, CheckCircle2, Clock, Clock3, LucideIcon, Timer} from "lucide-react";
import React from "react";

export const getTaskDueStatus = (task: QueryTaskByMe) => {


    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else {
            return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
        }
    };

    const currentDate = new Date();
    if (!task.taskend) {
        return {
            className: "bg-gray-50 border-gray-100",
            textColorClass: "text-gray-600",
            buttonColorClass: "bg-gray-600 hover:bg-gray-700",
            icon: <Calendar className="w-3.5 h-3.5 mr-1 text-gray-500" />,
            text: "No due date"
        };
    }

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.taskend);
    const incomingThreshold = new Date(today);
    incomingThreshold.setDate(today.getDate() + 3);

    if (dueDate < today) {
        return {
            className: "bg-rose-50 border-rose-100",
            textColorClass: "text-rose-600",
            buttonColorClass: "bg-rose-600 hover:bg-rose-700",
            icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-500" />,
            text: getDaysUntilDue(task.taskend)
        };
    } else if (dueDate <= incomingThreshold) {
        return {
            className: "bg-amber-50 border-amber-100",
            textColorClass: "text-amber-600",
            buttonColorClass: "bg-amber-600 hover:bg-amber-700",
            icon: <Clock3 className="w-3.5 h-3.5 mr-1 text-amber-500" />,
            text: getDaysUntilDue(task.taskend)
        };
    } else {
        return {
            className: "bg-blue-50 border-blue-100",
            textColorClass: "text-blue-600",
            buttonColorClass: "bg-blue-600 hover:bg-blue-700",
            icon: <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />,
            text: getDaysUntilDue(task.taskend)
        };
    }
};


export const countTasksByStatus = (actionTasks:QueryTaskByMe[]) => {

    const currentDate = new Date();

    const overdueTasks = actionTasks.filter(task =>
        task.taskend && new Date(task.taskend) < currentDate
    ).length;

    const incomingTasks = actionTasks.filter(task => {
        if (!task.taskend) return false;
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        const incomingThreshold = new Date(today);
        incomingThreshold.setDate(today.getDate() + 3);
        const dueDate = new Date(task.taskend);
        return dueDate >= today && dueDate <= incomingThreshold;
    }).length;

    const normalTasks = actionTasks.filter(task => {
        if (!task.taskend) return true;
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        const incomingThreshold = new Date(today);
        incomingThreshold.setDate(today.getDate() + 3);
        const dueDate = new Date(task.taskend);
        return dueDate > incomingThreshold;
    }).length;

    return { overdueTasks, incomingTasks, normalTasks };
};


export const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = '';
    let textColor = '';
    let icon: LucideIcon | null = null;
    let label = status;

    switch (status) {
        case 'Not start':
            bgColor = 'bg-amber-50';
            textColor = 'text-amber-700';
            icon = Timer;
            label = 'Not Started';
            break;
        case 'On progress':
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-700';
            icon = Clock;
            label = 'In Progress';
            break;
        case 'Completed':
            bgColor = 'bg-emerald-50';
            textColor = 'text-emerald-700';
            icon = CheckCircle2;
            break;
        default:
            bgColor = 'bg-gray-50';
            textColor = 'text-gray-700';
    }

    const IconComponent = icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border-0`}>
            {IconComponent && <IconComponent className="w-3 h-3" />}
            {label}
        </span>
    );
};