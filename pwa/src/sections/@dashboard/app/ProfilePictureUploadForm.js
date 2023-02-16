import React, { ChangeEvent, useState, useEffect } from 'react';
import { Box, Fab, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { uploadUserProfile } from '../../../actions/Profile';

export default function ProfilePictureUploader({ handleClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [file, setFile] = useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmitProfilePicture = () => {
      setLoading(true);
      uploadUserProfile(file)
        .then((res) => {
          setSuccess(true)
          setShowLoadingSpinner(true)
          window.location.reload()
        })
        .catch((err) => {
          console.debug(err);
        })
        .finally(() => setLoading(false));
    }

  return (
    <Dialog open onClose={handleClose} aria-labelledby="profile-picture-uploader">
      <DialogTitle>Upload Profile Picture</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Fab
                aria-label="save"
                color="primary"
                sx={buttonSx}
                //          onClick={onSubmitProfilePicture}
              >
                {success ? <CheckIcon /> : <SaveIcon />}
              </Fab>
              {loading && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Button
                
                sx={buttonSx}
                disabled={loading}
              >
                <input accept="image/*" type="file" onChange={handleFileChange} />
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Never mind</Button>
        {file && <Button onClick={onSubmitProfilePicture} autoFocus>
          Upload
        </Button>}
      </DialogActions>
    </Dialog>
  );
}
