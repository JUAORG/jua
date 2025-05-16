import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { get, map, last } from 'lodash';
import { Box, Rating, Grid, Stack, TextField, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import StarIcon from '@mui/icons-material/Star';
import Page from '../components/Page';
import { submitServiceRequestFeedback } from '../actions/JuaNetwork';
import notificationManager from '../actions/NotificationManager';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(rating) {
  return `${rating} Star${rating !== 1 ? 's' : ''}, ${labels[rating]}`;
}

export default function AdvisorySessionFeedback() {
  const navigate = useNavigate();
  const formProps = useForm({});
  const [hover, setHover] = useState(-1);
  const [audioRating, setAudioRating] = useState(4);
  const [videoRating, setVideoRating] = useState(4);
  const [overallRating, setOverallRating] = useState(4);
  const [likelyToUseJuaAgainRating, setLikelyToUseJuaAgainRating] = useState(4);
  const [likelyToRecommendJuaToOthersRating, setLikelyToRecommendJuaToOthersRating] = useState(4);
  const serviceRequestRef = last(window.location.pathname.split('/'));

  const ratingTypes = [
    {
      name: 'audio_experience_quality',
      value: audioRating,
      setValue: setAudioRating,
      label: 'Rate the quality of your audio experience',
    },
    {
      name: 'video_experience_quality',
      value: videoRating,
      setValue: setVideoRating,
      label: 'Rate the quality of your video experience',
    },
    {
      name: 'repeat_user_likelihood',
      value: likelyToUseJuaAgainRating,
      setValue: setLikelyToUseJuaAgainRating,
      label: 'How likely are you to use JUA again?',
    },
    {
      name: 'recommendation_likelihood',
      value: likelyToRecommendJuaToOthersRating,
      setValue: setLikelyToRecommendJuaToOthersRating,
      label: 'How likely are you to recommend JUA to others?',
    },
    {
      name: 'service_request_value',
      value: overallRating,
      setValue: setOverallRating,
      label: 'Overall, how valuable was your advisory session?',
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const onSubmit = values => {
    values.service_request_ref = serviceRequestRef;
    values.service_request_value = overallRating;
    values.audio_experience_quality = audioRating;
    values.video_experience_quality = videoRating;
    values.repeat_user_likelihood = likelyToUseJuaAgainRating;
    values.recommendation_likelihood = likelyToRecommendJuaToOthersRating;

    submitServiceRequestFeedback(values)
      .then(() => {
        notificationManager.success('Thank you for your feedback', 'Success');
        navigate(`/dashboard/app`, { replace: true });
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Advisory Session Feedback
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <Stack spacing={3}>
              {map(ratingTypes, x => (
                <>
                  <Typography component="h5" variant="h5">
                    {x.label}
                  </Typography>
                  <Box
                    sx={{
                      width: 200,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Rating
                      name={x.name}
                      value={x.value}
                      precision={0.5}
                      getLabelText={getLabelText}
                      onChange={(event, newRating) => {
                        x.setValue(newRating);
                      }}
                      emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                    />
                    {x.value !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : x.value]}</Box>}
                  </Box>
                </>
              ))}
              <Typography component="h5" variant="h5">
                Any other feedback?
              </Typography>
              <TextField
                rows={4}
                fullWidth
                multiline
                label="Feedback"
                {...register('feedback')}
                placeholder="How was your Jua service request? (optional)"
              />
              <LoadingButton fullWidth size="large" type="submit" loading={false} variant="contained">
                Submit
              </LoadingButton>
            </Stack>
          </Grid>
        </form>
      </Container>
    </Page>
  );
}
