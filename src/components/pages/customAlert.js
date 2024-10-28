// CustomAlert.js
import React from 'react';
import './customAlert.css'; // Ensure to create this CSS file for styling
function CustomAlert({ message, onClose, style}) {
    if (!message) return null;
    return (
        <div className="custom-alert" style={style}>
            <div className="custom-alert-content">
                <p>{message}</p>
                <button className="alterclose" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
export default CustomAlert;
