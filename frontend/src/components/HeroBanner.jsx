import { Box, Typography, Container } from '@mui/material';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

const HeroBanner = () => {
    const { 
    isMobile, 
    isFoldable, 
    isUltraWide, 
    getFoldableClasses, 
    getResponsiveValue, 
    getFoldableSpacing 
  } = useFoldableDisplay();

  return (
    <Container 
      maxWidth="xl" 
      className={getFoldableClasses()}
      sx={{ 
        px: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined)
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
          color: 'var(--color-cream-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined),
          px: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
          textAlign: 'center',
          mb: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
          borderRadius: getResponsiveValue(2, 3, 4, isFoldable ? 3 : undefined),
          boxShadow: '0 8px 32px rgba(163, 130, 76, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: isFoldable ? 'none' : 'translateY(-2px)',
            boxShadow: isFoldable ? '0 8px 32px rgba(163, 130, 76, 0.15)' : '0 12px 40px rgba(163, 130, 76, 0.25)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Typography 
          variant={getResponsiveValue("h3", "h2", "h1", isFoldable ? "h2" : undefined)}
          fontWeight={700} 
          gutterBottom
          sx={{
            mb: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
            fontSize: isFoldable 
              ? 'clamp(1.5rem, 4vw, 2.25rem)'
              : { 
                  xs: 'clamp(1.75rem, 8vw, 2.5rem)', 
                  sm: 'clamp(2rem, 6vw, 3rem)', 
                  md: 'clamp(2.5rem, 5vw, 3.5rem)',
                  lg: 'clamp(3rem, 4vw, 4rem)'
                },
            lineHeight: getResponsiveValue(1.2, 1.1, 1.1, isFoldable ? 1.15 : undefined),
            letterSpacing: getResponsiveValue('0.5px', '1px', '1px', isFoldable ? '0.75px' : undefined),
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Welcome to Golden Basket Mart
        </Typography>
        
        <Typography 
          variant={getResponsiveValue("h6", "h5", "h4", isFoldable ? "h5" : undefined)}
          sx={{
            fontSize: isFoldable 
              ? 'clamp(0.875rem, 3vw, 1.125rem)'
              : { 
                  xs: 'clamp(0.75rem, 3vw, 1rem)', 
                  sm: 'clamp(0.875rem, 2.5vw, 1.125rem)', 
                  md: 'clamp(1rem, 2vw, 1.25rem)',
                  lg: 'clamp(1.125rem, 1.5vw, 1.375rem)'
                },
            lineHeight: getResponsiveValue(1.4, 1.3, 1.3, isFoldable ? 1.35 : undefined),
            fontWeight: getResponsiveValue(500, 600, 600, isFoldable ? 550 : undefined),
            opacity: 0.95,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            zIndex: 1,
            maxWidth: isUltraWide ? '85%' : { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
            mx: 'auto',
            mb: getFoldableSpacing(0, 1, 2),
          }}
        >
          Fresh groceries, dairy, and more delivered to your doorstep!
        </Typography>
        
        {/* Decorative elements for larger screens */}
        {(!isMobile && !isFoldable) && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '5%',
                width: getResponsiveValue(60, 80, 100, undefined),
                height: getResponsiveValue(60, 80, 100, undefined),
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
                  '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '15%',
                left: '8%',
                width: getResponsiveValue(40, 60, 80, undefined),
                height: getResponsiveValue(40, 60, 80, undefined),
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 4s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)', opacity: 0.5 },
                  '50%': { transform: 'translateY(-10px)', opacity: 0.7 },
                },
              }}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default HeroBanner;
