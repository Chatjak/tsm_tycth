import React from 'react';
import ProjectDetailOverviewComponent from "@/components/Protect/Home/Projects/[id]/ProjectDetailOverviewComponent";


const Page = ({params}  :{params:{id:string}}) => {
    if(!params.id) {
        return <div className="text-center text-2xl font-bold">Project not found</div>
    }
    return (
        <ProjectDetailOverviewComponent id={params.id}/>
    );
};

export default Page;