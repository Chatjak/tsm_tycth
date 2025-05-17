'use client'
import React, {ElementRef, useEffect, useRef} from 'react';
import {useGetActionDetailQuery} from "@/stores/redux/api/actionApi";
import {Drawer} from "antd";
import SkeletonLoading from "@/features/task/components/SkeletonLoading";

import {useRouter} from "next/navigation";
import ActionMain from "@/features/action/components/ActionMain";

const ActionBase = ({id} : {id:string}) => {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    const [drawerWidth, setDrawerWidth] = React.useState("80%");

    useEffect(() => {
        const updateDrawerWidth = () => {
            setDrawerWidth(window.innerWidth < 1100 ? "100%" : "80%");
        };

        updateDrawerWidth(); // เช็คครั้งแรก
        window.addEventListener("resize", updateDrawerWidth); // อัปเดตเมื่อ resize

        return () => window.removeEventListener("resize", updateDrawerWidth);
    }, []);

    function onDismiss() {
        router.back();
    }
    const {data ,isLoading} = useGetActionDetailQuery({action_id:id})


    return (
        <Drawer
            open={true}
            onClose={onDismiss}
            width={drawerWidth}
            closeIcon={false}
            styles={{
                body: { padding: 0, backgroundColor: '#f9fafb' },
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
            }}
            placement="right"

        >
            <div className="bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] min-h-screen">
                {isLoading ? (
                    <SkeletonLoading/>
                ) : (
                   <ActionMain taskData={data}/>
                )}
            </div>
        </Drawer>
    );
};

export default ActionBase;