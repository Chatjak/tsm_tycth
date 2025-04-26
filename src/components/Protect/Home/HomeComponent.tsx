'use client'

import React from 'react';
import HomeCard from "@/components/Protect/Home/HomeCard";
import HomeAddNewProject from "@/components/Protect/Home/HomeAddNewProject";

const HomeComponent = () => {
    return (
     <>
         <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-800">DASHBOARD</h2>
             <HomeAddNewProject/>
         </div>
             <HomeCard/>
     </>
    );
};

export default HomeComponent;