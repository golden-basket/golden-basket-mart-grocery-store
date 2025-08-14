import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import ApiService from '../services/api';
import PropTypes from 'prop-types';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

const AddProductDialog = ({ open, onClose, onSuccess }) => {
  const { 
    isFoldable, 
    getFoldableClasses, 
    getResponsiveValue 
  } = useFoldableDisplay();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images
        ? form.images.split(',').map((img) => img.trim())
        : [],
    };
    ApiService.createProduct(productData)
      .then(() => {
        setForm({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          images: '',
        });
        onSuccess();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isFoldable ? "xs" : "sm"} 
      fullWidth
      className={getFoldableClasses()}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: getResponsiveValue(12, 16, 20, isFoldable ? 14 : undefined),
          margin: getResponsiveValue(16, 24, 32, isFoldable ? 20 : undefined),
        }
      }}
    >
      <DialogTitle
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          fontSize: getResponsiveValue('1.25rem', '1.5rem', '1.75rem', isFoldable ? '1.375rem' : undefined),
          textAlign: 'center',
          py: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
          transition: 'all 0.2s ease',
        }}
      >
        Add Product
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined) }}>
          {error && (
            <Alert severity="error" sx={{ 
              mb: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
              fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
            }}>
              {error}
            </Alert>
          )}
          <Box 
            display="flex" 
            flexDirection="column" 
            gap={getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined)}
          >
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
                '& .MuiInputBase-input': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                  minHeight: isFoldable ? '48px' : 'auto',
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={isFoldable ? 2 : 3}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
                '& .MuiInputBase-input': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
              }}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
                '& .MuiInputBase-input': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                  minHeight: isFoldable ? '48px' : 'auto',
                },
              }}
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
                '& .MuiInputBase-input': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                  minHeight: isFoldable ? '48px' : 'auto',
                },
              }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
                '& .MuiInputBase-input': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                  minHeight: isFoldable ? '48px' : 'auto',
                },
              }}
            />
            <TextField
              label="Images (comma-separated URLs)"
              name="images"
              value={form.images}
              onChange={handleChange}
              fullWidth
              multiline
              rows={isFoldable ? 2 : 3}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
                '& .MuiInputBase-input': {
                  fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
          pb: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
          gap: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
        }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            sx={{
              fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
              minHeight: isFoldable ? '48px' : 'auto',
              px: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: isFoldable ? 'scale(1.02)' : 'none',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              fontWeight: 600,
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              color: '#fff',
              textTransform: 'none',
              fontSize: getResponsiveValue('0.875rem', '1rem', '1.125rem', isFoldable ? '0.95rem' : undefined),
              minHeight: isFoldable ? '48px' : 'auto',
              px: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                color: '#000',
                transform: isFoldable ? 'scale(1.02)' : 'none',
                boxShadow: isFoldable ? '0 4px 12px rgba(163, 130, 76, 0.3)' : '0 4px 12px rgba(163, 130, 76, 0.3)',
              },
            }}
          >
            {loading ? <CircularProgress size={15} /> : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Props validation
AddProductDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddProductDialog;
