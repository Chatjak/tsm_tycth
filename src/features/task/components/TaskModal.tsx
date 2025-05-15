'use client';
import { Drawer } from "antd";
import { type ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useQueryTaskByIdQuery } from "@/stores/redux/api/taskApi";
import SkeletonLoading from "@/features/task/components/SkeletonLoading";

import TaskComponent from "@/features/task/components/TaskComponent";

export function TaskModal({id} : {id:string}) {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    const {data, isLoading} = useQueryTaskByIdQuery({id})

    return createPortal(
        <Drawer
            open={true}
            onClose={onDismiss}
            width={'100%'}
            closeIcon={false}
            styles={{
                body: { padding: 0, backgroundColor: '#f9fafb' },
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
            }}
            placement="left"

        >
            <div className="bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] min-h-screen">
                {isLoading ? (
                    <SkeletonLoading/>
                ) : (
                    <TaskComponent task={data} />
                )}
            </div>
        </Drawer>,
        document.getElementById('modal-root')!
    );
}