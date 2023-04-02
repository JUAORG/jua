import { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom'
import { alpha, useTheme, styled } from '@mui/material/styles'
import {
    Box,
    List,
    Collapse,
    Typography,
    ListItemText,
    ListItemIcon,
    ListItemButton
} from '@mui/material'
import Iconify from './Iconify'


const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
}))

const ListItemIconStyle = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

// ----------------------------------------------------------------------

NavItem.propTypes = {
    item: PropTypes.object,
    active: PropTypes.func,
}

function NavItem({ item, active }) {
    const theme = useTheme()
    const isActiveRoot = active(item.path)
    const { title, path, icon, info, children } = item
    const [open, setOpen] = useState(isActiveRoot)

    const handleOpen = () => {
        setOpen((prev) => !prev)
    }

    const activeRootStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    }

    const activeSubStyle = {
        color: 'text.primary',
        fontWeight: 'fontWeightMedium',
    }

    if (children) {
        return (
            <>
              <ListItemStyle
                onClick={handleOpen}
                sx={{
                    ...(isActiveRoot && activeRootStyle),
                }}
              >
                <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
                <ListItemText disableTypography primary={title} />
                {info && info}
                <Iconify
                  icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                  sx={{ width: 16, height: 16, ml: 1 }}
                />
              </ListItemStyle>

              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {children.map((item) => {
                      const { title, path } = item
                      const isActiveSub = active(path)

                      return (
                          <ListItemStyle
                            key={title}
                            component={RouterLink}
                            to={path}
                            sx={{
                                ...(isActiveSub && activeSubStyle),
                            }}
                          >
                            <ListItemIconStyle>
                              <Box
                                component="span"
                                sx={{
                                    width: 4,
                                    height: 4,
                                    display: 'flex',
                                    borderRadius: '50%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'text.disabled',
                                    transition: (theme) => theme.transitions.create('transform'),
                                    ...(isActiveSub && {
                                        transform: 'scale(2)',
                                        bgcolor: 'primary.main',
                                    }),
                                }}
                              />
                            </ListItemIconStyle>
                            <ListItemText disableTypography primary={title} />
                          </ListItemStyle>
                      )
                  })}
                </List>
              </Collapse>
            </>
        )
    }

    return (
        <ListItemStyle
          component={RouterLink}
          to={path}
          sx={{
              ...(isActiveRoot && activeRootStyle),
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
        </ListItemStyle>
    )
}

NavSection.propTypes = {
    navConfig: PropTypes.array,
}

export default function NavSection({ navConfig, ...other }) {
    const { pathname } = useLocation()
    const disabled = true
    const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false)
    const isAdvisorySessionActive = pathname === '/dashboard/advisory_session_meeting/'

    return (
        <Box {...other}>
          <List disablePadding sx={{ p: 1 }}>
            {isAdvisorySessionActive &&
             <Typography
               variant='p'
               component='p'
               sx={{ mt: 1, fontSize: '14px', textAlign: 'center' }}
             >
               Side bar disabled during active advisory session
             </Typography>
            }
            {!isAdvisorySessionActive && navConfig.map((item) => (
                <NavItem key={item.title} item={item} active={match} />
            ))}
          </List>
          <Typography
            variant='p'
            component='p'
            sx={{ mt: 1, fontSize: '11px', textAlign: 'center' }}
          >
            Proudly 🇿🇦 South African
          </Typography>
          <Typography
            variant='p'
            component='p'
            sx={{ fontSize: '11px', textAlign: 'center' }}
          >
            v{process.env.REACT_APP_VERSION_NUMBER}
          </Typography>
        </Box>
    )
}
