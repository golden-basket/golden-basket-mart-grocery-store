import React from 'react';
import {
  Box,
  Typography,
  Container,
  Link,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import Logo from './Logo';

const Footer = () => {
  const theme = useTheme();

  const socialMediaLinks = [
    { icon: FacebookIcon, label: 'Facebook', href: '#', color: '#1877F2' },
    { icon: TwitterIcon, label: 'Twitter', href: '#', color: '#1DA1F2' },
    { icon: InstagramIcon, label: 'Instagram', href: '#', color: '#E4405F' },
  ];

  return (
    <Box
      component='footer'
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 50%, ${theme.palette.background.paper} 100%)`,
        color: theme.palette.text.primary,
        py: { xs: 3, sm: 4, md: 5 },
        mt: { xs: 3, sm: 4, md: 6 },
        borderTop: `3px solid ${theme.palette.primary.main}`,
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      <Container maxWidth='xl'>
        {/* Company Info */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <Logo size='large' variant='footer' showText={false} />
          </Box>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              lineHeight: 1.2,
            }}
          >
            Golden Basket Mart
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: { xs: '100%', sm: '80%', md: '60%' },
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.6,
              px: { xs: 2, sm: 1, md: 0 },
            }}
          >
            Your trusted source for fresh groceries, dairy products, and
            household essentials. Quality products delivered with care to your
            doorstep.
          </Typography>
        </Box>

        {/* Main Footer Content */}
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 6 }}
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          {/* Contact Info - Left Side */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 3, sm: 0 },
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 2, md: 3 },
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                Contact Info
              </Typography>
              <Stack spacing={{ xs: 1.5, sm: 1.5, md: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <PhoneIcon
                    sx={{
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                    }}
                  >
                    +91-1800-123-4567
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <EmailIcon
                    sx={{
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                    }}
                  >
                    support@goldenbasketmart.com
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <LocationOnIcon
                    sx={{
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                    }}
                  >
                    Jaipur, Rajasthan, India
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <AccessTimeIcon
                    sx={{
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                    }}
                  >
                    Mon-Sat: 9:00 AM - 8:00 PM IST
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Social Media Links - Right Side */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'right' },
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 2, md: 3 },
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                Follow Us
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  flexWrap: 'wrap',
                }}
              >
                {socialMediaLinks.map(social => (
                  <Tooltip key={social.label} title={social.label} arrow>
                    <IconButton
                      component={Link}
                      href={social.href}
                      sx={{
                        color: social.color,
                        transition: 'all 0.3s ease',
                        width: { xs: 36, sm: 40, md: 44 },
                        height: { xs: 36, sm: 40, md: 44 },
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <social.icon
                        sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }}
                      />
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.primary.main}`,
            mt: { xs: 3, sm: 4, md: 5 },
            pt: { xs: 2, sm: 3, md: 4 },
            textAlign: 'center',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.6,
            }}
          >
            © {new Date().getFullYear()} Golden Basket Mart. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
