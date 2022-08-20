import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Grid, Stack, Container, Typography, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import StarIcon from '@mui/icons-material/Star'
import Page from '../components/Page'
import { submitServiceRequestFeedback } from '../actions/JuaNetwork'

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
}

function getLabelText(rating) {
  return `${rating} Star${rating !== 1 ? 's' : ''}, ${labels[rating]}`
}

export default function AdvisorySessionFeedback() {
  const navigate = useNavigate()
  const formProps = useForm({})
  const [hover, setHover] = useState(-1)
  const [rating, setRating] = useState(4)
  const serviceRequestId = window.location.search.slice(6)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formProps

  const onSubmit = async (values) => {
    values.rating = rating
    values.id = serviceRequestId

    await submitServiceRequestFeedback(values)
      .then((res) => {
        alert('Feedback submitted thank you')
        navigate(`/dashboard/app`, { replace: true })
      })
      .catch((error) => {
        alert('Error')
      })
  }

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Advisory Session Feedback
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <Stack spacing={3}>
              <Box
                sx={{
                  width: 200,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Rating
                  name="rating"
                  value={rating}
                  precision={0.5}
                  getLabelText={getLabelText}
                  onChange={(event, newRating) => {
                    setRating(newRating)
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover)
                  }}
                  emptyIcon={
                    <StarIcon
                      fontSize="inherit"
                      style={{ opacity: 0.55 }}
                    />
                  }
                />
                {
                  rating !== null &&
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : rating]}
                    </Box>
                }
              </Box>
              <TextField
                rows={4}
                fullWidth
                multiline
                label="Feedback"
                {...register('feedback')}
                placeholder="How was your Jua service request? (optional)"
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                loading={false}
                variant="contained"
              >
                Submit
              </LoadingButton>
            </Stack>
          </Grid>
        </form>
      </Container>
    </Page>
  )
}
