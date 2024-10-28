import React, {useEffect, useState} from 'react';
import Consumedvsbudgetedhours from "./selectreports/consumedvsbudgetedhours";
import ProductivityReport from "./selectreports/productivityReport";
import NormalizedHoursReport from "./selectreports/normalizedHoursReport";
import ProfitabilityReport from "./selectreports/profitabilityReport"
import './reports.css';

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('');
    const [username, setUsername] = useState('');
    const handleReportChange = (e) => {
        setSelectedReport(e.target.value);
       // setSelectedDetail(''); // Reset the detailed report selection
    };
    const RoleID = localStorage.getItem('roleID');
    const LoginUsername = localStorage.getItem('LoginUserName');


    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');
    }, []);
    return (
        <div>
            <div className="header">
                <h1>Reports</h1>
                <h2 className="loginusername">Welcome {LoginUsername}!</h2></div>
            <div className="project-filter productvityselectreport">
                <label  htmlFor="report-select">Select Report </label>
                <select id="report-select" value={selectedReport} onChange={handleReportChange} className="project-select">
                    <option value="">Select</option>
                    {/* <option value="1">Budgeted vs Consumed Hours</option> */}
                    <option value="2">Productivity Report</option>
                    {/* <option value="3">Normalized Hours Report</option> */}
                    {RoleID === '1' &&  <option value="4">Profitability Report</option>}

                </select>
            </div>
            {selectedReport === '1' && (
                <>
                    <Consumedvsbudgetedhours />
                </>
            )}
            {selectedReport === '2' && (
                <>
                    <ProductivityReport />
                </>
            )} {selectedReport === '3' && (
                <>
                    <NormalizedHoursReport/>
                </>
            )}
            {RoleID === '1' && selectedReport === '4' && (
                <>
                    <ProfitabilityReport/>
                </>
            )}

        </div>
    );
};

export default Reports;




