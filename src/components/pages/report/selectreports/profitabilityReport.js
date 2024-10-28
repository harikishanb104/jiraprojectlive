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
import "./normalizedHoursReport.css";
import ExcelJS from 'exceljs';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
const ProfitabilityReport  = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const fetchData = () => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Report/GetProfitabilityReport`)
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
   /* const SearchFilteredData = () => {
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
    };*/
    const columns = [
        {
            name: (<div title="Account Name"><strong>Account Name</strong></div>),
            selector: row => row.ResourceName,
            sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.AccountName}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.AccountName}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },
        {
            name: (<div title="Project"><strong>Project</strong></div>),
            selector: row => row.Project,
            sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.Project}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.Project}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },
        // {
        //     name: (
        //         <div title="Budgeted hours">Budgeted hours</div>),
        //     selector: row => {
        //         const hours = parseFloat(row.EstimatedHours);
        //         return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
        //     },
        //     sortable: true,
        // },
        // {
        //     name: (<div title="Invoiced hours">Invoiced hours</div>),
        //     selector: row => {
        //         const hours = parseFloat(row.InvoicedHours);
        //         return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
        //     },
        //     sortable: true,
        // },
        {
            name: (<div title="Budget"><strong>Budget ($)</strong></div>),
            // selector: row => {
            //     const hours = parseFloat(row.Budget);
            //     return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            // },
            selector: row => row.Budget,
            sortable: true,
        }, {
            name: (<div title="Expense"><strong>Expense ($)</strong></div>),
            selector: row => {
                const hours = parseFloat(row.Expense);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        }, {
            name: (<div title="Profit/Loss"><strong>Profit / Loss ($)</strong></div>),
            selector: row => {
                const hours = parseFloat(row.ProfitByLoss);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        }, {
            name: (<div title="Profit/Loss %"><strong>Profit / Loss %</strong></div>),
            selector: row => {
                const hours = parseFloat(row.PercentageOfProfitByLoss);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },

    ];
    const filteredItems = data.filter(
        item => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
    // const exportToExcel = async () => {
    //     if (filteredItems?.length === 0) {
    //         alert('No data available to export');
    //         return;
    //     }
    
    //     // Format the data
    //     const formattedData = filteredItems.map(({ AccountName, Project, EstimatedHours, InvoicedHours, Budget, Expense, ProfitByLoss, PercentageOfProfitByLoss }) => ({
    //         'Account Name': AccountName,
    //         'Project': Project,
    //         'Budget ($)': Budget,
    //         'Expense ($)': Expense,
    //         'Profit/Loss ($)': ProfitByLoss,
    //         'Profit/Loss %': PercentageOfProfitByLoss,
    //     }));
    
    //     // Create a new workbook and worksheet
    //     const wb = new ExcelJS.Workbook();
    //     const ws = wb.addWorksheet('Sheet1');
    
    //     // Define the headers and columns
    //     const headers = Object.keys(formattedData[0]);
    //     ws.columns = headers.map(header => ({
    //         header: header,
    //         key: header.toLowerCase().replace(/ /g, '_'),
    //         width: 20,
    //     }));
    
    //     // Add bold font to the header row
    //     headers.forEach((header, index) => {
    //         const cell = ws.getCell(1, index + 1); // Row 1, Column index+1
    //         cell.font = { bold: true };
    //     });
    
    //     // Add data rows
    //     formattedData.forEach((data, rowIndex) => {
    //         headers.forEach((header, colIndex) => {
    //             ws.getCell(rowIndex + 2, colIndex + 1).value = data[header];
    //         });
    //     });
    
    //     // Write the file to a Blob
    //     const buffer = await wb.xlsx.writeBuffer();
    //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     const url = window.URL.createObjectURL(blob);
        
    //     // Create a link element and click it to download the file
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `Profitability report${new Date().toISOString().replace(/[-:.]/g, "")}.xlsx`;
    //     document.body.appendChild(a);
    //     a.click();
        
    //     // Clean up
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(a);
    // };

    const generateFilename = (baseName, extension) => {
    const existingFiles = []; // This should be an array of existing filenames
    const regex = new RegExp(`^${baseName} \\((\\d+)\\)${extension}$`);
    
    let maxNumber = 0;
    existingFiles.forEach(filename => {
        const match = filename.match(regex);
        if (match) {
            const number = parseInt(match[1], 10);
            if (number > maxNumber) {
                maxNumber = number;
            }
        }
    });
    
    return `${baseName} (${maxNumber + 1})${extension}`;
   };

const exportToExcel = async () => {
    if (filteredItems?.length === 0) {
        alert('No data available to export');
        return;
    }

    // Format the data
    const formattedData = filteredItems.map(({ AccountName, Project, EstimatedHours, InvoicedHours, Budget, Expense, ProfitByLoss, PercentageOfProfitByLoss }) => ({
        'Account Name': AccountName,
        'Project': Project,
        'Budget ($)': Budget,
        'Expense ($)': Expense,
        'Profit/Loss ($)': ProfitByLoss,
        'Profit/Loss %': PercentageOfProfitByLoss,
    }));

    // Create a new workbook and worksheet
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Sheet1');

    // Define the headers and columns
    const headers = Object.keys(formattedData[0]);
    ws.columns = headers.map(header => ({
        header: header,
        key: header.toLowerCase().replace(/ /g, '_'),
        width: 20,
    }));

    // Add bold font to the header row
    headers.forEach((header, index) => {
        const cell = ws.getCell(1, index + 1); // Row 1, Column index+1
        cell.font = { bold: true };
    });

    // Add data rows
    formattedData.forEach((data, rowIndex) => {
        headers.forEach((header, colIndex) => {
            ws.getCell(rowIndex + 2, colIndex + 1).value = data[header];
        });
    });

    // Write the file to a Blob
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    
    // Generate the filename
    const baseName = 'Profitability report';
    const extension = '.xlsx';
    const filename = generateFilename(baseName, extension);
    
    // Create a link element and click it to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
{/*
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
*/}

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
                    title="Profitability report"
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
export default ProfitabilityReport ;




