import React from 'react';

export const CalendarIcon = () => (
    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
<line x1="16" y1="2" x2="16" y2="6" />
<line x1="8" y1="2" x2="8" y2="6" />
<line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export const DocumentIcon = () => (
    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

export const EmptyIcon = ({ className }: { className: string }) => (
    <svg className={`w-8 h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
<path d="M20 7l-8-4-8.1 4c-.5.3-.9.8-.9 1.5v7c0 .7.4 1.2.9 1.5l8 4c.3.1.6.1.9 0l8.1-4c.5-.3.9-.8.9-1.5v-7c0-.7-.4-1.2-.9-1.5zM4 12l8 4 8-4" />
<path d="M4 8l8 4 8-4" />
    </svg>
);

export const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
        case "Not start":
            return (
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                </svg>
            );
        case "On Progress":
            return (
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
            );
        case "In Review":
            return (
                <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            );
        case "Completed":
            return (
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        default:
            return null;
    }
};