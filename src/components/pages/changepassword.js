import React, { useState, useEffect } from 'react';
import './changepassword.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import config from "../config";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('PassWord');
    const loginUsername = localStorage.getItem('LoginUserName');

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    useEffect(() => {
        // Clear the error for old password if the user starts typing
        if (oldPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                oldPassword: undefined,
            }));
        }
    }, [oldPassword]);

    useEffect(() => {
        // Clear the error for new password if the user starts typing
        if (newPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                newPassword: undefined,
            }));
        }
    }, [newPassword]);

    useEffect(() => {
        // Clear the error for confirm new password if the user starts typing
        if (confirmNewPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmNewPassword: undefined,
            }));
        }
    }, [confirmNewPassword]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        setSuccess('');

        const validationErrors = {};

        // Check for empty fields first
        if (!oldPassword) validationErrors.oldPassword = 'Please provide the old password.';
        if (!newPassword) validationErrors.newPassword = 'Please provide the new password.';
        if (!confirmNewPassword) validationErrors.confirmNewPassword = 'Please provide the confirm password.';

        // Check specific password-related errors only if fields are not empty
        if (oldPassword && storedPassword !== oldPassword) validationErrors.oldPassword = 'Old password is not correct.';
        if (newPassword && newPassword.length < 6) validationErrors.newPassword = 'Password must have at least 6 characters.';
        if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) validationErrors.confirmNewPassword = "New password and confirm password don't match.";

        // If there are any validation errors, set them and stop the form submission
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Proceed with password change request
        axios.post(`${config.apiBaseUrl}/api/Login/PostUserChangePassword?UserName=${storedUsername}&newPassword=${confirmNewPassword}`)
            .then(response => {
                if (response?.data?.Message === "PassWord") {
                    setSuccess('Password changed successfully');
                } else {
                    setErrors({ changePassword: 'Password is not saved' });
                }
            })
            .catch(error => {
                console.error('Error changing password:', error);
                setErrors({ changePassword: 'An error occurred while changing the password.' });
            });
    };

    const reset = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrors({});
        setSuccess('');
    };

    return (
        <>
            <div className="header">
                <h1>Change Password</h1>
                <h2 className="loginusername">Welcome {loginUsername}!</h2>
            </div>
            <div className="change-password-container">
                <form onSubmit={handleSubmit}>
                    {errors.changePassword && <p className="required">{errors.changePassword}</p>}
                    {errors.oldPassword && <p className="required">{errors.oldPassword}</p>}
                    {errors.newPassword && <p className="required">{errors.newPassword}</p>}
                    {errors.confirmNewPassword && <p className="required">{errors.confirmNewPassword}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    
                    <div className="forgetpassword">
                        <label htmlFor="oldPassword">Old password <span className="required"> *</span></label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Old password"
                        />
                        <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="forgetpassword">
                        <label htmlFor="newPassword">New password <span className="required"> *</span></label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                        />
                        <span className="changepassword-toggle-icon" onClick={toggleNewPasswordVisibility}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="forgetpassword">
                        <label htmlFor="confirmNewPassword">Confirm password <span className="required"> *</span></label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                        <span className="changepassword-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button className="password" type="submit">Change Password</button>
                    <button className="password button-spacing" type="button" onClick={reset}>Reset</button>
                </form>
            </div>
        </>
    );
};

export default ChangePassword;
