import React from 'react';
import TaskGantt from "@/features/project/components/gantt/TaskGantt";

const Page = ({params} : {params:{id:string}}) => {
    return (
        <TaskGantt id={params.id} />
    );
};

export default Page;