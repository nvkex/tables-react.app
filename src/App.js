import React, { useState, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import axios from 'axios';
import './App.css';

// A global filter
function GlobalFilter({globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);
  const onInputChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200);

  return (
    <span>
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onInputChange(e.target.value);
        }}
        placeholder="Search..."
        style={{height:'5vh',width: '50%', margin:'0 25%'}}
      />
    </span>
  )
}

// Table component
function Table({ columns, data }) {

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

                {/* Icons representing sorting order*/}
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

        {/* Global Filter */}
        <tr>
          <td 
            colSpan={visibleColumns.length}
            style={{textALign: 'left'}}
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

function App() {

  const URL = 'https://jsonplaceholder.typicode.com/posts';
  var [data, setData] = useState([]);

  // Fetch table content
  // Update state when dataset empty 
  if (data.length === 0)
    axios.get(URL)
      .then(res => {
        setData(res.data.slice(0, 20));
      })
      .catch(err => console.log(err));


  // Define table headers
  // Must be memoized
  const columns = useMemo(() => [
    {
      Header: "User ID",
      accessor: "userId"
    },
    {
      Header: "ID",
      accessor: "id"
    },
    {
      Header: "Title",
      accessor: "title"
    },
    {
      Header: "Content",
      accessor: "body"
    }
  ], []);

  return (
    <div>

      {
        data.length === 0 ?
          <h1 className="display-3 text-muted text-center">Loading...</h1> :
          <Table columns={columns} data={data}></Table>
      }

    </div>
  );
}

export default App;
