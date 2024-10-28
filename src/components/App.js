import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./login/login";
import DashboardPage from "./pages/Dashboard";
import Projects from "./pages/projects";
import Users from "./pages/users";
import MainLayout from './layout/mainlayout';
import AssignProject from "./pages/Assignproject";
import TimeSheet from './pages/timesheet';
import Issue from './pages/issue';
import Jira from './pages/jira';
import Reports from './pages/report/reports';
import Dummy from './pages/dummy';
import ProjectTasks from './pages/projectTasks';
import RestrictionErrorlogs from './pages/restrictionerrorlogs.js';
import ProjectErrorLogs from './pages/projecterrorlogs';
import ChangePassword from './pages/changepassword'
function App() {

    const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    //5 * 60 * 1000; 5min

    const isSessionValid = () => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        const loginTime = localStorage.getItem('loginTime');
        const currentTime = new Date().getTime();
        return loggedIn && loginTime && currentTime - parseInt(loginTime) < SESSION_TIMEOUT
            //5 * 60 * 1000; 5min
    };

    const [isLoggedIn, setIsLoggedIn] = useState(() => isSessionValid());
    const [username, setUsername] = useState('');
    let idleTimer;

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        if (isLoggedIn) {
            idleTimer = setTimeout(handleLogout, SESSION_TIMEOUT); // 5 minutes
        }
    };

    const handleUserActivity = () => {
        const currentTime = new Date().getTime();
        localStorage.setItem('loginTime', currentTime.toString());
        resetIdleTimer();
    };

    useEffect(() => {
        const handleUrlChange = () => {
            const currentPath = window.location.pathname;
            localStorage.setItem('currentUrl', currentPath);
            // If the user navigates to /login, log them out
            if (currentPath === '/login') {
                handleLogout();
            }
        };

        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('pushstate', handleUrlChange); // For programmatic navigations
        const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, handleUserActivity));

        // Set up a session timeout check
        const sessionTimer = setInterval(() => {
            if (isLoggedIn && !isSessionValid()) {
                handleLogout();
            }
        }, 1000); // Check every second

        // Initialize idle timer
        resetIdleTimer();

        // Cleanup function
        return () => {
            clearInterval(sessionTimer);
            clearTimeout(idleTimer);
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('pushstate', handleUrlChange);
            events.forEach(event => window.removeEventListener(event, handleUserActivity));
        };
    }, [isLoggedIn]);

    const handleLogin = (username) => {
        const currentTime = new Date().getTime();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', currentTime.toString());
        localStorage.setItem('username', username);
        setUsername(username);
        setIsLoggedIn(true);
        resetIdleTimer();
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    {isLoggedIn ? (
                        <Route path="/" element={<MainLayout onLogout={handleLogout} />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/timesheet" element={<TimeSheet />} />
                            <Route path="/assignproject/:id" element={<AssignProject />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/issue" element={<Issue />} />
                            <Route path="/jira" element={<Jira />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/projectstasks/:id/:ProjectCategoryName/:ProjectKey" element={<ProjectTasks />} />
                            <Route path="/errorlogs" element={<RestrictionErrorlogs  />} />
                            <Route path="/projecterrorlogs" element={<ProjectErrorLogs  />} />
                            <Route path="/changepassword" element={<ChangePassword  />} />
                             <Route path="/dummy" element={<Dummy />} />
                        </Route>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
