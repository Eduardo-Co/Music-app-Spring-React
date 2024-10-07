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
import CreateArtistModal from 'components/modals/artists/CreateArtistsModal';
import noImage from '../../../assets/NoImage.png';
import DeleteArtistModal from 'components/modals/artists/DeleteArtistsModal';
import EditArtistModal from 'components/modals/artists/EditArtistsModal';
import ViewArtistModal from 'components/modals/artists/ViewArtistsModal';

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

export default function Index() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [updateArtists, setUpdateArtists] = useState(false);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState(null);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [artistToView, setArtistToView] = useState(null);

  const handleAddArtist = () => {
    setOpenCreateModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
  };
  const handleDelete = (artist) => {
    setArtistToDelete(artist.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setArtistToDelete(null);
  };

    const handleEdit = (artist) => {
    setArtistToEdit(artist.id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setArtistToEdit(null);
  };

  const handleView = (artist) => {
    setArtistToView(artist.id);
    setOpenViewModal(true);
  };
  
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setArtistToView(null);
  };

  useEffect(() => {
    api.get('/artist/fetch').then((response) => {
      setRows(response.data.map((artist) => ({
        
        photo: artist.photoUrl,
        name: artist.name,
        genre: artist.genre, 
        id: artist.artistId,
      })));

      setUpdateArtists(false);
    });
  }, [updateArtists]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 2 }}>
      <ViewArtistModal 
        open={openViewModal} 
        onClose={handleCloseViewModal} 
        artistId={artistToView}
      />
        <CreateArtistModal 
        open={openCreateModal} 
        onClose={handleCloseModal} 
        setUpdateArtists={setUpdateArtists}
      />
      <DeleteArtistModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        artistId={artistToDelete}
        setUpdateArtists={setUpdateArtists}
      />      
      <EditArtistModal 
        open={openEditModal} 
        onClose={handleCloseEditModal} 
        artistId={artistToEdit} 
        setUpdateArtists={setUpdateArtists} 
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc', borderLeft: '1px solid #ccc' }}>Photo</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Name</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Genre</TableCell>
              <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">
                  {row.photo 
                  ? <img src={row.photo} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                  : <img src={noImage} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                  }
                </TableCell>                
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.genre}</TableCell>
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
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={4}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Tooltip title="Create new artist" arrow>
        <Fab
          color="secondary"
          aria-label="add"
          sx={{
            float: 'right',
            m: 2,
            color: '#fff',
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#1b5e20' },
          }}
          onClick={handleAddArtist}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}