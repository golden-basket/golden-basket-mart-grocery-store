import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Container,
} from '@mui/material';
import { CheckCircle, Error, Email } from '@mui/icons-material';
import ApiService from '../services/api';
import { useToast } from '../hooks/useToast';
import { ROUTES } from '../utils/routeConstants';

const EmailVerification = () => {
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const verifyEmail = useCallback(async () => {
    // Prevent duplicate API calls
    if (hasVerified.current) {
      return;
    }

    try {
      hasVerified.current = true;

      // Get token from URL params or search params
      const verificationToken = token;

      if (!verificationToken) {
        setStatus('error');
        setError('No verification token found in the URL.');
        return;
      }

      const response = await ApiService.verifyEmail(verificationToken);

      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');

      success('Email verified successfully!');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err) {
      console.error('Email verification error:', err);
      setStatus('error');
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Verification failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  }, [token, navigate, success, showError]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const handleResendVerification = async () => {
    try {
      // For now, we'll redirect to a page where they can enter their email
      // In a more complete implementation, you might want to store the email
      // or have a form to enter it
      navigate(ROUTES.FORGOT_PASSWORD);
    } catch {
      showError('Failed to resend verification email');
    }
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ color: '#a3824c', mb: 2 }} />
            <Typography variant='h6' color='text.secondary' gutterBottom>
              Verifying your email...
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Please wait while we verify your email address.
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography variant='h5' color='success.main' gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              You will be redirected to the login page in a few seconds...
            </Typography>
            <Button
              variant='contained'
              onClick={handleGoToLogin}
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #8b6f3f 0%, #d4c085 50%, #a08555 100%)',
                },
              }}
            >
              Go to Login
            </Button>
          </Box>
        );

      case 'error':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Error sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
            <Typography variant='h5' color='error.main' gutterBottom>
              Verification Failed
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant='outlined'
                startIcon={<Email />}
                onClick={handleResendVerification}
                sx={{
                  borderColor: '#a3824c',
                  color: '#a3824c',
                  '&:hover': {
                    borderColor: '#8b6f3f',
                    backgroundColor: 'rgba(163, 130, 76, 0.04)',
                  },
                }}
              >
                Resend Verification
              </Button>
              <Button
                variant='contained'
                onClick={handleGoToLogin}
                sx={{
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #8b6f3f 0%, #d4c085 50%, #a08555 100%)',
                  },
                }}
              >
                Go to Login
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: 4,
            borderRadius: 2,
            background:
              'linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant='h4'
              component='h1'
              sx={{
                color: '#a3824c',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Email Verification
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Golden Basket Mart
            </Typography>
          </Box>

          {renderContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;
