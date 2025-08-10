import { Box, Typography, Container, Grid, Link } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

const Footer = () => {
  const { 
    isFoldable, 
    getFoldableClasses, 
    getResponsiveValue
  } = useFoldableDisplay();

  return (
    <Box
      component="footer"
      className={getFoldableClasses()}
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
        color: '#e6d897',
        py: getResponsiveValue(4, 5, 6, isFoldable ? 4.5 : undefined),
        mt: getResponsiveValue(4, 6, 8, isFoldable ? 5 : undefined),
        borderTop: '3px solid #a3824c',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: isFoldable 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #4a3518 50%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={getResponsiveValue(3, 4, 6, isFoldable ? 3.5 : undefined)}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: { xs: 'center', sm: 'flex-start' }, 
                mb: getResponsiveValue(2, 2, 2, isFoldable ? 2 : undefined),
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: isFoldable ? 'scale(1.02)' : 'none',
                }
              }}>
                <LocalGroceryStoreIcon 
                  sx={{ 
                    fontSize: isFoldable ? 34 : { xs: 32, sm: 36, md: 40 }, 
                    color: '#e6d897',
                    mr: 1,
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#f4e6b3',
                    }
                  }} 
                />
                <Typography
                  variant={getResponsiveValue("h6", "h5", "h5", isFoldable ? "h5" : undefined)}
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: isFoldable 
                      ? 'clamp(1.125rem, 3.5vw, 1.375rem)'
                      : { 
                          xs: 'clamp(1.25rem, 4vw, 1.5rem)', 
                          sm: 'clamp(1.5rem, 3.5vw, 1.75rem)'
                        },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Golden Basket Mart
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#c1b17a',
                  lineHeight: 1.6,
                  fontSize: isFoldable 
                    ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                    : { 
                        xs: 'clamp(0.875rem, 2.5vw, 1rem)', 
                        sm: 'clamp(1rem, 2vw, 1.125rem)'
                      },
                  transition: 'color 0.2s ease',
                }}
              >
                Your trusted source for fresh groceries, dairy products, and household essentials. 
                Quality products delivered with care to your doorstep.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant={getResponsiveValue("h6", "h5", "h5", isFoldable ? "h5" : undefined)}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                  color: '#e6d897',
                  fontSize: isFoldable 
                    ? 'clamp(1rem, 3vw, 1.125rem)'
                    : { 
                        xs: 'clamp(1.125rem, 3.5vw, 1.25rem)', 
                        sm: 'clamp(1.25rem, 3vw, 1.5rem)'
                      },
                  transition: 'color 0.2s ease',
                }}
              >
                Quick Links
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {[
                  { text: 'Home', href: '/' },
                  { text: 'Catalogue', href: '/catalogue' },
                  { text: 'About Us', href: '/about' },
                  { text: 'Contact', href: '/contact' },
                ].map((link) => (
                  <Box component="li" key={link.text} sx={{ 
                    mb: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: isFoldable ? 'translateX(4px)' : 'none',
                    }
                  }}>
                    <Link
                      href={link.href}
                      sx={{
                        color: '#c1b17a',
                        textDecoration: 'none',
                        fontSize: isFoldable 
                          ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                          : { 
                              xs: 'clamp(0.875rem, 2.5vw, 1rem)', 
                              sm: 'clamp(1rem, 2vw, 1.125rem)'
                            },
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#e6d897',
                          textShadow: isFoldable ? '0 0 8px rgba(230, 216, 151, 0.3)' : 'none',
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant={getResponsiveValue("h6", "h5", "h5", isFoldable ? "h5" : undefined)}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                  color: '#e6d897',
                  fontSize: isFoldable 
                    ? 'clamp(1rem, 3vw, 1.125rem)'
                    : { 
                        xs: 'clamp(1.125rem, 3.5vw, 1.25rem)', 
                        sm: 'clamp(1.25rem, 3vw, 1.5rem)'
                      },
                  transition: 'color 0.2s ease',
                }}
              >
                Contact Info
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 1.75 : undefined) 
              }}>
                {[
                  { icon: PhoneIcon, text: '+91 98765 43210' },
                  { icon: EmailIcon, text: 'info@goldenbasket.com' },
                  { icon: LocationOnIcon, text: 'Mumbai, Maharashtra' },
                ].map((item, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: isFoldable ? 'scale(1.02)' : 'none',
                    }
                  }}>
                    <item.icon sx={{ 
                      fontSize: getResponsiveValue(18, 20, 22, isFoldable ? 20 : undefined), 
                      color: '#a3824c',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#c1b17a',
                      }
                    }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#c1b17a',
                        fontSize: isFoldable 
                          ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                          : { 
                              xs: 'clamp(0.875rem, 2.5vw, 1rem)', 
                              sm: 'clamp(1rem, 2vw, 1.125rem)'
                            },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Business Hours */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant={getResponsiveValue("h6", "h5", "h5", isFoldable ? "h5" : undefined)}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                  color: '#e6d897',
                  fontSize: isFoldable 
                    ? 'clamp(1rem, 3vw, 1.125rem)'
                    : { 
                        xs: 'clamp(1.125rem, 3.5vw, 1.25rem)', 
                        sm: 'clamp(1.25rem, 3vw, 1.5rem)'
                      },
                  transition: 'color 0.2s ease',
                }}
              >
                Business Hours
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 1.75 : undefined) 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'none',
                  }
                }}>
                  <AccessTimeIcon sx={{ 
                    fontSize: getResponsiveValue(18, 20, 22, isFoldable ? 20 : undefined), 
                    color: '#a3824c',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#c1b17a',
                    }
                  }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#c1b17a',
                      fontSize: isFoldable 
                        ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                        : { 
                            xs: 'clamp(0.875rem, 2.5vw, 1rem)', 
                            sm: 'clamp(1rem, 2vw, 1.125rem)'
                          },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Mon - Sat: 7:00 AM - 10:00 PM
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#c1b17a',
                    fontSize: isFoldable 
                      ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                      : { 
                          xs: 'clamp(0.875rem, 2.5vw, 1rem)', 
                          sm: 'clamp(1rem, 2vw, 1.125rem)'
                        },
                    pl: getResponsiveValue(0, 3.5, 4, isFoldable ? 2.5 : undefined),
                    transition: 'color 0.2s ease',
                  }}
                >
                  Sunday: 8:00 AM - 9:00 PM
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#c1b17a',
                    fontSize: isFoldable 
                      ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                      : { 
                          xs: 'clamp(0.875rem, 2.5vw, 1rem)', 
                          sm: 'clamp(1rem, 2vw, 1.125rem)'
                        },
                    pl: getResponsiveValue(0, 3.5, 4, isFoldable ? 2.5 : undefined),
                    transition: 'color 0.2s ease',
                  }}
                >
                  *24/7 Online Ordering Available
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: '1px solid #a3824c',
            mt: getResponsiveValue(4, 5, 6, isFoldable ? 4.5 : undefined),
            pt: getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined),
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#c1b17a',
              fontSize: isFoldable 
                ? 'clamp(0.75rem, 2.2vw, 0.875rem)'
                : { 
                    xs: 'clamp(0.75rem, 2vw, 0.875rem)', 
                    sm: 'clamp(0.875rem, 1.8vw, 1rem)'
                  },
              transition: 'color 0.2s ease',
            }}
          >
            © {new Date().getFullYear()} Golden Basket Mart. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#a3824c',
              mt: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
              fontSize: isFoldable 
                ? 'clamp(0.75rem, 2.2vw, 0.875rem)'
                : { 
                    xs: 'clamp(0.75rem, 2vw, 0.875rem)', 
                    sm: 'clamp(0.875rem, 1.8vw, 1rem)'
                  },
              transition: 'color 0.2s ease',
              '&:hover': {
                color: isFoldable ? '#c1b17a' : '#a3824c',
              }
            }}
          >
            Made with ❤️ for fresh groceries
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
