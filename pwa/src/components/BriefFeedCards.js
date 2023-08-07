import * as React from 'react';
import { get, map } from 'lodash';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  ImageList,
  ImageListItem,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchFeed } from '../actions/JuaFeed';

export default function BriefFeedCards() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(['feed_list'], fetchFeed, {
    enabled: true,
    refetchIntervalInBackground: false,
  });
  const feed = get(data, 'data');

  const goToFeedItem = (ref) => {
    navigate(`/dashboard/feed/${ref}`, { replace: true });
  };

  return (
    <ImageList
      gap={10}
      cols={1}
      rowHeight={150}
    >
      {map(feed, (feedItem) => (
        <Card
          sx={{ margin: '10px 0px', md: {maxWidth: '80%'} }}
          key={get(feedItem, 'ref')}
          onClick={() => goToFeedItem(get(feedItem, 'ref'))}
        >
          <ImageListItem>
            <CardActionArea>
              {!isLoading && (
                <CardMedia
                  height="10"
                  component="div"
                  sx={{ objectFit: 'contain', background: '#5fe5e7', height: 20 }}
                />                
              )}
              {isLoading && <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />}
              <CardContent>
                {isLoading && <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />}
                {!isLoading && (
                  <Typography gutterBottom variant="h5" component="div">
                    {get(feedItem, 'title')}
                  </Typography>
                )}
                {isLoading && (
                  <>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} width="80%" />
                  </>
                )}
                {!isLoading && (
                  <>
                    <Box sx={{ my: 2,
                               overflow: 'hidden',
                               maxHeight: 20,
                               textOverflow: 'ellipsis',
                             }}>
                      <Typography variant="body2" color="text.secondary">
                        {get(feedItem, 'body')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {get(feedItem, 'created_at')}
                    </Typography>
                  </>
                )}
              </CardContent>
            </CardActionArea>
          </ImageListItem>
        </Card>
      ))}
    </ImageList>
  );
}
