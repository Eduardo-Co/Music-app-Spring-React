import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete, Alert, Snackbar, IconButton, CircularProgress } from '@mui/material'; 
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

export default function CreateAlbumModal({ onClose, open, setUpdateAlbums }) {
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumGenre, setAlbumGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [albumCover, setAlbumCover] = useState(null); 
  const [coverPreview, setCoverPreview] = useState(null); 
  const [artistId, setArtistId] = useState(null); 
  const [artistOptions, setArtistOptions] = useState([]); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);


  useEffect(() => {
    if (open) {
      fetchArtists();
    }
  }, [open]);

  const fetchArtists = async () => {
    setFetchLoading(true);
    try {
      const response = await api.get('/artist/fetch'); 
      setArtistOptions(response.data || []); 
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    let newErrors = {};
  
    if (!albumTitle) newErrors.title = 'Title is required';
    if (!albumGenre) newErrors.genre = 'Genre is required';
    if (!releaseDate) newErrors.releaseDate = 'Release Date is required';
    if (!artistId) newErrors.artistId = 'Artist is required'; 
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return; 
    }
  
    const formData = new FormData();
    formData.append('title', albumTitle);
    formData.append('genre', albumGenre);
    formData.append('releaseDate', releaseDate);
    formData.append('artistId', artistId);
    if (albumCover) {
      formData.append('file', albumCover); 
    }
  
    setLoading(true);
  
    try {
      const response = await api.post('/album/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearFields();
      onClose(); 
      setSnackbarMessage('Album added successfully!');
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setErrors({});
      setUpdateAlbums(true); 
      console.log(response);
    } catch (error) {
      console.log('Error adding album:', error);
      setSnackbarMessage('Failed to add album. Please try again.');
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      if (error.response && error.response.data) {
        setErrors(error.response.data); 
      }
    } finally {
      setLoading(false);
    }
  };
  const clearFields = () => {
    setAlbumTitle('');
    setAlbumGenre('');
    setReleaseDate('');
    setAlbumCover(null);
    setCoverPreview(null);
    setArtistId(null); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAlbumCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); 
      };
      reader.readAsDataURL(file);
    } else {
      setErrors({ ...errors, cover: 'Only image files are allowed' });
      setAlbumCover(null);
      setCoverPreview(null);
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
            Create New Album
          </Typography>

          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            sx={{ mt: 2 }}
            error={Boolean(errors.title)} 
            helperText={errors.title ? errors.title : ''}
          />

          <TextField
            label="Genre"
            variant="outlined"
            fullWidth
            value={albumGenre}
            onChange={(e) => setAlbumGenre(e.target.value)}
            sx={{ mt: 2 }}
            error={Boolean(errors.genre)}
            helperText={errors.genre ? errors.genre : ''}
          />

          <TextField
            label="Release Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            sx={{ mt: 2 }}
            error={Boolean(errors.releaseDate)}
            helperText={errors.releaseDate ? errors.releaseDate : ''}
          />

          <Autocomplete
            disablePortal
            options={artistOptions}
            getOptionLabel={(option) => option.name || ''}
            loading={fetchLoading}
            sx={{ mt: 2 }}
            onChange={(event, newValue) => setArtistId(newValue ? newValue.artistId : null)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Artist"
                error={Boolean(errors.artistId)} 
                helperText={errors.artistId ? errors.artistId : ''} 
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {fetchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mt: 2., backgroundColor: '#009688', ":hover": { backgroundColor: '#004d40' } }}
          >
            Upload Cover
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {coverPreview && (
            <Box mt={2} textAlign="center">
              <img src={coverPreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
            </Box>
          )}

          {errors.cover && (
            <Box mt={2} alignContent={'center'}> 
              <Typography color="error">{errors.cover}</Typography>
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
