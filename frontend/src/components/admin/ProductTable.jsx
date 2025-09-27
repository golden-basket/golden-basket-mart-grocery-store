import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const ProductTable = ({ products, categories, theme, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {['Name', 'Description', 'Price', 'Category', 'Stock', 'Images', 'Actions'].map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(prod => (
          <TableRow key={prod._id}>
            <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              {prod.name}
            </TableCell>
            <TableCell sx={{ color: theme.palette.text.secondary, maxWidth: 200 }}>
              {prod.description.length > 50 ? `${prod.description.substring(0, 50)}...` : prod.description}
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              ₹{prod.price}
            </TableCell>
            <TableCell sx={{ color: theme.palette.text.secondary }}>
              {categories.find(cat => cat._id === prod.category._id)?.name || 'N/A'}
            </TableCell>
            <TableCell>
              <Chip
                label={prod.stock}
                size='small'
                sx={{
                  backgroundColor: (() => {
                    if (prod.stock > 10) return theme.palette.success.main;
                    if (prod.stock > 0) return theme.palette.warning.main;
                    return theme.palette.error.main;
                  })(),
                  color: theme.palette.common.white,
                  fontWeight: 600,
                }}
              />
            </TableCell>
            <TableCell sx={{ color: theme.palette.text.secondary }}>
              <Chip label={`${prod.images?.length || 0} images`} size='small' variant='outlined' />
            </TableCell>
            <TableCell>
              <Stack direction='row' spacing={1}>
                <IconButton onClick={() => onEdit(prod)} sx={{ color: theme.palette.primary.main }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(prod._id)} sx={{ color: theme.palette.error.main }}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductTable;
