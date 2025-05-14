import React from 'react';

import TaskCalendar from "@/features/project/components/calendar/TaskCalendar";

const Page = ({params} : {params:{id:string}}) => {
    return (
        <TaskCalendar id={params.id}/>
    );
};

export default Page;