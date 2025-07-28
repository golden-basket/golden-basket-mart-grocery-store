import { Box, Typography, CircularProgress } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Loading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        gap: 2,
      }}
    >
      {/* Animated Shopping Cart Icon */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ShoppingCartIcon
          sx={{
            fontSize: 64,
            color: '#a3824c',
            animation: 'bounce 1.5s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateY(0)',
              },
              '40%': {
                transform: 'translateY(-10px)',
              },
              '60%': {
                transform: 'translateY(-5px)',
              },
            },
          }}
        />
        {/* Golden pulse effect */}
        <Box
          sx={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            opacity: 0.3,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.8)',
                opacity: 0.3,
              },
              '50%': {
                transform: 'scale(1.2)',
                opacity: 0.1,
              },
              '100%': {
                transform: 'scale(0.8)',
                opacity: 0.3,
              },
            },
          }}
        />
      </Box>

      {/* Loading text with golden gradient */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeInOut 2s ease-in-out infinite',
          '@keyframes fadeInOut': {
            '0%, 100%': {
              opacity: 0.7,
            },
            '50%': {
              opacity: 1,
            },
          },
        }}
      >
        Loading...
      </Typography>

      {/* Subtle progress indicator */}
      <CircularProgress
        size={24}
        thickness={4}
        sx={{
          color: '#e6d897',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
    </Box>
  );
};

export default Loading;
