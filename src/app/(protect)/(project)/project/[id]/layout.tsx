import React from 'react';
import Header from "@/components/layout/project/Header";

const Layout = ({params,children} : {params:{id:string},children:React.ReactNode}) => {
    return (
        <div>
        <Header id={params.id}/>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Layout;