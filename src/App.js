import React, {useState, useMemo} from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import './App.css';


function Table({ columns, data }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
   } = useTable({columns, data});

   return(
     <table {...getTableProps()}>
       <thead className="shadow-sm">
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
          {rows.map((row,i) => {
            prepareRow(row);
            return(
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>
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
  axios.get(URL)
    .then(res => {
      setData(res.data.slice(0,20));
    })
    .catch(err => console.log(err));
  


  const columns = useMemo(() =>[
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
    <Table columns={columns} data={data}></Table>
  );
}

export default App;
