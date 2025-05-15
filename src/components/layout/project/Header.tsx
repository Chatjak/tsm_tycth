'use client'

import React, { useEffect, useState, useRef } from 'react';
import {
    Search,
    LayoutGrid,
    Table as TableIcon,
    List,
    CalendarDays,
    Menu,
    X,
    Star,
    Clock,
    Pin,
    Users,
    MoreHorizontal,
    Share2,
    Bell,
    Settings,
    ListTree
} from 'lucide-react';
import TabButton from "@/features/project/components/TabButton";
import AddTaskComponent from "@/components/Protect/Home/Projects/[id]/AddTaskComponent";
import { usePathname, useRouter } from "next/navigation";
import { useGetProjectByIdQuery } from "@/stores/redux/api/projectApi";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relative time
dayjs.extend(relativeTime);

const Header = ({ id } : { id: string, title?: string }) => {
    // State
    const [menuOpen, setMenuOpen] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [animate, setAnimate] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Data fetching
    const { data, isLoading } = useGetProjectByIdQuery({ id }, { skip: !id });

    // Derived values
    const project = data ? data[0] : null;
    const projectName = project?.Name || '...';
    const projectDesc = project?.Description || '...';
    const projectInitial = project?.Name?.charAt(0).toUpperCase() || '?';
    const hasDateRange = project?.ProjectStart && project?.ProjectEnd;

    // Handle click outside options menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Animation effect when pinned/starred
    useEffect(() => {
        if (isStarred || isPinned) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isStarred, isPinned]);

    // Format date in a friendly way
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = dayjs(dateString);
        return date.isAfter(dayjs().subtract(7, 'day'))
            ? date.fromNow()
            : date.format('MMM D, YYYY');
    };

    // Calculate progress percentage if project has start/end dates
    const getProjectProgress = () => {
        if (!hasDateRange) return null;

        const start = dayjs(project!.ProjectStart);
        const end = dayjs(project!.ProjectEnd);
        const now = dayjs();

        // If project hasn't started yet
        if (now.isBefore(start)) return 0;
        // If project has ended
        if (now.isAfter(end)) return 100;

        // Calculate progress
        const totalDuration = end.diff(start);
        const elapsed = now.diff(start);
        return Math.round((elapsed / totalDuration) * 100);
    };

    const progressPercentage = getProjectProgress();

    // Show loading skeleton
    if (isLoading) {
        return (
            <div className="flex flex-col w-full animate-pulse">
                <div className="w-full bg-white p-5 md:p-6 shadow-sm">
                    <div className="h-8 bg-gray-100 rounded-lg w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-50 rounded w-2/3"></div>
                </div>
                <div className="w-full bg-white border-b border-t border-gray-100 shadow-sm">
                    <div className="flex justify-between px-4 py-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gray-100"></div>
                            <div className="h-5 bg-gray-100 rounded w-32 ml-3"></div>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100"></div>
                            <div className="w-8 h-8 rounded-lg bg-gray-100"></div>
                        </div>
                    </div>
                    <div className="flex space-x-2 px-4 py-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-8 bg-gray-100 rounded-lg w-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="flex flex-col w-full bg-white border-b border-gray-200 shadow-sm rounded-lg "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Project banner */}
            <div className="w-full bg-white p-5 md:p-6 relative">
                {/* Top Action Buttons */}
                <div className="absolute top-3 right-3 flex space-x-1.5">
                    <motion.button
                        className={`w-8 h-8 flex items-center justify-center rounded-full 
                            ${isStarred ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-500'} 
                            hover:bg-purple-50 hover:text-purple-600 transition-all`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={animate && isStarred ? { rotate: [0, 15, -15, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        onClick={() => setIsStarred(!isStarred)}
                        title={isStarred ? "Unstar project" : "Star project"}
                    >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-purple-600' : ''}`} />
                    </motion.button>

                    <motion.button
                        className={`w-8 h-8 flex items-center justify-center rounded-full 
                            ${isPinned ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-500'} 
                            hover:bg-purple-50 hover:text-purple-600 transition-all`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={animate && isPinned ? { y: [0, -3, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsPinned(!isPinned)}
                        title={isPinned ? "Unpin project" : "Pin project"}
                    >
                        <Pin className={`w-4 h-4 ${isPinned ? 'fill-purple-600' : ''}`} />
                    </motion.button>

                    <motion.button
                        className="w-8 h-8 flex items-center justify-center rounded-full
                            bg-gray-50 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowOptions(!showOptions)}
                        title="More options"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </motion.button>

                    {/* Options menu */}
                    <AnimatePresence>
                        {showOptions && (
                            <motion.div
                                ref={optionsRef}
                                className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-40 z-10"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-700 flex items-center">
                                    <Share2 className="w-4 h-4 mr-2 text-gray-500" />
                                    Share
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-700 flex items-center">
                                    <Bell className="w-4 h-4 mr-2 text-gray-500" />
                                    Notifications
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-700 flex items-center">
                                    <Settings className="w-4 h-4 mr-2 text-gray-500" />
                                    Settings
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <ListTree className="h-4 w-4" />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        {projectName}
                    </h1>
                </div>

                <div className="relative">
                    <p className={`text-sm md:text-base text-gray-600 ${!showFullDescription && projectDesc.length > 100 && 'line-clamp-2'}`}>
                        {projectDesc}
                    </p>
                    {projectDesc && projectDesc.length > 100 && (
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-xs text-purple-600 hover:text-purple-700 underline underline-offset-2 mt-1"
                        >
                            {showFullDescription ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                {/* Project metadata */}
                <div className="flex flex-wrap items-center mt-3 gap-3">
                    {project?.CreatedAt && (
                        <div className="flex items-center text-gray-600 text-xs px-2 py-1 bg-gray-50 rounded-full">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                            <span>Created {formatDate(project.CreatedAt)}</span>
                        </div>
                    )}

                    {project?.Priority && (
                        <div className="flex items-center text-gray-600 text-xs px-2 py-1 bg-gray-50 rounded-full">
                            <span className="font-medium">Priority: {project.Priority}</span>
                        </div>
                    )}

                    {(project?.EmpName || project?.OwnerId) && (
                        <div className="flex items-center text-gray-600 text-xs px-2 py-1 bg-gray-50 rounded-full">
                            <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                            <span>Owner: {project.EmpName || `User ${project.OwnerId}`}</span>
                        </div>
                    )}
                </div>

                {/* Project timeline */}
                {hasDateRange && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>{dayjs(project!.ProjectStart).format('MMM D, YYYY')}</span>
                            <span>{dayjs(project!.ProjectEnd).format('MMM D, YYYY')}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-in-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{project!.Duration} days duration</span>
                            <span>{progressPercentage}% complete</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation and tools */}
            <div className="w-full bg-white flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Mobile menu toggle */}
                <div className="flex items-center justify-between px-4 py-3 md:hidden border-b border-gray-100 md:border-b-0 w-full">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <span className="font-bold text-lg">{projectInitial}</span>
                        </div>
                        <div className="ml-3">
                            <h2 className="text-base font-semibold text-gray-800 truncate">
                                {projectName}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {project?.TasksJson?.length || 0} tasks
                            </p>
                        </div>
                    </div>

                    <button
                        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ?
                            <X className="w-5 h-5 text-gray-600" /> :
                            <Menu className="w-5 h-5 text-gray-600" />
                        }
                    </button>
                </div>

                {/* Navigation - Desktop shown, Mobile needs toggle */}
                <div className={`w-full transition-all duration-300 ease-in-out
                    ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'}
                    overflow-hidden md:overflow-visible`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-3 md:px-4 py-2">
                        {/* Tabs */}
                        <div className="py-2 md:py-0">
                            <TabsWithCustomDesign id={id} />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 py-3 md:py-0">
                            {/* Quick search - optional */}
                            <div className="relative hidden md:flex items-center mr-1">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="h-9 pl-8 pr-3 text-sm bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-all w-40 focus:w-56"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-2.5" />
                            </div>

                            {/* Add task button */}
                            <AddTaskComponent projectId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
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
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1.5">
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
                label="Calendar"
                active={activeTab === "calendar"}
                onClick={() => router.push(`/project/${id}/calendar`)}
            />
        </div>
    );
};

export default Header;