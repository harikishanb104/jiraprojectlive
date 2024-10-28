import React, {useState, useEffect, useMemo} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import * as XLSX from 'xlsx';
import config from '../config';
import CustomAlert from './customAlert';
import './assignProject.css';
import { Tooltip } from 'react-tooltip';
import {FaArrowCircleLeft,FaFileDownload} from "react-icons/fa";
import './restrictionerrorlogs.css'
import FilterComponent from "./FilterComponent";

const ProjectErrorLogs =()=> {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertStyle, setAlertStyle] = useState({});
    const navigate = useNavigate();

    const handleButtonClick = (id) => {
        console.log('Button clicked, ID:', id);
        setLoading(true);
        axios.post(`${config.apiBaseUrl}/api/User/IgnoreError/${id}`)
            .then(response => {
                console.log('Response:', response);
                let message = response.data;
                let style = {};
                if (response.data === 'Error has been removed.') {
                    style = { color: 'green', fontWeight: 'bold' };
                } else if (response.data === 'Ignoring failed please try again') {
                    style = { color: 'red' };
                } else {
                    message = 'Action completed successfully.';
                }
                setAlertMessage(message);
                setAlertStyle(style);
                setLoading(false);
                fetchData(); // Re-fetch data to update the table
            })
            .catch(error => {
                console.error('Error:', error);
                const errorMessage = error.response?.data?.message || 'An error occurred, please try again.';
                setAlertMessage(errorMessage);
                setAlertStyle({ color: 'red' });
                setLoading(false);
            });
    };

    const fetchData = () => {
        setLoading(true);
        axios.get(`${config.apiBaseUrl}api/Project/GetprojectsErrorlogs`)
            .then(response => {
                console.log('API Response:', response.data);
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setData([]); // Set data to empty array if fetching fails
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBack = () => {
        navigate('/users');
    };


    const exportToExcel = () => {
        if (data?.length > 0) {
            const formattedData = data?.map(({ProjectKey,Budget,ErrorDescription}) => ({
                'Project key': ProjectKey,
                'Budget': Budget,
                'Error description':ErrorDescription,
          
            }));
            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const filename = timestamp.length > 0 ? `Users.xlsx` : `Users_${timestamp}.xlsx`;
            XLSX.writeFile(wb, filename);
        } else {
            alert('No data available to export');
        }
    };


    // Columns configuration for DataTable
    const columns = [
        { name: 'Project key', selector: row => row.ProjectKey, sortable: true },
        { name: 'Budget ', selector: row => row.Budget || "", sortable: true },
        { name: 'Error description', selector: row => row.ErrorDescription, sortable: true },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: 'grey',
                color: 'white',
                fontWeight: 'bold',
            },
        },
    };

    const subHeaderComponent = useMemo(() => {
        return (
            <>
                <div className="SearchFilter">
                   
                    {data?.length> 0 && (  <button className='exportxls resource-button' onClick={exportToExcel}
                    >
                        <FaFileDownload  /> <span className="resource-text">Export to Excel</span>
                    </button>)}
                </div>
            </>
        );
    }, []);


    return (
        <div>
            {loading ? (
                <div className="loader">
                    <ThreeDots color="#00BFFF" height={100} width={100} />
                </div>
            ) : (
                <>
                    <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} style={alertStyle} />
                    <div className="heading-container">
                        <h1 className="heading">Project Error logs</h1>
                        <button className="backbutton" onClick={handleBack}>
                            <FaArrowCircleLeft/> Back
                        </button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={data} // Ensure to pass the data state
                        customStyles={customStyles}
                        highlightOnHover
                        striped
                        dense
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                        subHeader
                        subHeaderComponent={subHeaderComponent}
                    />
                </>
            )}
        </div>
    );
}

export default ProjectErrorLogs;
