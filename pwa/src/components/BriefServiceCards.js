import * as React from 'react';
import { get, map } from 'lodash';
import { Card,  CardContent, CardMedia, CardActionArea, Typography, ImageList, ImageListItem, Skeleton } from '@mui/material';

export default function BriefServiceCards() {
  return (
    <ImageList
    sx={{
      gridAutoFlow: 'column',
      gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)) !important',
      gridAutoColumns: 'minmax(260px, 1fr)',
    }}
    >
      {/* {map(images, (image) => ( */}
        <Card m={1} sx={{ maxWidth: 400 }}>
          <ImageListItem>
            <CardActionArea>
              {/* <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              /> */}
              <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
              <CardContent>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                {/* <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography> */}
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
                {/* <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                  continents except Antarctica
                </Typography> */}
              </CardContent>
            </CardActionArea>
          </ImageListItem>
        </Card>
        <Card sx={{ maxWidth: 400 }}>
          <ImageListItem>
            <CardActionArea>
              {/* <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              /> */}
              <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
              <CardContent>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                {/* <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography> */}
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
                {/* <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                  continents except Antarctica
                </Typography> */}
              </CardContent>
            </CardActionArea>
          </ImageListItem>
        </Card>
        <Card sx={{ maxWidth: 400 }}>
          <ImageListItem>
            <CardActionArea>
              {/* <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              /> */}
              <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
              <CardContent>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                {/* <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography> */}
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
                {/* <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                  continents except Antarctica
                </Typography> */}
              </CardContent>
            </CardActionArea>
          </ImageListItem>
        </Card>
      {/* ))} */}
    </ImageList>
  );
}
