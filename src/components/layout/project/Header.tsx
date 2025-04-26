'use client'
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, LayoutGrid, Table as TableIcon, List, CalendarDays } from 'lucide-react';

const Header = ({ id, title = "Craftboard Project" } : { id: string, title?: string }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="w-full bg-white p-6 ">
                <h1 className="text-3xl font-bold text-gray-800">Craftboard</h1>
                <p className="text-gray-500 mt-1">Streamline HR Operations with our Dynamic Dashboard Solutions</p>
            </div>
            <div className="w-full bg-white flex items-center justify-between py-3 px-4 ">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                        <span className="font-bold">C</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                </div>
            </div>
            <div className="w-full bg-white flex items-center justify-between px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                    <TabsWithCustomDesign />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 absolute left-2.5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 h-9 w-56 rounded-md bg-gray-50 border-gray-200"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 flex items-center gap-1.5 text-gray-700 border-gray-200 bg-white">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                    <Button size="sm" className="h-9 flex items-center gap-1.5 bg-gray-900 text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4" />
                        New Task
                    </Button>
                </div>
            </div>
        </div>
    );
};

const TabsWithCustomDesign = () => {
    const [activeTab, setActiveTab] = React.useState("kanban");

    return (
        <div className="flex items-center space-x-1">
            <TabButton
                value="kanban"
                icon={<LayoutGrid className="w-4 h-4" />}
                label="Kanban"
                active={activeTab === "kanban"}
                onClick={() => setActiveTab("kanban")}
            />
            <TabButton
                value="table"
                icon={<TableIcon className="w-4 h-4" />}
                label="Table"
                active={activeTab === "table"}
                onClick={() => setActiveTab("table")}
            />
            <TabButton
                value="list"
                icon={<List className="w-4 h-4" />}
                label="List"
                active={activeTab === "list"}
                onClick={() => setActiveTab("list")}
            />
            <TabButton
                value="timeline"
                icon={<CalendarDays className="w-4 h-4" />}
                label="Timeline"
                active={activeTab === "timeline"}
                onClick={() => setActiveTab("timeline")}
            />
        </div>
    );
};

interface TabButtonProps {
    value: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const TabButton = ({ value, icon, label, active, onClick }: TabButtonProps) => (
    <button
        type="button"
        className={`flex items-center space-x-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors
            ${active
            ? 'text-gray-800 bg-gray-100'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={onClick}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Header;