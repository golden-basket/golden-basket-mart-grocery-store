import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import RefreshIcon from '@mui/icons-material/Refresh';

const RateLimitError = ({
  retryAfter = 15,
  message = 'Too many requests',
  onRetry,
  showRetryButton = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatTime = seconds => {
    if (seconds >= 60) {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  };

  const handleRetry = () => {
    if (onRetry && retryAfter <= 0) {
      onRetry();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        p: isMobile ? 2 : 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 3 : 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: theme.shape.borderRadius * 2,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.error.light}20`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.error.main}20 0%, ${theme.palette.error.light}20 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${theme.palette.error.light}`,
            }}
          >
            <TimerIcon
              sx={{
                fontSize: 40,
                color: theme.palette.error.main,
              }}
            />
          </Box>
        </Box>

        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component='h1'
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.error.main,
            mb: 2,
          }}
        >
          Too Many Requests
        </Typography>

        <Typography
          variant='body1'
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>

        {retryAfter > 0 && (
          <Box
            sx={{
              background: theme.palette.warning.light + '20',
              border: `1px solid ${theme.palette.warning.light}40`,
              borderRadius: theme.shape.borderRadius,
              p: 2,
              mb: 3,
            }}
          >
            <Typography
              variant='body2'
              sx={{
                color: theme.palette.warning.dark,
                fontWeight: 500,
              }}
            >
              Please wait <strong>{formatTime(retryAfter)}</strong> before
              trying again
            </Typography>
          </Box>
        )}

        {showRetryButton && retryAfter <= 0 && (
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: theme.shape.borderRadius,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Try Again
          </Button>
        )}

        {retryAfter > 0 && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              background: theme.palette.info.light + '10',
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.info.light}30`,
            }}
          >
            <Typography
              variant='caption'
              sx={{
                color: theme.palette.info.dark,
                display: 'block',
                textAlign: 'center',
              }}
            >
              This helps protect our service from abuse and ensures fair usage
              for all users.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

RateLimitError.propTypes = {
  retryAfter: PropTypes.number,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  showRetryButton: PropTypes.bool,
};

export default RateLimitError;
