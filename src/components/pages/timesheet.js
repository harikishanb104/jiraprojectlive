import React, {useState, useEffect, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {ThreeDots} from 'react-loader-spinner';
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './timesheet.css';
import config from '../config';
import CustomAlert from './customAlert';
import FilterComponent from './FilterComponent';
import {FaFileDownload,FaFileUpload} from "react-icons/fa";
import Modal from "react-modal";
import DownloadFileButton from './downloadFile';
import ExcelJS from "exceljs";

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
const TimeSheet = () => {
    const [data, setData] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [editId, setEditId] = useState(null);
    const [normalizationFactor, setNormalizationFactor] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [invoice, setInvoiced] = useState("0");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [errorLogsLink, setErrorLogsLink] = useState(null);
    const [error, setError] = useState(null);

   // const [excelData, setExcelData] = useState([]);
    const LoginUsername = localStorage.getItem('LoginUserName');
   const UserId = localStorage.getItem('userID');

    useEffect(() => {
        setLoading(true);
        const fetchTimeSheetWorkLogs = axios.get(`${config.apiBaseUrl}/api/TimeSheet/GetTimeSheetWorkLogs?UserId=${UserId}`);
        const fetchProjects = axios.get(`${config.apiBaseUrl}/api/Project/GetProjects`);
        Promise.all([fetchTimeSheetWorkLogs, fetchProjects])
            .then(([timesheetResponse, projectsResponse]) => {
                setData(timesheetResponse?.data?.timesheetList);
                setProjects(projectsResponse?.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
        const today = new Date();
        const todayDayOfWeek = today.getDay(); // Current day of the week (0-6, 0=Sunday)
        const daysSinceLastMonday = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1; // Days since last Monday (0-6)
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - daysSinceLastMonday - 7); // Calculate last Monday
        const lastFriday = new Date(lastMonday);
        lastFriday.setDate(lastMonday.getDate() + 6); // Calculate last Friday
        setFromDate(formatDate(lastMonday));
        setToDate(formatDate(lastFriday));
    }, []);
    const SearchFilteredData = () => {
        if (fromDate < toDate || fromDate === toDate) {
            const projectID = projects.find(project => project.ProjectName === selectedProject)?.ProjectId || '';
            const invoicedValue = invoice;
            setLoading(true);
            axios.get(`${config.apiBaseUrl}/api/TimeSheet/GetTimeSheetWorkLogsFilters?ProjectID=${projectID}&StartDate=${fromDate}&EndDate=${toDate}&Invoiced=${invoicedValue}&UserId=${UserId}`)
                .then(response => {
                    setData(response?.data?.timesheetList);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                    setLoading(false);
                });
        }else {
            setAlertMessage('Start date should be greater than end date')
        }
    };
    const resetFilters = () => {
        const today = new Date();
        const todayDayOfWeek = today.getDay(); // Current day of the week (0-6, 0=Sunday)
        const daysSinceLastMonday = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1; // Days since last Monday (0-6)
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - daysSinceLastMonday - 7); // Calculate last Monday
        const lastFriday = new Date(lastMonday);
        lastFriday.setDate(lastMonday.getDate() + 4); // Calculate last Friday
        setSelectedProject('');
        setFromDate(formatDate(formatDate(lastMonday))); // Set to today's date or adjust as needed
        setToDate(formatDate(formatDate(lastFriday))); // Set to today's date or adjust as needed
        setFilterText('');
        setInvoiced("0");
        setResetPaginationToggle(!resetPaginationToggle);
        const invoicedValue = 0;
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/TimeSheet/GetTimeSheetWorkLogsFilters?ProjectID=${""}&StartDate=${fromDate}&EndDate=${toDate}&Invoiced=${invoicedValue}`)
            .then(response => {
                setData(response?.data?.timesheetList);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                setLoading(false);
            });
        setFilterText('');
    };

    const handleDownload = () => {
        const fileUrl = `${process.env.PUBLIC_URL}/uploadfile/TimeSheetSampleExcel.xlsx`; // Path to the file in the public folder
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'TimeSheetSampleExcel.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };


const filteredItems = data?.filter(item => {
        const searchText = filterText.toLowerCase();
        return ['ProjectKey', 'ProjectName', 'Task' ,'ResourceName']?.some(field =>
            item[field].toLowerCase().includes(searchText)
        );
    });

    const exportToExcel = async () => {
        if (filteredItems?.length > 0) {
            const formattedData = filteredItems?.map(({  WorklogId, ProjectKey, ProjectName, IssueKey, Task, ResourceName, Description, WorkloggedDate, LoggedHours, NormalisationFactor, InvoicedHours, IsInvoiced }) => ({
                'Worklog Id': WorklogId,
                'Project key': ProjectKey,
                'Project ': ProjectName,
                'Task key': IssueKey,
                'Task': Task,
                'Resource': ResourceName,
                'Description ': Description,
                'Date': WorkloggedDate,
                'Logged hours': LoggedHours,
                'Normalized hours': NormalisationFactor,
                'Invoiced hours': InvoicedHours,
                'Invoiced': IsInvoiced === '1' ? 'Yes' : 'No'
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
            const filename = timestamp?.length > 0 ? `Timesheet.xlsx` : '';
            a.download = filename;
            a.click();

            window.URL.revokeObjectURL(url);
        } else {
            alert('No data available to export');
        }
    };

    /*
        const exportToExcel = () => {
            if (filteredItems?.length > 0) {
                const formattedData = filteredItems?.map(({WorklogId, ProjectKey, ProjectName, IssueKey, Task, ResourceName, Description, WorkloggedDate, LoggedHours, NormalisationFactor, InvoicedHours, IsInvoiced}) => ({
                    'Worklog Id': WorklogId,
                    'Project key': ProjectKey,
                    'Project ': ProjectName,
                    'Task key': IssueKey,
                    'Task': Task,
                    'Resource': ResourceName,
                    'Description ': Description,
                    'Date': WorkloggedDate,
                    'Logged hours': LoggedHours,
                    'Normalized hours': NormalisationFactor,
                    'Invoiced hours': InvoicedHours,
                    'Invoiced': IsInvoiced === '1' ? 'Yes' : 'No'
                }));
                const ws = XLSX.utils.json_to_sheet(formattedData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
                const filename = timestamp.length > 0 ? `TimeSheets.xlsx` : `TimeSheets${timestamp}.xlsx`;
                XLSX.writeFile(wb, filename);
            } else {
                alert('No data available to export');
            }
        };
    */
    const exportToAcumatica = () => {
        if (data?.length > 0) {
            const formattedData = data?.map(({ProjectId, ProjectName, ProjectIssueId, InvoicedHours, Description}) => ({
                'Client ID': '',
                'Client Name': '',
                'Project ID': ProjectId,
                'Project Name ': ProjectName,
                'Project Task ID': ProjectIssueId,
                'Invoice Date': '',
                'Invoice No': InvoicedHours,
                'Service Code': '',
                'Work Performed': '',
                'Count': '',
                'Rate': '',
                'Unit': '',
                'Total': '',
                'Terms': '',
                'Comments': '',
                'Location': '',
                'Class': '',
                'Account Subcode': '',
                'MSA Date': '',
                'SOW/CR Date': '',
                'Contract ID': '',
                'Service period': '',
                'Description': Description,
            }));
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp.length > 0 ? `TimeSheets.xlsx` : `TimeSheets${timestamp}.xlsx`;
            XLSX.writeFile(wb, filename);
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

                           // console.log(jsonData);

                            const requiredKeys = [
                                'Hours', 'BilledHours', 'Workdate', 'WorkDescription',
                                'Datecreated', 'Dateupdated', 'IssueKey', 'Issuesummary',
                                'ProjectKey', 'ProjectName', 'UserAccountID', 'Fullname', 'Account','TempoWorklogID',
                            ];
                            const filteredData = jsonData.map(entry => {
                                let formattedEntry = {};
                                for (let key in entry) {
                                    const formattedKey = key.replace(/\s+/g, '');
                                    if (requiredKeys.includes(formattedKey)) {
                                        formattedEntry[formattedKey] = entry[key];
                                    }
                                }
                                 return formattedEntry;
                            });
                            const finalData = filteredData.filter(entry => Object.keys(entry).length > 0);
                             //console.log(finalData);
                            axios.post(`${config.apiBaseUrl}/api/TimeSheet/UploadTimeSheet`, finalData)
                                .then(response => {
                                    if (response.data === 'Data saved successfully') {
                                        setData();
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
                setFilterText('');
            }
        };
        return (
            <>
                <div className="sub-header">
                    <div className="project-filter">
                        <label htmlFor="project-select">Project</label>
                        <select
                            id="project-select"
                            onChange={e => setSelectedProject(e.target.value)}
                            value={selectedProject}
                            className="project-select"
                        >
                            <option value="">All Projects</option>
                            {projects.map(project => (
                                <option key={project.ProjectId} value={project.ProjectName}>
                                    {project.ProjectName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="project-filter">
                        <label htmlFor="project-select">Invoiced</label>
                        <select
                            id="invoice-select"
                            onChange={e => setInvoiced(e.target.value)}
                            value={invoice}
                            className="project-select"
                        >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                            <option value="2">Both</option>
                        </select>
                    </div>
                </div>
                <div className="date-filter-date">
                    <div className="date-filter">
                        <label htmlFor="from-date">Start date</label>
                        <input
                            className="dateinput"
                            type="date"
                            id="from-date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                        />
                        <label htmlFor="to-date">End date</label>
                        <input
                            className="dateinput"
                            type="date"
                            id="to-date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="date-filter">
                            <button className='search' onClick={SearchFilteredData}>Search</button>
                            <button className='reset' onClick={resetFilters}>Reset</button>
                        </div>
                    </div>
                </div>
                <div className="sub-header">
                    <div className="project-filter SearchFilter">
                        <label className="searchlabels">Search</label>
                        <FilterComponent
                            onFilter={e => setFilterText(e.target.value)}
                            onClear={handleClear}
                            filterText={filterText}
                        />
                        {data?.length> 0 && (  <button className='exportxls resource-button acumatica-buttons' onClick={exportToAcumatica}
                        >
                            <FaFileUpload className="resource-buttons" /> <span className="resource-text "> Export to Acumatica</span>
                        </button>)}

                        {data?.length> 0 && (
                                <button className='exportxls resource-button' onClick={exportToExcel} >
                            <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                        </button>
                        )}

                        <button className='exportxls resource-button reportupload upload-button' onClick={() => setIsModalOpen(true)}
                        >
                            <FaFileUpload  /> <span className="resource-text">Upload time sheet</span>
                        </button>
                    </div>
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, projects, selectedProject, fromDate, toDate, invoice, data,]);
    const handleDoubleClick = (id, currentFactor) => {
        setEditId(id);
        setNormalizationFactor(currentFactor);
    };

    const handleBlur = (worklogId) => {
        const postData = {
            InvoicedHours: normalizationFactor,
            WorklogId: worklogId
        };
        if (normalizationFactor === '0' || normalizationFactor === '' || normalizationFactor === undefined) {
            setAlertMessage('Invoiced hours should be greater than 0');
            setEditId(null);
        }
        else if (normalizationFactor >= 0 && normalizationFactor <= 2) {
            axios.post(`${config.apiBaseUrl}/api/TimeSheet/PostIssueInvoicedHours`, postData)
                .then(response => {
                    setEditId(null);
                    return axios.get(`${config.apiBaseUrl}/api/TimeSheet/GetTimeSheetWorkLogs`);
                })
                .then(response => {
                    setData(response?.data?.timesheetList);
                    setAlertMessage('Invoiced hours saved successfully.');
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    setAlertMessage('Failed to save normalization factor.');
                });
        }
    };

    const handleSelectAllRows = () => {
        if (allSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data?.map(row => row.WorklogId));
        }
        setAllSelected(!allSelected);
    };
    const handleRowSelect = (rowId) => {
        const newSelectedRows = selectedRows.includes(rowId)
            ? selectedRows.filter(id => id !== rowId)
            : [...selectedRows, rowId];
        setSelectedRows(newSelectedRows);
        setAllSelected(newSelectedRows.length === data?.length);
    };
    // Columns configuration for DataTable
    const columns = [
        {name:  (
                <div title="Worklog Id">
                    <strong> Worklog Id </strong></div>
            ), title: 'Worklog Id', selector: row => row.WorklogId, sortable: true},
        {name:  (
                <div title="Project key">
                    <strong>Project key</strong> </div>
            ), selector: row => row.ProjectKey, sortable: true},
        {
            name: <strong>Project</strong>, selector: row => row.ProjectName, sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.ProjectName}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.ProjectName}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },
        {
            name: (<div title="Task key">
                    <strong> Task key</strong> </div>
            ), selector: row => row.IssueKey, sortable: true
        },
        {
            name: <strong>Task</strong>, selector: row => row.Task, sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.Task}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.Task}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },
        {name: <strong>Resource</strong>, selector: row => row.ResourceName, sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.ResourceName}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.ResourceName}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },

        {
            name: (
                <div title="Description">
                    <strong> Description</strong> </div>
            ),
            selector: row => row.Description,
            sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.Description}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.Description}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },
        {   name: <strong>Date</strong>, selector: row => row.WorkloggedDate, sortable: true },
        {
            name: (<div title="Logged hours">
                    <strong> Logged hours </strong></div>
            ), selector: row => row.LoggedHours, sortable: true
        },
        {
            name: (
                <div title="Normalized hours">
                    <strong>Normalized hours</strong> </div>
            ),
            selector: row => {
                const hours = parseFloat(row.NormalisationFactor);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
        },
        {
            name: (
                <div title="Invoiced hours">
                    <strong> Invoiced hours</strong> </div>
            ),
            selector: row => row.InvoicedHours,
            sortable: true,
            cell: row =>
            {
               if (row.IsInvoiced === '1') {
                    return (
                        <div className='cursorinvoice'>
                            {row.InvoicedHours}
                        </div>
                    );
                }
                else {
                    return editId === row.WorklogId ? (
                        <input
                            type="text"
                            value={normalizationFactor}
                            onChange={e => setNormalizationFactor(e.target.value)}
                            onBlur={() => handleBlur(row.WorklogId)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleBlur(row.WorklogId);
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <div
                            onDoubleClick={() => handleDoubleClick(row.WorklogId, row.InvoicedHours || "")}
                            style={{ cursor: 'pointer', padding: '15px', border: '0px solid blue', userSelect: 'none' }}
                        >
                            {(() => {
                                const hours = parseFloat(row.InvoicedHours);
                                return !isNaN(hours) ? hours.toFixed(2) : '';
                            })()}
                        </div>
                    );
                }
            },
        },
        {
            name: <> <input className="checkboxinvoice" type="checkbox" checked={allSelected}
                            onChange={handleSelectAllRows}/><span title="Invoiced"><strong>Invoiced</strong></span></>,            cell: row => {
                if (row.IsInvoiced === '1') {
                    return <input type="checkbox" checked/>;
                }
                if (!row.InvoicedHours) {
                    return (
                        <input
                            className='cursorinvoice'
                            type="checkbox"
                            checked={false}
                            disabled
                        />
                    );
                }
                return (
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(row.WorklogId)}
                        onChange={() => handleRowSelect(row.WorklogId)}
                    />
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "56px"
        },

    ];
    const InvoiceClick = async () => {
        const selectedWorklogIds = data?.filter(row => selectedRows.includes(row.WorklogId))?.map(row => row.WorklogId);
        const postData1 = {
            Worklogids: selectedWorklogIds
        };
        if (selectedWorklogIds?.length > 0) {
            try {
                await axios.post(`${config.apiBaseUrl}/api/TimeSheet/PostIsInvoiced`, postData1);
                const response = await axios.get(`${config.apiBaseUrl}/api/TimeSheet/GetTimeSheetWorkLogs`);
                setData(response?.data?.timesheetList);
                setLoading(false);
                setAlertMessage('Selected records are successfully invoiced'); SearchFilteredData();
            } catch (error) {
                console.error('Error calling API:', error);
                setLoading(false);
            }
        } else {
            setAlertMessage('Please select atleast 1 record');
            console.log('No rows selected');
        }
    };
    return (
        <div>
            <>
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)}/>

                <div className="header">
                    <h1>Timesheets</h1>
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
                {invoice !== "1" && data?.length > 0 && (
                    <button className='Invoice' onClick={InvoiceClick}>
                        Invoice
                    </button>
                )}
                <Modal
                      className="exportModal"
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Upload Excel Modal"
                    ariaHideApp={false}
                >
                    <h2>Update timesheet details</h2>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <button  className="samplefile-link custom-btn" onClick={handleDownload}>
                        Download sample file
                    </button>
                    {uploadResponse === 'Data saved successfully' && <p style={{color:'green'}}><b>Data saved successfully</b></p>}
                    {uploadResponse === 'ErrorLogs' && <a href={errorLogsLink}><b style={{color:'red'}}>Errorlogs</b></a>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="custom-icon" onClick={() => setIsModalOpen(false)}>X</button>
                </Modal>

            </>
        </div>
    );
};
export default TimeSheet;
