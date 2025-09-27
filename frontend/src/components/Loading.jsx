import { Box, keyframes, LinearProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Optimized keyframes for better performance
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0%, 40%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  20% {
    transform: translateY(-15px) scale(1.5);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Loading = ({
  size = 'medium',
  variant = 'default',
  showDots = true,
  showIcon = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Direct theme color access - no fallbacks needed
  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryDark = theme.palette.secondary.dark;
  const shadow8 = theme.shadows[8];

  // Size configurations
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

  // Variant configurations using theme colors directly
  const variantConfigs = {
    default: {
      background: `${theme.palette.primary.main}0D`,
      iconGradient: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
      dotColors: [
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
        `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
        `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
      ],
    },
    subtle: {
      background: `${theme.palette.primary.main}05`,
      iconGradient: `linear-gradient(135deg, ${secondaryMain} 0%, ${primaryMain} 100%)`,
      dotColors: [
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
        `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
        `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
      ],
    },
    vibrant: {
      background: `${theme.palette.primary.main}1A`,
      iconGradient: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 50%, ${primaryDark} 100%)`,
      dotColors: [
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
        `linear-gradient(135deg, ${secondaryMain} 0%, ${secondaryDark} 100%)`,
        `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
        `linear-gradient(135deg, ${secondaryMain} 0%, ${secondaryDark} 100%)`,
        `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
      ],
    },
  };

  const variantConfig = variantConfigs[variant];

  return (
    <Box
      component='output'
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
        zIndex: 99,
        gap: config.gap,
        background: variantConfig.background,
        transition: 'all 0.3s ease',
        animation: `${fadeIn} 0.6s ease-out`,
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 1, sm: 1.5, md: 2 },
        '&:focus': {
          outline: `2px solid ${primaryMain}`,
          outlineOffset: '4px',
        },
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* Enhanced background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `radial-gradient(circle at 20% 80%, ${primaryMain} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${secondaryMain} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Animated Shopping Cart Icon */}
      {showIcon && (
        <Box
          sx={{
            mb: config.gap * 1.5,
            p: config.iconPadding,
            background: variantConfig.iconGradient,
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadow8,
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
              borderTop: `3px solid ${primaryLight}`,
              borderRight: `3px solid ${primaryMain}`,
              borderBottom: `3px solid ${primaryDark}`,
              borderLeft: `3px solid ${primaryMain}`,
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
              borderTop: `2px solid ${primaryLight}`,
              animation: `${spin} 0.8s linear infinite reverse`,
            },
          }}
        >
          <ShoppingCartIcon
            sx={{
              fontSize: config.iconSize,
              color: theme.palette.common.white,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              animation: `${bounce} 2s ease-in-out infinite`,
              zIndex: 1,
            }}
          />
        </Box>
      )}

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
                background: variantConfig.dotColors[index],
                animation: `${pulse} 1.5s ease-in-out infinite`,
                animationDelay: `${index * 0.1}s`,
                boxShadow: `0 2px 8px ${theme.palette.primary.main}40, 0 1px 3px rgba(0,0,0,0.12)`,
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: `0 4px 16px ${theme.palette.primary.main}60, 0 3px 6px rgba(0,0,0,0.16)`,
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Progress Indicator */}
      <LinearProgress
        sx={{
          width: '100%',
          maxWidth: isMobile ? '20%' : isMobile ? '13%' : '8%',
          height: 3,
          borderRadius: 1,
          overflow: 'hidden',
          animation: `${fadeIn} 0.8s ease-out 0.8s both`,
          mt: 0.5,
          '& .MuiLinearProgress-bar': {
            background: variantConfig.iconGradient,
          },
        }}
      />
    </Box>
  );
};

export default Loading;
