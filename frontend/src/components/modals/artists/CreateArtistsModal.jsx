import React, { useState } from 'react';
import Box from '@mui/material/Box'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Snackbar, IconButton, CircularProgress } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { api } from '../../../axios/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

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

export default function CreateArtistModal({ onClose, open, setUpdateArtists }) {
  const [artistName, setArtistName] = useState('');
  const [artistGenre, setArtistGenre] = useState('');
  const [artistPhoto, setArtistPhoto] = useState(null); 
  const [photoPreview, setPhotoPreview] = useState(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Estado de loading

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', artistName);
    formData.append('genre', artistGenre);
    if (artistPhoto) {
      formData.append('file', artistPhoto); 
    }

    setLoading(true); // Ativar loading

    try {
      const response = await api.post('/artist/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearFields();
      onClose(); 
      setSnackbarMessage('Artist added successfully!');
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setErrors({});
      setUpdateArtists(true); 
      console.log(response);

    } catch (error) {
      console.log('Error adding artist:', error);
      setSnackbarMessage('Failed to add artist. Please try again.');
      setSnackbarOpen(true);
      setSnackbarSeverity('error');

      if (error.response && error.response.data) {
        setErrors(error.response.data); 
      }
    } finally {
      setLoading(false); // Desativar loading
    }
  };

  const clearFields = () => {
    setArtistName('');
    setArtistGenre('');
    setArtistPhoto(null);
    setPhotoPreview(null);
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
      setErrors({ ...errors, photo: 'Only image files are allowed' });
      setArtistPhoto(null);
      setPhotoPreview(null);
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

          <Typography id="modal-modal-title" variant="h4" component="h2">
            Create New Artist
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            sx={{ mt: 2 }}
            error={Boolean(errors.name)} 
            helperText={errors.name ? errors.name : ''}
          />

          <TextField
            label="Genre"
            variant="outlined"
            fullWidth
            value={artistGenre}
            onChange={(e) => setArtistGenre(e.target.value)}
            sx={{ mt: 2 }}
            error={Boolean(errors.genre)}
            helperText={errors.genre ? errors.genre : ''}
          />

          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mt: 2., backgroundColor: '#009688', ":hover": { backgroundColor: '#004d40' } }}
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
            onClick={handleSave} 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            disabled={loading} 
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
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
