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
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import ApiService from '../services/api';
import JumpingCartAvatar from './JumpingCartAvatar';

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
        if (res && Array.isArray(res.items)) {
          setCart(res.items);
        } else {
          setCart([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to fetch cart: ${err.message}`);
        setCart([]);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!user || !token) return;
    fetchCart();
  }, [user, token]);

  const increaseQuantity = (productId) => {
    const item = cart.find((item) => item.product._id === productId);
    if (!item) return;
    ApiService.updateCartItem(productId, item.quantity + 1)
      .then(() => {
        fetchCart();
      })
      .catch((err) => setError(err.message || 'Failed to update cart.'));
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => item.product._id === productId);
    if (!item) return;
    if (item.quantity === 1) return removeFromCart(productId);
    ApiService.updateCartItem(productId, item.quantity - 1)
      .then(() => {
        fetchCart();
      })
      .catch((err) => setError(err.message || 'Failed to update cart.'));
  };

  const removeFromCart = (productId) => {
    ApiService.removeFromCart(productId)
      .then(() => {
        fetchCart();
      })
      .catch((err) => setError(err.message || 'Failed to remove from cart.'));
  };

  const total = cart
    .filter((item) => item && item.product && item.product.price)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Box sx={{ mt: 1, px: { xs: 2, md: 5 }, pb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          mb: 4,
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 8px rgba(163,130,76,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <JumpingCartAvatar />
        <Box
          sx={{ mt: 1, fontWeight: 700, fontSize: '1.3rem', letterSpacing: 1 }}
        >
          Manage Your Cart
        </Box>
      </Typography>
      {loading && <Loading />}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && (
        <Grid
          container
          spacing={3}
          alignItems="flex-start"
          justifyContent="center"
        >
          <Grid item xs={12} md={8} sx={{ mb: 2 }}>
            {cart.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 8,
                  px: 2,
                  py: 4,
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
                  maxWidth: 400,
                  mx: 'auto',
                  border: '1px solid #e6d897',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mb: 2,
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingCartIcon
                    sx={{
                      fontSize: 36,
                      color: '#fffbe6',
                      textShadow: '0 2px 8px rgba(163,130,76,0.18)',
                    }}
                  />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#a3824c',
                    fontWeight: 700,
                    mb: 1,
                    letterSpacing: 1,
                  }}
                >
                  Your cart is empty
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#866422',
                    maxWidth: 320,
                    mx: 'auto',
                    fontWeight: 500,
                  }}
                >
                  Looks like you haven&apos;t added any products yet.
                  <br />
                  Browse our catalogue and start shopping!
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    background:
                      'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                    color: '#fff',
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                      color: '#866422',
                      boxShadow: '0 4px 16px rgba(163,130,76,0.18)',
                    },
                  }}
                  onClick={() => navigate('/')}
                >
                  Browse Products
                </Button>
              </Box>
            ) : (
              <List>
                {cart
                  .filter((item) => item && item.product && item.product._id)
                  .map((item) => (
                    <ListItem
                      key={item.product._id}
                      alignItems="flex-start"
                      sx={{
                        bgcolor:
                          'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                        borderRadius: 3,
                        boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
                        mb: 1,
                        px: 2,
                        py: 1,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        border: '1px solid #e6d897',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label="delete"
                          color="error"
                          onClick={() => removeFromCart(item.product._id)}
                          sx={{
                            bgcolor: '#fffbe6',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#e6d897' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#a3824c',
                              mb: 0.5,
                            }}
                          >
                            {item.product.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#7d6033',
                              fontWeight: 500,
                            }}
                          >
                            ₹{item.product.price} /{' '}
                            {item.product.unit || 'unit'}
                          </Typography>
                        }
                        sx={{ minWidth: 180 }}
                      />
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          ml: { xs: 0, sm: 2 },
                          mt: { xs: 1, sm: 0 },
                          bgcolor: '#fffbe6',
                          borderRadius: 2,
                          px: 2,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: '#a3824c',
                            bgcolor: '#f7e7c1',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#e6d897' },
                          }}
                          onClick={() =>
                            item.quantity === 1
                              ? removeFromCart(item.product._id)
                              : decreaseQuantity(item.product._id)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{
                            px: 2,
                            minWidth: 32,
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: 18,
                            color: '#a3824c',
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#a3824c',
                            bgcolor: '#f7e7c1',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#e6d897' },
                          }}
                          onClick={() => increaseQuantity(item.product._id)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                      <Typography
                        variant="body1"
                        sx={{
                          mt: { xs: 1, sm: 0 },
                          fontWeight: 600,
                          color: '#a3824c',
                          px: 2,
                          mr: 4,
                        }}
                      >
                        Subtotal: ₹{item.product.price * item.quantity}
                      </Typography>
                    </ListItem>
                  ))}
              </List>
            )}
          </Grid>
          {cart.length > 0 && (
            <Grid item xs={12} md={4} sx={{ mb: 2 }}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  border: '1px solid #e6d897',
                  width: { xs: '100%', sm: 400, md: 450 },
                  mx: 'auto',
                  minHeight: 350,
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 24px 0 rgba(163,130,76,0.18)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    align="center"
                    sx={{
                      color: '#a3824c',
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Cart Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    {cart
                      .filter(
                        (item) => item && item.product && item.product._id
                      )
                      .map((item) => (
                        <Box
                          key={item.product._id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{ color: '#a3824c', fontWeight: 600 }}
                          >
                            {item.product.name} × {item.quantity}
                          </Typography>
                          <Typography
                            sx={{ color: '#7d6033', fontWeight: 600 }}
                          >
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
                    <Typography
                      variant="h6"
                      sx={{ color: '#a3824c', fontWeight: 700 }}
                    >
                      Total: ₹{total}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 3,
                      width: '100%',
                      textTransform: 'none',
                      fontWeight: 700,
                      background:
                        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                      color: '#fff',
                      borderRadius: 2,
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
                      '&:hover': {
                        background:
                          'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                        color: '#866422',
                        boxShadow: '0 4px 16px rgba(163,130,76,0.18)',
                      },
                      transition: 'all 0.3s ease',
                    }}
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
    </Box>
  );
};

export default Cart;
