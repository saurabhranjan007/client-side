import React, { useState, useEffect, useMemo } from 'react'
import './content.styles.scss'

import Axios from 'axios'
import { TableContent } from './TableContent'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


export default function Content() {

  const[dataId, setDataId] = useState('')
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)

  const [newName, setNewName] = useState('New Name')
  const [newDepartment, setNewDepartment] = useState('Tech')
  const [newTeam, setNewTeam] = useState('Dev')

  // GET EMPLOYEES
  const handleGet = async() => {
    const get = await Axios.get("http://localhost:3001/employee/get")
    if(!get) return 
    setData(get.data)
    // console.log("data ", get.data);
  }

  useEffect(() => {
    handleGet(); 
  }, [])

  // UPDATE EMPLOYEE 
  const handleUpdate = async() => {
    // console.log("Updating doc, id - ", dataId);
    if(!dataId) return 
    const updateCall = await Axios.post("http://localhost:3001/employee/update", {
      id: dataId,
      name: newName,
      department: newDepartment,
      team: newTeam, 
    })
    // console.log("update ", updateCall);
    setOpen(false);
    handleGet(); 
  }

  // DELETE EMPLOYEE 
  const handleDelete = async(id) => {
    if(!id) return
    const del = await Axios.post("http://localhost:3001/employee/delete", {id: id})
    if(!del) return 
    // console.log("dell ", del);
    handleGet(); 
  }

  const columns = [
    { 
      accessor: "name",
      label: "Name",
    },
    {
      accessor: "department", 
      label: "Department",
    },
    {
      accessor: "team",
      label: "Team", 
    },
    { 
      accessor: "update",
      label: "Update",
      format: (value) => value ? ("") : (<div className=""></div>), 
    }, 
    { 
      accessor: "delete",
      label: "Delete",
      format: (value) => value ? ("") : (<div className=""></div>), 
    },
  ];

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className='table-container'>
      <div className='table-data'>
        <TableContent
          columns={columns}
          data={data}
          handleGet={handleGet}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          setOpen={setOpen}
          setDataId={setDataId}
        />
      </div>
      <div>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update Employee Details
            </Typography>
            <input 
              placeholder='Enter New Name' 
              onChange={(e) => setNewName(e.target.value)} 
            />
            <input 
              placeholder='Enter New Department' 
              onChange={(e) => setNewDepartment(e.target.value)} 
            />
            <input 
              placeholder='Enter New Team' 
              onChange={(e) => setNewTeam(e.target.value)} 
            />

            <button style={{ margin: '0 10px' }} onClick={() => handleUpdate()}> Update </button>
          </Box>
        </Modal>
      </div>
    </div>
  )
}
