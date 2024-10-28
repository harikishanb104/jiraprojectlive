import React, {useState, useEffect, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import * as XLSX from 'xlsx';
import config from '../config';
import CustomAlert from './customAlert';
import './assignProject.css';
import { Tooltip } from 'react-tooltip';
import {FaArrowCircleLeft, FaFileDownload, FaFileUpload} from "react-icons/fa";
import './restrictionerrorlogs.css'
import FilterComponent from "./FilterComponent";
import ExcelJS from "exceljs";

const RestrictionErrorlogs =()=> {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertStyle, setAlertStyle] = useState({});
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const RoleID = localStorage.getItem('roleID');
    const navigate = useNavigate();
    const handleButtonClick = (id) => {
        console.log('Button clicked, ID:', id);
        setLoading(true);
        axios.post(`${config.apiBaseUrl}api/User/IgnoreError/${id}`)
            .then(response => {
                console.log('Response:', response);
                let message = response.data;
                let style = {};
                if (response.data === 'Error has been removed.') {
                    style = { color: 'green', fontWeight: 'bold' };
                } else if (response.data === 'Ignoring failed please try again') {
                    style = { color: 'red' };
                } else {
                    message = 'Action completed successfully.';
                }
                setAlertMessage(message);
                setAlertStyle(style);
                setLoading(false);
                fetchData(); // Re-fetch data to update the table
            })
            .catch(error => {
                console.error('Error:', error);
                const errorMessage = error.response?.data?.message || 'An error occurred, please try again.';
                setAlertMessage(errorMessage);
                setAlertStyle({ color: 'red' });
                setLoading(false);
            });
    };
    const fetchData = () => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/User/GetErrorlogs`)
            .then(response => {
                console.log('API Response:', response.data);
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setData([]); // Set data to empty array if fetching fails
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBack = () => {
        navigate('/users');
    };

    const filteredItems = data?.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );


    const exportToExcel = async () => {
        if (filteredItems?.length > 0) {
            const formattedData = filteredItems?.map(({  EmailAddress, EmployeeCode, NormalizationFactor, CTC, ErrorDescription,Designation,Department }) => ({
                'Email address': EmailAddress,
                'Employee code': EmployeeCode,
                'Normalization factor': NormalizationFactor,
                'Error description':ErrorDescription,
                'Designation':Designation,
                'Department':Department,
                ...(RoleID === '4' && { 'CTC': CTC }) // Only include 'CTC' for RoleID 4
            }));

            const wb = new ExcelJS.Workbook();
            const ws = wb.addWorksheet('Sheet1');

            const headers = Object?.keys(formattedData[0]);
            const filteredHeaders = headers.filter(header => header !== 'User' || formattedData.some(data => data['User'] !== ''));

            // Set headers with bold formatting
            ws.columns = filteredHeaders.map(header => ({
                header: header,
                key: header.toLowerCase().replace(/ /g, '_'),
                width: 20,
            }));

            // Apply bold formatting to header row
            ws.getRow(1).font = { bold: true };

            // Add data rows
            formattedData.forEach(item => {
                const row = {};
                filteredHeaders.forEach(header => {
                    row[header.toLowerCase().replace(/ /g, '_')] = item[header];
                });
                ws.addRow(row);
            });

            // Generate and download Excel file
            const buffer = await wb.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp?.length > 0 ? `Users.xlsx` : '';
            a.download = filename;
            a.click();

            window.URL.revokeObjectURL(url);
        } else {
            alert('No data available to export');
        }
    };

    // Columns configuration for DataTable
    const convertToINR = (ctc) => {
        // Assuming `ctc` is already in INR
        const formattedINR = ctc.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `₹ ${formattedINR}`;
    };

    const columns = [
        { name: 'Email address', selector: row => row.EmailAddress, sortable: true },
        { name: 'Employee code', selector: row => row.EmployeeCode, sortable: true },
        { name: 'Normalization factor', selector: row => row.NormalizationFactor || "", sortable: true },
        {
            name: 'Error description',
            selector: row => row.ErrorDescription || "",
            sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.ErrorDescription || ""}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.ErrorDescription || ""}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid" />
                </div>
            )
        },
        { name: 'Designation', selector: row => row.Designation || "", sortable: true },
        { name: 'Department', selector: row => row.Department || "", sortable: true },
        {
            name: 'Action',
            cell: row => (
                <>
                    <button
                        onClick={() => handleButtonClick(row.ErrorLogId)}
                        style={{ fontSize: '14px', padding: '6px 10px', width: '50%' }}
                    >
                        ignore
                    </button>
                </>
            ),
        },
    ];
    if (RoleID === '4') {
        columns.splice(columns.length - 1, 0, {
            name:<strong>CTC</strong>,
            selector: row => convertToINR(row.CTC),
            sortable: true,
        });
    }
   // { name: 'CTC', selector: row => row.CTC, sortable: true },

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: 'grey',
                color: 'white',
                fontWeight: 'bold',
            },
        },
    };

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };
        return (
            <>
                <div className="project-filter SearchFilter">
                    <label className="searchlabel">Search</label>
                    <FilterComponent
                        className="my-filter-class"
                        onFilter={e => setFilterText(e.target.value)}
                        onClear={handleClear}
                        filterText={filterText}
                    />
                    {data.length > 0 && (<button className='exportxls resource-button' onClick={exportToExcel}>
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}


                </div>
            </>
        );
    }, [filterText, filteredItems, data]);

   return (
        <div>
            {loading ? (
                <div className="loader">
                    <ThreeDots color="#00BFFF" height={100} width={100} />
                </div>
            ) : (
                <>
                    <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} style={alertStyle} />
                    <div className="header">
                        <h1>Errorlogs</h1>
                        <button className="backbutton" onClick={handleBack}>
                            <FaArrowCircleLeft/> Back
                        </button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={filteredItems} // Ensure to pass the data state
                        customStyles={customStyles}
                        highlightOnHover
                        striped
                        dense
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                        subHeader
                        subHeaderComponent={subHeaderComponent}
                    />
                </>
            )}
        </div>
    );
}

export default RestrictionErrorlogs;
