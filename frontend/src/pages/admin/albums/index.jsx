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
import noImage from '../../../assets/NoImage.png';
import CreateAlbumModal from 'components/modals/albums/CreateAlbumsModal';
import DeleteAlbumModal from 'components/modals/albums/DeleteAlbumsModal';
import EditAlbumModal from 'components/modals/albums/EditAlbumsModal';
import ViewAlbumModal from 'components/modals/albums/ViewAlbumsModal';

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
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [updateAlbums, setUpdateAlbums] = useState(false);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState(null);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [albumToView, setAlbumToView] = useState(null);

  const handleAddAlbum = () => {
    setOpenCreateModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
  };
  
  const handleDelete = (album) => {
    setAlbumToDelete(album.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setAlbumToDelete(null);
  };

  const handleEdit = (album) => {
    setAlbumToEdit(album.id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setAlbumToEdit(null);
  };

  const handleView = (album) => {
    setAlbumToView(album.id);
    setOpenViewModal(true);
  };
  
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setAlbumToView(null);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumsResponse = await api.get('/album/fetch');
  
        const updatedRows = await Promise.all(albumsResponse.data.map(async (album) => {
          const artistResponse = await api.get(`/artist/fetch/${album.artistId}`);
          const artist = artistResponse.data;
  
          const formattedReleaseDate = `${String(album.releaseDate[2]).padStart(2, '0')}/${String(album.releaseDate[1]).padStart(2, '0')}/${album.releaseDate[0]}`;
  
          return {
            photo: album.photoUrl,
            title: album.title,
            genre: album.genre,
            releaseDate: formattedReleaseDate,
            id: album.albumId,
            artist: artist
          };
        }));
  
        setRows(updatedRows);
        setUpdateAlbums(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchAlbums();
  }, [updateAlbums]);
  
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
      <ViewAlbumModal 
        open={openViewModal} 
        onClose={handleCloseViewModal} 
        albumId={albumToView}
      />
      <CreateAlbumModal 
        open={openCreateModal} 
        onClose={handleCloseModal} 
        setUpdateAlbums={setUpdateAlbums}
      />
      <DeleteAlbumModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        albumId={albumToDelete}
        setUpdateAlbums={setUpdateAlbums}
      />      
      <EditAlbumModal 
        open={openEditModal} 
        onClose={handleCloseEditModal} 
        albumId={albumToEdit} 
        setUpdateAlbums={setUpdateAlbums} 
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc', borderLeft: '1px solid #ccc' }}>Photo</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Title</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Genre</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Artist Photo</TableCell>
              <TableCell align="left" sx={{ borderRight: '1px solid #ccc' }}>Artist Name</TableCell>
              <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>Release Date</TableCell>
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
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">{row.genre}</TableCell>
                <TableCell align="left">
                  {row.artist.photoUrl ? (
                      <img src={row.artist.photoUrl} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} alt={row.artist.name} />
                  ) : <img src={noImage} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
}
                </TableCell>
                <TableCell align='left'>{row.artist.name}</TableCell>
                <TableCell align="center">{row.releaseDate}</TableCell>
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
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
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
      <Tooltip title="Add Album">
        <Fab 
            color="primary" 
            aria-label="add" 
            onClick={handleAddAlbum} 
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
