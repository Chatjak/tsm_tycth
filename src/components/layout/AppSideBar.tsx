'use client'

import React from 'react';
import {HouseIcon, LayoutListIcon, FolderKanbanIcon,
} from "lucide-react"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader} from "@/components/ui/sidebar";
import Image from "next/image";
import NavMain from "@/components/layout/NavMain";
import NavProject from "@/components/layout/NavProject";
import NavUser from "@/components/layout/NavUser";
const AppSideBar = ({...props}:React.ComponentProps<typeof Sidebar>) => {





    const data = {
            navMain: [
                {
                    title: "Home",
                    url: "/",
                    icon: HouseIcon,
                },
                {
                    title: "My Tasks",
                    url: "/me",
                    icon: LayoutListIcon,
                },
                {
                    title: "Projects",
                    url: "/project",
                    icon: FolderKanbanIcon,
                },
            ],
    }

    return (
        <Sidebar collapsible="icon" {...props}  >
            <SidebarHeader className={`flex items-center justify-center`}>
                <Image src={'/icon.png'} alt={'logo'} width={100} height={60}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProject />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSideBar;