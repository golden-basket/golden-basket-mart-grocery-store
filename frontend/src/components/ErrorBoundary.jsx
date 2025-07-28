import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error.message || 'An unexpected error occurred'}
        </Typography>
        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          sx={{
            fontWeight: 600,
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            textTransform: 'none',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
              color: '#000',
            },
          }}
        >
          Try Again
        </Button>
      </Alert>
    </Box>
  );
};

const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (import.meta.env.DEV) {
          console.error('Error caught by boundary:', error, errorInfo);
        }
        // In production, you could send this to an error reporting service
        // like Sentry, LogRocket, etc.
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

// Props validation
ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
