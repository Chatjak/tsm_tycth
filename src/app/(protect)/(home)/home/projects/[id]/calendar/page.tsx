import React from 'react';
import ProjectDetailCalendar from "@/components/Protect/Home/Projects/[id]/ProjectDetailCalendar";

const Page = ({params} :  {params:{id:string}}) => {
    if(!params.id) {
        return <div className="text-center text-2xl font-bold">Project not found</div>
    }
    return (
        <ProjectDetailCalendar id={params.id}/>
    );
};

export default Page;