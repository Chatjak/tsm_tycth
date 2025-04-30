import {PaperclipIcon} from "lucide-react";
import React from "react";

export const AttachmentCard = ({ name, size }: { name: string; size: string }) => (
    <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 shadow-sm transition cursor-pointer">
        <div className="h-10 w-10 flex-shrink-0 bg-red-50 rounded-md flex items-center justify-center text-red-500">
            <PaperclipIcon size={20} />
        </div>
        <div className="ml-3">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-500">{size} • Download</p>
        </div>
    </div>
);
