import React, { useState, useMemo } from 'react';
import axios from 'axios';

import Table from './components/Table';
import './App.css';


function App() {

  const URL = 'https://jsonplaceholder.typicode.com/posts';
  var [data, setData] = useState([]);

  // Fetch table content
  // Update state only when dataset empty 
  if (data.length === 0)
    axios.get(URL)
      .then(res => {
        setData(res.data.slice(0, 20));
      })
      .catch(err => console.log(err));


  // Define table headers.
  // Must be memoized.
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
      
      {/* Display loading text while the data is being fetched */}
      {
        data.length === 0 ?
          <h1 className="display-3 text-muted text-center">Loading...</h1> :
          <Table columns={columns} data={data}></Table>
      }

    </div>
  );
}

export default App;
