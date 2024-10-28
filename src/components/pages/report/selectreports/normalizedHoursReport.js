import React, {useState, useEffect, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as XLSX from 'xlsx';
import FilterComponent from './../../FilterComponent';
import config from '../../../config';
import {ThreeDots} from 'react-loader-spinner';
import CustomAlert from "./../../customAlert";
import {Tooltip} from "react-tooltip";
import {FaFileDownload} from "react-icons/fa";
import "./normalizedHoursReport.css"


const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
const NormalizedHoursReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const fetchData = () => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Report/GetNormalizationReport`)
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
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Report/GetNormalizationReportFilters?StartDate=${fromDate}&EndDate=${toDate}`)
            .then(response => {
                setData(response?.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                setLoading(false);
            });
        }
            else {
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
        setFromDate(formatDate(formatDate(lastMonday))); // Set to today's date or adjust as needed
        setToDate(formatDate(formatDate(lastFriday))); // Set to today's date or adjust as needed
        setFilterText('');
        setResetPaginationToggle(!resetPaginationToggle);
        fetchData();
        setFilterText('');
    };
    const columns = [
        {
            name: (<div title="Resource Name">Resource name</div>),
            selector: row => row.ResourceName,
            sortable: true,
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
                <div title="Total Logged Hours">Total logged hours</div>),
            selector: row => {
                const hours = parseFloat(row.TotalLoggedHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name: (<div title="Normalized Hours">Normalized hours</div>),
            selector: row => {
                const hours = parseFloat(row.NormalizedHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name: (<div title="Invoiced Hours">Invoiced hours</div>),
            selector: row => {
                const hours = parseFloat(row.InvoicedHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },

    ];
    const filteredItems = data.filter(
        item => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
    const exportToExcel = () => {
        if (filteredItems.length > 0) {
            const formattedData = filteredItems.map(({ResourceName, TotalLoggedHours, NormalizedHours, InvoicedHours}) => ({
                'Resource name': ResourceName,
                'Total logged hours': TotalLoggedHours,
                'Normalized hours': NormalizedHours,
                'Invoiced hours': InvoicedHours,
            }));
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp.length > 0 ? `Normalizedhoursreport.xlsx` : `Normalizedhoursreport_${timestamp}.xlsx`;
            XLSX.writeFile(wb, filename);
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
                <div className="date-filter-date">
                    <div className="date-filter">
                        <label htmlFor="from-date" className="startdate">Start date</label>
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
                <div className="project-filter SearchFilter">
                    <label className="searchlabelreport">Search</label>
                    <FilterComponent
                        onFilter={e => setFilterText(e.target.value)}
                        onClear={handleClear}
                        filterText={filterText}
                    />
                    {data.length > 0 && (<button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload /> <span
                        className="resource-text">Export to Excel</span>
                    </button>)}
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, filteredItems]);
    return (
        <div>
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)}/>}
            <>
                <DataTable
                    className="custom-data-table"
                    title="Normalized Hours Report"
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
                    progressComponent={<ThreeDots className="three-dots-loader"/>}
                />
            </>
        </div>
    );
};
export default NormalizedHoursReport;




