'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import {
    FileTextIcon,
    PaperclipIcon,
    SendIcon,
    SmileIcon,
    ImageIcon,
    MicIcon,
    MoreHorizontalIcon,
    SearchIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMessagesQuery } from "@/stores/redux/api/messageApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion, AnimatePresence } from "framer-motion";

// Extend dayjs with relative time
dayjs.extend(relativeTime);

const MessageComponent = ({task_id, project_id} : {task_id:number, project_id:number, isMobile:boolean}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const {data, isLoading} = useGetMessagesQuery({task_id, project_id});

    useEffect(() => {
        scrollToBottom();
    }, [data]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Function to generate a message time display
    const getMessageTime = (timestamp: string) => {
        const msgDate = dayjs(timestamp);
        const now = dayjs();

        if (now.diff(msgDate, 'day') < 1) {
            return msgDate.format('HH:mm');
        } else if (now.diff(msgDate, 'day') < 7) {
            return msgDate.format('ddd HH:mm');
        } else {
            return msgDate.format('MMM D, HH:mm');
        }
    };

    const currentUser = {
        id: 1, // Example user ID
        name: "Chatjak" // Using the current user from the system
    };

    const emojis = ["👍", "👎", "😊", "😂", "❤️", "🎉", "👏", "🙏", "🔥", "✅"];

    // Function to add emoji to message
    const addEmoji = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojis(false);
        textareaRef.current?.focus();
    };

    // For grouping messages by sender and time
    const getGroupedMessages = () => {
        if (!data) return [];

        const grouped: any[] = [];
        let currentGroup: any = null;

        data.forEach((msg, index) => {
            // Start a new group if:
            // 1. This is the first message
            // 2. The sender changed
            // 3. Time gap between messages is > 5 minutes
            const shouldStartNewGroup =
                !currentGroup ||
                currentGroup.senderId !== msg.tsm_user.id ||
                (index > 0 && dayjs(msg.timestamp).diff(dayjs(data[index-1].timestamp), 'minute') > 5);

            if (shouldStartNewGroup) {
                currentGroup = {
                    id: `group-${msg.id}`,
                    senderId: msg.tsm_user.id,
                    senderName: msg.tsm_user.emp_name,
                    senderInitial: msg.tsm_user.emp_name.charAt(0).toUpperCase(),
                    timestamp: msg.timestamp,
                    messages: [msg],
                    isCurrentUser: msg.tsm_user.id === currentUser.id
                };
                grouped.push(currentGroup);
            } else {
                currentGroup.messages.push(msg);
                // Update the timestamp to the latest one
                currentGroup.timestamp = msg.timestamp;
            }
        });

        return grouped;
    };

    const groupedMessages = getGroupedMessages();

    return (
        <div className="flex flex-col  h-[95%] bg-white border-l border-slate-200 shadow-md rounded-l-xl overflow-hidden sticky top-5 z-20">
            {/* Header with search */}
            <div className="py-3 px-4 border-b border-slate-200 bg-white flex justify-between items-center sticky  top-0 z-10 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Messages</h3>
                <div className="flex items-center gap-2">
                    {showSearch ? (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 150, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="relative"
                        >
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-1 px-3 pr-8 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                                autoFocus
                            />
                            <button
                                className="absolute right-2 top-1.5"
                                onClick={() => setShowSearch(false)}
                            >
                                <span className="text-xs text-slate-400 hover:text-slate-600">×</span>
                            </button>
                        </motion.div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full p-2 h-auto hover:bg-slate-100 text-slate-500"
                            onClick={() => setShowSearch(true)}
                        >
                            <SearchIcon size={16} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-2 h-auto hover:bg-slate-100 text-slate-500"
                    >
                        <MoreHorizontalIcon size={16} />
                    </Button>
                </div>
            </div>

            {/* Messages container */}
            <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6 bg-slate-50/50">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm mt-3">Loading messages...</p>
                    </div>
                ) : groupedMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                            <SendIcon size={24} className="text-violet-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No messages yet</h3>
                        <p className="text-slate-500 text-sm max-w-xs">
                            Start the conversation by sending the first message to your team
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Date separator */}
                        <div className="flex items-center justify-center my-4">
                            <div className="h-px bg-slate-200 flex-grow"></div>
                            <span className="px-3 text-xs text-slate-500 font-medium">
                                {dayjs().format('MMMM D, YYYY')}
                            </span>
                            <div className="h-px bg-slate-200 flex-grow"></div>
                        </div>

                        {/* Message groups */}
                        {groupedMessages.map((group) => (
                            <div
                                key={group.id}
                                className={`flex ${group.isCurrentUser ? 'justify-end' : 'justify-start'} gap-3`}
                            >
                                {!group.isCurrentUser && (
                                    <Avatar className="h-9 w-9 flex-shrink-0 mt-1">
                                        <AvatarFallback className="bg-violet-500 text-white font-medium">
                                            {group.senderInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={`flex flex-col max-w-[75%] ${group.isCurrentUser ? 'items-end' : 'items-start'}`}>
                                    {!group.isCurrentUser && (
                                        <div className="flex items-center mb-1">
                                            <span className="font-medium text-sm mr-2 text-slate-800">{group.senderName}</span>
                                            <span className="text-xs text-slate-500">{getMessageTime(group.timestamp)}</span>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        {group.messages.map((msg: any, idx: number) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={`
                                                    ${group.isCurrentUser
                                                    ? 'bg-violet-600 text-white rounded-tl-xl rounded-bl-xl rounded-tr-xl'
                                                    : 'bg-white text-slate-800 rounded-tr-xl rounded-br-xl rounded-tl-xl'}
                                                    ${idx === 0 ? (group.isCurrentUser ? 'rounded-tr-xl' : 'rounded-tl-xl') : ''}
                                                    ${idx === group.messages.length - 1 ? (group.isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none') : ''}
                                                    shadow-sm p-3 text-sm
                                                `}
                                            >
                                                <p>{msg.message}</p>

                                                {/* Attachments if any */}
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-opacity-20 border-slate-200">
                                                        {msg.attachments.map((attachment: any) => (
                                                            <div
                                                                key={attachment.id}
                                                                className={`
                                                                    flex items-center ${group.isCurrentUser ? 'bg-violet-700' : 'bg-white'} 
                                                                    p-2 rounded border border-opacity-20 ${group.isCurrentUser ? 'border-white' : 'border-slate-200'} text-xs
                                                                `}
                                                            >
                                                                <FileTextIcon size={14} className={`${group.isCurrentUser ? 'text-violet-200' : 'text-violet-500'} mr-2`} />
                                                                <span className={`${group.isCurrentUser ? 'text-white' : 'text-violet-600'} hover:underline cursor-pointer`}>
                                                                    {attachment.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {group.isCurrentUser && (
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-slate-500">{getMessageTime(group.timestamp)}</span>
                                            <span className="text-xs ml-2 text-slate-400">✓✓</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message input form */}
            <div className="border-t border-slate-200 p-3 bg-white relative">
                <AnimatePresence>
                    {showEmojis && (
                        <motion.div
                            className="absolute bottom-full left-4 bg-white p-2 rounded-lg shadow-lg border border-slate-200 grid grid-cols-5 gap-1 z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            {emojis.map(emoji => (
                                <button
                                    key={emoji}
                                    className="text-xl p-1.5 hover:bg-slate-100 rounded transition-colors"
                                    onClick={() => addEmoji(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <div
                    className={`flex items-end gap-2 transition-all duration-200 ${isComposing ? 'pb-2' : ''}`}
                >
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={() => setIsComposing(true)}
                            onBlur={() => setIsComposing(false)}
                            placeholder="Type your message..."
                            className="min-h-[60px] max-h-[150px] py-3 px-4 pr-12 resize-none focus:border-violet-500 focus:ring-violet-500 rounded-2xl shadow-sm text-sm"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1.5">
                            <motion.button
                                type="button"
                                className="p-1.5 rounded-full hover:bg-violet-50 text-slate-500 hover:text-violet-500"
                                onClick={() => setShowEmojis(!showEmojis)}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SmileIcon size={18} />
                            </motion.button>
                            <motion.button
                                type="button"
                                className="p-1.5 rounded-full hover:bg-violet-50 text-slate-500 hover:text-violet-500"
                                whileTap={{ scale: 0.95 }}
                            >
                                <PaperclipIcon size={18} />
                            </motion.button>
                            <motion.button
                                type="button"
                                className="p-1.5 rounded-full hover:bg-violet-50 text-slate-500 hover:text-violet-500 md:block hidden"
                                whileTap={{ scale: 0.95 }}
                            >
                                <ImageIcon size={18} />
                            </motion.button>
                        </div>
                    </div>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                    >
                        {newMessage.trim() ? (
                            <Button
                                type="submit"
                                className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-violet-600 hover:bg-violet-700 shadow-sm"
                            >
                                <SendIcon size={18} />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-violet-600 hover:bg-violet-700 shadow-sm"
                            >
                                <MicIcon size={18} />
                            </Button>
                        )}
                    </motion.div>
                </div>

                {/* Quick replies when composing */}
                {isComposing && (
                    <motion.div
                        className="flex gap-2 mt-2 overflow-x-auto pb-1 px-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {["👍 Sounds good", "I'll check and get back", "Thank you!", "Working on it", "Can we discuss?"].map((reply) => (
                            <button
                                key={reply}
                                className="px-3 py-1 text-xs rounded-full bg-slate-100 whitespace-nowrap hover:bg-violet-100 hover:text-violet-700 transition-colors"
                                onClick={() => setNewMessage(reply)}
                            >
                                {reply}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MessageComponent;