import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ThreeDots } from 'react-loader-spinner';
//import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './timesheet.css';
import config from '../config';
import CustomAlert from "./customAlert";
import './jira.css'
import {FaFileDownload} from "react-icons/fa";
import ExcelJS from "exceljs";

const Jira = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('kensium');
    const [jiradomine, setjiradomine] = useState([]);
    const [selectedProject, setSelectedProject] = useState('both');
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [loading, setLoading] = useState(true); // Set initial loading state to true
    const LoginUsername = localStorage.getItem('LoginUserName');


    const searchFetchFilteredData = () => {
            setLoading(true);
        const domain = selectedDomain || 'kensium';
        const product = selectedProject || 'both';
            axios.get(`${config.apiBaseUrl}/api/User/GetUsersDomainFilters?domain=${domain}&value=${product}`)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching filtered data:', error);
                    setLoading(false);
                });

    };
    const reset = () => {
        setLoading(true);
        const projectID = '';
        axios.get(`${config.apiBaseUrl}/api/User/GetUsersDomainFilters?domain=kensium&value=jsm`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                setLoading(false);
            });
    };
    const resetFilters = () => {
        setSelectedProject('');
        setFilterText("");
        setResetPaginationToggle(!resetPaginationToggle);
        reset();
    };
   useEffect(() => {
        setLoading(true);
        const fetchSearchData = axios.get(`${config.apiBaseUrl}/api/User/GetUsersDomainFilters?domain=${selectedDomain}&value=${selectedProject}`);
        const fetchDropdownData = axios.get(`${config.apiBaseUrl}/api/User/GetUsersDomain`);

        Promise.all([fetchSearchData, fetchDropdownData])
            .then(responses => {
                const [searchDataResponse, dropdownDataResponse] = responses;
                setData(searchDataResponse.data);
                setProjects(dropdownDataResponse.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [selectedDomain, selectedProject]);

    const columns = [
        { name: 'Domain', selector: row => row.Domain, sortable: true },
        { name: 'UserName', selector: row => row.UserName, sortable: true },
        { name: 'Email', selector: row => row.EmailAddress, sortable: true },
        { name: 'Jira', selector: row => row.Jira, sortable: true },
        { name: 'JSM', selector: row => row.JSM, sortable: true },
    ];

    /*const exportToExcel = () => {
        const filteredItems = data?.filter(
            item =>
                JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredItems?.length > 0) {
            const formattedData = filteredItems?.map(({ Domain, UserName, Email, Jira, JSM }) => ({
                Domain, UserName, Email, Jira, JSM
            }));
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp.length > 0 ? `Atlassian.xlsx` : `Atlassian_${timestamp}.xlsx`;
            XLSX.writeFile(wb, filename);
        } else {
            alert('No data available to export');
        }
    };*/


    const filteredItems = data?.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );

    const exportToExcel = async () => {
        if (filteredItems?.length > 0) {
            const formattedData = filteredItems?.map(({  Domain,UserName, EmailAddress, Jira, JSM}) => ({
                'Domain': Domain,
                'UserName':UserName,
                'Email': EmailAddress,
                'Jira': Jira,
                'JSM': JSM,

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
            const filename = timestamp?.length > 0 ? `Atlassian.xlsx` : '';
            a.download = filename;
            a.click();

            window.URL.revokeObjectURL(url);
        } else {
            alert('No data available to export');
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
                <div className="sub-header">
                    <div className="project-filter">
                        <label htmlFor="project-select">Domain</label>
                        <select
                            id="domain-select"
                            onChange={e => setSelectedDomain(e.target.value)}
                            value={selectedDomain}
                            className="project-select"
                        >

                            {projects?.map(project => (
                                <option key={project.Domain} value={project.Domain}>
                                    {project.Domain}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="project-filter">
                        <label htmlFor="project-select">Products</label>
                        <select
                            id="project-select"
                            onChange={e => setSelectedProject(e.target.value)}
                            value={selectedProject}
                            className="project-select"
                        >
                           {/* <option value="all">All</option>*/}
                            <option value="jira">jira</option>
                            <option value="jsm">jsm</option>
                            <option value="both">both</option>
                        </select>
                    </div>
                    <button className='search' onClick={searchFetchFilteredData}>Search</button>
                    <button className='reset' onClick={resetFilters}>Reset</button>
                </div>
                <div className="project-filter SearchFilter searchs">
                <label className="searchlabel label">Search</label>
                <FilterComponent
                    onFilter={e => setFilterText(e.target.value)}
                    onClear={handleClear}
                    filterText={filterText}
                />
                    {data?.length> 0 && (  <button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, jiradomine, selectedDomain,selectedProject, data]);

    return (
        <div>
             <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
            <div className="header">
                <h1>Atlassian</h1>
                <h2 className="loginusername">Welcome {LoginUsername}!</h2></div>
                    <DataTable
                        className="custom-data-table"
                        columns={columns}
                        data={filteredItems}
                        defaultSortField="name"
                        striped
                        pagination
                        noDataComponent
                        subHeader
                        subHeaderComponent={subHeaderComponent}
                        highlightOnHover
                        responsive
                        persistTableHead
                        progressPending={loading}
                        progressComponent={<ThreeDots className="three-dots-loader" />}
                    />
                    <p className="total">Total Records: {data?.length}</p>
        </div>
    );
};

export default Jira;
