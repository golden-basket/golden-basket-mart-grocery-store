import { Box, Typography, CircularProgress } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

const Loading = () => {
  const { 
    isFoldable, 
    getFoldableClasses, 
    getResponsiveValue 
  } = useFoldableDisplay();

  return (
    <Box
      className={getFoldableClasses()}
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
        gap: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.25 : undefined),
        background: isFoldable 
          ? 'rgba(26, 26, 26, 0.95)'
          : 'rgba(26, 26, 26, 0.9)',
        backdropFilter: isFoldable ? 'blur(8px)' : 'blur(4px)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Animated Shopping Cart Icon */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: isFoldable ? 'scale(1.05)' : 'none',
          }
        }}
      >
        <ShoppingCartIcon
          sx={{
            fontSize: getResponsiveValue(48, 56, 64, isFoldable ? 56 : undefined),
            color: '#a3824c',
            animation: 'bounce 1.5s ease-in-out infinite',
            transition: 'color 0.2s ease',
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
            width: getResponsiveValue(64, 72, 80, isFoldable ? 72 : undefined),
            height: getResponsiveValue(64, 72, 80, isFoldable ? 72 : undefined),
            borderRadius: '50%',
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            opacity: isFoldable ? 0.4 : 0.3,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.8)',
                opacity: isFoldable ? 0.4 : 0.3,
              },
              '50%': {
                transform: 'scale(1.2)',
                opacity: isFoldable ? 0.15 : 0.1,
              },
              '100%': {
                transform: 'scale(0.8)',
                opacity: isFoldable ? 0.4 : 0.3,
              },
            },
          }}
        />
      </Box>

      {/* Loading text with golden gradient */}
      <Typography
        variant={getResponsiveValue("h6", "h5", "h4", isFoldable ? "h5" : undefined)}
        sx={{
          fontWeight: 600,
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeInOut 2s ease-in-out infinite',
          fontSize: isFoldable 
            ? 'clamp(1.125rem, 3.5vw, 1.375rem)'
            : getResponsiveValue('1.25rem', '1.5rem', '1.75rem', undefined),
          textAlign: 'center',
          transition: 'all 0.2s ease',
          '@keyframes fadeInOut': {
            '0%, 100%': {
              opacity: isFoldable ? 0.8 : 0.7,
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
        size={getResponsiveValue(20, 22, 24, isFoldable ? 22 : undefined)}
        thickness={getResponsiveValue(3, 3.5, 4, isFoldable ? 3.5 : undefined)}
        sx={{
          color: '#e6d897',
          transition: 'all 0.2s ease',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
          '&:hover': {
            transform: isFoldable ? 'scale(1.1)' : 'none',
          }
        }}
      />
    </Box>
  );
};

export default Loading;
