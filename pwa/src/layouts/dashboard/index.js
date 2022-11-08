import { useEffect, useState } from 'react'
import {
  ref,
  onValue,
  getDatabase
} from "firebase/database"
import { get } from 'lodash'
import { Outlet } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import DashboardNavbar from './DashboardNavbar'
import DashboardSidebar from './DashboardSidebar'
import { AuthProvider } from '../../components/AuthProvider'
import UserContext from '../../contexts/User'
import UsersContext from '../../contexts/Users'
import { showCustomerView } from '../../actions/UI'

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92


const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
})

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const db = getDatabase()
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null)
  const [open, setOpen] = useState(false)
  const environment = process.env.NODE_ENV
  const viewType = showCustomerView()

  useEffect(() => {
    onValue(ref(db, `/users`), (snapshot) => {  
      const users = (snapshot.val() && snapshot.val())
      setUsers(users)
    })
  }, [db])

  return (
    <RootStyle>
      <UsersContext.Provider value={users}>
      {/* <UserContext.Provider value={{user, viewType}}> */}
      <AuthProvider>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
      </AuthProvider>
      {/* </UserContext.Provider> */}
      </UsersContext.Provider>
    </RootStyle>
  )
}
