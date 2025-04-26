'use client'


import React from 'react';
import {Flex, Splitter} from "antd";
import NavbarLeft from "@/components/layout/NavbarLeft";

const MainLayout = ({children }: {children:React.ReactNode}) => {
    const [sizes] = React.useState<(number | string)[]>(['10%', '90%']);
    return (
        <Flex vertical gap="middle" className={`overflow-hidden`}>
            <Splitter
            >
                <Splitter.Panel size={sizes[0]} max={'10%'} min={'10%'} className={`relative`}>
                    <NavbarLeft/>
                </Splitter.Panel>
                <Splitter.Panel size={sizes[1]} className={'overflow-auto  flex flex-col md:flex-row h-full max-h-[calc(100svh-64px)]'}>
                    <div className={` container mx-auto`}>

                    {children}
                    </div>
                </Splitter.Panel>
            </Splitter>
        </Flex>
    );
};

export default MainLayout;