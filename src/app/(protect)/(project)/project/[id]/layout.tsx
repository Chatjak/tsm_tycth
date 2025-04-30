import React from 'react';
import Header from "@/components/layout/project/Header";

const Layout = ({params,children} : {params:{id:string},children:React.ReactNode}) => {
    return (
        <>
        <Header id={params.id}/>
            <div>
                {children}
            </div>
        </>
    );
};

export default Layout;