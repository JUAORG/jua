import React, {useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import { get, map, head } from "lodash"
import {
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import MUIDataTable from "mui-datatables";
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { activeJuaNetworkUsers } from "../actions/JuaNetwork"
import Page from '../components/Page';

export default function JuaNetwork() {
  const navigate = useNavigate();
  const db = getDatabase()
  const [users, setUsers] = useState([])
  const columns = [
    {
      name: "uid",
      label: "id",
      options: {
        filter: false,
        allowToggle: false,
        sort: false,
        display: false,
      }
    },
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "current_occupation",
      label: "Occupation",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "industry",
      label: "Industry",
      options: {
        filter: false,
        sort: false,
      }
    },
  ];

  useEffect(() => {
    onValue(ref(db, `/users`), (snapshot) => {
      let result = (snapshot.val() && snapshot.val())
      result = activeJuaNetworkUsers(result)
      setUsers(result)
    })
  }, [db])

  const goToUserProfile = (rowData) => {
    const juaNetworkUserId = head(rowData)
    navigate(`/dashboard/jua_network/${juaNetworkUserId}`, { replace: true });    
  }
  
  const options = {
    filterType: 'checkbox',
    print: false,
    download: false,
    isRowSelectable: false,
    selectableRows: 'none',
    resizableColumns: true,
    onRowClick: goToUserProfile,
    responsive: 'stacked',
    selectableRowsHideCheckboxes: false
  };
  
  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network
        </Typography>   
        <MUIDataTable
          data={users}
          columns={columns}
          options={options}
        />     
      </Container>
    </Page>
  )
}
