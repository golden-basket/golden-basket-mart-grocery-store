import { Card, CardContent, CardActions, Typography, Button, Grid, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const ProductCard = ({ product, categories, theme, onEdit, onDelete }) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Typography variant='h6' sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
          {product.name}
        </Typography>
        <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
          {product.description}
        </Typography>
        <Grid container spacing={1} justifyContent='space-between' sx={{ mt: 1 }}>
          <Grid item>
            <Chip label={`₹${product.price}`} size='small' sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }} />
          </Grid>
          <Grid item>
            <Chip label={categories.find(cat => cat._id === product.category._id)?.name || 'N/A'} variant='outlined' size='small' />
          </Grid>
          <Grid item>
            <Chip label={`Stock: ${product.stock}`} size='small' sx={{
              backgroundColor: (() => {
                if (product.stock > 10) return theme.palette.success.main;
                if (product.stock > 0) return theme.palette.warning.main;
                return theme.palette.error.main;
              })(),
              color: theme.palette.common.white,
            }} />
          </Grid>
        </Grid>
      </Stack>
    </CardContent>
    <CardActions>
      <Button startIcon={<EditIcon />} onClick={() => onEdit(product)} sx={{ color: theme.palette.primary.main }}>
        Edit
      </Button>
      <Button startIcon={<DeleteIcon />} onClick={() => onDelete(product._id)} sx={{ color: theme.palette.error.main }}>
        Delete
      </Button>
    </CardActions>
  </Card>
);

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductCard;
