'use client'

import React from 'react';
import Image from 'next/image';

import { useGetProfileQuery } from "@/stores/redux/api/authApi";

const HomePageHeader = () => {
    const { data: currentUser } = useGetProfileQuery();

    return (
        <header className="mb-6 p-4 bg-white/40 backdrop-blur-xs rounded-xl shadow border-slate-200/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-blue-200">
                        <Image
                            src={currentUser?.profile || '/icon.png'}
                            alt="User avatar"
                            fill
                            className="object-cover object-top"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/icon.png';
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">DASHBOARD OVERVIEW</h1>
                        <p className="text-gray-600 text-sm mt-0.5">
                            Welcome back, <span className="font-medium">{currentUser?.employee_id} {currentUser?.name || currentUser?.email}</span>
                        </p>
                        <p className={`text-gray-600 text-sm mt-0.5`}>
                            Position: <span className="font-medium">{currentUser?.job_title}</span>
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HomePageHeader;