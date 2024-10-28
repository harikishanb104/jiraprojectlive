import React, {useState, useEffect, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {ThreeDots} from 'react-loader-spinner';
import CustomAlert from './customAlert'; // Ensure correct import path
import {FaArrowCircleLeft, FaCog, FaFileDownload} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import * as XLSX from 'xlsx';
import config from '../config';
import {Tooltip} from 'react-tooltip';
import FilterComponent from "./FilterComponent";
import ExcelJS from "exceljs";

function ProjectTasks() {
    const {id,ProjectCategoryName,ProjectKey} = useParams();
      const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Project/GetTaskdetailesByProjectID/?ProjectId=${id}`)
            .then(response => {
                setData(response.data); // Assuming response.data is an object with necessary properties
                setLoading(false);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
                setAlertMessage('Error fetching data. Please try again.'); // Set error message
            });
    }, [id]);

    const columns = [
        {
            name: 'Issue key',
            selector: row => row.IssueKey,
            sortable: true,
        },
        {
            name: 'Issue', selector: row => row.IssueName, sortable: true,
            cell: (row, index) => (
                <div
                    data-tip={row.IssueName}
                    data-for={`tooltip-${index}`}
                    className="description-cell"
                >
                    {row.IssueName}
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid"/>
                </div>
            )
        },

        {
            name: 'Original estimated hours',
            selector: row => {
                const hours = parseFloat(row.OriginalEstimateHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
          //  selector: row => row.OriginalEstimateHours || 0,
            sortable: true,
        },
        {
            name: 'Time spent hours',
            selector: row => {
                const hours = parseFloat(row.ConsumedHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name: 'Normalization hours',
            selector: row => {
                const hours = parseFloat(row.NormalizationHours);
                return !isNaN(hours) ? hours.toFixed(2) : ''; // Format to 2 decimal places if it's a number
            },
            sortable: true,
        },
        {
            name: 'Invoiced hours',
            selector: row => (row.InvoicedHours ? row.InvoicedHours.toFixed(2) : '0.00'),
            sortable: true,
        }
    ];

    const handleBack = () => {
        navigate('/projects');
    };

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: 'grey',
                color: 'white',
                fontWeight: 'bold',
            },
        },
    };


    const exportToExcel = async () => {
        // Check if data is defined and has the necessary properties
        if (!data && !data?.RoleActorsList && !data?.ProjectName && !data?.ProjectKey) {
            alert('No data available to export');
        }

        // Create a new workbook and a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Project Resources');

        // Add Project information
        const projectInfoRow = worksheet.addRow([
            'Project', data?.ProjectName, 'Project key', data?.ProjectKey
        ]);

        // Apply styles to the project information labels
        projectInfoRow.getCell(1).font = {bold: true};
        projectInfoRow.getCell(3).font = {bold: true};

        // Add an empty row
        worksheet.addRow([]);

        // Define headers
        const headers = ['Issue key', 'Issue name', 'Original estimated hours', 'Time spent hours', 'Normalization hours', 'Invoiced hours'];
        const headerRow = worksheet.addRow(headers);

        // Apply styles to the headers
        headerRow.eachCell((cell, colNumber) => {
            cell.font = {bold: true};
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFD3D3D3'},
            };
            cell.alignment = {vertical: 'middle', horizontal: 'center'};
        });

        // Add filtered data
        data?.issuelist?.forEach(item => {
            worksheet.addRow([
                item?.IssueKey || '',
                item?.IssueName || '',
                item?.OriginalEstimateHours || '',
                item?.ConsumedHours || '',
                item?.NormalizationHours || '',
                item?.InvoicedHours || ''
            ]);
        });

        // Adjust column widths
        worksheet.columns = [
            {key: 'Issue key', width: 20},
            {key: 'Issue name', width: 30},
            {key: 'Original estimated hours', width: 25},
            {key: 'Normalization hours', width: 25},
            {key: 'Original estimated hours', width: 25},
            {key: 'Invoiced hours', width: 25},

        ];
        // Generate file name with timestamp
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
        const fileName = timestamp.length > 0 ? (`${data?.ProjectName}.xlsx`) : (null);
        // Write the workbook to file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/octet-stream'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const filteredItems = data?.issuelist?.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );
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
                    {data?.issuelist?.length> 0 && (  <button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload   /> <span className="resource-text">Export to Excel</span>
                    </button>)}
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, filteredItems, data]);
    return (
        <div>
            <div className="heading-container">
                <h1 className="heading">Project task</h1>
                <button className="backbutton" onClick={handleBack}>
                    <FaArrowCircleLeft/> Back
                </button>
            </div>
            <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)}/>
            <div className="sameline">
                <table className="table">
                    <tbody>
                    <tr className="row">
                        <td className="label">Project</td>
                        <td className="value">{ProjectCategoryName}</td>
                        <td className="label">Project key</td>
                        <td className="value">{ProjectKey}</td>
                    </tr>
                    </tbody>
                </table>
                <DataTable
                    columns={columns}
                    data={filteredItems || []}
                    pagination
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    customStyles={customStyles}
                    highlightOnHover
                    persistTableHead
                    progressPending={loading}
                    progressComponent={<ThreeDots className="three-dots-loader"/>}
                /></div>
        </div>
    );
}

export default ProjectTasks;
