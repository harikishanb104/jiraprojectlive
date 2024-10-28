import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import config from '../config';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import Modal from 'react-modal';

// Set the app element for accessibility
// Modal.setAppElement('#root');

const Login = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [forgotUsername, setForgotUsername] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => setUsername(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const handleForgotUsernameChange = (event) => setForgotUsername(event.target.value);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/Login/PostValidUser`, null, {
                params: { UserName: username, Password: password }
            });
            setLoading(false);

            if (response.data.Message === "Sucess") {
                localStorage.setItem('userID', response.data.UserID);
                localStorage.setItem('roleID', response.data.RoleID);
                localStorage.setItem('LoginUserName', response.data.UserName);
                localStorage.setItem('PassWord', response.data.Password);
                onLogin(username);
                navigate('/projects');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    const togglePopup = () => {
        setIsModalOpen(true);
        setIsPopupOpen(true); // Add this line to toggle the class
    };

    const closeModal = () => {
        console.log("Close Modal called"); // Debug log
        setIsModalOpen(false);
        setIsPopupOpen(false); // Add this line to remove the class
        setForgotUsername('');
        setError('');
    };

    const handleForgotPasswordSubmit = async (event) => {
      //  event.preventDefault();

        setSuccessMessage('');
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/Login/PostForgetPassword`, null, {
                params: { UserName: forgotUsername }
            });

            if (response.data.Message === "Sucess") {
                setSuccessMessage(`A temporary password has been sent to ${response.data.EmailAddress}`);
             //   setIsModalOpen(false);
                setError('');
                setForgotUsername(''); // Clear the input
            } else {
                setError('Invalid username');
            }
        } catch (error) {

            setError('An error occurred. Please try again.');
        }
    };

    const modalContent = useMemo(() => {
        setSuccessMessage('');
         return (
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Forgot Password"
                className="exportModalPopup"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
            >
                <div>
                    <h3 >Forgot Password</h3>
                    {successMessage && <p className="successmessage">{successMessage}</p>}
                    <div className="form-group">
                        <label className="forgotpasswordusername" htmlFor="forgotUsername">Username</label>
                        <input
                            type="text"
                            id="forgotUsername"
                            value={forgotUsername}
                            onChange={handleForgotUsernameChange}
                            placeholder="Enter your username"
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="submit">
                        <button onClick={handleForgotPasswordSubmit}>Submit</button>
                        <button onClick={closeModal}>Close</button>
                    </div>


                </div>
            </Modal>
        );
    }, [isModalOpen, forgotUsername, error]);

    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <ThreeDots height="80" width="80" color="#4fa94d" ariaLabel="loading" />
                </div>
            ) : (
                <div className={`login-container ${isPopupOpen ? 'openclass' : ''}`}>
                    <div className="login-form">
                        <h2 className='loginheader'>Login</h2>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                                placeholder="Username"
                                id="username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                                    placeholder="Password"
                                    id="password"
                                />
                                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleLogin}>Login</button>
                        <p className="forgot-password-link" onClick={togglePopup}>Forgot Password?</p>
                        {error && (
                            <p style={{ color: 'red' }}>{error}</p>
                        )}
                    </div>
                </div>
            )}
            {modalContent}
        </>
    );
};

export default Login;
