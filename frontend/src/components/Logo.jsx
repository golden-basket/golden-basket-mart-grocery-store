import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const Logo = ({
  onClick,
  showText = true,
  size = 'default',
  variant = 'navbar', // 'navbar', 'footer', 'compact'
  sx = {},
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const getLogoSizes = () => {
    switch (size) {
      case 'small':
        return { xs: '32px', sm: '40px', md: '48px' };
      case 'large':
        return { xs: '64px', sm: '80px', md: '96px' };
      case 'default':
      default:
        return { xs: '48px', sm: '56px', md: '64px' };
    }
  };

  const getTextSizes = () => {
    switch (size) {
      case 'small':
        return { xs: '0.875rem', sm: '1rem', md: '1.125rem' };
      case 'large':
        return { xs: '1.5rem', sm: '1.75rem', md: '2rem' };
      case 'default':
      default:
        return { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' };
    }
  };

  const logoSizes = getLogoSizes();
  const textSizes = getTextSizes();

  const logoContainerSx = {
    display: 'flex',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    ...(onClick && {
      '&:hover': {
        transform: 'scale(1.05)',
        '& img': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        },
      },
    }),
    ...sx,
  };

  const logoSx = {
    width: logoSizes,
    height: logoSizes,
    borderRadius: '50%',
    objectFit: 'cover',
    border:
      variant === 'navbar' ? '2px solid rgba(255, 255, 255, 0.2)' : 'none',
    boxShadow: variant === 'navbar' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
  };

  const textSx = {
    ml: variant === 'navbar' ? { xs: 1.5, sm: 2, md: 2.5 } : 1,
    fontWeight: 700,
    color: variant === 'navbar' ? '#ffffff' : theme.palette.primary.main,
    textShadow: variant === 'navbar' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
    display: { xs: 'none', sm: 'block' },
    fontSize: textSizes,
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  };

  return (
    <Box onClick={onClick} sx={logoContainerSx}>
      <Box
        component='img'
        src='/golden-basket-rounded.png'
        alt='Golden Basket Mart'
        sx={logoSx}
        style={{
          // Force inline styles as backup
          width: logoSizes.xs,
          height: logoSizes.xs,
          borderRadius: '50%',
          objectFit: 'cover',
          border:
            variant === 'navbar'
              ? '2px solid rgba(255, 255, 255, 0.2)'
              : 'none',
          boxShadow:
            variant === 'navbar' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
        }}
      />
      {showText && (
        <Typography variant='h6' sx={textSx}>
          {isSmall ? 'Golden Basket' : 'Golden Basket Mart'}
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
