import React from 'react';
import DataTable from 'react-data-table-component';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';


const columns = [
    {
        name: (
            <div
                data-tip="Description"
                data-for="header-tooltip-description"
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                Description
                <Tooltip id="header-tooltip-description" place="top" effect="solid" />
            </div>
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
                <Tooltip id={`tooltip-${index}`} place="top" effect="solid" />
            </div>
        )
    }
    // other columns...
];

const data = [
    { id: 1, Description: 'Task 1 description' },
    { id: 2, Description: 'Task 2 description' },
    // other data...
];

const MyDataTable = () => (
    <div>
        <DataTable
            columns={columns}
            data={data}
        />
    </div>
);


// Data structure

// Output: ['Granny Smith', 'Honeycrisp', 'Gala', 'Cavendish', 'Red', 'Plantain', 'Nantes', 'Imperator', 'Danvers', 'Russet', 'Yukon Gold', 'Red']


export default MyDataTable;



/*
const data = [
    {
        category: 'Fruits',
        items: [
            {
                name: 'Apple',
                varieties: ['Granny Smith', 'Honeycrisp', 'Gala']
            },
            {
                name: 'Banana',
                varieties: ['Cavendish', 'Red', 'Plantain']
            }
        ]
    },
    {
        category: 'Vegetables',
        items: [
            {
                name: 'Carrot',
                varieties: ['Nantes', 'Imperator', 'Danvers']
            },
            {
                name: 'Potato',
                varieties: ['Russet', 'Yukon Gold', 'Red']
            }
        ]
    }
];


console.log(data)
// Using map to extract all varieties
const allVarieties = data.map(category =>
    category.items.map(item =>
        item.varieties
    )
);

console.log("All Varieties:");
console.log(allVarieties);
// Output:
// [
//     [
//         ['Granny Smith', 'Honeycrisp', 'Gala'],
//         ['Cavendish', 'Red', 'Plantain']
//     ],
//     [
//         ['Nantes', 'Imperator', 'Danvers'],
//         ['Russet', 'Yukon Gold', 'Red']
//     ]
// ]

// Using filter to get categories with more than one item
const categoriesWithMultipleItems = data.filter(category =>
    category.items.length > 0
);

console.log("Categories with Multiple Items:");
console.log(categoriesWithMultipleItems);
// Output:
// [
//     {
//         category: 'Fruits',
//         items: [
//             { name: 'Apple', varieties: ['Granny Smith', 'Honeycrisp', 'Gala'] },
//             { name: 'Banana', varieties: ['Cavendish', 'Red', 'Plantain'] }
//         ]
//     },
//     {
//         category: 'Vegetables',
//         items: [
//             { name: 'Carrot', varieties: ['Nantes', 'Imperator', 'Danvers'] },
//             { name: 'Potato', varieties: ['Russet', 'Yukon Gold', 'Red'] }
//         ]
//     }
// ]

// Using find to locate a category with a specific variety
const categoryWithHoneycrisp = data.find(category =>
    category.items.find(item =>
        item.varieties.includes('Honeycrisp')
    )
);

console.log("Category with Honeycrisp Variety:");
console.log(categoryWithHoneycrisp);
// Output:
// {
//     category: 'Fruits',
//     items: [
//         { name: 'Apple', varieties: ['Granny Smith', 'Honeycrisp', 'Gala'] },
//         { name: 'Banana', varieties: ['Cavendish', 'Red', 'Plantain'] }
//     ]
// }

// Combining map, filter, and flat to get all varieties in categories with more than one item
const varietiesInMultipleItemCategories = data
    .filter(category => category.items.length > 1) // Filter categories with multiple items
    .map(category =>
        category.items.map(item =>
            item.varieties
        )
    )
    .flat(2); // Flatten the array to remove nested arrays

console.log("Varieties in Categories with Multiple Items:");
console.log(varietiesInMultipleItemCategories);

*/

/*return (
    {data}
);*/
//export default data;














/*
import React , { useState } from 'react';


const Dummy = () => {
    const [selectedReport, setSelectedReport] = useState('');
    const [selectedDetail, setSelectedDetail] = useState('');

    const handleReportChange = (e) => {
        setSelectedReport(e.target.value);
        setSelectedDetail(''); // Reset the detailed report selection
    };

    const handleDetailChange = (e) => {
        setSelectedDetail(e.target.value);
    };

    return (
        <div className="sub-header">
            <div>
                <label htmlFor="report-select">Select Report </label>
                <select id="report-select" value={selectedReport} onChange={handleReportChange}>
                    <option value="">Select </option>
                    <option value="1">Productivity Report</option>
                    <option value="2">Normalized Hours Report</option>
                    <option value="3">Profitability Report</option>
                    <option value="4">Consumed Vs Budgeted Hours</option>
                </select>
            </div>

            {selectedReport === '1' && (
                <div>
                    <label htmlFor="detail-select">Select Detailed Report: </label>
                    <select id="detail-select" value={selectedDetail} onChange={handleDetailChange}>
                        <option value="">Select a detailed report</option>
                        <option value="1">User wise Report</option>
                        <option value="2">Project wise Report</option>
                        <option value="3">Task wise Report</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Dummy;
*/
