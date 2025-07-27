import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import ApiService from '../services/api';

const Cart = () => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = () => {
    setLoading(true);
    setError('');
    ApiService.getCart()
      .then((res) => {
        setCart(res.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to fetch cart: ${err.message}`);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!user || !token) return;
    fetchCart();
    // eslint-disable-next-line
  }, [user, token]);

  const increaseQuantity = (productId) => {
    const item = cart.find((item) => item.product._id === productId);
    if (!item) return;
    ApiService.updateCartItem(productId, item.quantity + 1)
      .then((res) => setCart(res.items || []))
      .catch((err) => setError(err.message || 'Failed to update cart.'));
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => item.product._id === productId);
    if (!item) return;
    if (item.quantity === 1) return removeFromCart(productId);
    ApiService.updateCartItem(productId, item.quantity - 1)
      .then((res) => setCart(res.items || []))
      .catch((err) => setError(err.message || 'Failed to update cart.'));
  };

  const removeFromCart = (productId) => {
    ApiService.removeFromCart(productId)
      .then((res) => setCart(res.items || []))
      .catch((err) => setError(err.message || 'Failed to remove from cart.'));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ mt: 1, px: { xs: 1, md: 5 }, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <ShoppingCartIcon sx={{ mr: 1, mb: -0.5 }} fontSize="large" />
        Cart
      </Typography>
      {loading && <Loading />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && (
        <Grid
          spacing={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid
            item
            xs={12}
            md={8}
            width={{ xs: '100%', md: '80%' }}
            sx={{ mb: 2 }}
          >
            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty.
                </Typography>
              </Box>
            ) : (
              <List>
                {cart.map((item, idx) => (
                  <Box key={item.name + idx}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: 2,
                        boxShadow: 1,
                        mb: 2,
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.product.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            ₹{item.product.price} / {item.product.unit}
                          </Typography>
                        }
                        sx={{ minWidth: 180 }}
                      />
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
                        px={2}
                        mx={2}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            item.quantity === 1
                              ? removeFromCart(item.product._id)
                              : decreaseQuantity(item.product._id)
                          }
                        >
                          <RemoveIcon color="secondary" />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{
                            px: 2,
                            minWidth: 32,
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: 18,
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => increaseQuantity(item.product._id)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                      <Typography
                        variant="body1"
                        px={2}
                        mx={2}
                        sx={{
                          mt: { xs: 1, sm: 0 },
                          fontWeight: 500,
                        }}
                      >
                        Subtotal: ₹{item.product.price * item.quantity}
                      </Typography>
                    </ListItem>
                    {idx < cart.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Grid>
          {cart.length > 0 && (
            <Grid
              item
              xs={12}
              md={4}
              width={{ xs: '100%', md: '80%' }}
              sx={{ mb: 2 }}
            >
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    Cart Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    {cart.map((item) => (
                      <Box
                        key={item.product._id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography>
                          {item.product.name} × {item.quantity}
                        </Typography>
                        <Typography>
                          ₹{item.product.price * item.quantity}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'end',
                      mt: 2,
                    }}
                  >
                    <Typography variant="h6">Total: ₹{total}</Typography>
                  </Box>
                  {/* <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Invoice Status:</Typography>
                    {invoiceError && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {invoiceError}
                      </Alert>
                    )}
                    {invoiceLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Typography variant="body2">
                        {invoiceError ? 'Failed to generate invoice' : 'Invoice generated successfully'}
                      </Typography>
                    )}
                  </Box> */}
                  <Button
                    variant="contained"
                    sx={{ mt: 3, width: '100%', textTransform: 'none' }}
                    onClick={() => navigate('/checkout')}
                    disabled={cart.length === 0}
                  >
                    Checkout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
      {/* <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Add More Products
        </Typography>
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.name}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography>
                    ₹{p.price} / {p.unit}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, textTransform: 'none', }}
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box> */}
    </Box>
  );
};

export default Cart;
