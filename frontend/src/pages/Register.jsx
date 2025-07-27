import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Slide,
  Grid,
} from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register',
        form
      );
      setSuccess(
        res.data.message ||
          'Registration successful! Please check your email to verify your account.'
      );
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Slide direction="right" in={true} timeout={400}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, md: 4 },
            width: '50%',
            borderRadius: 4,
            background:
              'linear-gradient(135deg, #fff 0%, #fffbe6 50%, #f7ecd0 100%)',
            border: '2px solid #e6d897',
            boxShadow: '0 20px 40px rgba(163,130,76,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            },
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <ShoppingCartIcon
                sx={{
                  fontSize: 48,
                  color: '#a3824c',
                  animation: 'bounce 2s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-8px)' },
                    '60%': { transform: 'translateY(-4px)' },
                  },
                }}
              />
            </Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: 1,
              }}
            >
              Join Golden Basket Mart
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Create your account and start shopping fresh groceries
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Fade in={true}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #fff5f5 0%, #fed7d7 100%)',
                  color: '#c53030',
                  border: '1px solid #feb2b2',
                  '& .MuiAlert-icon': { color: '#c53030' },
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={true}>
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #f0fff4 0%, #c6f6d5 100%)',
                  color: '#22543d',
                  border: '1px solid #9ae6b4',
                  '& .MuiAlert-icon': { color: '#22543d' },
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} width="49.25%">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#a3824c' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#a3824c' },
                      '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                    },
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': { color: '#a3824c' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} width="49.25%">
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#a3824c' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#a3824c' },
                      '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                    },
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': { color: '#a3824c' },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#a3824c' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': { color: '#a3824c' },
                },
              }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              helperText="Min 8 chars, uppercase, lowercase, number, special char"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#a3824c' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: '#a3824c',
                          '&: hover': {
                            color: '#a3824c',
                            background: 'transparent',
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': { color: '#a3824c' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#a3824c',
                  fontSize: '0.8rem',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading ? null : <PersonAddIcon />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 2,
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                color: '#fff',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                  color: '#000',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(90deg, #ccc 0%, #ddd 100%)',
                  color: '#666',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider
              sx={{ my: 3, '&::before, &::after': { borderColor: '#e6d897' } }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                Already have an account?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                borderColor: '#a3824c',
                color: '#a3824c',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: '#a3824c',
                  borderColor: '#e6d897',
                  backgroundColor: 'rgba(163,130,76,0.05)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(163,130,76,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In Instead
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default Register;
