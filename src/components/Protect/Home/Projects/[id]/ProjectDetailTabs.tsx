'use client'

import React from 'react';
import {Calendar, CheckCircle, PieChart} from "lucide-react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const ProjectDetailTabs = ({id} : {id:string}) => {
    const pathname = usePathname();
    const isActive = (segment: string) => pathname == (segment);
    return (
        <div className="bg-white rounded-t-lg shadow-sm">
            <div className="flex border-b">
                <Link href={'/home/projects/' + id}
                    className={`px-6 py-3 text-sm font-medium flex items-center ${isActive(`/home/projects/${id}`) ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <PieChart size={16} className="mr-2" />
                    Overview
                </Link>
                <Link href={'/home/projects/' + id + '/tasks'}
                    className={`px-6 py-3 text-sm font-medium flex items-center ${isActive(`/home/projects/${id}/tasks`) ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}

                >
                    <CheckCircle size={16} className="mr-2" />
                    Task List
                </Link>
                <Link href={'/home/projects/' + id + '/calendar'}
                    className={`px-6 py-3 text-sm font-medium flex items-center ${isActive(`/home/projects/${id}/calendar`) ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}

                >
                    <Calendar size={16} className="mr-2" />
                    Calendar
                </Link>
            </div>
        </div>
    );
};

export default ProjectDetailTabs;