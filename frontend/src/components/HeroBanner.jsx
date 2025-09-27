import { Box, Typography, Container, Button, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const HeroBanner = () => {
  const theme = useTheme();

  return (
    <Container maxWidth='md' sx={{ py: 3 }}>
      <Box
        sx={{
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: 2,
          p: { xs: 1, md: 2 },
          color: theme.palette.primary.contrastText,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          boxShadow: theme.shadows[4],
        }}
      >
        {/* Left Content */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: theme.palette.primary.contrastText,
            }}
          >
            Golden Basket Mart
          </Typography>
          <Typography
            variant='body1'
            sx={{
              mb: 3,
              opacity: 0.9,
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              color: theme.palette.primary.contrastText,
            }}
          >
            Grab Grocery items or get them delivered at your doorstep
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default HeroBanner;
