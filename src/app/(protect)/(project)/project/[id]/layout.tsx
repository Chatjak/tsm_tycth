import React from 'react';
import Header from "@/components/layout/project/Header";

const Layout = ({params,children,modal} : {params:{id:string},children:React.ReactNode,modal:React.ReactNode}) => {
    return (
        <>
        <Header id={params.id}/>
            <div className=" min-h-[50vh] flex flex-col flex-grow   bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                <div className={`flex flex-col flex-grow container mx-auto` }>
                    {modal}
                {children}
                </div>
            </div>
        </>
    );
};

export default Layout;