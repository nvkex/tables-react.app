import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';

// Global filter for all columns
export default function GlobalFilter({globalFilter, setGlobalFilter }) {

    const [value, setValue] = useState(globalFilter);

    // This handler filters on every input change
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