import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import FilterComponent from './FilterComponent';
import config from '../config';
import './users.css';
import { ThreeDots } from 'react-loader-spinner';
import CustomAlert from "./customAlert";
import Modal from 'react-modal';
import axios from 'axios';
import {FaSync, FaTasks, FaFileDownload, FaFileUpload} from "react-icons/fa";
import DownloadFileButton from './downloadFile';
import { json } from 'react-router-dom';
import {Tooltip} from "react-tooltip";
import ExcelJS from "exceljs";

const Users = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [normalizationFactor, setNormalizationFactor] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [excelData, setExcelData] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [uploadResponse, setUploadResponse] = useState(null); // State to hold upload response
    const [errorLogsLink, setErrorLogsLink] = useState(null); // State to hold error logs link
    const [savedSuccessfully, setSavedSuccessfully] = useState(false); // State to track successful save

   const LoginUsername = localStorage.getItem('LoginUserName');
    const RoleID = localStorage.getItem('roleID');
    const UserId = localStorage.getItem('userID');
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');
    }, []);
    const fetchData = () => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/User/GetUsers?UserId=${UserId}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDoubleClick = (id, currentFactor) => {
        setEditId(id);
        setNormalizationFactor(currentFactor);
        setShowInput(true);
    };

    const handleBlur = (id) => {
        const data2 = {
            UserAccountId: id,
            NormalizationFactor: normalizationFactor
        };

        if (normalizationFactor === '0' || normalizationFactor === '' || normalizationFactor === undefined) {
            setAlertMessage('Normalization factor value should be greater than 0');
            setEditId(null);
        } else if (normalizationFactor > 0 && normalizationFactor <= 2) {
            axios.post(`${config.apiBaseUrl}/api/User/PostUserNormalizationFactor`, data2)
                .then(response => {
                    setData(prevData => prevData.map(item => item.UserAccountId === id ? { ...item, NormalizationFactor: normalizationFactor } : item));
                    setEditId(null);
                    setAlertMessage('Normalization factor saved successfully.');
                    setShowInput(false);
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    setAlertMessage('Failed to save normalization factor.');
                    setShowInput(false);
                    setEditId(null);
                });
        } else {
            setAlertMessage('Normalization factor value should be between 0 and 2.');
            setEditId(null);
        }
    };

    const handleButtonClick = (UserAccountId) => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/TimeSheet/PostUpdateTimeSheetAsync?UserAccountId=${UserAccountId}`)
            .then(response => {
                if (response.data === true) {
                    setLoading(false);
                    setAlertMessage('Successfully synced.');
                } else {
                    setLoading(false);
                    setAlertMessage('Timesheet not logged.');
                }
                setShowInput(false);
            })
            .catch(error => {
                console.error('Error saving data:', error);
                setAlertMessage('Failed to save normalization factor.');
                setShowInput(false);
                setEditId(null);
            });
    };
    const convertToINR = (ctc) => {
        // Assuming `ctc` is already in INR
        const formattedINR = ctc.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `₹ ${formattedINR}`;
    };
    const columns = [
        {
            name:<strong>User</strong>,
            selector: row => row.UserName,
            sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.UserName}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.UserName}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )        },
        {
            name:<strong>Employee code</strong>,
            selector: row => row.EmployeeCode,
            sortable: true,
        },
        {
            name:<strong>Designation</strong>,
            selector: row => row.Designation,
            sortable: true,
        },
        {
            name:<strong>Department</strong>,
            selector: row => row.Department,
            sortable: true,
        },
        {
            name:<strong>Email address</strong>,
            selector: row => row.EmailAddress,
            sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.EmailAddress}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.EmailAddress}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },
        {
            name:<strong>Reporting manger</strong>,
            selector: row => row.ReportingManager,
            sortable: true,
        },
        {
            name:<strong>Normalization factor</strong>,
            selector: row => {
                const hours = parseFloat(row.NormalizationFactor);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
            cell: row => editId === row.UserAccountId ? (
                <input
                    type="text"
                    value={normalizationFactor}
                    onChange={e => setNormalizationFactor(e.target.value)}
                    onBlur={() => handleBlur(row.UserAccountId)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleBlur(row.UserAccountId);
                        }
                    }}
                    autoFocus
                />
            ) : (
                <div
                    onDoubleClick={() => handleDoubleClick(row.UserAccountId, row.NormalizationFactor || "")}
                    style={{ cursor: 'pointer', padding: '25px', border: '0px solid blue', userSelect: 'none' }}
                >
                    {row.NormalizationFactor || ""}
                </div>
            ),
        },
        {
            name:<strong>Role name</strong>,
            selector: row => row.RoleName,
            sortable: true,
        },
        {
            name:<strong>Task</strong>,
            cell: row => (
                <button
                    onClick={() => handleButtonClick(row.UserAccountId)}
                    className="resource-button"
                >
                    <FaSync className="resource-icon" /> <span className="resource-text">Sync</span>
                </button>
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
    const handleDownload = () => {
        let fileUrl = '';
        if(RoleID =='4')
        {
         fileUrl = `${process.env.PUBLIC_URL}/uploadfile/usersampledata.xlsx`; // Path to the file in the public folder
        } 
        else{
             fileUrl = `${process.env.PUBLIC_URL}/uploadfile/usersamplesdata.xlsx`;
        }
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'User_sample.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    const filteredItems = data.filter(
        item => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );

    const exportToExcel = async () => {
        if (filteredItems?.length > 0) {
            const formattedData = filteredItems?.map(({ UserName, Department, Designation, EmployeeCode, EmailAddress, ReportingManager, NormalizationFactor, RoleName, CTC }) => ({
                'User': UserName,
                'Employee code': EmployeeCode,
                'Designation': Designation,
                'Department': Department,
                'Email address': EmailAddress,
                'Reporting manager': ReportingManager,
                'Normalization factor': NormalizationFactor,
                'RoleName': RoleName,
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


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    // Normalize column names
                    const normalizedData = jsonData.map(row => {
                        const normalizedRow = {};
                        Object.keys(row).forEach(key => {
                            normalizedRow[key.trim().toLowerCase()] = row[key];
                        });
                        return normalizedRow;
                    });
                    axios.post(`${config.apiBaseUrl}/api/User/UploadExcel`, normalizedData)
                        .then(response => {
                            if (response.data === 'Data saved successfully') {
                                fetchData();  // Fetch data after successful upload
                                setAlertMessage('Data saved successfully.');
                                setIsModalOpen(false); // Close modal upon successful upload
                            } else if (response.data === 'ErrorLogs') {
                                setUploadResponse('ErrorLogs'); // Set upload response state
                                setErrorLogsLink('/Errorlogs'); // Set link to error logs
                            }
                        })
                        .catch(error => {
                            setError('Error uploading Excel file');
                            console.error(error);
                        })
                        .finally(() => setLoading(false));

                    setExcelData(normalizedData);
                    setError(null);
                } catch (err) {
                    setError('Error reading the Excel file');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            reader.onerror = (err) => {
                setError('Error reading the file');
                console.error(err);
                setLoading(false);
            };
            reader.readAsArrayBuffer(file);
            setLoading(true);
        }
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
                        onFilter={e => setFilterText(e.target.value)}
                        onClear={handleClear}
                        filterText={filterText}
                    />
                    {data.length> 0 && (  <button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}

                    <button className='exportxls resource-button reportupload' onClick={() => setIsModalOpen(true)}
                    >
                        <FaFileUpload   /> <span className="resource-text">Update users</span>
                    </button>
                       {/* <button className='uploadxl' onClick={() => setIsModalOpen(true)}
                                style={{ fontSize: '14px', padding: '6px 10px', width:'10%', background:'blue', marginLeft: '10px' }}
                        >
                            Update users
                        </button>*/}
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, filteredItems]);

    return (
        <div>
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <div className="header">
                <h1>Users</h1>
                <h2 className="loginusername">Welcome {LoginUsername}!</h2></div>
            <DataTable
                className="custom-data-table"
                columns={columns}
                data={filteredItems}
                defaultSortField="UserName"
                striped
                pagination
                subHeader
                subHeaderComponent={subHeaderComponent}
                highlightOnHover
                responsive
                persistTableHead
                progressPending={loading}
                progressComponent={<ThreeDots className="three-dots-loader"  />
                }
            />
            <Modal
                className="exportModal"
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Upload Excel Modal"
                ariaHideApp={false}
            >
                <h2>Update user details</h2>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <button  className="samplefile-link custom-btn" onClick={handleDownload}>
                    Download sample file
                </button>
                {uploadResponse === 'Data saved successfully' && <p style={{color:'green'}}><b>Data saved successfully</b></p>}
                {uploadResponse === 'ErrorLogs' && <a href={errorLogsLink}><b style={{color:'red'}}>Errorlogs</b></a>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className="custom-icon" onClick={() => setIsModalOpen(false)}>X</button>
            </Modal>
        </div>
    );
};

export default Users;




