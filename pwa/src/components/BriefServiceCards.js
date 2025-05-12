import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  ImageList,
  ImageListItem,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { get, map } from 'lodash';
import { db } from '../actions/firebase';

export default function BriefServiceCards() {
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'industries'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          ref: doc.id,
          ...doc.data(),
        }));
        setIndustries(entries);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching industries:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const goToIndustry = (ref) => {
    navigate(`/dashboard/industry/${ref}`, { replace: true });
  };

  const truncateIndustryDescription = (str) =>
    str && str.length > 100 ? `${str.substring(0, 100)} ...` : str;

  return (
    <ImageList
      sx={{
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(260px, 1fr)',
        gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)) !important',
      }}
    >
      {loading && (
        [...Array(3)].map((_, idx) => (
          <Card key={idx} sx={{ maxWidth: 400 }}>
            <ImageListItem>
              <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
              <CardContent>
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
              </CardContent>
            </ImageListItem>
          </Card>
        ))
      )}

      {!loading && industries.length > 0 && map(industries, (industry) => (
        <Card
          key={get(industry, 'ref')}
          sx={{ maxWidth: 400, cursor: 'pointer' }}
          onClick={() => goToIndustry(get(industry, 'ref'))}
        >
          <ImageListItem>
            <CardActionArea>
              <CardMedia
                height="200"
                component="img"
                sx={{ objectFit: 'contain' }}
                alt={get(industry, 'name')}
                image={`/static/icons/${get(industry, 'image_src')}.svg`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {get(industry, 'name')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateIndustryDescription(get(industry, 'description'))}
                </Typography>
              </CardContent>
            </CardActionArea>
          </ImageListItem>
        </Card>
      ))}
    </ImageList>
  );
}
