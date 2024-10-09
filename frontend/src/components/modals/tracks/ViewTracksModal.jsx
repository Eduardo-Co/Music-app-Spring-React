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

export default function ViewTrackModal({ onClose, open, trackId }) {
  const [track, setTrack] = useState({ title: '', artistId: '', albumId: '', duration: '', releaseDate: '', trackLink: '' });
  const [loading, setLoading] = useState(false); // Estado de loading

  useEffect(() => {
    if (open && trackId) {
      fetchTrack(trackId);
    }
  }, [open, trackId]);

  const fetchTrack = async (id) => {
    setLoading(true); // Iniciar o loading
    try {
      const response = await api.get(`/track/fetch/${id}`);
      if (response.data) {
        setTrack({
          title: response.data.title || '',
          artistId: response.data.artistId || '',
          albumId: response.data.albumId || '',
          duration: response.data.duration || '',
          releaseDate: response.data.releaseDate || '',
          trackLink: response.data.trackLink || '',
        });
      }
    } catch (error) {
      console.error('Error fetching track data:', error);
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
            View Track
          </Typography>

          {loading ? ( 
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : ( 
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Title: </strong> {track.title}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Artist ID: </strong> {track.artistId}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Album ID: </strong> {track.albumId}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Duration: </strong> {track.duration}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Release Date: </strong> {track.releaseDate}
              </Typography>

              {track.trackLink ? (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Track Link: </strong> <a href={track.trackLink} target="_blank" rel="noopener noreferrer">Listen</a>
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="textSecondary">
                  No link available
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
