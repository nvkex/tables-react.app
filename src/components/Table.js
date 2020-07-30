import React, { useMemo } from 'react';
import {
    useTable,
    useSortBy,
    useFilters,
    useGlobalFilter,
} from 'react-table';

import GlobalFilter from './GlobalFilter';

export default function Table({ columns, data }) {
    
    // Add filter types
    const filterTypes = useMemo(() => ({
        text: (rows, id, filterValue) => {
            return rows.filter(row => {
                const rowValue = row.values[id]
                return rowValue !== undefined
                    ? String(rowValue)
                        .toLowerCase()
                        .startsWith(String(filterValue).toLowerCase())
                    : true
            })
        }
    }), []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            filterTypes
        },
        useFilters, useGlobalFilter, useSortBy);

    return (
        <table {...getTableProps()}>
            <thead className="shadow-sm">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>

                                {/* Table heading */}
                                {column.render('Header')}

                                {/* Icons representing sort order*/}
                                <span>
                                    {column.isSortedDesc ?
                                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-up-short text-secondary mb-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z" />
                                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8 5.707 5.354 8.354a.5.5 0 1 1-.708-.708l3-3z" />
                                        </svg>
                                        :
                                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-down-short text-secondary mb-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.646 7.646a.5.5 0 0 1 .708 0L8 10.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" />
                                            <path fillRule="evenodd" d="M8 4.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                    }
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}

                {/* Global Filter Input */}
                <tr>
                    <td
                        colSpan={visibleColumns.length}
                        style={{ textALign: 'left' }}
                    >
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter} />
                    </td>
                </tr>

            </thead>

            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>

                                    {/* Cell value */}
                                    {cell.render('Cell')}

                                </td>
                            })}
                        </tr>
                    )
                })}
            </tbody>

        </table>

    )
}