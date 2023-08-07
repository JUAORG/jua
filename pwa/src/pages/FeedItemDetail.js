import { useQuery } from 'react-query'
import { get, map, last } from 'lodash'
import {
  Container,
  Typography,
  Skeleton
} from '@mui/material'
import { fetchFeedItem } from '../actions/JuaFeed'
import Page from '../components/Page'

export default function FeedItemDetail() {
  const industryRef = last(window.location.pathname.split('/'))

  const { isLoading, data } = useQuery('feed_item', () => fetchFeedItem(industryRef))
  const feedItem = get(data, 'data')

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 1 }}>
          {get(feedItem, 'title')}
        </Typography>
        <Typography variant="small" sx={{ mb: 1 }}>
          {get(feedItem, 'created_at')}
        </Typography><br/>
          <Typography variant="p" sx={{ my: 2 }}>
          {get(feedItem, 'body')}
    </Typography>
    
      </Container>
    </Page>
  )
}
