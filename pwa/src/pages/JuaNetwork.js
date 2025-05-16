import React, { useEffect, useState, useMemo } from 'react';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ShareIcon from '@mui/icons-material/Share';
import BasicSpeedDial from '../components/SpeedDial';
import {
  Container,
  Typography,
  Stack,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  ImageList,
  ImageListItem,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
} from '@mui/material';
import ReactGA from 'react-ga';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../actions/firebase'; // Adjust the path to your firebase.js config
import notificationManager from '../actions/NotificationManager';
import { UserDetail } from '../components/UserDetail';
import Page from '../components/Page';

const ITEMS_PER_PAGE = 6;

export default function JuaNetwork() {
  const [users, setUsers] = useState([]);
  const [industryFilter, setIndustryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDetailView, setOpenUserDetailView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('profile_visible', '==', true),
      where('is_service_provider', '==', true)
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const updatedUsers = snapshot.docs.map(doc => ({
          ...doc.data(),
          ref: doc.id,
        }));
        setUsers(updatedUsers);
        setLoading(false);
      },
      error => {
        notificationManager.error('Failed to listen to network users', 'Error');
        setLoading(false);
      }
    );

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  const filteredIndustries = useMemo(() => {
    const uniqueIndustries = [...new Set(users.map(u => u.industry))];
    return uniqueIndustries.sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (industryFilter) {
      list = list.filter(u => u.industry === industryFilter);
    }
    if (searchTerm) {
      list = list.filter(u =>
        `${u.first_name} ${u.last_name} ${u.bio || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return list;
  }, [users, industryFilter, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const onClickJuaNetworkUser = async ref => {
    try {
      const snap = await getDoc(doc(db, 'users', ref));
      if (snap.exists()) {
        setSelectedUser({ ...snap.data(), ref: snap.id });
        setOpenUserDetailView(true);
        ReactGA.event({
          value: 1,
          category: `Profile view: ${ref}`,
          action: 'Clicked on service provider profile',
        });
      }
    } catch (err) {
      notificationManager.error('Could not load user details', 'Error');
    }
  };

  const closeUserDetailView = () => setOpenUserDetailView(false);

  const handleIndustryChange = e => {
    setIndustryFilter(e.target.value);
    setPage(1);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network
        </Typography>

        {loading ? (
          <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
        ) : (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <TextField
                select
                label="Filter by Industry"
                value={industryFilter}
                onChange={handleIndustryChange}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All Industries</MenuItem>
                {filteredIndustries.map(industry => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search name or bio..."
                sx={{ flex: 1 }}
              />
            </Stack>

            <ImageList
              sx={{
                gridAutoFlow: 'row',
                gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)) !important',
              }}
            >
              {paginatedUsers.map(advisor => (
                <Card
                  key={advisor.ref}
                  sx={{ width: 350, maxWidth: 350 }}
                  onClick={() => onClickJuaNetworkUser(advisor.ref)}
                >
                  <ImageListItem>
                    <CardActionArea>
                      <CardMedia component="div" sx={{ objectFit: 'contain', background: '#004aad', height: 20 }} />
                      <Avatar
                        src={advisor.profile_picture}
                        sx={{ color: '#2065D1', position: 'relative', left: '20px', top: '15px' }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5">
                          {advisor.first_name} {advisor.last_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {advisor.bio}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </ImageListItem>
                </Card>
              ))}
            </ImageList>

            {filteredUsers.length > ITEMS_PER_PAGE && (
              <Pagination
                count={Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
              />
            )}
          </>
        )}

        {openUserDetailView && <UserDetail user={selectedUser} handleClose={closeUserDetailView} />}
        <BasicSpeedDial
          actions={[
            {
              icon: <FeedbackIcon />,
              name: 'Feedback',
              onClick: () => navigate(`/dashboard/about`, { replace: true }),
            },
            {
              icon: <ShareIcon />,
              name: 'Share',
              onClick: () => navigator.share({ title: 'JUA', text: 'Join JUA today!', url: 'https://jua.one' }),
            },
          ]}
        />
      </Container>
    </Page>
  );
}
