import React, {ReactNode} from 'react';
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import AppSideBar from "@/components/layout/AppSideBar";
import SiteHeader from "@/components/layout/SiteHeader";


const Layout = ({children} : {children : ReactNode}) => {
    return (

        <SidebarProvider>
            <AppSideBar/>
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>


    );
};

export default Layout;