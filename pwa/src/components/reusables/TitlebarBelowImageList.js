import * as React from 'react';
import { fromPairs, get, map, size } from "lodash"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function TitlebarBelowImageList({ itemData }) {
  const navigate = useNavigate()
  const matches = useMediaQuery('(min-width:600px)')

  const goToPage = (item) => {
    const slug = get(item, 'slug')
    navigate(`/dashboard/service/${slug}`, { replace: true });
    }
  
  return (
    <ImageList sx={{ padding: 3, height: '50vh' }} cols={ matches ? 2 : 1 }>
      {itemData.map((item) => (
        <ImageListItem
          key={ get(item, 'thumbnail') }
          onClick={() => goToPage(item)}
          sx={{ cursor: 'pointer' }}
        >
          <img
            loading='lazy'
            alt={ get(item, 'name') }
            src={`${get(item, 'thumbnail')}?w=248&fit=crop&auto=format`}
            srcSet={`${get(item, 'thumbnail')}?w=248&fit=crop&auto=format&dpr=2 2x`}
          />
          <ImageListItemBar
            position='below'
            title={ get(item, 'name') }
            subtitle={ get(item, 'description') }
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}
