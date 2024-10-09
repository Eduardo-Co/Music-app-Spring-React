import React, { useState } from 'react';
import Box from '@mui/material/Box'; 
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Snackbar, IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { api } from '../../../axios/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteTrackModal({ onClose, open, trackId, setUpdateTracks }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); 

  const handleDelete = async () => {
    try {
      await api.post(`/track/delete/${trackId}`);
      setErrorMessage('');
      setSnackbarMessage('Track deleted successfully!');
      setSnackbarSeverity('success');
      setUpdateTracks(true); 
      onClose();
    } catch (error) {
      const { errorMessage} = error.response.data; 
      if (errorMessage === "FOREIGN_KEY_VIOLATION") {
        setErrorMessage("It is not possible to delete the entity because there are dependent records.");
        setSnackbarMessage(''); 
      } else {
        setSnackbarMessage('Failed to delete artist. Please try again.');
        setSnackbarSeverity('error');
        setErrorMessage(''); 
        setSnackbarOpen(true);
      }
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
            Confirm Deletion
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this track? This action cannot be undone.
          </Typography>

          {errorMessage && (
            <Alert 
              severity="error" 
              sx={{ mt: 2 }} 
              icon={<ErrorIcon sx={{ color: 'white' }} />} 
              style={{ backgroundColor: '#f44336', color: '#fff' }} 
            >
              {errorMessage}
            </Alert>
          )}

          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ mt: 3, mr: 2 }}
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ mt: 3 }}
          >
            Cancel
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
