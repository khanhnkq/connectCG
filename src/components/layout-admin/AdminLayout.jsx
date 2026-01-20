import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children, title, activeTab, brandName }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-white font-display">
            <Sidebar brandName={brandName} activeTab={activeTab} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title={title} />
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#140d08]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
