'use client'

import React from 'react';
import TaskHeader from "@/features/task/components/TaskHeader";
import {TaskDto} from "@/features/task/dto/QueryTaskById";
import TaskMain from "@/features/task/components/TaskMain";

const TaskComponent = ({task} : {task:TaskDto}) => {
    return (
        <div className=" flex flex-col min-h-screen relative">
            <TaskHeader selectedTask={task}/>
            <div className={`h-[90vh]`}>
            <TaskMain selectedTask={task}/>
            </div>

        </div>
    );
};

export default TaskComponent;