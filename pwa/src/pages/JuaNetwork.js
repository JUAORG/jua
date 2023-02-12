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
        filter: true,
        sort: false,
      }
    },
    {
      name: "industry",
      label: "Industry",
      options: {
        filter: true,
        sort: true,
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
