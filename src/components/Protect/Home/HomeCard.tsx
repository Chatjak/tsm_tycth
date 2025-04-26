'use client'

import React from 'react';

const HomeCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            My Tasks
                        </h3>
                        <span className="text-3xl font-bold text-blue-600 bg-blue-50 rounded-full h-12 w-12 flex items-center justify-center">12</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-gray-600">Pending</div>
                            <div className="text-xl font-bold text-black">3</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-gray-600">In Progress</div>
                            <div className="text-xl font-bold text-black">7</div>
                        </div>
                        {/*<div className="bg-gray-50 rounded-lg p-3 text-center">*/}
                        {/*    <div className="text-sm font-medium text-gray-600">For Review</div>*/}
                        {/*    <div className="text-xl font-bold text-black">2</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending Approvals
                        </h3>
                        <span className="text-3xl font-bold text-amber-500 bg-amber-50 rounded-full h-12 w-12 flex items-center justify-center">5</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-gray-600">High</div>
                            <div className="text-xl font-bold text-black">2</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-gray-600">Medium</div>
                            <div className="text-xl font-bold text-black">2</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-gray-600">Low</div>
                            <div className="text-xl font-bold text-black">1</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Performance
                        </h3>
                        <span className="text-3xl font-bold text-green-600 bg-green-50 rounded-full h-12 w-12 flex items-center justify-center">85%</span>
                    </div>
                    <div className="relative pt-1 mb-4">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-50">
                                    Tasks Completed On Time
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-green-600">
                                    17/20
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCard;