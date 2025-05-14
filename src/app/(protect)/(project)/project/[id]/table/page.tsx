import React from 'react';
import ProjectTable from "@/features/project/components/table/ProjectTable";

const Page = ({params} : {params:{id:string}}) => {
    return (
        <ProjectTable id={params.id}/>
    );
};

export default Page;