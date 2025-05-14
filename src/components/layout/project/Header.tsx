 'use client'
import React, {useEffect, useState} from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, LayoutGrid, Table as TableIcon, List, CalendarDays, Menu, X } from 'lucide-react';
import TabButton from "@/features/project/components/TabButton";
import AddTaskComponent from "@/components/Protect/Home/Projects/[id]/AddTaskComponent";
import {usePathname, useRouter} from "next/navigation";
 import {useGetProjectByIdQuery} from "@/stores/redux/api/projectApi";


const Header = ({ id, title = "Craftboard Project" } : { id: string, title?: string }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const {data ,isLoading,isSuccess} = useGetProjectByIdQuery({id:id},{skip:!id})


    if(isLoading){
        return <div>Loading...</div>
    }





    return (
        <div className="flex flex-col w-full">
            {/* Top header */}
            <div className="w-full bg-white p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{data ? data[0]?.Name : '...'}</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">{data ? data[0]?.Description : '...'}</p>
            </div>

            {/* Project title bar */}
            <div className="w-full bg-white flex items-center justify-between py-3 px-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                        <span className="font-bold">{
                            data ? data[0]?.Name?.charAt(0).toUpperCase() || '?' : '...'
                        }</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{
                        data ? data[0]?.Name : '...'
                    }</h2>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden flex items-center justify-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ?
                        <X className="w-5 h-5 text-gray-700" /> :
                        <Menu className="w-5 h-5 text-gray-700" />
                    }
                </button>
            </div>

            {/* Navigation and actions */}
            <div className={`w-full bg-white border-b transition-all duration-300 ease-in-out ${menuOpen ? 'flex flex-col' : 'hidden md:flex'} md:flex-row md:items-center md:justify-between px-4 py-2`}>
                {/* Tabs */}
                <div className="flex md:items-center overflow-x-auto scrollbar-hide py-2">
                    <TabsWithCustomDesign id={id} />
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 py-2">
                    {/* Search */}
                    <div className="relative flex items-center w-full md:w-auto">
                        <Search className="w-4 h-4 absolute left-2.5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 h-9 w-full md:w-56 rounded-md bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <Button variant="outline" size="sm" className="h-9 flex items-center gap-1.5 text-gray-700 border-gray-200 bg-white">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </Button>

                        <AddTaskComponent projectId={id}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabsWithCustomDesign = ({ id }: { id: string }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("kanban");

    useEffect(() => {
        if (pathname.endsWith("/table")) {
            setActiveTab("table");
        } else if (pathname.endsWith("/gantt")) {
            setActiveTab("gantt");
        } else if (pathname.endsWith("/calendar")) {
            setActiveTab("calendar");
        } else {
            setActiveTab("kanban");
        }
    }, [pathname]);

    return (
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            <TabButton
                value="kanban"
                icon={<LayoutGrid className="w-4 h-4" />}
                label="Kanban"
                active={activeTab === "kanban"}
                onClick={() => router.push(`/project/${id}`)}
            />
            <TabButton
                value="table"
                icon={<TableIcon className="w-4 h-4" />}
                label="Table"
                active={activeTab === "table"}
                onClick={() => router.push(`/project/${id}/table`)}
            />
            <TabButton
                value="gantt"
                icon={<List className="w-4 h-4" />}
                label="Gantt"
                active={activeTab === "gantt"}
                onClick={() => router.push(`/project/${id}/gantt`)}
            />
            <TabButton
                value="calender"
                icon={<CalendarDays className="w-4 h-4" />}
                label="Calender"
                active={activeTab === "calendar"}
                onClick={() => router.push(`/project/${id}/calendar`)}
            />
        </div>
    );
};




export default Header;