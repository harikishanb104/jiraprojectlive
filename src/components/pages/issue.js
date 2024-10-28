import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ThreeDots } from 'react-loader-spinner';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './timesheet.css';
import config from '../config';

const Issue = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [loading, setLoading] = useState(false);

   
    const fetchFilteredData = () => {
        setLoading(true);
        const projectID = projects.find(project => project.ProjectName === selectedProject)?.ProjectId || '';
       
        axios.get(`${config.apiBaseUrl}/api/Project/GetProjectIssueTimetrackingByProjectId?ProjectID=${projectID}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Project/GetProjectIssueTimetracking`)
            .then(response => {
                setData(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get(`${config.apiBaseUrl}/api/Project/GetProjects`)
            .then(response => {
                setProjects(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                setLoading(false);
            });
    }, []);

    const columns = [
        { name: 'Project Name', selector: row => row.ProjectName, sortable: true },
        { name: 'Issue Name', selector: row => row.IssueName, sortable: true },
        { name: 'Original Estimate', selector: row => row.OriginalEstimateHours, sortable: true },
        { name: 'Time Spent', selector: row => row.TimeSpentHours, sortable: true },
    ];

    const exportToExcel = () => {
        const filteredItems = data.filter(
            item =>
                JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
        );
        console.log("Data to be exported:", filteredItems);
        if (filteredItems.length > 0) {
            const formattedData = filteredItems.map(({ ProjectName, IssueName, OriginalEstimateHours,TimeSpentHours }) => ({
                ProjectName,
                IssueName,
                OriginalEstimateHours,
                TimeSpentHours,
            }));
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp.length > 0 ? `Issues.xlsx` : `Issues_${timestamp}.xlsx`;
            XLSX.writeFile(wb, filename);
           // XLSX.writeFile(wb, `TimeSheets_${timestamp}.xlsx`);
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
                        <label htmlFor="project-select">Project Name:</label>
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
                  
                    <button className='search' onClick={fetchFilteredData}>Search</button>
                </div>
                <FilterComponent
                    onFilter={e => setFilterText(e.target.value)}
                    onClear={handleClear}
                    filterText={filterText}
                />
                <button className='exportxl' onClick={exportToExcel}>
                    Export to Excel
                </button>
            </>
        );
    }, [filterText, resetPaginationToggle, projects, selectedProject,  data]);

    return (
        <div>
            {loading ? (
                <div className="loader">
                    <ThreeDots
                        color="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>
            ) : (
                <>
                    <DataTable
                        title="Issues"
                        columns={columns}
                        data={data.filter(item => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()))}
                        defaultSortField="name"
                        striped
                        pagination
                        subHeader
                        subHeaderComponent={subHeaderComponent}
                        highlightOnHover
                        responsive
                    />
                </>
            )}
        </div>
    );
};

export default Issue;
