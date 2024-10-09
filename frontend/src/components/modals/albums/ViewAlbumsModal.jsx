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

export default function ViewAlbumModal({ onClose, open, albumId }) {
  const [album, setAlbum] = useState({ title: '', genre: '', releaseDate: '', artistName: '', photo: '' });
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && albumId) {
      fetchAlbum(albumId);
    }
  }, [open, albumId]);

  const fetchAlbum = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/album/fetch/${id}`);
      if (response.data) {
        const artistResponse = await api.get(`/artist/fetch/${response.data.artistId}`);
        setAlbum({
          title: response.data.title || '',
          genre: response.data.genre || '',
          releaseDate: response.data.releaseDate || '',
          artistName: artistResponse.data.name || '',
          photo: response.data.photoUrl,
        });
        setCoverPreview(response.data.photoUrl || null);
      }
    } catch (error) {
      console.error('Error fetching album data:', error);
    } finally {
      setLoading(false);
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
            View Album
          </Typography>

          {loading ? ( 
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : ( 
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Title: </strong> {album.title}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Genre: </strong> {album.genre}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Release Date: </strong> {album.releaseDate}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Artist: </strong> {album.artistName}
              </Typography>

              {coverPreview ? (
                <Box mt={2} textAlign="center">
                  <img src={coverPreview} alt="Album Cover" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                </Box>
              ) : (
                <Typography variant="subtitle1" color="textSecondary">
                  No cover available
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
