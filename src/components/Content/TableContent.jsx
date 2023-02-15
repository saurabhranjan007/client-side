import React, { useState, useEffect, useMemo, useRef } from "react";
import { sortRows, filterRows, paginateRows } from "../helper/helperfunc.js";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export const TableContent = ({ 
    columns, 
    data, 
    handleDelete, 
    setOpen, 
    setDataId, 
    handleGet
}) => {

    const [activePage, setActivePage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({ order: "asc", orderBy: "id" });
    const [rowsPerPage, setRowsPerPage] = useState(data && data.length > 0 ? data.length : 10);
    const tableRef = useRef(null);
  
    const filteredRows = useMemo(() => filterRows(data, filters), [data, filters]);
    const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort]);
    const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);
    const count = filteredRows.length;
    const totalPages = Math.ceil(count / rowsPerPage);

    const handleSearch = (value, accessor) => {
        setActivePage(1);
    
        if (value) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            [accessor]: value,
          }));
        } else {
          setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            delete updatedFilters[accessor];
    
            return updatedFilters;
          });
        }
    };
    
    const handleSort = (accessor) => {
        setActivePage(1);
        setSort((prevSort) => ({
            order:
            prevSort.order === "asc" && 
            prevSort.orderBy === accessor ? "desc" : "asc",
            orderBy: accessor,
        }));
    };


    return (
        <>
            <table ref={tableRef}>
                <thead>
                <tr>
                    {columns &&
                    columns.map((column) => {
                        const sortIcon = () => {
                        if (
                            column.accessor  !== 'update' && 
                            column.accessor  !== 'delete' && 
                            column.accessor === sort.orderBy
                        ) {
                            {/* console.log('column',column) */}
                            if (sort.order === "asc") {
                            return ( 
                                <ArrowDropUpIcon />
                            ); 
                            }
                            return (
                                <ArrowDropDownIcon />
                            );
                        } else {
                            return <ArrowDropUpIcon />;
                        }
                        };
                        return (
                        <th
                            key={column.accessor}
                            className=""
                            onClick={() => handleSort(column.accessor)}
                        >
                            <span className="">
                            {column.label} {sortIcon()}
                            </span>
                        </th>
                        );
                    })}
                </tr>
                {data?.length > 0 ? (
                    <tr>
                    {columns.map((column) => {
                        return column.accessor == "update" || column.accessor == "delete" ? 
                        ("") : (
                            <th className="">
                            <input
                                className=""
                                key={`${column.accessor}-search`}
                                type="search"
                                placeholder={`Search ${column.label}`}
                                value={filters[column.accessor]}
                                onChange={(event) => handleSearch(event.target.value, column.accessor)}
                            />
                            </th>
                        );
                        })
                    }
                    </tr>
                ) : ("")}
                </thead>

                <tbody>
                {calculatedRows.map((row, index) => {
                    return (
                    
                    <tr key={row.id} className="">
                        {columns.map((column) => {
                        if (column.format) {
                            return column.accessor === "update" ? (
                            <td key={column.accessor}>
                                <div className="">
                                    {column.format(row[column.accessor])}
                                    <button onClick={() => {
                                        setOpen(true); 
                                        setDataId(row._id);
                                    }}> UPDATE </button>
                                </div>
                            </td>
                            ) : (column.accessor === "delete" ? (
                                <td key={column.accessor}>
                                    <div className="">
                                        {column.format(row[column.accessor])}
                                        <button onClick={() => {
                                            handleDelete(row._id);
                                        }}> DELETE </button>
                                    </div>
                                </td>
                            ) : column.accessor === "" ? (
                            <td key={column.accessor}>{index + 1}</td>
                            ) : (
                            <td key={column.accessor}>{index}</td>
                            ));
                        }
                        return <td key={column.accessor}>{row[column.accessor]}</td>;
                        })}
                    </tr>
                    );
                })}
                </tbody>
            </table>
        </>
    )
}