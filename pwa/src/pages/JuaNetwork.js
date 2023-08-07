import React, { useState } from 'react'
import ReactGA from 'react-ga'
import { get, map } from 'lodash'
import { useQuery } from 'react-query'
import {
  Stack,
  Avatar,
  Container,
  Typography,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  ImageList,
  ImageListItem,
} from '@mui/material'
import '../App.css'
import { fetchIndustries, fetchJuaNetworkUser } from '../actions/JuaNetwork'
import Page from '../components/Page'
import { UserDetail } from '../components/UserDetail'

export default function JuaNetwork() {
  const { data, error, isLoading } = useQuery(['jua_network_users'], fetchIndustries, {
    enabled: true,
    refetchInterval: 600000,
    // Continue to refetch while the tab/window is in the background
    refetchIntervalInBackground: false,
  })
  const industries = get(data, 'data', [])
  const [selectedUser, setSelectedUser] = useState(false)
  const [openUserDetailView, setOpenUserDetailView] = useState(false)

  const onClickJuaNetworkUser = (ref) => {
    fetchJuaNetworkUser(ref)
      .then((response) => {
        setSelectedUser(response.data)
        setOpenUserDetailView(true)
        ReactGA.event({
          value: 1,
          category: `Profile view: ${ref}`,
          action: `Clicked on service provider profile`,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const closeUserDetailView = () => setOpenUserDetailView(false)

  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network
        </Typography>
        <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={5}>
          {map(industries, (industry) => (
            <>
              <p>{get(industry, 'name')}</p>
              <ImageList
                sx={{
                  gridAutoFlow: 'column',
                  gridAutoColumns: 'minmax(260px, 1fr)',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)) !important',
                }}
              >
                {map(get(industry, 'advisors'), (advisor) => (
                  <>
                    <Card
                      m={1}
                      sx={{ maxWidth: 400 }}
                      key={get(advisor, 'ref')}
                      onClick={() => onClickJuaNetworkUser(get(advisor, 'ref'))}
                    >
                      <ImageListItem>
                        <CardActionArea>
                          {!isLoading && (
                            <CardMedia
                              height="10"
                              component="div"
                              sx={{ objectFit: 'contain', background: '#004aad', height: 20 }}
                            />
                          )}
                          <Avatar
                            src={get(advisor, 'profile_picture')}
                            sx={{color: "#2065D1", position: 'relative', left: '20px', top: '15px'}}
                          />
                          {isLoading && <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />}
                          <CardContent>
                            {isLoading && <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />}
                            {!isLoading && (
                              <Typography gutterBottom variant="h5" component="div">
                                {get(advisor, 'first_name')} {get(advisor, 'last_name')}
                              </Typography>
                            )}
                            {isLoading && (
                              <>
                                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                <Skeleton animation="wave" height={10} width="80%" />
                              </>
                            )}
                            {!isLoading && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textOverflow:'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                {get(advisor, 'bio')}
                              </Typography>
                            )}
                          </CardContent>
                        </CardActionArea>
                      </ImageListItem>
                    </Card>
                  </>
                ))}
              </ImageList>
            </>
          ))}
        </Stack>
        {openUserDetailView && <UserDetail user={selectedUser} handleClose={closeUserDetailView} />}
      </Container>
    </Page>
  )
}
