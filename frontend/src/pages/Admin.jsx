import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../components/Loading';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get('http://localhost:3000/api/products')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images
        ? form.images.split(',').map((img) => img.trim())
        : [],
    };

    axios
      .post('http://localhost:3000/api/products', productData)
      .then(() => {
        setSuccess('Product created successfully!');
        setForm({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          images: [],
        });
        fetchProducts();
      })
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to create product.')
      );
  };

  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:3000/api/products/${id}`)
      .then(() => {
        setSuccess('Product deleted successfully!');
        fetchProducts();
      })
      .catch(() => setError('Failed to delete product.'));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}
      >
        Manage Products
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ minWidth: 300 }}
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            sx={{ minWidth: 120 }}
          />
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            sx={{ minWidth: 120 }}
          />
        </Box>
        <TextField
          label="Images (comma-separated URLs)"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{
            fontWeight: 600,
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
              color: '#000',
            },
          }}
        >
          Save Product
        </Button>
      </Box>

      {loading ? (
        <Loading />
      ) : (
        <List>
          {products.map((product) => (
            <ListItem
              key={product._id}
              sx={{ border: '1px solid #ddd', mb: 1, borderRadius: 1 }}
            >
              <ListItemText
                primary={product.name}
                secondary={`₹${product.price} | Stock: ${product.stock} | Category: ${product.category}`}
              />
              <IconButton
                onClick={() => deleteProduct(product._id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
