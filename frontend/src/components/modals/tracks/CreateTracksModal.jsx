import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Snackbar, IconButton, CircularProgress, Autocomplete } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { api } from '../../../axios/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReactAudioPlayer from 'react-audio-player';
import InputMask from 'react-input-mask';
import { set } from 'lodash';

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

export default function CreateTrackModal({ onClose, open, setUpdateTracks }) {
  const [filePreview, setFilePreview] = useState(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [fetchLoading, setFetchLoading] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [artists, setArtists] = useState(null);
  const [artistId, setArtistId] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [albumId, setAlbumId] = useState(null);
  const [trackFile, setTrackFile] = useState(null);

  useEffect(() => {
    if (open) {
      fetchArtists();
      fetchAlbums();
    }
  }, [open]);

  console.log(artistId);


  const handleSave = async () => {
    let newErrors = {};
  
    if (!title) newErrors.title = 'Title is required';
    if (!artistId) newErrors.artistId = 'Artist is required';
    if (!albumId) newErrors.albumId = 'Album is required';
    if (!releaseDate) newErrors.releaseDate = 'Release Date is required'; 
    if (!duration) newErrors.duration = 'Duration is required'; 

    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return; 
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artistId', artistId);
    formData.append('albumId', albumId);
    formData.append('releaseDate', releaseDate);
    formData.append('duration', duration); 
    if (trackFile) {
      formData.append('file', trackFile); 
    }


    setLoading(true); 
    try {
      const response = await api.post('/track/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearFields();
      onClose(); 
      setSnackbarMessage('Track added successfully!');
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setErrors({});
      setUpdateTracks(true); 
      console.log(response);

    } catch (error) {
      console.log('Error adding track:', error);
      setSnackbarMessage('Failed to add track. Please try again.');
      setSnackbarOpen(true);
      setSnackbarSeverity('error');

      if (error.response && error.response.data) {
        setErrors(error.response.data); 
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    setFetchLoading(true);
    try {
      const response = await api.get('/artist/fetch'); 
      setArtists(response.data || []); 
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchAlbums = async () => {
    setFetchLoading(true);
    try {
      const response = await api.get('/album/fetch'); 
      setAlbums(response.data || []); 
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const clearFields = () => {
    setTitle('');
    setArtistId(''); 
    setDuration('');  
    setTrackFile(null); 
    setFilePreview(null);
    setReleaseDate('');  
    setAlbumId(null);
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('audio/')) {
      setTrackFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    } else {
      setErrors({ ...errors, file: 'Only audio files are allowed' });
      setTrackFile(null);
      setFilePreview(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDurationChange = (e) => {
      const value = e.target.value;
      setDuration(value);

      if (!value || value === "00:00:00") {
          setErrors((prevErrors) => ({ ...prevErrors, duration: undefined })); 
          return;
      }

      const isValidDuration = (duration) => {
          const timeParts = duration.split(':');
          if (timeParts.length !== 3) return false;

          const [hours, minutes, seconds] = timeParts.map(Number);
          if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return false;
          if (hours < 0 || minutes < 0 || seconds < 0 || minutes >= 60 || seconds >= 60) return false;

          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          return totalSeconds <= 86399; 
      };

      if (!isValidDuration(value)) {
          setErrors((prevErrors) => ({ ...prevErrors, duration: 'Duration cannot exceed 23h 59m 59s.' }));
      } else {
          setErrors((prevErrors) => ({ ...prevErrors, duration: undefined })); 
      }
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
            Create New Track
          </Typography>
          
          <TextField
            label="Track Title"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={Boolean(errors.title)}
            helperText={errors.title ? errors.title : ''}
          />

          <TextField
            label="Release Date"
            type="date"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            error={Boolean(errors.releaseDate)}
            helperText={errors.releaseDate ? errors.releaseDate : ''}
          />

          <InputMask
            mask="99:99:99"
            value={duration}
            onChange={handleDurationChange}
            placeholder="hh:mm:ss"
            sx={{ mt: 2 }}
          >
            {(inputProps) => (
                <TextField
                    {...inputProps}
                    label="Duration (hh:mm:ss)"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    error={Boolean(errors.duration)} 
                    helperText={errors.duration}
                />
            )}
          </InputMask>

          <Autocomplete
            sx={{ mt: 2 }}
            disablePortal
            options={artists || []}
            getOptionLabel={(option) => option.name || ''}
            loading={fetchLoading}
            isOptionEqualToValue={(option, value) => option.artistId === value.artistId} 
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

          <Autocomplete
            sx={{ mt: 2 }}
            disablePortal
            options={albums || []}
            getOptionLabel={(option) => option.title || ''}
            loading={fetchLoading}
            isOptionEqualToValue={(option, value) => option.albumId === value.albumId} 
            onChange={(event, newValue) => setAlbumId(newValue ? newValue.albumId : null)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Album"
                error={Boolean(errors.albumId)} 
                helperText={errors.albumId ? errors.albumId : ''} 
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
            Upload Audio
            <VisuallyHiddenInput
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </Button>
          <Box
            mt={2}
            textAlign="center"
            sx={{
              position: 'relative', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px',
              backgroundColor: filePreview ? '#f9f9f9' : '#e0e0e0',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: filePreview ? 'scale(1.02)' : 'none', 
              },
            }}
          >
            {filePreview ? (
              <>
                <IconButton
                  onClick={() => {
                    console.log("Closing file preview"); 
                    setFilePreview(null);
                    setTrackFile(null);
                  }}
                  sx={{
                    position: 'absolute',
                    right: '4px',
                    top: '3px',
                    color: '#ff0000', 
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
                
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Audio Preview</Typography>

                <ReactAudioPlayer
                  src={filePreview}
                  controls
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #ccc',
                    padding: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </>
            ) : (
              <Typography variant="subtitle1" sx={{ color: '#757575' }}>
                No audio file selected. Please upload an audio file.
              </Typography>
            )}
          </Box>

          {errors.file && (
            <Box mt={2} alignContent={'center'}> 
              <Typography color="error">{errors.file}</Typography>
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
