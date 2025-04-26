import React from 'react';

import ProjectDetailTabs from "@/components/Protect/Home/Projects/[id]/ProjectDetailTabs";
import ProjectDetailHeader from "@/components/Protect/Home/Projects/[id]/ProjectDetailHeader";

const Layout = ({children,params} : {children:React.ReactNode,params:{id:string}}) => {
    return (
        <div className="flex flex-col h-full min-h-[calc(100svh-64px)] bg-gray-50 p-4 md:p-6">

            <ProjectDetailHeader id={params.id} />
            <ProjectDetailTabs id={params.id}/>
        {children}
        </div>
    );
};

export default Layout;