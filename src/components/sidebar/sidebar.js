import React, {useState} from 'react';
import {
    FaTh,
    FaBars,
    FaProductHunt,
    FaWpforms,
    FaUser,
    FaExchangeAlt,
    FaFileAlt,
    FaArrowAltCircleLeft,
    FaAtlassian,

} from "react-icons/fa";
import {NavLink} from 'react-router-dom';
import logo from '../Kensiumlogo.svg';
import './sidebar.css'
import {useNavigate} from 'react-router-dom';


const Sidebar = ({children, isOpen, toggleSidebar, onLogout}) => {

    /*   const[isOpen ,setIsOpen] = useState(false);
       const toggle = () => setIsOpen (!isOpen);*/

    const navigate = useNavigate();

    // Function to handle logout button click
    const handleLogoutClick = () => {
        onLogout(); // Call the onLogout function passed as a prop
        navigate('/login'); // Navigate to the login page
    };
    const menuItem = [


        {
            path: "/dashboard",
            name: "Dashboard",
            icon: <FaTh/>
        },
        {
            path: "/users",
            name: "Users",
            icon: <FaUser/>
        },
        {
            path: "/projects",
            name: "Projects ",
            icon: <FaProductHunt/>
        },
        {
            path: "/timesheet",
            name: "Timesheets",
            icon: <FaWpforms/>,

        },

        {
            path: "/jira",
            name: "Atlassian",
            icon: <FaAtlassian/>

        },
        {
            path: "/reports",
            name: "Reports",
            icon: <FaFileAlt/>
        },
        {
            path: "/changepassword",
            name: "Change password",
            icon: <FaExchangeAlt/>
        },


    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{maxWidth: isOpen ? "200px" : "50px"}}>
            <div className="top_section">
                <h1 style={{display: isOpen ? "block" : "none"}} className="logo">
                    <img src={logo} className="App-logo" style={{width: '100px', height: '40px'}} alt="logo"/>
                </h1>
                <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                    <FaBars onClick={toggleSidebar}/>
                </div>
            </div>
            {menuItem.map((item, index) => (
                <NavLink to={item.path} key={index} className="link" activeclassName="active" title={item.name}>
                    <div className="icon">{item.icon}</div>
                    <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                </NavLink>
            ))}
            <button className={`logout-btn ${isOpen ? 'isOpen' : 'logout-btn'}`} onClick={handleLogoutClick}
                    title="Logout">
                <FaArrowAltCircleLeft/> <span
                className={`logout-btn-txt ${isOpen ? 'logout-btn-block' : 'logout-btn-txt'}`}>Logout</span>
            </button>
        </div>
    );

};

export default Sidebar;