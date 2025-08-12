import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  TextField,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import SupportIcon from '@mui/icons-material/Support';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import logo from '../assets/golden-basket-rounded.png';

const Footer = () => {
  const {
    isMobile,
    isTablet,
    isFoldable,
    getFoldableClasses,
    getResponsiveValue,
    getResponsiveSpacingClasses,
  } = useFoldableDisplay();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterLoading(true);
    // Simulate API call - replace with actual newsletter signup
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterLoading(false);
      // Show success message
    }, 1000);
  };

  const socialMediaLinks = [
    { icon: FacebookIcon, label: 'Facebook', href: '#', color: '#1877F2' },
    { icon: TwitterIcon, label: 'Twitter', href: '#', color: '#1DA1F2' },
    { icon: InstagramIcon, label: 'Instagram', href: '#', color: '#E4405F' },
    // { icon: LinkedInIcon, label: 'LinkedIn', href: '#', color: '#0A66C2' },
    // { icon: YouTubeIcon, label: 'YouTube', href: '#', color: '#FF0000' },
    // { icon: WhatsAppIcon, label: 'WhatsApp', href: '#', color: '#25D366' },
    // { icon: TelegramIcon, label: 'Telegram', href: '#', color: '#0088CC' },
  ];

  const quickLinks = [
    { text: 'Home', href: '/', icon: '🏠' },
    { text: 'Catalogue', href: '/catalogue', icon: '🛍️' },
    { text: 'Special Offers', href: '/offers', icon: '🎉' },
    { text: 'Fresh Produce', href: '/category/fresh-produce', icon: '🥬' },
    { text: 'Dairy & Eggs', href: '/category/dairy', icon: '🥛' },
    { text: 'Beverages', href: '/category/beverages', icon: '🥤' },
  ];

  const customerService = [
    { text: 'Track Order', href: '/track-order', icon: '📦' },
    { text: 'Return Policy', href: '/returns', icon: '↩️' },
    { text: 'FAQ', href: '/faq', icon: '❓' },
    { text: 'Contact Support', href: '/support', icon: '📞' },
    { text: 'Store Locator', href: '/stores', icon: '📍' },
    { text: 'Gift Cards', href: '/gift-cards', icon: '🎁' },
  ];

  const companyInfo = [
    { text: 'About Us', href: '/about', icon: '🏢' },
    { text: 'Careers', href: '/careers', icon: '💼' },
    { text: 'Press & Media', href: '/press', icon: '📰' },
    { text: 'Sustainability', href: '/sustainability', icon: '🌱' },
    { text: 'Privacy Policy', href: '/privacy', icon: '🔒' },
    { text: 'Terms of Service', href: '/terms', icon: '📋' },
  ];

  const features = [
    {
      icon: LocalShippingIcon,
      text: 'Free Delivery',
      subtext: 'Orders above ₹500',
    },
    { icon: PaymentIcon, text: 'Secure Payment', subtext: '100% Secure' },
    { icon: SecurityIcon, text: 'Quality Assured', subtext: 'Best Products' },
    {
      icon: EnergySavingsLeafIcon,
      text: 'Eco-Friendly',
      subtext: 'Sustainable Choices',
    },
    { icon: SupportIcon, text: '24/7 Support', subtext: 'Always Here' },
  ];

  return (
    <Box
      component="footer"
      className={`${getFoldableClasses()} ${getResponsiveSpacingClasses()}`}
      sx={{
        background:
          'linear-gradient(135deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
        color: '#e6d897',
        py: getResponsiveValue(4, 5, 6, isFoldable ? 4.5 : undefined),
        mt: getResponsiveValue(4, 6, 8, isFoldable ? 5 : undefined),
        borderTop: '3px solid #a3824c',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          background: isFoldable
            ? 'linear-gradient(135deg, #1a1a1a 0%, #4a3518 50%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, #e6d897 50%, transparent 100%)',
          opacity: 0.3,
        },
      }}
    >
      {/* Company Info */}
      <Container maxWidth="xl">
        <Grid
          container
          spacing={getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined)}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  mb: getResponsiveValue(
                    2,
                    2.5,
                    3,
                    isFoldable ? 2.5 : undefined
                  ),
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="Golden Basket Mart"
                    style={{
                      height: isFoldable
                        ? 50
                        : isMobile
                        ? 40
                        : isTablet
                        ? 44
                        : 48,
                      width: 'auto',
                      marginRight: getResponsiveValue(
                        1,
                        1.5,
                        2,
                        isFoldable ? 1.5 : undefined
                      ),
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <Typography
                    variant={getResponsiveValue(
                      'h6',
                      'h5',
                      'h5',
                      isFoldable ? 'h5' : undefined
                    )}
                    sx={{
                      ml: 1,
                      fontWeight: 700,
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: isFoldable
                        ? 'clamp(1.125rem, 3.5vw, 1.375rem)'
                        : {
                            xs: 'clamp(1.25rem, 4vw, 1.5rem)',
                            sm: 'clamp(1.5rem, 3.5vw, 1.75rem)',
                          },
                      transition: 'all 0.2s ease',
                      lineHeight: 1.2,
                    }}
                  >
                    Golden Basket Mart
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#c1b17a',
                  lineHeight: 1.6,
                  fontSize: isFoldable
                    ? 'clamp(0.7rem, 2vw, 0.8rem)'
                    : {
                        xs: 'clamp(0.75rem, 2.2vw, 0.875rem)',
                        sm: 'clamp(0.875rem, 1.8vw, 1rem)',
                      },
                  transition: 'color 0.2s ease',
                  mb: getResponsiveValue(
                    2,
                    2.5,
                    3,
                    isFoldable ? 2.5 : undefined
                  ),
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                Your trusted source for fresh groceries, dairy products, and
                household essentials. Quality products delivered with care to
                your doorstep.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="xl">
        {/* Features Section - Top */}
        <Box
          sx={{
            mb: getResponsiveValue(4, 5, 6, isFoldable ? 4.5 : undefined),
            p: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
            background:
              'linear-gradient(135deg, rgba(163, 130, 76, 0.1) 0%, rgba(230, 216, 151, 0.05) 100%)',
            borderRadius: isMobile ? 2 : isTablet ? 3 : isFoldable ? 2.5 : 4,
            border: '1px solid rgba(163, 130, 76, 0.2)',
          }}
        >
          <Grid
            container
            spacing={getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              rowWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'space-between',
              alignContent: 'center',
              gap: 2,
              p: 2,
            }}
          >
            {features.map((feature, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: getResponsiveValue(
                      1.5,
                      2,
                      2.5,
                      isFoldable ? 2 : undefined
                    ),
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      transform: isFoldable
                        ? 'scale(1.02)'
                        : 'translateY(-2px)',
                    },
                  }}
                >
                  <feature.icon
                    sx={{
                      fontSize: getResponsiveValue(
                        28,
                        32,
                        36,
                        isFoldable ? 30 : undefined
                      ),
                      color: '#e6d897',
                      mb: getResponsiveValue(
                        1,
                        1.5,
                        2,
                        isFoldable ? 1.5 : undefined
                      ),
                      transition: 'color 0.2s ease',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#e6d897',
                      fontSize: isFoldable
                        ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                            sm: 'clamp(1rem, 2vw, 1.125rem)',
                          },
                      mb: getResponsiveValue(
                        0.5,
                        0.75,
                        1,
                        isFoldable ? 0.75 : undefined
                      ),
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {feature.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#c1b17a',
                      fontSize: isFoldable
                        ? 'clamp(0.7rem, 1.8vw, 0.8rem)'
                        : {
                            xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                            sm: 'clamp(0.875rem, 1.8vw, 1rem)',
                          },
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.subtext}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Footer Content */}
        <Grid
          container
          spacing={getResponsiveValue(3, 4, 6, isFoldable ? 3.5 : undefined)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            rowWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            alignContent: 'center',
            gap: 2,
            p: 2,
          }}
        >
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant={getResponsiveValue(
                  'h6',
                  'h5',
                  'h5',
                  isFoldable ? 'h5' : undefined
                )}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                  color: '#e6d897',
                  fontSize: getResponsiveValue(
                    'clamp(1.125rem, 3.5vw, 1.25rem)', // mobile
                    'clamp(1.25rem, 3vw, 1.5rem)', // tablet
                    'clamp(1.5rem, 2.5vw, 1.75rem)', // desktop
                    isFoldable ? 'clamp(1rem, 3vw, 1.125rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Quick Links
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {quickLinks.map((link) => (
                  <Box
                    component="li"
                    key={link.text}
                    sx={{
                      mb: getResponsiveValue(
                        1,
                        1.5,
                        2,
                        isFoldable ? 1.25 : undefined
                      ),
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: isFoldable ? 'translateX(4px)' : 'none',
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      sx={{
                        color: '#c1b17a',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                              sm: 'clamp(1rem, 2vw, 1.125rem)',
                            },
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: getResponsiveValue(
                          0.5,
                          0.75,
                          1,
                          isFoldable ? 0.75 : undefined
                        ),
                        '&:hover': {
                          color: '#e6d897',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(230, 216, 151, 0.3)'
                            : 'none',
                        },
                      }}
                    >
                      <span
                        style={{
                          fontSize: getResponsiveValue(
                            16,
                            18,
                            20,
                            isFoldable ? 18 : undefined
                          ),
                        }}
                      >
                        {/* {link.icon} */}
                        {link.icon}
                      </span>{' '}
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant={getResponsiveValue(
                  'h6',
                  'h5',
                  'h5',
                  isFoldable ? 'h5' : undefined
                )}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                  color: '#e6d897',
                  fontSize: getResponsiveValue(
                    'clamp(1.125rem, 3.5vw, 1.25rem)', // mobile
                    'clamp(1.25rem, 3vw, 1.5rem)', // tablet
                    'clamp(1.5rem, 2.5vw, 1.75rem)', // desktop
                    isFoldable ? 'clamp(1rem, 3vw, 1.125rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Customer Service
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {customerService.map((link) => (
                  <Box
                    component="li"
                    key={link.text}
                    sx={{
                      mb: getResponsiveValue(
                        1,
                        1.5,
                        2,
                        isFoldable ? 1.25 : undefined
                      ),
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: isFoldable ? 'translateX(4px)' : 'none',
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      sx={{
                        color: '#c1b17a',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                              sm: 'clamp(1rem, 2vw, 1.125rem)',
                            },
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: getResponsiveValue(
                          0.5,
                          0.75,
                          1,
                          isFoldable ? 0.75 : undefined
                        ),
                        '&:hover': {
                          color: '#e6d897',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(230, 216, 151, 0.3)'
                            : 'none',
                        },
                      }}
                    >
                      <span
                        style={{
                          fontSize: getResponsiveValue(
                            16,
                            18,
                            20,
                            isFoldable ? 18 : undefined
                          ),
                        }}
                      >
                        {link.icon}
                      </span>
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Company Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant={getResponsiveValue(
                  'h6',
                  'h5',
                  'h5',
                  isFoldable ? 'h5' : undefined
                )}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                  color: '#e6d897',
                  fontSize: getResponsiveValue(
                    'clamp(1.125rem, 3.5vw, 1.25rem)', // mobile
                    'clamp(1.25rem, 3vw, 1.5rem)',     // tablet
                    'clamp(1.5rem, 2.5vw, 1.75rem)',  // desktop
                    isFoldable ? 'clamp(1rem, 3vw, 1.125rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Company
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {companyInfo.map((link) => (
                  <Box
                    component="li"
                    key={link.text}
                    sx={{
                      mb: getResponsiveValue(
                        1,
                        1.5,
                        2,
                        isFoldable ? 1.25 : undefined
                      ),
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: isFoldable ? 'translateX(4px)' : 'none',
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      sx={{
                        color: '#c1b17a',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                              sm: 'clamp(1rem, 2vw, 1.125rem)',
                            },
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: getResponsiveValue(
                          0.5,
                          0.75,
                          1,
                          isFoldable ? 0.75 : undefined
                        ),
                        '&:hover': {
                          color: '#e6d897',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(230, 216, 151, 0.3)'
                            : 'none',
                        },
                      }}
                    >
                      <span
                        style={{
                          fontSize: getResponsiveValue(
                            16,
                            18,
                            20,
                            isFoldable ? 18 : undefined
                          ),
                        }}
                      >
                        {link.icon}
                      </span>
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {/* Contact Info */}
              <Typography
                variant={getResponsiveValue(
                  'h6',
                  'h5',
                  'h5',
                  isFoldable ? 'h5' : undefined
                )}
                sx={{
                  fontWeight: 600,
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  color: '#e6d897',
                  fontSize: getResponsiveValue(
                    'clamp(1.125rem, 3.5vw, 1.25rem)', // mobile
                    'clamp(1.25rem, 3vw, 1.5rem)', // tablet
                    'clamp(1.5rem, 2.5vw, 1.75rem)', // desktop
                    isFoldable ? 'clamp(1rem, 3vw, 1.125rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                }}
              >
                Contact Info
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 1.75 : undefined
                  ),
                }}
              >
                {[
                  { icon: PhoneIcon, text: '+91 98765 43210' },
                  { icon: EmailIcon, text: 'info@goldenbasket.com' },
                  { icon: LocationOnIcon, text: 'Jaipur, Rajasthan' },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      gap: getResponsiveValue(
                        1,
                        1.5,
                        2,
                        isFoldable ? 1.25 : undefined
                      ),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: isFoldable ? 'scale(1.02)' : 'none',
                      },
                    }}
                  >
                    <item.icon
                      sx={{
                        fontSize: getResponsiveValue(
                          18,
                          20,
                          22,
                          isFoldable ? 20 : undefined
                        ),
                        color: '#a3824c',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: '#c1b17a',
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#c1b17a',
                        fontSize: isFoldable
                          ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                              sm: 'clamp(1rem, 2vw, 1.125rem)',
                            },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Social Media Links */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: getResponsiveValue(
                    1,
                    1.5,
                    2,
                    isFoldable ? 1.25 : undefined
                  ),
                  flexWrap: 'wrap',
                  mt: 'auto',
                  pt: getResponsiveValue(
                    1,
                    1.5,
                    2,
                    isFoldable ? 1.5 : undefined
                  ),
                }}
              >
                {socialMediaLinks.map((social, index) => (
                  <Tooltip key={index} title={social.label} arrow>
                    <IconButton
                      component={Link}
                      href={social.href}
                      sx={{
                        color: social.color,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: social.color,
                          transform: 'scale(1.1)',
                        },
                        width: getResponsiveValue(
                          36,
                          40,
                          44,
                          isFoldable ? 38 : undefined
                        ),
                        height: getResponsiveValue(
                          36,
                          40,
                          44,
                          isFoldable ? 38 : undefined
                        ),
                      }}
                    >
                      <social.icon
                        sx={{
                          fontSize: getResponsiveValue(
                            18,
                            20,
                            22,
                            isFoldable ? 20 : undefined
                          ),
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            {/* Newsletter */}
            <Typography
              variant={getResponsiveValue(
                'h6',
                'h5',
                'h5',
                isFoldable ? 'h5' : undefined
              )}
              sx={{
                fontWeight: 600,
                mb: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
                color: '#e6d897',
                fontSize: getResponsiveValue(
                  'clamp(1.125rem, 3.5vw, 1.25rem)', // mobile
                  'clamp(1.25rem, 3vw, 1.5rem)',     // tablet
                  'clamp(1.5rem, 2.5vw, 1.75rem)',  // desktop
                  isFoldable ? 'clamp(1rem, 3vw, 1.125rem)' : undefined
                ),
                transition: 'color 0.2s ease',
                lineHeight: 1.2,
              }}
            >
              Newsletter
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{
                mb: getResponsiveValue(2, 2.5, 3, isFoldable ? 2.5 : undefined),
              }}
            >
              <Stack
                spacing={getResponsiveValue(
                  1,
                  1.5,
                  2,
                  isFoldable ? 1.5 : undefined
                )}
              >
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#e6d897',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(163, 130, 76, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(163, 130, 76, 0.5)',
                      },
                      '&.Mui-focused': {
                        borderColor: '#e6d897',
                      },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#c1b17a',
                      opacity: 0.7,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={newsletterLoading || !newsletterEmail.trim()}
                  sx={{
                    background:
                      'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: 'rgba(163, 130, 76, 0.3)',
                      color: 'rgba(230, 216, 151, 0.5)',
                    },
                  }}
                >
                  {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Business Hours Section */}
        <Box
          sx={{
            mt: getResponsiveValue(4, 5, 6, isFoldable ? 4.5 : undefined),
            p: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
            background:
              'linear-gradient(135deg, rgba(163, 130, 76, 0.1) 0%, rgba(230, 216, 151, 0.05) 100%)',
            borderRadius: getResponsiveValue(
              2,
              3,
              4,
              isFoldable ? 2.5 : undefined
            ),
            border: '1px solid rgba(163, 130, 76, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant={getResponsiveValue(
              'h6',
              'h5',
              'h5',
              isFoldable ? 'h5' : undefined
            )}
            sx={{
              fontWeight: 600,
              p: isMobile ? 0.5 : isTablet ? 0.5 : isFoldable ? 0.75 : 2,
              m: getResponsiveValue(2, 3, 3, isFoldable ? 2.5 : undefined),
              color: '#e6d897',
              fontSize: isFoldable
                ? 'clamp(1rem, 3vw, 1.125rem)'
                : {
                    xs: 'clamp(1.125rem, 3.5vw, 1.25rem)',
                    sm: 'clamp(1.25rem, 3vw, 1.5rem)',
                  },
              transition: 'color 0.2s ease',
              lineHeight: 1.2,
            }}
          >
            Business Hours
          </Typography>
          <Grid
            container
            spacing={getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              rowWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'space-between',
              alignContent: 'center',
              gap: 1,
              p: 2,
            }}
          >
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: getResponsiveValue(
                    1,
                    1.5,
                    2,
                    isFoldable ? 1.25 : undefined
                  ),
                  transition: 'all 0.2s ease',
                  p: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  borderRadius: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  background: 'rgba(163, 130, 76, 0.05)',
                  border: '1px solid rgba(163, 130, 76, 0.1)',
                  height: '100%',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'translateY(-2px)',
                    background: 'rgba(163, 130, 76, 0.08)',
                  },
                }}
              >
                <AccessTimeIcon
                  sx={{
                    fontSize: getResponsiveValue(
                      20,
                      24,
                      28,
                      isFoldable ? 22 : undefined
                    ),
                    color: '#a3824c',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#c1b17a',
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#e6d897',
                      fontWeight: 600,
                      fontSize: isFoldable
                        ? 'clamp(0.9rem, 2.5vw, 1rem)'
                        : {
                            xs: 'clamp(1rem, 2.8vw, 1.125rem)',
                            sm: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                          },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    Mon - Sat: 7:00 AM - 10:00 PM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#c1b17a',
                      fontSize: isFoldable
                        ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                            sm: 'clamp(1rem, 2vw, 1.125rem)',
                          },
                      lineHeight: 1.3,
                    }}
                  >
                    Sunday: 8:00 AM - 9:00 PM
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: getResponsiveValue(
                    1,
                    1.5,
                    2,
                    isFoldable ? 1.25 : undefined
                  ),
                  transition: 'all 0.2s ease',
                  p: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  borderRadius: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  background: 'rgba(163, 130, 76, 0.05)',
                  border: '1px solid rgba(163, 130, 76, 0.1)',
                  height: '100%',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'translateY(-2px)',
                    background: 'rgba(163, 130, 76, 0.08)',
                  },
                }}
              >
                <LocalShippingIcon
                  sx={{
                    fontSize: getResponsiveValue(
                      20,
                      24,
                      28,
                      isFoldable ? 22 : undefined
                    ),
                    color: '#a3824c',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#c1b17a',
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#e6d897',
                      fontWeight: 600,
                      fontSize: isFoldable
                        ? 'clamp(0.9rem, 2.5vw, 1rem)'
                        : {
                            xs: 'clamp(1rem, 2.8vw, 1.125rem)',
                            sm: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                          },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    24/7 Online Ordering
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#c1b17a',
                      fontSize: isFoldable
                        ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                            sm: 'clamp(1rem, 2vw, 1.125rem)',
                          },
                      lineHeight: 1.3,
                    }}
                  >
                    Same Day Delivery Available
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: getResponsiveValue(
                    1,
                    1.5,
                    2,
                    isFoldable ? 1.25 : undefined
                  ),
                  transition: 'all 0.2s ease',
                  p: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  borderRadius: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  background: 'rgba(163, 130, 76, 0.05)',
                  border: '1px solid rgba(163, 130, 76, 0.1)',
                  height: '100%',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'translateY(-2px)',
                    background: 'rgba(163, 130, 76, 0.08)',
                  },
                }}
              >
                <SupportIcon
                  sx={{
                    fontSize: getResponsiveValue(
                      20,
                      24,
                      28,
                      isFoldable ? 22 : undefined
                    ),
                    color: '#a3824c',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#c1b17a',
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#e6d897',
                      fontWeight: 600,
                      fontSize: isFoldable
                        ? 'clamp(0.9rem, 2.5vw, 1rem)'
                        : {
                            xs: 'clamp(1rem, 2.8vw, 1.125rem)',
                            sm: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                          },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    Customer Support
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#c1b17a',
                      fontSize: isFoldable
                        ? 'clamp(0.8rem, 2.2vw, 0.9rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                            sm: 'clamp(1rem, 2vw, 1.125rem)',
                          },
                      lineHeight: 1.3,
                    }}
                  >
                    Always Here to Help
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

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
                    sm: 'clamp(0.875rem, 1.8vw, 1rem)',
                  },
              transition: 'color 0.2s ease',
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
