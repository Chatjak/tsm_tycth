import React from 'react';
import ProjectDetailTaskList from "@/components/Protect/Home/Projects/[id]/ProjectDetailTaskList";

const Page = ({params} : {params: {id:string}}) => {
    if(!params.id) {
        return <div className="text-center text-2xl font-bold">Project not found</div>
    }

    return (
        <ProjectDetailTaskList id={params.id}/>
    );
};

export default Page;