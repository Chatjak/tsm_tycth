import dayjs from "dayjs";
import {ActionDetails} from "@/features/action/dto/ActionDtoSchema";

export const formatDate = (dateString:string) => {
    return dayjs(dateString).format('D MMM YYYY  HH:mm ');
};


export     const calculateDelay = (taskData:ActionDetails) => {
    if (!taskData.due_date) return 0;
    const currentDate = dayjs();

    const due_date = dayjs(taskData.due_date);

    if (currentDate <= due_date) return 0;

    const diffDays = currentDate.diff(due_date, 'day');
    return diffDays;
};
