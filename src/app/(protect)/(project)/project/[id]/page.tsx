
import React from 'react';
import ProjectDetailComponent from "@/features/project/components/ProjectDetailComponent";

const Page = ({params} : {params:{id:string,task_id:string}}) => {
    return (
        <>
       <ProjectDetailComponent id={params.id}/>
        </>
    );
};

export default Page;