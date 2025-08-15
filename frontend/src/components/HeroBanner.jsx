import { Box, Typography, Container, Button } from '@mui/material';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const HeroBanner = () => {
  const {
    isMobile,
    isFoldable,
    isUltraWide,
    getFoldableClasses,
    getResponsiveValue,
  } = useFoldableDisplay();

  return (
    <Container
      maxWidth='xl'
      className={getFoldableClasses()}
      sx={{
        px: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
        mb: getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined),
      }}
    >
      <Box
        sx={{
          p: isMobile ? 1 : isFoldable ? 2 : isUltraWide ? 3 : 2,
          background:
            'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
          borderRadius: isMobile ? 6 : isFoldable ? 7 : isUltraWide ? 10 : 8,
          border: '2px solid #e6d897',
          boxShadow: '0 8px 32px rgba(163, 130, 76, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: isFoldable ? 'none' : 'translateY(-4px)',
            boxShadow: isFoldable
              ? '0 8px 32px rgba(163, 130, 76, 0.15)'
              : '0 16px 48px rgba(163, 130, 76, 0.25)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            borderRadius:
              getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined) +
              'px ' +
              getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined) +
              'px 0 0',
          },
        }}
      >
        {/* Decorative Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: getResponsiveValue(
              80,
              120,
              160,
              isFoldable ? 100 : undefined
            ),
            height: getResponsiveValue(
              80,
              120,
              160,
              isFoldable ? 100 : undefined
            ),
            background:
              'radial-gradient(circle, rgba(163, 130, 76, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px) rotate(0deg)',
                opacity: 0.6,
              },
              '50%': {
                transform: 'translateY(-20px) rotate(180deg)',
                opacity: 0.8,
              },
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '8%',
            width: getResponsiveValue(60, 90, 120, isFoldable ? 75 : undefined),
            height: getResponsiveValue(
              60,
              90,
              120,
              isFoldable ? 75 : undefined
            ),
            background:
              'radial-gradient(circle, rgba(230, 216, 151, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
              '50%': { transform: 'scale(1.2)', opacity: 0.6 },
            },
          }}
        />

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: getResponsiveValue(4, 6, 8, isFoldable ? 5 : undefined),
            px: getResponsiveValue(3, 4, 6, isFoldable ? 3.5 : undefined),
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              mb: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
              p: isFoldable
                ? 2
                : {
                    xs: 1.5,
                    sm: 2,
                    md: 2.5,
                    lg: 3,
                  },
              background:
                'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(163, 130, 76, 0.3)',
              animation: 'bounce 2s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: isFoldable
                  ? 20
                  : {
                      xs: 15,
                      sm: 20,
                      md: 25,
                      lg: 30,
                    },
                color: '#fff',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            />
          </Box>

          {/* Main Title */}
          <Typography
            variant={getResponsiveValue(
              'h3',
              'h2',
              'h1',
              isFoldable ? 'h2' : undefined
            )}
            sx={{
              fontSize: isFoldable
                ? 'clamp(1.25rem, 4vw, 1.75rem)'
                : {
                    xs: 'clamp(1.125rem, 6vw, 1.625rem)',
                    sm: 'clamp(1.5rem, 5vw, 2.25rem)',
                    md: 'clamp(1.875rem, 4vw, 2.625rem)',
                    lg: 'clamp(2.25rem, 3vw, 3rem)',
                  },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '0.5px',
              color: '#a3824c',
              textShadow: '0 2px 8px rgba(163, 130, 76, 0.2)',
              mb: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 2 : undefined),
              maxWidth: isUltraWide
                ? '90%'
                : { xs: '100%', sm: '95%', md: '90%', lg: '85%' },
              mx: 'auto',
            }}
          >
            Welcome to <br />
            <Box
              component='span'
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: getResponsiveValue(
                  900,
                  900,
                  900,
                  isFoldable ? 900 : undefined
                ),
              }}
            >
              Golden Basket Mart
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant={getResponsiveValue(
              'h6',
              'h5',
              'h4',
              isFoldable ? 'h5' : undefined
            )}
            sx={{
              fontSize: isFoldable
                ? 'clamp(1rem, 3.5vw, 1.25rem)'
                : {
                    xs: 'clamp(0.875rem, 3.5vw, 1.125rem)',
                    sm: 'clamp(1rem, 3vw, 1.25rem)',
                    md: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                    lg: 'clamp(1.25rem, 2vw, 1.5rem)',
                  },
              fontWeight: 500,
              lineHeight: 1.4,
              color: '#b59961',
              opacity: 0.9,
              mb: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
              maxWidth: isUltraWide
                ? '85%'
                : { xs: '100%', sm: '90%', md: '80%', lg: '75%' },
              mx: 'auto',
            }}
          >
            Fresh groceries, dairy products, and household essentials delivered
            right to your doorstep!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default HeroBanner;
