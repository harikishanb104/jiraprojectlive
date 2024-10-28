import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import config from '../config';
import { ThreeDots } from 'react-loader-spinner';
import './projects.css';
import {FaFileDownload, FaFileUpload} from "react-icons/fa";
import CustomAlert from "./customAlert";
import Modal from 'react-modal';
import ExcelJS from "exceljs";

const Projects = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [uploadResponse, setUploadResponse] = useState(null); // State to hold upload response
    const [errorLogsLink, setErrorLogsLink] = useState(null);
    const [editId, setEditId] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [Budget, setBudget] = useState("");
    const [excelData, setExcelData] = useState([]);
    const handleButtonClick = (id) => {
        navigate(`/assignproject/${id}`);
    };
    const handleButtonClick1 = (id,ProjectCategoryName,ProjectKey) => {
        navigate(`/projectstasks/${id}/${ProjectCategoryName}/${ProjectKey}`);
    };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Set initial loading state to true
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const LoginUsername = localStorage.getItem('LoginUserName');
    const RoleID = localStorage.getItem('roleID');
    const fetchData =()=>{
        axios.get(`${config.apiBaseUrl}/api/Project/GetProjects`)
            .then(response => {
                setData(response.data);
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false in case of error
            });
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleDownload = () => {
        const fileUrl = `${process.env.PUBLIC_URL}/uploadfile/Projects_sample.xlsx`; // Path to the file in the public folder
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Projects_sample.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    axios.post(`${config.apiBaseUrl}/api/Project/UploadProjectsExcel`, normalizedData)
                        .then(response => {
                            if (response.data === 'Data saved successfully') {
                                fetchData();  // Fetch data after successful upload
                                setAlertMessage('Data saved successfully.');
                                setIsModalOpen(false); // Close modal upon successful upload
                            } else if (response.data === 'ErrorLogs') {
                                setUploadResponse('ErrorLogs'); // Set upload response state
                                setErrorLogsLink('/projecterrorlogs'); // Set link to error logs
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

    const handleDoubleClick = (ProjectKey, Budget) => {
        setEditId(ProjectKey);
        setBudget(Budget);
        setShowInput(true);
    };
    const handleBlur = (id) => {
        const data2 = {
            ProjectKey: id,
            Budget: Budget
        };

      /*  if (Budget === '0' || Budget === '' || Budget === undefined) {
            setAlertMessage('Normalization factor value should be greater than 0');
            setEditId(null);
        } else if (Budget > 0 && Budget <= 2) {*/
            axios.post(`${config.apiBaseUrl}/api/Project/PostProjectBudget`, data2)
                .then(response => {
                    setData(prevData => prevData.map(item => item.ProjectKey === id ? { ...item, Budget: Budget } : item));
                    setEditId(null);
                    fetchData();
                    setAlertMessage('Budget saved successfully.');
                    setShowInput(false);
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    setAlertMessage('Failed to save Budget.');
                    setShowInput(false);
                    setEditId(null);
                });
       /* } else {
            setAlertMessage('Normalization factor value should be between 0 and 2.');
            setEditId(null);
        }*/
    };

    const columns = [
        {
            name: <strong>Project</strong>,
            cell: row => <span title={row.ProjectName}>{row.ProjectName}</span>,
            sortable: true,
        },
        {
            name: <strong>Project key</strong>,
            selector: row => row.ProjectKey,
            sortable: true,
        },
        {
            name: <strong>Project category</strong>,
            selector: row => row.ProjectCategoryName,
            sortable: true,
        },
        {
            name: <strong>Project type key</strong>,
            selector: row => row.ProjectTypeKey,
            sortable: true,
        },
        // {
        //     name: 'Budget',
        //     // selector: row => row.Budget,
        //     // sortable: true,
        //     selector: row => {
        //         const hours = parseFloat(row.Budget);
        //         return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
        //     },
        //     sortable: true,
        //     cell: row => editId === row.ProjectKey ? (
        //         <input
        //             type="text"
        //             value={Budget}
        //             onChange={e => setBudget(e.target.value)}
        //             onBlur={() => handleBlur(row.ProjectKey)}
        //             onKeyDown={(e) => {
        //                 if (e.key === 'Enter') {
        //                     handleBlur(row.ProjectKey);
        //                 }
        //             }}
        //             autoFocus
        //         />
        //     ) : (
        //         <div
        //             onDoubleClick={() => handleDoubleClick(row.ProjectKey, row.Budget || "")}
        //             style={{ cursor: 'pointer', padding: '25px', border: '0px solid blue', userSelect: 'none' }}
        //         >
        //             {row.Budget || ""}
        //         </div>
        //     )
        // }
        ...(RoleID === '1' ? [{
            name: 'Budget ($)',
            selector: row => {
                const hours = parseFloat(row.Budget);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
            cell: row => editId === row.ProjectKey ? (
                <input
                    type="text"
                    value={Budget}
                    onChange={e => setBudget(e.target.value)}
                    onBlur={() => handleBlur(row.ProjectKey)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleBlur(row.ProjectKey);
                        }
                    }}
                    autoFocus
                />
            ) : (
                <div
                    onDoubleClick={() => handleDoubleClick(row.ProjectKey, row.Budget || "")}
                    style={{ cursor: 'pointer', border: '0px solid blue', userSelect: 'none' }}
                >
                    {row.Budget || ""}
                </div>
            )
        }] : []),

        {
            name: 'Action',

            cell: row => (
                <>
                    <button
                        onClick={() => handleButtonClick(row.ProjectId)}
                        style={{ fontSize: '14px', padding: '6px 10px', width: '50%' }}
                    >
                        Resources
                    </button>
                    <button
                        onClick={() => handleButtonClick1(row.ProjectId)}
                        style={{ fontSize: '14px', padding: '6px 10px', width: '50%' }}
                    >
                        Task
                    </button>
                </>
            ),
            center: true,
        },

    ];


    const filteredItems = data?.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );

    const exportToExcel = async () => {
        if (filteredItems?.length > 0) {
            const formattedData = filteredItems?.map(({  ProjectName, ProjectKey, ProjectCategoryName, ProjectTypeKey, Budget  }) => ({
                'Project': ProjectName,
                'Project key': ProjectKey,
                'Project category': ProjectCategoryName,
                'Project type key': ProjectTypeKey,
                ...(RoleID === '1' && { 'Budget ($)': Budget })
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
            const filename = timestamp?.length > 0 ? `Projects.xlsx` : '';
            a.download = filename;
            a.click();

            window.URL.revokeObjectURL(url);
        } else {
            alert('No data available to export');
        }
    };

/*
    const exportToExcel = () => {
        const exportData = filterText ? filteredItems : data;
        if (exportData.length > 0) {
            const formattedData = exportData.map(({ ProjectName, ProjectKey, ProjectCategoryName, ProjectTypeKey, Budget }) => {
                const projectData = {
                    'Project': ProjectName,
                    'Project key': ProjectKey,
                    'Project category': ProjectCategoryName,
                    'Project type key': ProjectTypeKey,
                };
    
                if (RoleID === '1') {
                    projectData['Budget ($)'] = Budget;
                }
    
                return projectData;
            });
    
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = `Projects_${timestamp}.xlsx`;
            XLSX.writeFile(wb, filename);
        } else {
            alert('No data available to export');
        }
    };
*/

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
                    {data.length> 0 && (<button className='exportxls resource-button' onClick={exportToExcel}>
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}
                   
                    {RoleID === '1' && (
                    <button className='exportxls resource-button reportupload' onClick={() => setIsModalOpen(true)}
                    >
                        <FaFileUpload   /> <span className="resource-text">Update project</span>
                    </button>
                    )}
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, filteredItems, data]);


    return (
    <div>
        {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}

            <div className="header">
            <h1>Projects</h1>
        <h2 className="loginusername">Welcome {LoginUsername}!</h2></div>
        <DataTable
            className="custom-data-table"
            columns={columns}
            data={filteredItems}
            defaultSortField="name"
            striped
            pagination
            subHeader
            subHeaderComponent={subHeaderComponent}
            highlightOnHover
            responsive
            persistTableHead
            progressPending={loading}
            progressComponent={<ThreeDots className="three-dots-loader" />}
        />
        <Modal
            className="exportModal"
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Upload Excel Modal"
            ariaHideApp={false}
        >
            <h2>Update project details</h2>
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
export default Projects;