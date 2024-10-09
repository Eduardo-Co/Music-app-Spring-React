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

export default function EditArtistModal({ onClose, open, artistId, setUpdateArtists }) {
  const [artist, setArtist] = useState({ name: '', genre: '', photoUrl: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [artistPhoto, setArtistPhoto] = useState(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (open) {
      fetchArtist(artistId);
    }
  }, [open]);

  const fetchArtist = async (id) => {
    setLoading(true); 
    try {
      const response = await api.get(`/artist/fetch/${id}`);
      if (response.data) {
        setArtist({
          name: response.data.name || '',
          genre: response.data.genre || '',
          photoUrl: response.data.photoUrl || '',
        });
        setPhotoPreview(response.data.photoUrl || null);
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtist(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setArtistPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result); 
      };
      reader.readAsDataURL(file);
    } else {
      setErrors({ ...errors, photo: 'Apenas arquivos de imagem são permitidos' });
      setArtistPhoto(null);
      setPhotoPreview(null);
    }
  };

  const handleEdit = async () => {
    setLoading(true); 
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('genre', artist.genre);
    formData.append('photoUrl', artist.photoUrl);
    if (artistPhoto) { 
      formData.append('file', artistPhoto); 
    }

    try {
      await api.post(`/artist/edit/${artistId}`, formData); 
      setSnackbarMessage('Artist updated successfully!');
      setSnackbarSeverity('success');
      setUpdateArtists(true);
      onClose();
    } catch (error) {
      console.error('Error updating artist:', error);
      setSnackbarMessage('Failed to update artist. Please try again.');
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
            Edit Artist
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TextField
                label="Name"
                name="name"
                value={artist.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.name)}
                helperText={errors.name ? errors.name : ''}
              />
              <TextField
                label="Genre"
                name="genre"
                value={artist.genre}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.genre)}
                helperText={errors.genre ? errors.genre : ''}
              />

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mt: 2, backgroundColor: '#009688', ":hover": { backgroundColor: '#004d40' } }}
              >
                Upload Photo
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              {photoPreview && (
                <Box mt={2} textAlign="center">
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                </Box>
              )}
              {errors.photo && (
                <Box mt={2} alignContent={'center'}>
                  <Typography color="error">{errors.photo}</Typography>
                </Box>
              )}

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
