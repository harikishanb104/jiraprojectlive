import React , { useState }from 'react';
import Sidebar from '../sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import './mainlayout.css';
import logo from '../Kensiumlogo.svg';

const MainLayout = ({ onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {

        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`main-content-container ${isSidebarOpen ? 'sidebaropen' : ''}`}>
            <div className="sidebar">
                <Sidebar onLogout={onLogout} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div className="outlet">
                <Outlet /><div className='footerBlock'><img src={logo} className="App-logo"  style={{ width: '100px', height: '40px' }} alt="logo" />  2024 © Copyright Kensium . All Rights Reserved.</div>
            </div>

        </div>
    );
};

export default MainLayout;
