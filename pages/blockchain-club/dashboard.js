import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Members from './members';

const Dashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <MainContent />
            </div>
            {/* <Footer /> */}

        </div>
    );
};

const Header = () => {
    return (
        <header className="bg-blue-500 text-white p-4 text-center">
            <h1 className="text-xl">Blockchain Club Dashboard</h1>
        </header>
    );
};

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <nav>
                <ul>
                    <li className="mb-2"><a href="#members">Members</a></li>
                    <li className="mb-2"><a href="#events">Events</a></li>
                    <li className="mb-2"><a href="#projects">Projects</a></li>
                    <li className="mb-2"><a href="#settings">Settings</a></li>
                </ul>
            </nav>
        </aside>
    );
};

const MainContent = () => {
    return (
        <main className="p-4">
            <section id="members">
                <Members />
            </section>
        </main>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-200 text-center p-4">
            <p>© 2023 MSP. All rights reserved.</p>
        </footer>
    );
};

export default Dashboard;
