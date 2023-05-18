import * as React from 'react';
import { get, map } from 'lodash';
import { useQuery } from 'react-query';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  ImageList,
  ImageListItem,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchIndustries } from '../actions/JuaNetwork'

export default function BriefServiceCards() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery(['industry_list'], fetchIndustries, {
    enabled: true,
    refetchIntervalInBackground: false,
  })  
  const industries = get(data, 'data')

  const goToIndustry = (ref) => {
    navigate(`/dashboard/industry/${ref}`, { replace: true });
  };

  return (
    <ImageList
      sx={{
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(260px, 1fr)',
        gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)) !important'
      }}
    >
      {map(industries, (industry) => (
        <Card
          m={1}
          sx={{ maxWidth: 400 }}
          key={get(industry, 'ref')}
          onClick={ () => goToIndustry(get(industry, 'ref')) }
        >
          <ImageListItem>
            <CardActionArea>
              {/* {!isLoading && */}
              {/*  <CardMedia */}
              {/*    component="img" */}
              {/*    height="140" */}
              {/*    image="/static/images/cards/contemplative-reptile.jpg" */}
              {/*    alt="green iguana" */}
              {/*  /> */}
              {/* } */}
              <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
              <CardContent>
                { isLoading && <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} /> }
                { !isLoading &&
                  <Typography gutterBottom variant="h5" component="div"> 
                    {get(industry, 'name')}
                  </Typography>
                }
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
      ))}
    </ImageList>
  );
}
