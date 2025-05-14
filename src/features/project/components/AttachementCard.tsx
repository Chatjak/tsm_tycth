import {PaperclipIcon} from "lucide-react";
import React from "react";
import {useDownloadFileMutation} from "@/stores/redux/api/taskApi";
import {generateSecureDownloadLink} from "@/services/GenerateDownloadLink";

export const AttachmentCard = ({ name, size,id }: { name: string; size: string,id:string }) => {

    const [downloadFile] = useDownloadFileMutation();

    const handleDownload = async () => {
        try {
            const fileBlob = await downloadFile({ fileId: await generateSecureDownloadLink(id) }).unwrap();
            const url = window.URL.createObjectURL(fileBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 shadow-sm transition cursor-pointer"  onClick={handleDownload} >
            <div className="h-10 w-10 flex-shrink-0 bg-red-50 rounded-md flex items-center justify-center text-red-500">
                <PaperclipIcon size={20} />
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-gray-500">{size} • Download</p>
            </div>
        </div>
    );
}
