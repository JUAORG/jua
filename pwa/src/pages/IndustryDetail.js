import { useQuery } from 'react-query'
import { get, map, last } from 'lodash'
import {
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
import { fetchIndustry } from '../actions/JuaNetwork'
import Page from '../components/Page'

export default function IndustryDetail() {
  const industryRef = last(window.location.pathname.split('/'))

  const { isLoading, data } = useQuery('industry', () => fetchIndustry(industryRef))
  const industry = get(data, 'data')

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 1 }}>
          {get(industry, 'name')}
        </Typography>
        <Typography variant="p" sx={{ my: 2 }}>
          {get(industry, 'description')}
        </Typography>
        <Typography variant="h6" sx={{ mt: 5, mb: 3 }}>
          Advisors
        </Typography>
        <ImageList
          sx={{
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(260px, 1fr)',
            gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)) !important',
          }}
        >
          {map(get(industry, 'advisors'), (advisor) => (
            <>
              <Card m={1} sx={{ maxWidth: 400 }} key={get(advisor, 'ref')}>
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
                          {get(advisor, 'first_name')}
                        </Typography>
                      )}
                      {isLoading && (
                        <>
                          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                          <Skeleton animation="wave" height={10} width="80%" />
                        </>
                      )}
                      {!isLoading && (
                        <Typography variant="body2" color="text.secondary">
                          {get(advisor, 'last_name')}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </ImageListItem>
              </Card>
            </>
          ))}
        </ImageList>
      </Container>
    </Page>
  )
}
