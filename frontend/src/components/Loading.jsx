import {
  Box,
  keyframes,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { COLORS, GRADIENTS, SHADOWS } from '../styles/theme';
import './Loading.css';

// Optimized keyframes for better performance
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

// Not in use
// const wave = keyframes`
//   0% { transform: translateX(-100%); }
//   50% { transform: translateX(100%); }
//   100% { transform: translateX(100%); }
// `;

const pulse = keyframes`
  0%, 40%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  20% {
    transform: translateY(-12px) scale(1.4);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Loading = ({
  // eslint-disable-next-line
  message = '', // Not in use
  size = 'medium',
  variant = 'default',
  showDots = true,
  showIcon = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  // Simplified size configurations
  const sizeConfigs = {
    small: {
      containerHeight: '15vh',
      iconSize: 16,
      iconPadding: 1,
      gap: 1,
      fontSize: '0.75rem',
      dotSize: 8,
    },
    medium: {
      containerHeight: '40vh',
      iconSize: 28,
      iconPadding: 2,
      gap: 2,
      fontSize: '1.125rem',
      dotSize: 12,
    },
    large: {
      containerHeight: '60vh',
      iconSize: 40,
      iconPadding: 3,
      gap: 3,
      fontSize: '1.5rem',
      dotSize: 16,
    },
  };

  const config = sizeConfigs[size];

  // Variant configurations
  const variantConfigs = {
    default: {
      background: 'rgba(163, 130, 76, 0.05)',
      iconGradient: GRADIENTS.button,
      dotColors: [
        COLORS.primary.light,
        COLORS.primary.main,
        COLORS.primary.dark,
        COLORS.secondary.main,
        COLORS.secondary.dark,
      ],
    },
    subtle: {
      background: 'rgba(163, 130, 76, 0.02)',
      iconGradient: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
      dotColors: [
        COLORS.primary.light,
        COLORS.primary.main,
        COLORS.primary.dark,
        COLORS.primary.light,
        COLORS.primary.main,
      ],
    },
    vibrant: {
      background: 'rgba(163, 130, 76, 0.1)',
      iconGradient:
        'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #866422 100%)',
      dotColors: [
        COLORS.warning.light,
        COLORS.primary.main,
        COLORS.success.main,
        COLORS.info.main,
        COLORS.secondary.main,
      ],
    },
  };

  const variantConfig = variantConfigs[variant];

  return (
    <Box
      role='status'
      aria-live='polite'
      tabIndex={0}
      sx={{
        height: config.containerHeight,
        width: '100%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        gap: config.gap,
        background: variantConfig.background,
        transition: 'all 0.3s ease',
        animation: `${fadeIn} 0.6s ease-out`,
        position: 'relative',
        overflow: 'hidden',

        // Simplified responsive design
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 1, sm: 1.5, md: 2 },

        // Improved accessibility
        '&:focus': {
          outline: '2px solid var(--color-primary)',
          outlineOffset: '4px',
        },

        // Performance optimizations
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* Enhanced background pattern for visual interest */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `radial-gradient(circle at 20% 80%, ${COLORS.primary.main} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${COLORS.secondary.main} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Animated Shopping Cart Icon */}
      {showIcon && (
        <Box
          sx={{
            mb: config.gap * 2.5,
            p: config.iconPadding,
            background: variantConfig.iconGradient,
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: SHADOWS.buttonHover,
            animation: `${fadeIn} 0.8s ease-out 0.2s both`,

            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              right: '-6px',
              bottom: '-6px',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTop: `3px solid ${COLORS.primary.light}`,
              borderRight: `3px solid ${COLORS.primary.main}`,
              borderBottom: `3px solid ${COLORS.primary.dark}`,
              borderLeft: `3px solid ${COLORS.primary.main}`,
              animation: `${spin} 1.2s linear infinite`,
            },

            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTop: `2px solid ${COLORS.primary.light}`,
              animation: `${spin} 0.8s linear infinite reverse`,
            },
          }}
        >
          <ShoppingCartIcon
            sx={{
              fontSize: config.iconSize,
              color: COLORS.primary.contrastText,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              animation: `${bounce} 2s ease-in-out infinite`,
              zIndex: 1,
            }}
          />
        </Box>
      )}

      {/* Enhanced Loading Message */}
      {/* <Typography
        variant="h6"
        sx={{
          color: COLORS.text.primary,
          fontSize: config.fontSize,
          fontWeight: 600,
          textAlign: 'center',
          animation: `${fadeIn} 0.8s ease-out 0.4s both`,
          position: 'relative',
          overflow: 'hidden',

          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${COLORS.primary.main}, transparent)`,
            animation: `${wave} 2s ease-in-out infinite`,
            opacity: 0.3,
          },
        }}
      >
        {message || 'Loading...'}
      </Typography> */}

      {/* Enhanced Animated Dots */}
      {showDots && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            mb: 0,
            animation: `${fadeIn} 0.8s ease-out 0.6s both`,
          }}
        >
          {[0, 1, 2, 3, 4].map(index => (
            <Box
              key={index}
              role='presentation'
              aria-hidden='true'
              sx={{
                width: config.dotSize,
                height: config.dotSize,
                borderRadius: '50%',
                background: `linear-gradient(135deg, 
                    ${variantConfig.dotColors[index]} 0%, 
                    ${
                      variantConfig.dotColors[
                        (index + 1) % variantConfig.dotColors.length
                      ]
                    } 100%)`,
                animation: `${pulse} 1.5s ease-in-out infinite`,
                animationDelay: `${index * 0.1}s`,
                boxShadow: SHADOWS.button,
                transition: 'all 0.3s ease',

                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: SHADOWS.buttonHover,
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Optional Progress Indicator */}
      <LinearProgress
        sx={{
          width: '100%',
          maxWidth: isMobile ? '20%' : isTablet ? '13%' : '8%',
          height: 3,
          borderRadius: 1,
          overflow: 'hidden',
          animation: `${fadeIn} 0.8s ease-out 0.8s both`,
          mt: 0.5,
        }}
      />
    </Box>
  );
};

export default Loading;
