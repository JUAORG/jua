import React, { useState } from "react"
import ReactGA from 'react-ga';
import { get, head } from "lodash"
import { useQuery } from 'react-query';
import { Avatar, Container, Typography, Skeleton } from '@mui/material';
import MUIDataTable from "mui-datatables";
import "../App.css";
import { fetchJuaNetworkUsers, fetchJuaNetworkUser } from "../actions/JuaNetwork"
import Page from '../components/Page';
import { UserDetail } from '../components/UserDetail';


export default function JuaNetwork() {
  const { data, error, isLoading } = useQuery(['jua_network_users'], fetchJuaNetworkUsers, {
    enabled: true,
    refetchInterval: 60000,
    // Continue to refetch while the tab/window is in the background
    refetchIntervalInBackground: true,
  });
  const users = get(data, 'data', [])
  const [selectedUser, setSelectedUser] = useState(false)
  const [openUserDetailView, setOpenUserDetailView] = useState(false)

  const onClickJuaNetworkUser = (ref) => {
    fetchJuaNetworkUser(ref).then((response) => {
      setSelectedUser(response.data)
      setOpenUserDetailView(true)
      ReactGA.event({
        value: 1,
        category: `Profile view: ${ref}`,
        action: `Clicked on service provider profile`
      })
    }).catch((error) => {
      console.error(error)
    })
  }


  const columns = [
    {
      name: "ref",
      label: "--",
      options: {
        filter: false,
        showColumn: false,
        allowToggle: false,
        sort: false,
        display: false,
      }
    },
    {
      name: "profile_picture",
      label: ' ',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const row = tableMeta.tableData[tableMeta.rowIndex]
          return <div><Avatar src={get(row, 'profile_picture')}/></div>;
        }
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

  const goToUserProfile = (rowData) => {
    const juaNetworkUserId = head(rowData)
    onClickJuaNetworkUser(juaNetworkUserId)
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
    responsive: 'vertical',
    selectableRowsHideCheckboxes: false
  };

  const renderDataTableSkeleton = () => (
    <>
      <Skeleton
        variant="rectangular"
        height={'5vh'}
        sx={{
          margin: 'auto',
          width: {
            xs: '90vw',
            md: '50vw'
          }
        }}
      />
      <br/>
      <Skeleton
        variant="rectangular"
        height={'45vh'}
        sx={{
          margin: 'auto',
          width:{
            xs: '90vw',
            md: '50vw'
          }
        }}
      />
    </>
  )

  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network
        </Typography>
        {isLoading && renderDataTableSkeleton()}
        {!isLoading &&
         <MUIDataTable
           data={users}
           columns={columns}
           options={options}
         />
        }
        {openUserDetailView &&
         <UserDetail
           user={selectedUser}
           handleClose={closeUserDetailView}
         />
        }
      </Container>
    </Page>
  )
}
