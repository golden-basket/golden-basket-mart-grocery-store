import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Link,
  TextField,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
// TODO: Add LinkedIn, YouTube, WhatsApp, Telegram icons. Currently not used.
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
import Logo from './Logo';
import HomeIcon from '@mui/icons-material/Home';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SpaIcon from '@mui/icons-material/Spa';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import RecyclingIcon from '@mui/icons-material/Recycling';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Footer = () => {
  const {
    isMobile,
    isFoldable,
    getFoldableClasses,
    getResponsiveValue,
    getResponsiveSpacingClasses,
  } = useFoldableDisplay();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async e => {
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
    { text: 'Home', href: '/', icon: HomeIcon },
    { text: 'Catalogue', href: '/catalogue', icon: LocalOfferIcon },
    { text: 'Special Offers', href: '/offers', icon: CelebrationIcon },
    { text: 'Fresh Produce', href: '/category/fresh-produce', icon: SpaIcon },
    { text: 'Dairy', href: '/category/dairy', icon: LocalDrinkIcon },
    {
      text: 'Beverages',
      href: '/category/beverages',
      icon: EmojiFoodBeverageIcon,
    },
  ];

  const customerService = [
    { text: 'Track Order', href: '/track-order', icon: ShareLocationIcon },
    { text: 'Return Policy', href: '/returns', icon: KeyboardReturnIcon },
    { text: 'FAQ', href: '/faq', icon: LiveHelpIcon },
    { text: 'Contact Support', href: '/support', icon: PhoneIcon },
    { text: 'Store Locator', href: '/stores', icon: LocationPinIcon },
    { text: 'Gift Cards', href: '/gift-cards', icon: CardGiftcardIcon },
  ];

  const companyInfo = [
    { text: 'About Us', href: '/about', icon: InfoIcon },
    { text: 'Careers', href: '/careers', icon: WorkIcon },
    { text: 'Press & Media', href: '/press', icon: NewspaperIcon },
    { text: 'Sustainability', href: '/sustainability', icon: RecyclingIcon },
    { text: 'Privacy Policy', href: '/privacy', icon: SecurityIcon },
    { text: 'Terms of Service', href: '/terms', icon: GavelIcon },
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
      component='footer'
      className={`${getFoldableClasses()} ${getResponsiveSpacingClasses()}`}
      sx={{
        background:
          'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 50%, var(--color-cream-light) 100%)',
        color: 'var(--color-text-primary)',
        py: getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined),
        mt: getResponsiveValue(3, 4, 6, isFoldable ? 4 : undefined),
        borderTop: '3px solid var(--color-primary)',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          background: isFoldable
            ? 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-primary-light) 50%, var(--color-cream-light) 100%)'
            : 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 50%, var(--color-cream-light) 100%)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%)',
          opacity: 0.3,
        },
      }}
    >
      {/* Company Info */}
      <Container maxWidth='xl'>
        <Grid
          container
          spacing={getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined)}
          sx={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                p: { xs: 2, sm: 1.5, md: 2 },
                mb: { xs: 3, sm: 0 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
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
                    justifyContent: 'center',
                  }}
                >
                  <Stack direction='column' spacing={1} alignItems='center'>
                    <Logo size='large' variant='footer' showText={false} />
                    <Typography
                      variant={getResponsiveValue(
                        'h6',
                        'h5',
                        'h5',
                        isFoldable ? 'h5' : undefined
                      )}
                      sx={{
                        fontWeight: 700,
                        background:
                          'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: isFoldable
                          ? 'clamp(1rem, 3vw, 1.25rem)'
                          : {
                              xs: 'clamp(1.125rem, 3.5vw, 1.375rem)',
                              sm: 'clamp(1.25rem, 3vw, 1.5rem)',
                            },
                        transition: 'all 0.2s ease',
                        lineHeight: 1.2,
                        textAlign: 'center',
                      }}
                    >
                      Golden Basket Mart
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <Typography
                variant='body2'
                sx={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  fontSize: isFoldable
                    ? 'clamp(0.75rem, 2.2vw, 0.875rem)'
                    : {
                        xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                        sm: 'clamp(1rem, 2vw, 1.125rem)',
                      },
                  transition: 'color 0.2s ease',
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  textAlign: 'center',
                  maxWidth: { xs: '100%', sm: '80%', md: '60%' },
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
      <Container maxWidth='xl'>
        {/* Features Section - Top */}
        <Box
          sx={{
            mb: { xs: 4, sm: 3, md: 5 },
            p: { xs: 3, sm: 2, md: 3 },
            mx: { xs: 2, sm: 3, md: 4 },
            background:
              'linear-gradient(135deg, rgba(163, 130, 76, 0.08) 0%, rgba(230, 216, 151, 0.03) 100%)',
            borderRadius: { xs: 2, sm: 2, md: 3 },
            border: '1px solid rgba(163, 130, 76, 0.15)',
          }}
        >
          <Grid
            container
            spacing={getResponsiveValue(1.5, 2, 3, isFoldable ? 2 : undefined)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              alignContent: 'center',
              gap: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.5 : undefined),
              p: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.5 : undefined),
            }}
          >
            {features.map((feature, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2, sm: 1.5, md: 2 },
                    mb: { xs: 2, sm: 0 },
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
                  {React.createElement(feature.icon, {
                    sx: {
                      fontSize: getResponsiveValue(
                        24,
                        28,
                        32,
                        isFoldable ? 26 : undefined
                      ),
                      color: 'var(--color-primary)',
                      mb: getResponsiveValue(
                        0.75,
                        1,
                        1.5,
                        isFoldable ? 1 : undefined
                      ),
                      transition: 'color 0.2s ease',
                    },
                  })}
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      fontSize: isFoldable
                        ? 'clamp(0.75rem, 2vw, 0.875rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                            sm: 'clamp(1rem, 1.8vw, 1.125rem)',
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
                    variant='caption'
                    sx={{
                      color: 'var(--color-text-secondary)',
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
          spacing={{ xs: 3, sm: 3, md: 4 }}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            gap: { xs: 3, sm: 2, md: 3 },
            p: { xs: 3, sm: 2, md: 2 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ mb: { xs: 2, sm: 0 } }}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                p: { xs: 3, sm: 1.5, md: 2 },
                mb: { xs: 4, sm: 0 },
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
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  color: 'var(--color-text-primary)',
                  fontSize: getResponsiveValue(
                    'clamp(1rem, 3vw, 1.125rem)', // mobile
                    'clamp(1.125rem, 2.8vw, 1.25rem)', // tablet
                    'clamp(1.25rem, 2.5vw, 1.5rem)', // desktop
                    isFoldable ? 'clamp(0.875rem, 2.8vw, 1rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Quick Links
              </Typography>
              <Box
                component='ul'
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
                {quickLinks.map(link => (
                  <Box
                    key={link.text}
                    sx={{
                      mb: getResponsiveValue(
                        0.75,
                        1,
                        1.5,
                        isFoldable ? 1 : undefined
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
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.75rem, 2vw, 0.875rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                              sm: 'clamp(1rem, 1.8vw, 1.125rem)',
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
                          color: 'var(--color-primary)',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(163, 130, 76, 0.2)'
                            : 'none',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: '7px !important',
                        }}
                      >
                        <link.icon
                          sx={{
                            fontSize: getResponsiveValue(
                              18,
                              20,
                              22,
                              isFoldable ? 20 : undefined
                            ),
                          }}
                        />
                      </Box>{' '}
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ mb: { xs: 2, sm: 0 } }}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                p: { xs: 3, sm: 1.5, md: 2 },
                mb: { xs: 4, sm: 0 },
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
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  color: 'var(--color-text-primary)',
                  fontSize: getResponsiveValue(
                    'clamp(1rem, 3vw, 1.125rem)', // mobile
                    'clamp(1.125rem, 2.8vw, 1.25rem)', // tablet
                    'clamp(1.25rem, 2.5vw, 1.5rem)', // desktop
                    isFoldable ? 'clamp(0.875rem, 2.8vw, 1rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Customer Service
              </Typography>
              <Box
                component='ul'
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
                {customerService.map(link => (
                  <Box
                    key={link.text}
                    sx={{
                      mb: getResponsiveValue(
                        0.75,
                        1,
                        1.5,
                        isFoldable ? 1 : undefined
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
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.75rem, 2vw, 0.875rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                              sm: 'clamp(1rem, 1.8vw, 1.125rem)',
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
                          color: 'var(--color-primary)',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(163, 130, 76, 0.2)'
                            : 'none',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: '7px !important',
                        }}
                      >
                        <link.icon
                          sx={{
                            fontSize: getResponsiveValue(
                              18,
                              20,
                              22,
                              isFoldable ? 20 : undefined
                            ),
                          }}
                        />
                      </Box>{' '}
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Company Info */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ mb: { xs: 2, sm: 0 } }}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                p: { xs: 3, sm: 1.5, md: 2 },
                mb: { xs: 4, sm: 0 },
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
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  color: 'var(--color-text-primary)',
                  fontSize: getResponsiveValue(
                    'clamp(1rem, 3vw, 1.125rem)', // mobile
                    'clamp(1.125rem, 2.8vw, 1.25rem)', // tablet
                    'clamp(1.25rem, 2.5vw, 1.5rem)', // desktop
                    isFoldable ? 'clamp(0.875rem, 2.8vw, 1rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Company
              </Typography>
              <Box
                component='ul'
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
                {companyInfo.map(link => (
                  <Box
                    key={link.text}
                    sx={{
                      mb: getResponsiveValue(
                        0.75,
                        1,
                        1.5,
                        isFoldable ? 1 : undefined
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
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.75rem, 2vw, 0.875rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                              sm: 'clamp(1rem, 1.8vw, 1.125rem)',
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
                          color: 'var(--color-primary)',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(163, 130, 76, 0.2)'
                            : 'none',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: '7px !important',
                        }}
                      >
                        <link.icon
                          sx={{
                            fontSize: getResponsiveValue(
                              18,
                              20,
                              22,
                              isFoldable ? 20 : undefined
                            ),
                          }}
                        />
                      </Box>{' '}
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ mb: { xs: 2, sm: 0 } }}>
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                p: { xs: 3, sm: 1.5, md: 2 },
                mb: { xs: 4, sm: 0 },
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
                  color: 'var(--color-text-primary)',
                  fontSize: getResponsiveValue(
                    'clamp(1rem, 3vw, 1.125rem)', // mobile
                    'clamp(1.125rem, 2.8vw, 1.25rem)', // tablet
                    'clamp(1.25rem, 2.5vw, 1.5rem)', // desktop
                    isFoldable ? 'clamp(0.875rem, 2.8vw, 1rem)' : undefined
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
                  {
                    icon: PhoneIcon,
                    text: '+91-1800-123-4567',
                    href: 'tel:+9118001234567',
                    label: 'Toll Free',
                  },
                  {
                    icon: PhoneIcon,
                    text: '+91-98765-43210',
                    href: 'tel:+919876543210',
                    label: 'Mobile',
                  },
                  {
                    icon: EmailIcon,
                    text: 'support@goldenbasketmart.com',
                    href: 'mailto:support@goldenbasketmart.com',
                    label: 'Support Email',
                  },
                  {
                    icon: EmailIcon,
                    text: 'info@goldenbasketmart.com',
                    href: 'mailto:info@goldenbasketmart.com',
                    label: 'General Inquiries',
                  },
                  {
                    icon: LocationOnIcon,
                    text: 'Jaipur, Rajasthan, India',
                    href: 'https://maps.app.goo.gl/1234567890',
                    label: 'Head Office',
                  },
                  {
                    icon: AccessTimeIcon,
                    text: 'Mon-Sat: 9:00 AM - 8:00 PM IST',
                    href: '#',
                    label: 'Business Hours',
                  },
                ].map(item => (
                  <Box
                    key={item.text}
                    sx={{
                      mb: getResponsiveValue(
                        0.75,
                        1,
                        1.5,
                        isFoldable ? 1 : undefined
                      ),
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: isFoldable ? 'translateX(4px)' : 'none',
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      sx={{
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        fontSize: isFoldable
                          ? 'clamp(0.75rem, 2vw, 0.875rem)'
                          : {
                              xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                              sm: 'clamp(1rem, 1.8vw, 1.125rem)',
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
                          color: 'var(--color-primary)',
                          textShadow: isFoldable
                            ? '0 0 8px rgba(163, 130, 76, 0.2)'
                            : 'none',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: '7px !important',
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
                          }}
                        />
                      </Box>{' '}
                      {item.text}
                    </Link>
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
                      {React.createElement(social.icon, {
                        sx: {
                          fontSize: getResponsiveValue(
                            18,
                            20,
                            22,
                            isFoldable ? 20 : undefined
                          ),
                        },
                      })}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ mb: { xs: 2, sm: 0 } }}>
            <Box
              sx={{
                p: { xs: 3, sm: 1.5, md: 2 },
                mb: { xs: 4, sm: 0 },
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
                  mb: getResponsiveValue(
                    1.5,
                    2,
                    2.5,
                    isFoldable ? 2 : undefined
                  ),
                  color: 'var(--color-text-primary)',
                  fontSize: getResponsiveValue(
                    'clamp(1rem, 3vw, 1.125rem)', // mobile
                    'clamp(1.125rem, 2.8vw, 1.25rem)', // tablet
                    'clamp(1.25rem, 2.5vw, 1.5rem)', // desktop
                    isFoldable ? 'clamp(0.875rem, 2.8vw, 1rem)' : undefined
                  ),
                  transition: 'color 0.2s ease',
                  lineHeight: 1.2,
                }}
              >
                Newsletter
              </Typography>
              <Box
                component='form'
                onSubmit={handleNewsletterSubmit}
                sx={{
                  mb: getResponsiveValue(
                    2,
                    2.5,
                    3,
                    isFoldable ? 2.5 : undefined
                  ),
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
                    type='email'
                    placeholder='Enter your email'
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    size='small'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'var(--color-primary-light)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(163, 130, 76, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(163, 130, 76, 0.5)',
                        },
                        '&.Mui-focused': {
                          borderColor: 'var(--color-primary-light)',
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: 'var(--color-primary-muted)',
                        opacity: 0.7,
                      },
                    }}
                  />
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={newsletterLoading || !newsletterEmail.trim()}
                    sx={{
                      background:
                        'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      '&:hover': {
                        background:
                          'linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background:
                          'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
                        color: '#999',
                        borderColor: '#ccc',
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Business Hours Section */}
        <Box
          sx={{
            mt: { xs: 4, sm: 3, md: 5 },
            p: { xs: 3, sm: 2, md: 3 },
            mx: { xs: 2, sm: 3, md: 4 },
            background:
              'linear-gradient(135deg, rgba(163, 130, 76, 0.08) 0%, rgba(230, 216, 151, 0.03) 100%)',
            borderRadius: { xs: 2, sm: 2, md: 3 },
            border: '1px solid rgba(163, 130, 76, 0.15)',
          }}
        >
          <Grid
            container
            spacing={getResponsiveValue(1.5, 2, 3, isFoldable ? 2 : undefined)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              alignContent: 'center',
              gap: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.5 : undefined),
              p: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.5 : undefined),
            }}
          >
            <Grid
              size={{ xs: 12, sm: 4 }}
              style={{
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 1.5, sm: 1, md: 1.5 },
                  transition: 'all 0.2s ease',
                  p: { xs: 3, sm: 1.5, md: 2 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: 2, sm: 1.5, md: 2 },
                  background: 'rgba(163, 130, 76, 0.03)',
                  border: '1px solid rgba(163, 130, 76, 0.08)',
                  height: '100%',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'translateY(-2px)',
                    background: 'rgba(163, 130, 76, 0.05)',
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
                    color: 'var(--color-primary)',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'var(--color-primary-muted)',
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      fontSize: isFoldable
                        ? 'clamp(0.875rem, 2.2vw, 1rem)'
                        : {
                            xs: 'clamp(1rem, 2.5vw, 1.125rem)',
                            sm: 'clamp(1.125rem, 2.2vw, 1.25rem)',
                          },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    Mon - Sat: 7:00 AM - 10:00 PM
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'var(--color-text-secondary)',
                      fontSize: isFoldable
                        ? 'clamp(0.75rem, 2vw, 0.875rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                            sm: 'clamp(1rem, 1.8vw, 1.125rem)',
                          },
                      lineHeight: 1.3,
                    }}
                  >
                    Sunday: 8:00 AM - 9:00 PM
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 4 }}
              style={{
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 1.5, sm: 1, md: 1.5 },
                  transition: 'all 0.2s ease',
                  p: { xs: 3, sm: 1.5, md: 2 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: 2, sm: 1.5, md: 2 },
                  background: 'rgba(163, 130, 76, 0.03)',
                  border: '1px solid rgba(163, 130, 76, 0.08)',
                  height: '100%',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'translateY(-2px)',
                    background: 'rgba(163, 130, 76, 0.05)',
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
                    color: 'var(--color-primary)',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'var(--color-primary-muted)',
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      fontSize: isFoldable
                        ? 'clamp(0.875rem, 2.2vw, 1rem)'
                        : {
                            xs: 'clamp(1rem, 2.5vw, 1.125rem)',
                            sm: 'clamp(1.125rem, 2.2vw, 1.25rem)',
                          },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    24/7 Online Ordering
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'var(--color-text-secondary)',
                      fontSize: isFoldable
                        ? 'clamp(0.75rem, 2vw, 0.875rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                            sm: 'clamp(1rem, 1.8vw, 1.125rem)',
                          },
                      lineHeight: 1.3,
                    }}
                  >
                    Same Day Delivery Available
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 4 }}
              style={{
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 1.5, sm: 1, md: 1.5 },
                  transition: 'all 0.2s ease',
                  p: { xs: 3, sm: 1.5, md: 2 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: 2, sm: 1.5, md: 2 },
                  background: 'rgba(163, 130, 76, 0.03)',
                  border: '1px solid rgba(163, 130, 76, 0.08)',
                  height: '100%',
                  '&:hover': {
                    transform: isFoldable ? 'scale(1.02)' : 'translateY(-2px)',
                    background: 'rgba(163, 130, 76, 0.05)',
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
                    color: 'var(--color-primary)',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'var(--color-primary-muted)',
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      fontSize: isFoldable
                        ? 'clamp(0.875rem, 2.2vw, 1rem)'
                        : {
                            xs: 'clamp(1rem, 2.5vw, 1.125rem)',
                            sm: 'clamp(1.125rem, 2.2vw, 1.25rem)',
                          },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    Customer Support
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'var(--color-text-secondary)',
                      fontSize: isFoldable
                        ? 'clamp(0.75rem, 2vw, 0.875rem)'
                        : {
                            xs: 'clamp(0.875rem, 2.2vw, 1rem)',
                            sm: 'clamp(1rem, 1.8vw, 1.125rem)',
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

        {/* Support & Contact Section */}
        <Box
          sx={{
            borderTop: '1px solid rgba(163, 130, 76, 0.2)',
            mt: { xs: 4, sm: 3, md: 4 },
            pt: { xs: 3, sm: 2, md: 3 },
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              mb: 2,
              fontSize: getResponsiveValue(
                'clamp(1.125rem, 3vw, 1.25rem)',
                'clamp(1.25rem, 2.8vw, 1.375rem)',
                'clamp(1.375rem, 2.5vw, 1.5rem)',
                isFoldable ? 'clamp(1rem, 2.8vw, 1.125rem)' : undefined
              ),
            }}
          >
            📞 Need Help? We're Here for You!
          </Typography>

          <Grid container spacing={2} justifyContent='center'>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant='subtitle2' color='primary' gutterBottom>
                  🆘 Emergency Support
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Available 24/7 for critical issues
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{ mt: 1 }}
                  onClick={() => window.open('tel:+919876543210', '_blank')}
                >
                  Call Now
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant='subtitle2' color='primary' gutterBottom>
                  💬 WhatsApp Support
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Quick responses via WhatsApp
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.open('https://wa.me/919876543210', '_blank')
                  }
                >
                  Chat Now
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant='subtitle2' color='primary' gutterBottom>
                  📧 Email Support
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Detailed support via email
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.open('mailto:support@goldenbasketmart.com', '_blank')
                  }
                >
                  Send Email
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant='subtitle2' color='primary' gutterBottom>
                  📍 Visit Us
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Drop by our store anytime
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.open('https://maps.app.goo.gl/1234567890', '_blank')
                  }
                >
                  Get Directions
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: '1px solid var(--color-primary)',
            mt: { xs: 4, sm: 3, md: 5 },
            pt: { xs: 3, sm: 2, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              p: { xs: 3, sm: 1.5, md: 2 },
              color: 'var(--color-text-secondary)',
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
