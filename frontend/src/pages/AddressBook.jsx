import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../components/Loading';
import ApiService from '../services/api';
import { useToastNotifications } from '../hooks/useToast';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

const AddressBook = () => {
  const { token } = useAuth();
  const { showSuccess, showError } = useToastNotifications();
  const theme = useTheme();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNumber: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      ApiService.getAddresses()
        .then(data => setAddresses(data))
        .catch(() => showError('Failed to load addresses. Please try again.'))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Only depend on token, not showError (intentionally excluded to prevent infinite loops)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = editingId ? 'updateAddress' : 'addAddress';
    const args = editingId ? [editingId, form] : [form];
    ApiService[method](...args)
      .then(() => {
        showSuccess(
          editingId
            ? 'Address updated successfully!'
            : 'Address added successfully!'
        );
        setForm({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: '',
          pinCode: '',
          phoneNumber: '',
        });
        setEditingId(null);
        // Refresh addresses after successful add/update
        ApiService.getAddresses()
          .then(data => setAddresses(data))
          .catch(() => showError('Failed to refresh addresses.'));
      })
      .catch(() => showError('Failed to save address. Please try again.'));
  };

  const handleEdit = address => {
    setForm(address);
    setEditingId(address._id);
  };

  const handleDelete = id => {
    ApiService.deleteAddress(id)
      .then(() => {
        showSuccess('Address deleted successfully!');
        // Refresh addresses after successful delete
        ApiService.getAddresses()
          .then(data => setAddresses(data))
          .catch(() => showError('Failed to refresh addresses.'));
      })
      .catch(() => showError('Failed to delete address. Please try again.'));
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary[900]}20 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.background.default} 100%)`,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth='xl' sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant='h3'
            sx={{
              fontWeight: 800,
              color: theme.palette.primary.main,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            }}
          >
            <LocationOnIcon
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            />
            Manage Shipping Addresses
          </Typography>
          <Typography
            variant='h6'
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            }}
          >
            Manage your delivery addresses for faster checkout
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Address List - Takes 3/4 of the width */}
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 8 }}>
            <Card
              elevation={12}
              sx={{
                borderRadius: 4,
                border: `3px solid ${theme.palette.primary.main}`,
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary[900]}30 100%)`
                    : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary[50]} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocationOnIcon
                      sx={{ color: 'white', fontSize: '1.5rem' }}
                    />
                  </Box>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' },
                    }}
                  >
                    Saved Addresses ({addresses.length})
                  </Typography>
                </Box>

                {addresses.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary[100],
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <LocationOnIcon
                        sx={{
                          fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                          color: theme.palette.primary.main,
                        }}
                      />
                    </Box>
                    <Typography
                      variant='h5'
                      sx={{
                        color: theme.palette.text.primary,
                        mb: 2,
                        fontWeight: 600,
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                      }}
                    >
                      No addresses found
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      }}
                    >
                      Add your first address to get started
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    {addresses.map(addr => (
                      <Card
                        key={addr._id}
                        elevation={8}
                        sx={{
                          p: { xs: 2, sm: 2.5, md: 3 },
                          width: '100%',
                          minHeight: 'auto',
                          border: `2px solid ${theme.palette.primary.light}`,
                          borderRadius: { xs: 2, sm: 3, md: 4 },
                          background:
                            theme.palette.mode === 'dark'
                              ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary[900]}20 100%)`
                              : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary[50]} 100%)`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 15px 35px ${theme.palette.primary.main}25`,
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            width: '100%',
                            minHeight: 'auto',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 0 },
                          }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              pr: { xs: 0, sm: 2 },
                              minWidth: 0,
                              width: { xs: '100%', sm: 'auto' },
                            }}
                          >
                            <Typography
                              variant='h6'
                              sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                mb: 1.5,
                                fontSize: {
                                  xs: '1.1rem',
                                  sm: '1.2rem',
                                  md: '1.3rem',
                                },
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                lineHeight: 1.4,
                              }}
                            >
                              {addr.addressLine1}
                            </Typography>
                            {addr.addressLine2 && (
                              <Typography
                                variant='body1'
                                sx={{
                                  color: theme.palette.text.secondary,
                                  mb: 1.5,
                                  fontSize: {
                                    xs: '1rem',
                                    sm: '1.1rem',
                                    md: '1.2rem',
                                  },
                                  wordBreak: 'break-word',
                                  whiteSpace: 'normal',
                                  lineHeight: 1.4,
                                }}
                              >
                                {addr.addressLine2}
                              </Typography>
                            )}
                            <Typography
                              variant='body1'
                              sx={{
                                color: theme.palette.text.secondary,
                                mb: 1.5,
                                fontSize: {
                                  xs: '1rem',
                                  sm: '1.1rem',
                                  md: '1.2rem',
                                },
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                lineHeight: 1.4,
                              }}
                            >
                              {addr.city}, {addr.state}, {addr.country} -{' '}
                              {addr.pinCode}
                            </Typography>
                            <Typography
                              variant='body1'
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: {
                                  xs: '1rem',
                                  sm: '1.1rem',
                                  md: '1.2rem',
                                },
                                fontWeight: 600,
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                lineHeight: 1.4,
                              }}
                            >
                              📞 {addr.phoneNumber}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: { xs: 1, sm: 1.5 },
                              justifyContent: {
                                xs: 'flex-end',
                                sm: 'flex-start',
                              },
                              width: { xs: '100%', sm: 'auto' },
                              mt: { xs: 1, sm: 0 },
                            }}
                          >
                            <IconButton
                              onClick={() => handleEdit(addr)}
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                '&:hover': {
                                  bgcolor: theme.palette.primary.dark,
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                                boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                              }}
                            >
                              <EditIcon
                                sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                              />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(addr._id)}
                              sx={{
                                bgcolor: theme.palette.error.main,
                                color: 'white',
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                '&:hover': {
                                  bgcolor: theme.palette.error.dark,
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                                boxShadow: `0 4px 12px ${theme.palette.error.main}30`,
                              }}
                            >
                              <DeleteIcon
                                sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                              />
                            </IconButton>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Add Address Form - Takes 1/4 of the width */}
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Card
              elevation={12}
              sx={{
                borderRadius: 4,
                border: `3px solid ${theme.palette.primary.main}`,
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary[900]}30 100%)`
                    : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary[50]} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AddIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' },
                    }}
                  >
                    {editingId ? 'Edit Address' : 'Add New Address'}
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label='Address Line 1'
                      name='addressLine1'
                      value={form.addressLine1}
                      onChange={handleChange}
                      required
                      fullWidth
                      margin='normal'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          '&.Mui-focused': {
                            color: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                    <TextField
                      label='Address Line 2'
                      name='addressLine2'
                      value={form.addressLine2}
                      onChange={handleChange}
                      fullWidth
                      margin='normal'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          '&.Mui-focused': {
                            color: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label='City'
                          name='city'
                          value={form.city}
                          onChange={handleChange}
                          required
                          fullWidth
                          margin='normal'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            '& .MuiInputLabel-root': {
                              '&.Mui-focused': {
                                color: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label='State'
                          name='state'
                          value={form.state}
                          onChange={handleChange}
                          required
                          fullWidth
                          margin='normal'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            '& .MuiInputLabel-root': {
                              '&.Mui-focused': {
                                color: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label='Country'
                          name='country'
                          value={form.country}
                          onChange={handleChange}
                          required
                          fullWidth
                          margin='normal'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            '& .MuiInputLabel-root': {
                              '&.Mui-focused': {
                                color: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label='Pin Code'
                          name='pinCode'
                          value={form.pinCode}
                          onChange={handleChange}
                          required
                          fullWidth
                          margin='normal'
                          slotProps={{ input: { maxLength: 6 } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            '& .MuiInputLabel-root': {
                              '&.Mui-focused': {
                                color: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label='Phone Number'
                      name='phoneNumber'
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      fullWidth
                      margin='normal'
                      slotProps={{ input: { maxLength: 10 } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          '&.Mui-focused': {
                            color: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                    <Button
                      type='submit'
                      fullWidth
                      startIcon={<AddIcon />}
                      sx={{
                        mt: 3,
                        mb: 2,
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                        color: theme.palette.primary.contrastText,
                        textTransform: 'none',
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}50`,
                        '&:hover': {
                          background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          color: theme.palette.primary.contrastText,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {editingId ? 'Update Address' : 'Add Address'}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AddressBook;
