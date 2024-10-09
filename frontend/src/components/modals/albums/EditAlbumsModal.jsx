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

export default function EditAlbumModal({ onClose, open, albumId, setUpdateAlbums }) {
  const [album, setAlbum] = useState({ title: '', genre: '', releaseDate: '', artistId: null, coverUrl: '' });
  const [coverPreview, setCoverPreview] = useState(null);
  const [albumCover, setAlbumCover] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAlbum(albumId);
      fetchArtists();
    }
  }, [open, albumId]);

  const fetchAlbum = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/album/fetch/${id}`);
      if (response.data) {
        const formattedDate = new Date(response.data.releaseDate).toISOString().split('T')[0];
        const artistResponse = await api.get(`/artist/fetch/${response.data.artistId}`);
        setAlbum({ ...response.data, releaseDate: formattedDate, artistId: artistResponse.data.artistId });
        setCoverPreview(response.data.coverUrl);
      }
    } catch (error) {
      console.error('Error fetching album data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbum((prevState) => ({ ...prevState, [name]: value }));
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

  const handleEdit = async () => {
    let validationErrors = {};

    if (!album.title) {
      validationErrors.title = 'Title is required';
    }
    if (!album.genre) {
      validationErrors.genre = 'Genre is required';
    }
    if (!album.releaseDate) {
      validationErrors.releaseDate = 'Release Date is required';
    }
    if (!album.artistId) {
      validationErrors.artistId = 'Artist is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', album.title);
    formData.append('genre', album.genre);
    formData.append('releaseDate', album.releaseDate);
    formData.append('artistId', album.artistId);
    if (albumCover) {
      formData.append('file', albumCover);
    }

    try {
      await api.post(`/album/edit/${albumId}`, formData);
      setSnackbarMessage('Album updated successfully!');
      setSnackbarSeverity('success');
      setUpdateAlbums(true);
      onClose();
    } catch (error) {
      console.error('Error updating album:', error);
      setSnackbarMessage('Failed to update album. Please try again.');
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

          <Typography id="modal-modal-title" variant="h5" component="h2">
            Edit Album
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
                value={album.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.title)}
                helperText={errors.title ? errors.title : ''}
              />
              <TextField
                label="Genre"
                name="genre"
                value={album.genre}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.genre)}
                helperText={errors.genre ? errors.genre : ''}
              />
              <TextField
                label="Release Date"
                type="date"
                name="releaseDate"
                InputLabelProps={{ shrink: true }}
                value={album.releaseDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.releaseDate)}
                helperText={errors.releaseDate ? errors.releaseDate : ''}
              />

              <Autocomplete
                disablePortal
                value={album.artistId ? artistOptions.find((artist) => artist.artistId === album.artistId) : null}
                options={artistOptions}
                getOptionLabel={(option) => option.name || ''}
                loading={fetchLoading}
                onChange={(event, newValue) =>
                  setAlbum((prev) => ({ ...prev, artistId: newValue ? newValue.artistId : null }))
                }
                sx={{ mt: 2 }}
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
                sx={{ mt: 2, backgroundColor: '#009688', ':hover': { backgroundColor: '#004d40' } }}
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
                onClick={handleEdit}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
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
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          icon={snackbarSeverity === 'success' ? <CheckCircleIcon sx={{ color: 'white' }} /> : <ErrorIcon sx={{ color: 'white' }} />}
          sx={{
            width: '100%',
            backgroundColor: snackbarSeverity === 'success' ? '#81c784' : '#f44336',
            color: '#fff',
            fontSize: '1rem',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
