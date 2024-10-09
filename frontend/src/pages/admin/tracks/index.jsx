import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import { api } from '../../../axios/api';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateTrackModal from 'components/modals/tracks/CreateTracksModal';
import DeleteTrackModal from 'components/modals/tracks/DeleteTracksModal';
import EditTrackModal from 'components/modals/tracks/EditTracksModal';
import ViewTrackModal from 'components/modals/tracks/ViewTracksModal';
import ReactAudioPlayer from 'react-audio-player';
import { width } from '@mui/system';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

export default function TrackTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [updateTracks, setUpdateTracks] = useState(false);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState(null);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [trackToView, setTrackToView] = useState(null);

  const handleAddTrack = () => {
    setOpenCreateModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
  };

  const handleDelete = (track) => {
    setTrackToDelete(track.trackId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setTrackToDelete(null);
  };

  const handleEdit = (track) => {
    setTrackToEdit(track.trackId);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setTrackToEdit(null);
  };

  const handleView = (track) => {
    setTrackToView(track.trackId);
    setOpenViewModal(true);
  };
  
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setTrackToView(null);
  };

  useEffect(() => {
    api.get('/track/fetch').then((response) => {
      setRows(response.data.map((track) => ({
        title: track.title,
        artistId: track.artistId,
        albumId: track.albumId,
        duration: track.duration,
        releaseDate: track.releaseDate,
        trackLink: track.trackLink,
        trackId: track.trackId,
      })));
      console.log(response.data)

      setUpdateTracks(false);
    });
  }, [updateTracks]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(rows)
  return (
    <Box sx={{ p: 2 }}>
      <ViewTrackModal 
        open={openViewModal} 
        onClose={handleCloseViewModal} 
        trackId={trackToView}
      />
      <CreateTrackModal 
        open={openCreateModal} 
        onClose={handleCloseModal} 
        setUpdateTracks={setUpdateTracks}
      />
      <DeleteTrackModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        trackId={trackToDelete}
        setUpdateTracks={setUpdateTracks}
      />      
      <EditTrackModal 
        open={openEditModal} 
        onClose={handleCloseEditModal} 
        trackId={trackToEdit} 
        setUpdateTracks={setUpdateTracks} 
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc', borderLeft: '1px solid #ccc' }}>Title</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Artist ID</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Album ID</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Duration</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Release Date</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Track Link</TableCell>
              <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">{row.artistId}</TableCell>
                <TableCell align="left">{row.albumId}</TableCell>
                <TableCell align="left">{row.duration}</TableCell>
                <TableCell align="left">{row.releaseDate}</TableCell>
                <TableCell align="left" sx={{width: '300px'}}>
                <ReactAudioPlayer
                    src={row.trackLink}  
                    controls
                    onError={(e) => console.error('Error loading audio:', e)}
                    style={{
                      width: '100%',         
                      height: '50px',        
                      borderRadius: '8px',
                      backgroundColor: '#fafafa',
                      border: '1px solid #ccc',
                      padding: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleView(row)} aria-label="view" sx={{ color: '#2196f3' }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(row)} aria-label="edit" sx={{ color: '#ffca28' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row)} aria-label="delete" sx={{ color: '#f44336' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      
      <Tooltip title="Add Track" aria-label="add">
        <Fab color="primary" 
        onClick={handleAddTrack}
        sx={{
          float: 'right',
          m: 2,
          color: '#fff',
          backgroundColor: '#4caf50',
          '&:hover': { backgroundColor: '#1b5e20' },
        }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}
