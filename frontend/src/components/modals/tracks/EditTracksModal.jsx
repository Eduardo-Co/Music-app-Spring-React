import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box'; 
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Alert, Snackbar, IconButton, CircularProgress } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { api } from '../../../axios/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditTrackModal({ onClose, open, trackId, setUpdateTracks }) {
  const [track, setTrack] = useState({ title: '', artistId: '', duration: '', releaseDate: '', trackLink: '' });
  const [trackPreview, setTrackPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (open) {
      fetchTrack(trackId);
    }
  }, [open]);

  const fetchTrack = async (id) => {
    setLoading(true); 
    try {
      const response = await api.get(`/track/fetch/${id}`);
      if (response.data) {
        setTrack({
          title: response.data.title || '',
          artistId: response.data.artistId || '',
          duration: response.data.duration || '',
          releaseDate: response.data.releaseDate || '',
          trackLink: response.data.trackLink || '',
        });
      }
    } catch (error) {
      console.error('Error fetching track data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrack(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEdit = async () => {
    setLoading(true); 
    const formData = new FormData();
    formData.append('title', track.title);
    formData.append('artistId', track.artistId);
    formData.append('duration', track.duration);
    formData.append('releaseDate', track.releaseDate);
    formData.append('trackLink', track.trackLink);

    try {
      await api.post(`/track/edit/${trackId}`, formData); 
      setSnackbarMessage('Track updated successfully!');
      setSnackbarSeverity('success');
      setUpdateTracks(true);
      onClose();
    } catch (error) {
      console.error('Error updating track:', error);
      setSnackbarMessage('Failed to update track. Please try again.');
      setSnackbarSeverity('error');
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    } finally {
      setSnackbarOpen(true);
      setLoading(false); 
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
            Edit Track
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TextField
                label="Title"
                name="title"
                value={track.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.title)}
                helperText={errors.title ? errors.title : ''}
              />
              <TextField
                label="Artist ID"
                name="artistId"
                value={track.artistId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.artistId)}
                helperText={errors.artistId ? errors.artistId : ''}
              />
              <TextField
                label="Duration"
                name="duration"
                value={track.duration}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.duration)}
                helperText={errors.duration ? errors.duration : ''}
              />
              <TextField
                label="Release Date"
                name="releaseDate"
                value={track.releaseDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.releaseDate)}
                helperText={errors.releaseDate ? errors.releaseDate : ''}
              />
              <TextField
                label="Track Link"
                name="trackLink"
                value={track.trackLink}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.trackLink)}
                helperText={errors.trackLink ? errors.trackLink : ''}
              />

              <Button
                onClick={handleEdit}
                variant="contained"
                color="primary"
                sx={{ mt: 3, mr: 2 }}
                disabled={loading} 
              >
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ width: '20%' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          icon={snackbarSeverity === 'success' 
                  ? <CheckCircleIcon sx={{ color: 'white' }} /> 
                  : <ErrorIcon sx={{ color: 'white' }} />} 
          sx={{ 
            width: '100%', 
            backgroundColor: snackbarSeverity === 'success' ? '#81c784' : '#f44336', 
            color: '#fff', 
            fontSize: '1rem' 
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
