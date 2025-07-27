import { Box, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(90deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
        color: '#fffde4',
        p: 4,
        position: 'static',
        width: '100%',
      }}
      component="footer"
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight={700}>
            Golden Basket Mart
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Shop No. 2 & 3, Mangalam Anantra,
            <br />
            Opp. Pink Perl Water park,
            <br />
            Mangalam Grand City, Mahapura
            <br />
            Jaipur, Rajasthan, 332026
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Phone:{' '}
            <Link
              href="tel:+919876543210"
              color="inherit"
              underline="hover"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              +91 98765 43210
            </Link>
            <br />
            Email:{' '}
            <Link
              href="mailto:support@goldenbasketmart.com"
              color="inherit"
              underline="hover"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              support@goldenbasketmart.com
            </Link>
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight={700}>
            Quick Links
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link
              href="/catalogue"
              color="inherit"
              underline="hover"
              display="block"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              Catalogue
            </Link>
            <Link
              href="/prices"
              color="inherit"
              underline="hover"
              display="block"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              Today's Prices
            </Link>
            <Link
              href="/cart"
              color="inherit"
              underline="hover"
              display="block"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              Cart
            </Link>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight={700}>
            Follow Us
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              display="block"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              Instagram
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              display="block"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              Facebook
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              display="block"
              sx={{
                '&:hover': {
                  color: '#e6d897',
                  transition: 'color 0.3s ease, text-decoration 0.3s ease',
                },
              }}
            >
              Twitter
            </Link>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="body2" align="center" sx={{ mt: 4 }}>
        &copy; {new Date().getFullYear()} Golden Basket Mart. All rights
        reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
