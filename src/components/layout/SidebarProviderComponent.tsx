import React from 'react';
import {SidebarProvider} from "@/components/ui/sidebar";
import AppSideBar from "@/components/layout/AppSideBar";

const SidebarProviderComponent = () => {

    return (
        <SidebarProvider>
            <AppSideBar/>
        </SidebarProvider>
    );
};

export default SidebarProviderComponent;