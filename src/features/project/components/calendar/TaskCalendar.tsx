'use client'

import React, { useEffect, useState } from 'react';
import {Calendar, dayjsLocalizer, Event} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetProjectByIdQuery } from '@/stores/redux/api/projectApi';
import { TaskDto } from '@/features/project/types/projects.types';
import dayjs from "dayjs";
import CalendarEvent from "@/features/project/components/calendar/CalendarEvent";


const localizer = dayjsLocalizer(dayjs);

const TaskCalendar = ({ id }: { id: string }) => {
    const { data, isLoading, error } = useGetProjectByIdQuery({ id });
    const [events, setEvents] = useState<Event[]>([]);
    console.log({data})

    useEffect(() => {
        if (data) {
            const tasks: TaskDto[] = data[0].TasksJson || [];

            const mappedEvents = tasks.map((task) => ({
                title: task.Title,
                start: new Date(task.TaskStart ?? task.CreatedAt),
                end: new Date(task.TaskEnd ?? task.TaskStart ?? task.CreatedAt),
                allDay: true,
                resource: task,
            }));

            setEvents(mappedEvents);
        }
    }, [data]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    📅 Project Task Calendar
                </h2>
                <p className="text-sm text-gray-500 mt-1">Overview of task timelines by project</p>
            </div>

            <div className="overflow-hidden">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    popup
                    style={{
                        height: "75vh",
                    }}
                    components={{
                        toolbar: () => null,
                        event:({event}) => <CalendarEvent event={event} />,
                    }}
                    eventPropGetter={(event) => {
                        const status = event.resource?.Status?.toLowerCase();
                        let backgroundColor = '#e2e8f0';
                        if (status === 'completed' || status === 'done') backgroundColor = '#c6f6d5';
                        else if (status === 'on progress') backgroundColor = '#bfdbfe';
                        else backgroundColor = '#e2e8f0';
                        return {
                            style: {
                                backgroundColor,
                                color: '#1f2937',
                                fontWeight: 600,
                                borderRadius: '8px',
                                border: '1px solid #cbd5e0',
                                padding: '6px 10px',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                cursor: 'pointer',
                            },
                            className: ' hover:shadow-md',
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default TaskCalendar;
