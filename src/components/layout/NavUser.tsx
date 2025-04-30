'use client'

import {
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import React from 'react';
import { useAppSelector } from "@/stores/redux/hooks";

const NavUserSkeleton = () => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="pointer-events-none">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="grid flex-1 text-left gap-1 ml-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="ml-auto size-4 rounded-full" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

const NavUser = () => {
    const { isMobile } = useSidebar();
    const { user } = useAppSelector((state) => state.auth);

    if ( !user) {
        return <NavUserSkeleton />;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.profile} alt={user.name} className="object-cover object-top" />
                                <AvatarFallback className="rounded-lg">{user.name?.substring(0, 2) || 'US'}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.profile} alt={user.name} className="object-cover object-top" />
                                    <AvatarFallback className="rounded-lg">{user.name?.substring(0, 2) || 'US'}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserCircleIcon className="mr-2 h-4 w-4" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCardIcon className="mr-2 h-4 w-4" />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <BellIcon className="mr-2 h-4 w-4" />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export default NavUser;