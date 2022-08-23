import { Box, Stack, Link, Card, Avatar, Button, Divider, Typography, CardHeader } from '@mui/material'
import { get, map } from "lodash"
import Iconify from '../../../components/Iconify'
import Scrollbar from '../../../components/Scrollbar'

// ----------------------------------------------------------------------

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
        {map(list, (x) => (
          <NewsItem news={x}/>
        ))}
        </Stack>
      </Scrollbar>

      <Divider />

      {/* <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View all
        </Button>
      </Box> */}
    </Card>
  );
}

// ----------------------------------------------------------------------

function NewsItem({ news }) {
  const { image, title, body, timestamp } = news;
  const postedAt = new Date(timestamp).toString()

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar src=''/>

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {body}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        { postedAt }
      </Typography>
    </Stack>
  );
}
