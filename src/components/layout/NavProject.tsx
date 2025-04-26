'use client'

import React, { useState } from 'react';
import {
    Forward,
    MoreHorizontal,
    Trash2,
    Plus,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link";
import { useGetProjectsMeQuery } from "@/stores/api/projectApi";


const ProjectSkeletons = () => {
    return (
        <>
            {[1, 2, 3].map((i) => (
                <SidebarMenuItem key={i} className="px-1 py-0.5">
                    <div className="flex items-center w-full px-2 py-2">
                        <Skeleton className="w-6 h-6 rounded-md mr-2" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                    </div>
                </SidebarMenuItem>
            ))}
        </>
    );
};

const NavProject = () => {
    const { isMobile } = useSidebar();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const { data: projects, isLoading } = useGetProjectsMeQuery();


    if (!isLoading && (!projects || projects.length === 0)) {
        return (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2">
                <div className="flex items-center justify-between mb-1 px-2">
                    <SidebarGroupLabel className="text-sm font-medium text-sidebar-foreground/70">Projects</SidebarGroupLabel>
                    <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full hover:bg-sidebar-highlight/20">
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Add Project</span>
                    </Button>
                </div>
                <SidebarMenu className="space-y-1">
                    <div className="p-4 text-center text-muted-foreground">
                        <p className="mb-2">No projects found</p>
                        <Button variant="outline" size="sm" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Project
                        </Button>
                    </div>
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2">
            <div className="flex items-center justify-between mb-1 px-2">
                <SidebarGroupLabel className="text-sm font-medium text-sidebar-foreground/70">Projects</SidebarGroupLabel>
                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full hover:bg-sidebar-highlight/20">
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Add Project</span>
                </Button>
            </div>
            <SidebarMenu className="space-y-1">
                {isLoading ? (
                    <ProjectSkeletons />
                ) : (
                    projects?.map((item, index) => (
                        <SidebarMenuItem
                            key={item.Name || index}
                            onMouseEnter={() => setHoveredItem(item.Name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="group transition-colors duration-200 hover:bg-sidebar-highlight/10 rounded-md"
                        >
                            <SidebarMenuButton asChild className="px-2 py-2">
                                <Link href={`/project/${encodeURIComponent(item.Id)}`} className="flex items-center">
                                    <div
                                        className={`w-6 h-6 mr-2 flex items-center justify-center rounded-md text-sm font-semibold ${
                                            hoveredItem === item.Name ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {item.Name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <span className="flex-1 truncate">{item.Name}</span>
                                </Link>
                            </SidebarMenuButton>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction showOnHover className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4" />
                                        <span className="sr-only">More</span>
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-52 rounded-lg shadow-lg border border-border/50"
                                    side={isMobile ? "bottom" : "right"}
                                    align={isMobile ? "end" : "start"}
                                    sideOffset={8}
                                >
                                    <DropdownMenuItem className="cursor-pointer hover:bg-secondary">
                                        <span className="w-4 h-4 mr-2 text-muted-foreground">📁</span>
                                        <span>View Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer hover:bg-secondary">
                                        <Forward className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>Share Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        <span>Delete Project</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    ))
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export default NavProject;