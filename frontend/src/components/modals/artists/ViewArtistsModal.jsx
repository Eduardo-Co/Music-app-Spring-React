import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton'; 
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';
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

export default function ViewArtistModal({ onClose, open, artistId }) {
  const [artist, setArtist] = useState({ name: '', genre: '', photoUrl: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de loading

  useEffect(() => {
    if (open && artistId) {
      fetchArtist(artistId);
    }
  }, [open, artistId]);

  const fetchArtist = async (id) => {
    setLoading(true); // Iniciar o loading
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
      setLoading(false); // Parar o loading
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

          <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
            View Artist
          </Typography>

          {loading ? ( 
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : ( 
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Name: </strong> {artist.name}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Genre: </strong> {artist.genre}
              </Typography>

              {photoPreview ? (
                <Box mt={2} textAlign="center">
                  <img src={photoPreview} alt="Artist Photo" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                </Box>
              ) : (
                <Typography variant="subtitle1" color="textSecondary">
                  No photo available
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
