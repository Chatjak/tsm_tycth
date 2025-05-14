'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Textarea} from "@/components/ui/textarea";
import {FileTextIcon, PaperclipIcon, SendIcon, SmileIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useGetMessagesQuery} from "@/stores/redux/api/messageApi";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import dayjs from "dayjs";

const MessageComponent = ({task_id , project_id,isMobile} : {task_id:number,project_id:number,isMobile:boolean}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');






    const  {data, isLoading} = useGetMessagesQuery({task_id,project_id});

    useEffect(() => {
        scrollToBottom();
    }, [data]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={`${isMobile ? 'hidden' : 'w-1/3'} border-l bg-white flex flex-col h-full`}>
            <div className="flex-grow overflow-y-auto px-4 py-6 space-y-4">
                <div className="border-b pb-2 mb-4">
                    <h3 className="text-lg font-medium">Messages</h3>
                </div>

                {data?.map((msg) => (
                    <div key={msg.id} className="flex mb-4">
                        <Avatar className="h-8 w-8 mr-3 mt-1">
                            <AvatarFallback className="bg-blue-400 text-white">
                                {msg.tsm_user.emp_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col max-w-[85%]">
                            <div className="flex items-center mb-1">
                                <span className="font-medium text-sm mr-2">{msg.tsm_user.emp_name}</span>
                                <span className="text-xs text-gray-500">{dayjs(msg.timestamp).format('DD/MM/YY HH:mm')}</span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 text-sm">
                                <p className="text-gray-800">{msg.message}</p>

                                {/* Attachments if any */}
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        {msg.attachments.map(attachment => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center bg-white p-2 rounded border border-gray-200 text-xs"
                                            >
                                                <FileTextIcon size={14} className="text-blue-500 mr-2" />
                                                <span className="text-blue-600 hover:underline cursor-pointer">
                                                    {attachment.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input form */}
            <div className="border-t p-3">
                <form className="flex items-end gap-2">
                    <div className="flex-1 relative">
                        <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="min-h-[80px] py-2 pr-12 resize-none"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1">
                            <button
                                type="button"
                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <SmileIcon size={18} />
                            </button>
                            <button
                                type="button"
                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <PaperclipIcon size={18} />
                            </button>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
                        disabled={!newMessage.trim()}
                    >
                        <SendIcon size={18} />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default MessageComponent;