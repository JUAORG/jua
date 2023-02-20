import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function BadgesList() {
    const [selectedBadge, setSelectedBadge] = useState(null)

    const showBadgeDetail = (badge) => {
        setSelectedBadge(badge)
    }

    return (
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={200}>
            {itemData.map((badge) => (
                    <ImageListItem key={badge.img} onClick={() => showBadgeDetail(badge)} sx={{cursor: 'pointer'}}>
                    <img
                src={`${badge.img}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${badge.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={badge.title}
                loading="lazy"
                    />
                    </ImageListItem>

            ))}
        </ImageList>

    );

}

const itemData = [
    {
        img: 'https://jua-bucket.fra1.cdn.digitaloceanspaces.com/production%2Fmedia%2Fbadges%2Fwelcome_badge.png',
        title: 'Welcome to Jua',

    },


];
