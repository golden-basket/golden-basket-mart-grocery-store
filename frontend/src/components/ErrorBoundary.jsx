import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log error to console
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, errorId, onRetry, onGoHome }) => {
  const handleGoHome = () => {
    onGoHome();
    // Use window.location instead of navigate when outside Router context
    window.location.href = '/';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <ReportIcon
          sx={{
            fontSize: 64,
            color: 'error.main',
            mb: 2,
          }}
        />

        <Typography variant='h4' component='h1' gutterBottom color='error.main'>
          Oops! Something went wrong
        </Typography>

        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          We're sorry, but something unexpected happened. Our team has been
          notified.
        </Typography>

        {errorId && (
          <Alert severity='info' sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Error Reference</AlertTitle>
            If this problem persists, please contact support with this ID:{' '}
            <strong>{errorId}</strong>
          </Alert>
        )}

        {error && (
          <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Error Details</AlertTitle>
            <Typography
              variant='body2'
              component='pre'
              sx={{ fontSize: '0.75rem', overflow: 'auto' }}
            >
              {error.toString()}
            </Typography>
            {errorInfo && errorInfo.componentStack && (
              <Typography
                variant='body2'
                component='pre'
                sx={{ fontSize: '0.75rem', overflow: 'auto', mt: 1 }}
              >
                {errorInfo.componentStack}
              </Typography>
            )}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant='contained'
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ minWidth: 120 }}
          >
            Try Again
          </Button>

          <Button
            variant='outlined'
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{ minWidth: 120 }}
          >
            Go Home
          </Button>
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 3 }}>
          If the problem continues, please refresh the page or contact our
          support team.
        </Typography>

        {/* Contact Information */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant='subtitle2' gutterBottom color='primary.main'>
            📞 Contact Support
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              textAlign: 'left',
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              <strong>Email:</strong> support@goldenbasketmart.com
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <strong>Phone:</strong> +91-1800-123-4567
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <strong>WhatsApp:</strong> +91-98765-43210
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <strong>Business Hours:</strong> Mon-Sat: 9:00 AM - 8:00 PM IST
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <strong>Emergency:</strong> Available 24/7 for critical issues
            </Typography>
          </Box>
        </Box>

        {/* Additional Help Options */}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant='text'
            size='small'
            onClick={() =>
              window.open(
                'mailto:support@goldenbasketmart.com?subject=Error Report - ' +
                  (errorId || 'Unknown'),
                '_blank'
              )
            }
            sx={{ fontSize: '0.75rem' }}
          >
            📧 Email Support
          </Button>
          <Button
            variant='text'
            size='small'
            onClick={() =>
              window.open(
                'https://wa.me/919876543210?text=Error Report - ' +
                  (errorId || 'Unknown'),
                '_blank'
              )
            }
            sx={{ fontSize: '0.75rem' }}
          >
            💬 WhatsApp Support
          </Button>
          <Button
            variant='text'
            size='small'
            onClick={() => window.open('tel:+9118001234567', '_blank')}
            sx={{ fontSize: '0.75rem' }}
          >
            📞 Call Support
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorBoundary;
