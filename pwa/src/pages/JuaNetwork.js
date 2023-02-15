import React, {useState, useEffect, useContext} from "react"
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
import "../App.css";
import { UserContext, UserDispatchContext } from "../contexts/User";
import { fetchJuaNetworkUsers, fetchJuaNetworkUser } from "../actions/JuaNetwork"
import Page from '../components/Page';
import { UserDetail } from '../components/UserDetail';


export default function JuaNetwork() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(false)
  const [openUserDetailView, setOpenUserDetailView] = useState(false)

  useEffect(() => {
    fetchJuaNetworkUsers()
      .then((response) => {
        setUsers(response.data)
      }).catch((error) => {
        console.error(error)
      })
  }, [])

  console.log(selectedUser)
  const onClickJuaNetworkUser = (id) => {
    fetchJuaNetworkUser(id).then((response) => {
      setSelectedUser(response.data)
    }).catch((error) => {
      console.error(error)
    })
  }

    
  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        filter: false,
        showColumn: false,
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
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log(tableMeta)
          return <div>{get(tableMeta.tableData[tableMeta.rowIndex], ['profile', 'first_name'])}</div>;
        }
      }
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{get(tableMeta.tableData[tableMeta.rowIndex], ['profile', 'last_name'])}</div>;
        }
      }
    },
    {
      name: "current_occupation",
      label: "Occupation",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{get(tableMeta.tableData[tableMeta.rowIndex], ['profile', 'occupation'])}</div>
        }
      }
    },
    {
      name: "industry",
      label: "Industry",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{get(tableMeta.tableData[tableMeta.rowIndex], ['profile', 'industry'])}</div>
        }
      }
    },
  ];

  useEffect(() => {

  }, [])

  const goToUserProfile = (rowData) => {
    const juaNetworkUserId = head(rowData)
    onClickJuaNetworkUser(juaNetworkUserId)
    setOpenUserDetailView(true)
  }

  const closeUserDetailView = () => setOpenUserDetailView(false)
  
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
  console.log(users)  
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
        {openUserDetailView &&
         <UserDetail
           user={head(selectedUser)}
           handleClose={closeUserDetailView}
         />
        }
      </Container>
    </Page>
  )
}
