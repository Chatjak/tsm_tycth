'use client'

import React from 'react';
import {slideLeft, slideRight, slideUp} from "@/features/project/utils/animationUtils";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {MessageSquareIcon, XIcon} from "lucide-react";
import {TaskDto} from "@/features/task/dto/QueryTaskById";
import {useRouter} from "next/navigation";

const TaskHeader = ({selectedTask} : {selectedTask:TaskDto}) => {
    const router = useRouter();
    function onDismiss() {
        router.back();
    }

    return (
        <motion.div
            className="bg-slate-50 border-b  shadow-sm"
            variants={slideUp}
        >
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between">
                <motion.div
                    className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4"
                    variants={slideRight}
                >
                    <h2 className="text-lg md:text-xl font-semibold break-words pr-12 md:pr-0">{selectedTask?.Title}</h2>
                </motion.div>

                    <motion.div
                        className="flex items-center space-x-2 mt-2 md:mt-0"
                        variants={slideLeft}
                    >
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MessageSquareIcon size={16} className="mr-1" />
                                Messages
                            </Button>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDismiss()}
                            >
                                <XIcon size={16} className="mr-1" />
                                Close
                            </Button>
                        </motion.div>
                    </motion.div>
            </div>
        </motion.div>
    );
};

export default TaskHeader;