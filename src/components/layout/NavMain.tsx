'use client'

import React from 'react';
import {LucideIcon} from "lucide-react";
import {
    SidebarGroup, SidebarGroupContent, SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";


interface NavMainProps  {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

const NavMain = ({items} :{items:NavMainProps[]}) => {
    const router = useRouter()
    return (
        <SidebarGroup >
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu >
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}  >
                            <SidebarMenuButton tooltip={item.title}
                            onClick={() => router.push(item.url)}
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default NavMain;