'use client'

import React from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";

const HomeTabs = () => {
    const pathname = usePathname();
    const tabsContainerClasses = "border-b";
    const isActive = (segment: string) => pathname.includes(segment);
    const tabsClasses =  "flex";

    const tabItemClasses = (isActive : boolean) => {
        const baseClasses =  "px-6 py-4 text-sm font-medium";

        return `${baseClasses} ${
            isActive
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
        }`;
    };

    return (
        <div className={tabsContainerClasses}>
            <div className={tabsClasses}>
                <Link href={'/home/projects'}
                      className={tabItemClasses(isActive('/projects'))}
                >
                    Projects
                </Link>
                <Link href={'/home/tasks'}
                      className={tabItemClasses(isActive('/tasks'))}

                >
                    Tasks
                </Link>
                <Link href={'/home/approval'}
                      className={tabItemClasses(isActive('/approval'))}

                >
                    Approval
                </Link>

            </div>
        </div>
    );
};

export default HomeTabs;