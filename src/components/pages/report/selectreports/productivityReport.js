import React, {useState, useEffect, useMemo, useRef} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import FilterComponent from './../../FilterComponent';
import config from '../../../config';
import {ThreeDots} from 'react-loader-spinner';
import CustomAlert from "./../../customAlert";
import {Tooltip} from "react-tooltip";
import "./productivityReport.css";
import {FaFileDownload} from "react-icons/fa";
import Select from 'react-select';
import {components} from 'react-select';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
const ProductivityReport = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [filterText, setFilterText] = useState("");
        const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
        const [alertMessage, setAlertMessage] = useState(null);
        const [fromDate, setFromDate] = useState('');
        const [toDate, setToDate] = useState('');
        const [ExcelDropdown, setExcelDropdown] = useState('1');
        const selectedTypeRef = useRef('1'); // Ref for selected type, default '1'
        const [departments, setDepartments] = useState(null);
        //  const [childDepartments, setDepartments] = useState(null);
        const [selectedDepartment, setSelectedDepartment] = useState('');
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [childDepartments, setChildDepartments] = useState([]);

        const UserId = localStorage.getItem('userID');

        const fetchData = () => {
            setLoading(true);
            axios.get(`${config?.apiBaseUrl}/api/Report/GetProductivityReport?UserId=${UserId}`)
                .then(response => {
                    console.log('hiii');
                    console.log(response?.data?.ip);
                    setData(response?.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching productivity report data:', error);

                });
            /*  setLoading(true);
              Promise.all([
                  axios.get(`${config.apiBaseUrl}/api/Report/GetProductivityReport`),
                  axios.get(`${config.apiBaseUrl}/api/User/GetDepartments`)
              ])
                  .then(([productivityResponse, departmentsResponse]) => {
                      setData(productivityResponse?.data);
                      setDepartments(departmentsResponse?.data);
                      setLoading(false);
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      setLoading(false);
                  });*/
        };
        const fetchDepartments = () => {
            axios.get(`${config?.apiBaseUrl}/api/User/GetParentDepartments`)
                .then(response => {

                    setDepartments(response?.data);
                })
                .catch(error => {
                    console.error('Error fetching departments data:', error);
                });
        };
        useEffect(() => {
            fetchData();
            fetchDepartments();
            const today = new Date();
            const todayDayOfWeek = today.getDay(); // Current day of the week (0-6, 0=Sunday)
            const daysSinceLastMonday = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1; // Days since last Monday (0-6)
            const lastMonday = new Date(today);
            lastMonday.setDate(today.getDate() - daysSinceLastMonday - 7); // Calculate last Monday
            const lastFriday = new Date(lastMonday);
            lastFriday.setDate(lastMonday.getDate() + 6); // Calculate last Friday
            setFromDate(formatDate(lastMonday));
            setToDate(formatDate(lastFriday));
            const selectElement = document.getElementById('report-selects');
            selectElement.value = selectedTypeRef.current;
        }, [selectedTypeRef.current, resetPaginationToggle]);
        const SearchFilteredData = () => {
            if (fromDate < toDate || fromDate === toDate) {
                const selectedValues = (selectedOptions || []).map(option => option?.value);
                const selectedType = document.getElementById('report-selects').value;
                setLoading(true);
                const endpoint = selectedType === '1'
                    ? `${config.apiBaseUrl}/api/Report/GetProductivityReportFilters?StartDate=${fromDate}&EndDate=${toDate}&depnames=${selectedValues}&UserId=${UserId}&ParentDepartment=${selectedDepartment}`
                    : `${config.apiBaseUrl}/api/Report/GetProductivityReportByDepartmentFilters?StartDate=${fromDate}&EndDate=${toDate}&depnames=${selectedValues}&UserId=${UserId}&ParentDepartment=${selectedDepartment}`;
                axios.get(endpoint)
                    .then(response => {
                        selectedType === '1' ? setExcelDropdown('1') : setExcelDropdown('2');
                        setData(response.data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching filtered data:', error);
                        setLoading(false);
                    });
            } else {
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
            setResetPaginationToggle(!resetPaginationToggle);
            fetchData();
            setDepartments([]);
            setSelectedDepartment([]);
            setFilterText('');
            setSelectedOptions('');
        };

/*
        const columns = useMemo(() => {
            const baseColumns = [];
            if (data?.length > 0 && data?.every(item => item?.ResourceName)) {
                baseColumns.push({
                    name: (<div title="Resource Name">Resource name</div>),
                    selector: row => row?.ResourceName,
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
                });
            }
            baseColumns.push(
                {
                    name: (<div title="sub-Department">Department</div>),
                    selector: row => row.Department,
                    sortable: true,
                },
                {
                    name: (<div title="Department">Parent department</div>),
                    selector: row => row.ParentDepartment,
                    sortable: true,
                },
                {
                    name: (<div title="Total logged hours">Total logged hours</div>),
                    selector: row => {
                        const hours = parseFloat(row.TotalLoggedHours);
                        return !isNaN(hours) ? hours.toFixed(2) : '';
                    },
                    sortable: true,
                    conditionalCellStyles: [
                        {
                            when: row => parseFloat(row.TotalLoggedHours) < 40,
                            style: {
                                backgroundColor: 'Orange',
                                color: 'white',
                            },
                        },
                    ],
                },
                {
                    name: (<div title="Recorded Hours">Recorded hours</div>),
                    selector: row => {
                        const hours = parseFloat(row.RecordedHours);
                        return !isNaN(hours) ? hours.toFixed(2) : '';
                    },
                    sortable: true,
                },
                {
                    name: (<div title="Productive Hours ">Productive hours</div>),
                    selector: row => {
                        const hours = parseFloat(row.ProductiveHours);
                        return !isNaN(hours) ? hours.toFixed(2) : '';
                    },
                    sortable: true,
                },
                {
                    name: (<div title="Non Productive Hours">Non productive hours</div>),
                    selector: row => {
                        const hours = parseFloat(row.NonProductiveHours);
                        return !isNaN(hours) ? hours.toFixed(2) : '';
                    },
                    sortable: true,
                },
                {
                    name: (<div title="Excluded hours">Excluded hours</div>),
                    selector: row => {
                        const hours = parseFloat(row.ExcludeRecordedHours);
                        return !isNaN(hours) ? hours.toFixed(2) : '';
                    },
                    sortable: true,
                },
                {
                    name: (<div title="Productive %">Productive % </div>),
                    selector: row => {
                        const hours = parseFloat(row.PercentageProductiveHours);
                        return !isNaN(hours) ? hours.toFixed(2) : '';
                    },
                    sortable: true,
                    conditionalCellStyles: [
                        {
                            when: row => parseFloat(row.PercentageProductiveHours) < 65,
                            style: {
                                backgroundColor: 'Tomato',
                                color: 'white',
                            },
                        },
                    ],
                },);
            return baseColumns;
        }, [data]);
*/



    const columns = useMemo(() => {
        const baseColumns = [];

        // Check if the initial condition is met
        const isConditionMet = data?.length > 0 && data?.every(item => item?.ResourceName);

        // Apply columns based on the condition
        if (isConditionMet) {
            baseColumns.push({
                name: (<div title="Resource Name"><strong>Resource name</strong></div>),
                selector: row => row?.ResourceName,
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
            });
        }

        // Common columns
        baseColumns.push(
            {
                name: (<div title="Department"><strong>Department</strong></div>),
                selector: row => row.Department,
                sortable: true,
            },
            {
                name: (<div title="Parent department"><strong>Parent department</strong></div>),
                selector: row => row.ParentDepartment,
                sortable: true,
            },
            {
                name: (<div title="Total logged hours"><strong>Total logged hours</strong></div>),
                selector: row => {
                    const hours = parseFloat(row.TotalLoggedHours);
                    return !isNaN(hours) ? hours.toFixed(2) : '';
                },
                sortable: true,
                conditionalCellStyles: [
                    {
                        when: row => {
                            const hours = parseFloat(row.TotalLoggedHours);
                            return isConditionMet && hours < 40;
                        },
                        style: {
                            backgroundColor: 'Orange',
                            color: 'white',
                        },
                    },
                    {
                        // Default style if condition is not met or different criteria
                        when: row => {
                            const hours = parseFloat(row.TotalLoggedHours);
                            return !isConditionMet || hours >= 40;
                        },
                        style: {
                            backgroundColor: '', // No special background
                            color: 'black',      // Default text color
                        },
                    },
                ],
            },

            {
                name: (<div title="Recorded hours"><strong>Recorded hours</strong></div>),
                selector: row => {
                    const hours = parseFloat(row.RecordedHours);
                    return !isNaN(hours) ? hours.toFixed(2) : '';
                },
                sortable: true,
            },
            {
                name: (<div title="Productive hours"><strong>Productive hours</strong></div>),
                selector: row => {
                    const hours = parseFloat(row.ProductiveHours);
                    return !isNaN(hours) ? hours.toFixed(2) : '';
                },
                sortable: true,
            },
            {
                name: (<div title="Non productive hours"><strong>Non productive hours</strong></div>),
                selector: row => {
                    const hours = parseFloat(row.NonProductiveHours);
                    return !isNaN(hours) ? hours.toFixed(2) : '';
                },
                sortable: true,
            },
            {
                name: (<div title="Excluded hours"><strong>Excluded hours</strong></div>),
                selector: row => {
                    const hours = parseFloat(row.ExcludeRecordedHours);
                    return !isNaN(hours) ? hours.toFixed(2) : '';
                },
                sortable: true,
            },
            {
                name: (<div title="Productive %"><strong>Productive %</strong></div>),
                selector: row => {
                    const hours = parseFloat(row.PercentageProductiveHours);
                    return !isNaN(hours) ? hours.toFixed(2) : '';
                },
                sortable: true,
                conditionalCellStyles: [
                    {
                        when: row => parseFloat(row.PercentageProductiveHours) < 65,
                        style: {
                            backgroundColor: 'Tomato',
                            color: 'white',
                        },
                    },
                ],
            },
        );

        return baseColumns;
    }, [data]);



        const filteredItems = data?.filter(item => {
            const searchText = filterText?.toLowerCase();
            return ['Department', 'ResourceName']?.some(field =>
                item[field]?.toLowerCase()?.includes(searchText)
            );
        });
        const exportToExcel = async () => {
            if (filteredItems?.length === 0) {
                alert('No data available to export');
                return;
            }
            const formattedData = filteredItems?.map(({ResourceName, Department,ParentDepartment, TotalLoggedHours, RecordedHours, ProductiveHours, NonProductiveHours, ExcludeRecordedHours, PercentageProductiveHours}) => ({
                ...(ResourceName !== null && ResourceName !== undefined ? {'Resource name': ResourceName} : {}),
                'Department': Department,
                'Parent department':ParentDepartment,
                'Total logged hours': TotalLoggedHours,
                'Recorded hours': RecordedHours,
                'Productive hours': ProductiveHours,
                'Non productive hours': NonProductiveHours,
                'Excluded hours': ExcludeRecordedHours,
                'Productive %': PercentageProductiveHours,
            }));
            const wb = new ExcelJS.Workbook();
            const ws = wb.addWorksheet('Sheet1');
            const headers = Object.keys(formattedData[0]);
            const filteredHeaders = headers.filter(header => header !== 'Resource name' || formattedData.some(data => data['Resource name'] !== ''));
            ws.columns = filteredHeaders.map(header => ({
                header: header,
                key: header.toLowerCase().replace(/ /g, '_'),
                width: 20,
            }));
             // Add bold font to the header
    filteredHeaders.forEach((header, index) => {
        const cell = ws.getCell(1, index + 1); // Row 1, Column index+1
        cell.font = { bold: true };
    });
            formattedData.forEach(item => {
                const row = {};
                filteredHeaders.forEach(header => {
                    row[header.toLowerCase().replace(/ /g, '_')] = item[header];
                });
                ws.addRow(row);
            });
            ws.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const productiveCell = row.getCell('productive_%');
                    const productiveValue = parseFloat(productiveCell.value);
                    if (!isNaN(productiveValue) && productiveValue < 65) {
                        productiveCell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'FFFF6347'}  // Tomato color in ARGB
                        };
                    }
                    const totalLoggedHoursCell = row.getCell('total_logged_hours');
                    const totalLoggedHoursValue = parseFloat(totalLoggedHoursCell.value);
                    if (!isNaN(totalLoggedHoursValue) && totalLoggedHoursValue < 40) {
                        totalLoggedHoursCell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'FFFFA500'}  // Orange color in ARGB
                        };
                    }
                }
            });
            const buffer = await wb.xlsx.writeBuffer();
            const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const reportType = ExcelDropdown === '1' ? 'User' : 'Department';
            const filename = timestamp?.length > 0 ? `ProductivityReport_${reportType}_${fromDate}_to_${toDate}.xlsx` : '';
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        };
        const Option = (props) => {
            return (
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            );
        };
        const handleSelectChange = (selected) => {
            const options = selected || [];
            setSelectedOptions(options);
        };
        const handleChange = (event) => {
            const department = event.target.value;
            setSelectedDepartment(department);
            setSelectedOptions('');

            if (department) {
                axios.get(`${config?.apiBaseUrl}/api/User/GetDepartments?ParentDepName=${department}`)
                    .then(response => {

                        setChildDepartments(response?.data);
                    })
                    .catch(error => {
                        console.error('Error fetching departments data:', error);
                    });
            } else {
                  setChildDepartments([]);
            }
        };

        const flattenDepartments = (departments) => {
            let options = [];

            departments?.map(department => {
                options?.push({
                    value: department.Department,
                    label: department.Department
                });

                if (department?.DepList && department?.DepList?.length > 0) {
                    department?.DepList?.map(depList => {
                        options?.push({
                            value: depList.Department,
                            label: depList.Department
                        });
                    });
                }
            });
            return options;
        };
        const options = flattenDepartments(childDepartments);
        const getTitleString = () => {
            if (selectedOptions && selectedOptions?.length > 0) {
                return selectedOptions?.map(option => option?.label).join(', ');
            }
            return '';
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
                    <div className="project-filter SearchFilter reportclass ">
                        <label className="searchlabelreport">Search</label>
                        <FilterComponent
                            className="searchfilter"
                            onFilter={e => setFilterText(e.target.value)}
                            onClear={handleClear}
                            filterText={filterText}
                        />
                        {data.length > 0 && (
                            <button className='exportxls resource-button resourcereport-button ' onClick={exportToExcel}>
                                <FaFileDownload/> <span className="resource-text">Export to Excel</span>
                            </button>
                        )}
                    </div>
                </>
            );
        }, [filterText, resetPaginationToggle, filteredItems]);

        return (
            <div>
                {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)}/>}
                <div className="date-filter-date">
                    <div className=" custom-dropdown project-filter reportdata ">
                        <label htmlFor="report-selects">Select type</label>
                        <select id="report-selects" defaultValue={selectedTypeRef.current} className="project-select ">
                            <option value="">Select</option>
                            <option value="1">User</option>
                            <option value="2">Department</option>
                        </select>
                    </div>
                    <div className="date-filter">
                        <label htmlFor="from-date" >Start date</label>
                        <input
                            className="dateinput"
                            type="date"
                            id="from-date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                        />
                        <label  htmlFor="to-date">End date</label>
                        <input
                            className="dateinput"
                            type="date"
                            id="to-date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="date-filter-date">
                    <div>
                        <div className=" custom-dropdown project-filter reportdata ">
                            <label htmlFor="department-select">Parent department</label>
                            <select value={selectedDepartment} onChange={handleChange}>
                                <option value="">Select a department</option>
                                {departments?.map(department => (
                                    <option key={department?.Department} value={department?.Department}>
                                        {department?.Department}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="project-filter  " title={getTitleString()}>
                        <label className="startdateproductivity" htmlFor="report-selects">Department</label>
                        <Select
                            className="selectreport"
                            isMulti
                            options={options}
                            onChange={handleSelectChange}
                            value={selectedOptions}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{Option}}
                        />

                    </div>
                    <div>
                        <div className="date-filter">
                            <button className='search reportsearch' onClick={SearchFilteredData}>Search</button>
                            <button className='reset' onClick={resetFilters}>Reset</button>
                        </div>
                    </div>
                </div>
                {(selectedTypeRef.current === '1' || selectedTypeRef.current === '2') && (
                    <div >
                        {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)}/>}
                        <DataTable
                            className="custom-data-table reportdatatable"
                            title="Productivity Report"
                            columns={columns}
                            data={filteredItems}
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
                    </div>
                )}
            </div>
        );
    };
export default ProductivityReport;