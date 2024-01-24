// pages/company/dashboard.js
import React, { useState, useEffect } from 'react';
import ProfileSection from './ProfileSection';
import EmployeesSection from './EmployeesSection';
import StudentsSearchSection from './StudentsSearchSection';
import RequestSection from './RequestSection';
import JobsSection from './JobsSection';
import MeetingsSection from './MeetingsSection';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if no token is found
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/company/login');
        }
    }, [router]);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSection />;
            case 'employees':
                return <EmployeesSection />;
            case 'students':
                return <StudentsSearchSection />;
            case 'requests':
                return <RequestSection />;
            case 'jobs':
                return <JobsSection />;
            case 'meetings':
                return <MeetingsSection />;
            default:
                return <ProfileSection />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/company/login');
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="flex flex-col w-64 bg-white">
                <div className="flex items-center justify-center h-20 shadow-md">
                    <h1 className="text-3xl font-bold text-indigo-600">Company</h1>
                </div>
                <ul>
                    <li>
                        <a onClick={() => setActiveTab('profile')} className="flex items-center p-4 cursor-pointer hover:bg-indigo-100">
                            <span>Profile</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveTab('employees')} className="flex items-center p-4 cursor-pointer hover:bg-indigo-100">
                            <span>Employees</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveTab('students')} className="flex items-center p-4 cursor-pointer hover:bg-indigo-100">
                            <span>Users</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveTab('requests')} className="flex items-center p-4 cursor-pointer hover:bg-indigo-100">
                            <span>Requests</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveTab('jobs')} className="flex items-center p-4 cursor-pointer hover:bg-indigo-100">
                            <span>Jobs</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveTab('meetings')} className="flex items-center p-4 cursor-pointer hover:bg-indigo-100">
                            <span>Meetings</span>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-end items-center p-4 shadow-md">
                    {/* User Profile Dropdown or any other items you want to put in the header */}
                    <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-500 rounded">Logout</button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
