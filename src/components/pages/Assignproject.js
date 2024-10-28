import React, {useState, useEffect, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './assignProject.css'; // Ensure this CSS file is imported
import config from '../config';
import {ThreeDots} from 'react-loader-spinner';
import CustomAlert from './customAlert';     // Ensure the correct import path
import {FaArrowCircleLeft, FaFileDownload} from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import ExcelJS from 'exceljs';
import FilterComponent from "./FilterComponent";

function AssignProject() {
    const {id} = useParams();
    const [data, setData] = useState({});
    const [editId, setEditId] = useState(null);
    const [normalizationFactor, setNormalizationFactor] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState(""); // Add state for filter text
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}/api/Project/GetProjectsById/?ProjectId=${id}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [id]);
    const handleDoubleClick = (id, currentFactor) => {
        setEditId(id);
        setNormalizationFactor(currentFactor);
    };

    const handleBlur = (actorId) => {
        const projectId = data.ProjectId;
        if (!projectId) {
            console.error('ProjectId is not defined');
            return;
        }
        const postData = {
            NormalizationFactor: normalizationFactor,
            ActorId: actorId,
            ProjectId: projectId
        };
        if (normalizationFactor === '0' || normalizationFactor === '' || normalizationFactor === undefined) {
            setAlertMessage('Normalization factor value should be greater than 0');
            setEditId(null);
        }
        else if (normalizationFactor >= 0 && normalizationFactor <= 2) {
            axios.post(`${config.apiBaseUrl}/api/Project/PostNormalizationFactor`, postData)
                .then(response => {
                    setEditId(null);
                    // Fetch the updated data only if the normalization factor is successfully saved
                    return axios.get(`${config.apiBaseUrl}/api/Project/GetProjectsById/?ProjectId=${id}`);
                })
                .then(response => {
                    setData(response.data);
                    setAlertMessage('Normalization factor saved successfully.');
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    setAlertMessage('Failed to save normalization factor.');
                });
        } else {
            setAlertMessage('Normalization factor value should be between 0 and 2.');
            setEditId(null);
        }
    };
    const columns = [
        {
            name: 'Resource',
            selector: row => row.ActorName,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.EmailAddress,
            sortable: true,
        },
        {
            name: 'Normalization factor',
            selector: row => row.NormalizationFactorText || "",
            sortable: true,
            cell: row => editId === row.ActorId ? (
                <input
                    type="text"
                    value={normalizationFactor}
                    onChange={e => setNormalizationFactor(e.target.value)}
                    onBlur={() => handleBlur(row.ActorId)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleBlur(row.ActorId);
                        }
                    }}
                    autoFocus
                />
            ) : (
                <div
                    onDoubleClick={() => handleDoubleClick(row.ActorId, row.NormalizationFactorText || "")}
                    style={{cursor: 'pointer', padding: '15px', border: '0px solid blue', userSelect: 'none'}}
                >
                    {row.NormalizationFactorText || ""}
                </div>
            ),
        },
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
        const headers = ['Resource', 'Email', 'Normalization factor'];
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
        data?.RoleActorsList?.forEach(item => {
            worksheet.addRow([
                item?.ActorName || '',
                item?.EmailAddress || '',
                item?.NormalizationFactorText || ''
            ]);
        });
        // Adjust column widths
        worksheet.columns = [
            {key: 'Resource', width: 20},
            {key: 'Email', width: 30},
            {key: 'Normalization factor', width: 25}
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

    const filteredItems = data?.RoleActorsList?.filter(
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
                    {data?.RoleActorsList?.length> 0 && (  <button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}
                </div>
            </>
        );
    }, [filterText, resetPaginationToggle, filteredItems, data]);

    return (
        <div>
            <div className="heading-container">
                <h1 className="heading">Project resources</h1>
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
                        <td>{data.ProjectName}</td>
                        <td className="label">Project key</td>
                        <td>{data.ProjectKey}</td>
                    </tr>
                    </tbody>
                </table>
                <DataTable
                    columns={columns}
                    data={filteredItems || []}
                    subHeader
                    pagination
                    subHeaderComponent={subHeaderComponent}
                    customStyles={customStyles}
                    highlightOnHover
                    persistTableHead
                    progressPending={loading}
                    progressComponent={<ThreeDots className="three-dots-loader"/>}
                />
            </div>
        </div>
    );
}

export default AssignProject;
