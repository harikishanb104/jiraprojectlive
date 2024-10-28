import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as XLSX from 'xlsx';
import FilterComponent from './../../FilterComponent';
import config from '../../../config';
import { ThreeDots } from 'react-loader-spinner';
import CustomAlert from "./../../customAlert";
import {Tooltip} from "react-tooltip";
import {FaFileDownload} from "react-icons/fa";

const Consumedvsbudgetedhours = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const fetchData = () => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Report/GetProjectBudgetHoursAndConsumedHours`)
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
    const formatDate = (dateStr) => {
        if (!dateStr) return ''; // Return empty string if dateStr is undefined, null, or empty
        const [year, month, day] = dateStr?.split('-');
        if (!year || !month || !day) return ''; // Return empty string if any part is missing
        return `${day}-${month}-${year}`;
    };
    const columns = [
        {
            name: 'Name',
            selector: row => row.AccountName,
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
            name: (<div title="Contract type">Contract type</div>),
            selector: row => row.AccountCategoryKey,
            sortable: true,
        },
        {
            name: 'Start date',
            selector: row => formatDate(row.ContractEffectiveDate),
            sortable: true,
        },
        {
            name: 'Due date',
            selector: row => formatDate(row.ContractEndDate),
            sortable: true,
        },

        {
            name: (<div title="Estimated hours">Budgeted hours</div>),
            selector: row => {
                const hours = parseFloat(row.EstimatedHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name: (<div title="Actual hours">Consumed hours</div>),
            selector: row => {
                const hours = parseFloat(row.TimeSpentHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },

        {
            name:(<div title="Consumed %">Consumed %</div>) ,
            selector: row => {
                const hours = parseFloat(row.ConsumedPercentage);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name: (<div title="Completed %">% Complete </div>),
            selector: row => {
                const hours = parseFloat(row.PercentageWorkCompleted);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name:(<div title="Consumed risk">Consumed risk</div>),
            selector: row =>  {
                const hours = parseFloat(row.ConsumedRiskPercentage);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        }
    ];

    const filteredItems = data.filter(
        item => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );

    const exportToExcel = () => {
        if (filteredItems.length > 0) {

            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = String(date?.getDate()).padStart(2, '0');
                const month = String(date?.getMonth() + 1).padStart(2, '0');
                const year = date?.getFullYear();
                return `${day}-${month}-${year}`;
            };
            const formattedData = filteredItems.map(({ AccountName, AccountCategoryKey, ContractEffectiveDate, ContractEndDate, EstimatedHours,TimeSpentHours,ConsumedPercentage,PercentageWorkCompleted,ConsumedRiskPercentage }) => ({
                'Name': AccountName,
                'Contract Type': AccountCategoryKey,
                'Start Date': ContractEffectiveDate? formatDate(ContractEffectiveDate) : "",
                'Due Date': ContractEndDate ? formatDate(ContractEndDate) : "",
                'Budgeted hours': EstimatedHours ,
                'Consumed hours': TimeSpentHours,
                'Consumed %': ConsumedPercentage,
                '% Complete': PercentageWorkCompleted || 0,
                'Consumed Risk': ConsumedRiskPercentage,
            }));
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp.length > 0 ? `Reports.xlsx` : `Reports_${timestamp}.xlsx`;
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
                <div className="project-filter SearchFilter">
                    <label className="searchlabelreport">Search</label>
                    <FilterComponent
                        onFilter={e => setFilterText(e.target.value)}
                        onClear={handleClear}
                        filterText={filterText}
                    />
                    {data.length> 0 && (  <button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}

                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, filteredItems]);

    return (
        <div>
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
                <>
                    <DataTable
                        className="custom-data-table"
                        title="Budgeted vs Consumed Hours"
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
                        progressComponent={<ThreeDots className="three-dots-loader" />}
                    />
                </>
        </div>
    );
};

export default Consumedvsbudgetedhours;




