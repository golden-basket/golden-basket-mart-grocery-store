import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { isFoldable, getFoldableClasses, getResponsiveValue } =
    useFoldableDisplay();

  return (
    <Box
      className={getFoldableClasses()}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isFoldable ? '60vh' : '50vh',
        p: getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined),
        textAlign: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <Alert
        severity="error"
        sx={{
          mb: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
          maxWidth: getResponsiveValue(
            500,
            550,
            600,
            isFoldable ? 525 : undefined
          ),
          borderRadius: getResponsiveValue(
            8,
            12,
            16,
            isFoldable ? 10 : undefined
          ),
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <Typography
          variant={getResponsiveValue(
            'h6',
            'h5',
            'h4',
            isFoldable ? 'h5' : undefined
          )}
          gutterBottom
          sx={{
            fontSize: isFoldable
              ? 'clamp(1.125rem, 3.5vw, 1.375rem)'
              : getResponsiveValue('1.25rem', '1.5rem', '1.75rem', undefined),
            fontWeight: 600,
            mb: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
            transition: 'all 0.2s ease',
          }}
        >
          Something went wrong
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 1.75 : undefined),
            fontSize: isFoldable
              ? 'clamp(0.875rem, 2.5vw, 1rem)'
              : getResponsiveValue('0.875rem', '1rem', '1.125rem', undefined),
            lineHeight: 1.5,
            transition: 'color 0.2s ease',
          }}
        >
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
            fontSize: getResponsiveValue(
              '0.875rem',
              '1rem',
              '1.125rem',
              isFoldable ? '0.95rem' : undefined
            ),
            minHeight: isFoldable ? '48px' : 'auto',
            px: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
            py: getResponsiveValue(
              1,
              1.25,
              1.5,
              isFoldable ? 1.125 : undefined
            ),
            borderRadius: getResponsiveValue(
              6,
              8,
              10,
              isFoldable ? 7 : undefined
            ),
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
              color: '#000',
              transform: isFoldable ? 'scale(1.02)' : 'none',
              boxShadow: isFoldable
                ? '0 4px 12px rgba(163, 130, 76, 0.3)'
                : '0 4px 12px rgba(163, 130, 76, 0.3)',
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
          console.error('Error caught by ErrorBoundary:', error);
          console.error('Error info:', errorInfo);
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
