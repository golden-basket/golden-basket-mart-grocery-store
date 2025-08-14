import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  ListItemAvatar,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../hooks/useAuth';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCart } from '../hooks/useCart';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import ImageWithFallback from './ImageWithFallback';
import { useState } from 'react';
import logo from '../assets/golden-basket-rounded.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cart } = useCart();
  const {
    isMobile,
    isTablet,
    isFoldable,
    isUltraWide,
    isExtraSmall,
    isSmall,
    getFoldableClasses,
    getResponsiveButtonSize,
    getResponsiveTextClasses,
  } = useFoldableDisplay();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  // Calculate cart item count
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/catalogue', label: 'Catalogue', icon: <InventoryIcon /> },
  ];

  const authLinks = [
    { to: '/login', label: 'Login', icon: <LoginIcon /> },
    { to: '/register', label: 'Register', icon: <PersonAddAltIcon /> },
  ];

  // User-specific links for mobile drawer (desktop uses Profile dropdown)
  const userLinks = [
    { to: '/profile', label: 'Profile', icon: <PersonIcon /> },
    { to: '/orders', label: 'Orders', icon: <LocalOfferIcon /> },
    { to: '/addresses', label: 'Addresses', icon: <EmojiNatureIcon /> },
  ];

  const isActive = (path) => location.pathname === path;

  const navButtonSx = (active) => ({
    fontWeight: 700,
    borderBottom: active
      ? '4px solid var(--color-primary-light)'
      : '4px solid transparent',
    textTransform: 'none',
    minHeight: isFoldable ? '44px' : { xs: '48px', md: '40px' },
    fontSize: isFoldable ? '0.75rem' : { xs: '0.75rem', md: '0.875rem' },
    px: isFoldable ? 1.5 : { xs: 1, md: 1.5 },
    borderRadius: isFoldable ? 2 : 1,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#ffffff',
      background:
        'linear-gradient(90deg, #8B7355 0%, #A0522D 50%, #8B4513 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(139, 69, 19, 0.3)',
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) {
      setMobileOpen(false);
    }
    setProfileMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const profileMenuOpen = Boolean(profileMenuAnchor);

  const drawer = (
    <Box
      sx={{
        width: isUltraWide ? 400 : { xs: 280, sm: 320 },
        pt: isUltraWide ? 4 : { xs: 2, sm: 3 },
        height: '100%',
      }}
    >
      {/* User Profile Section for Mobile */}
      {user && (
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            mb: { xs: 2, sm: 3 },
            mx: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            background:
              'linear-gradient(135deg, rgba(163, 130, 76, 0.1) 0%, rgba(210, 180, 140, 0.15) 100%)',
            border: '1px solid rgba(163, 130, 76, 0.2)',
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                fontWeight: 700,
                fontSize: 14,
                width: 48,
                height: 48,
                background:
                  'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                border: '2px solid #e6d897',
                boxShadow: '0 4px 12px rgba(163, 130, 76, 0.25)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(163, 130, 76, 0.35)',
                  background:
                    'linear-gradient(135deg, #866422 0%, #a3824c 50%, #b59961 100%)',
                },
              }}
            >
              {user.firstName.charAt(0) + user.lastName.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  color: 'var(--color-primary-dark)',
                  lineHeight: 1.2,
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography
                sx={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: 'var(--color-primary-darker)',
                  opacity: 0.8,
                  fontWeight: 400,
                }}
              >
                {user.email}
              </Typography>
              {user.role === 'admin' && (
                <Typography
                  sx={{
                    fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                    color: 'var(--color-primary)',
                    fontWeight: 500,
                    mt: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Administrator
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Divider after user profile section */}
      {user && (
        <Divider
          sx={{
            mb: { xs: 2, sm: 3 },
            borderColor: 'var(--color-primary-light)',
            opacity: 0.6,
          }}
        />
      )}

      <List sx={{ px: { xs: 1, sm: 1.5 } }}>
        {navLinks.map((link) => (
          <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(link.to)}
              selected={isActive(link.to)}
              sx={{
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                mx: { xs: 0.25, sm: 0.5 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(163, 130, 76, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(163, 130, 76, 0.15)',
                  borderLeft: '4px solid var(--color-primary)',
                  boxShadow: '0 2px 8px rgba(163,130,76,0.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive(link.to) ? '#2F1B14' : '#4A3728',
                  transition: 'color 0.3s ease',
                }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontWeight: isActive(link.to) ? 500 : 400,
                  fontSize: {
                    xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                    sm: 'clamp(0.875rem, 1.5vw, 1rem)',
                  },
                  color: isActive(link.to)
                    ? 'var(--color-primary-dark)'
                    : 'var(--color-primary-darker)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Auth Links for non-authenticated users */}
        {!user &&
          authLinks.map((link) => (
            <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(link.to)}
                selected={isActive(link.to)}
                sx={{
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 1.5, sm: 2 },
                  borderRadius: 1.5,
                  mx: { xs: 0.25, sm: 0.5 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(163, 130, 76, 0.08)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(163, 130, 76, 0.15)',
                    borderLeft: '4px solid var(--color-primary)',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.12)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive(link.to) ? '#2F1B14' : '#4A3728',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(link.to) ? 500 : 400,
                    fontSize: {
                      xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                      sm: 'clamp(0.875rem, 1.5vw, 1rem)',
                    },
                    color: isActive(link.to)
                      ? 'var(--color-primary-dark)'
                      : 'var(--color-primary-darker)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

        {user && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation('/cart')}
              selected={isActive('/cart')}
              sx={{
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                mx: { xs: 0.25, sm: 0.5 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(163, 130, 76, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(163, 130, 76, 0.15)',
                  borderLeft: '4px solid var(--color-primary)',
                  boxShadow: '0 2px 8px rgba(163,130,76,0.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive('/cart') ? '#2F1B14' : '#4A3728',
                  transition: 'color 0.3s ease',
                }}
              >
                {cartItemCount > 0 ? (
                  <Badge badgeContent={cartItemCount} color="error" max={99}>
                    <LocalGroceryStoreIcon />
                  </Badge>
                ) : (
                  <LocalGroceryStoreIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Cart"
                primaryTypographyProps={{
                  fontWeight: isActive('/cart') ? 500 : 400,
                  fontSize: {
                    xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                    sm: 'clamp(0.875rem, 1.5vw, 1rem)',
                  },
                  color: isActive('/cart')
                    ? 'var(--color-primary-dark)'
                    : 'var(--color-primary-darker)',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* User-specific links - kept in mobile drawer for easy access */}
        {user &&
          userLinks.map((link) => (
            <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(link.to)}
                selected={isActive(link.to)}
                sx={{
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 1.5, sm: 2 },
                  borderRadius: 1.5,
                  mx: { xs: 0.25, sm: 0.5 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(163, 130, 76, 0.08)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(163, 130, 76, 0.15)',
                    borderLeft: '4px solid var(--color-primary)',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.12)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive(link.to)
                      ? 'var(--color-primary-dark)'
                      : 'var(--color-primary)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(link.to) ? 500 : 400,
                    fontSize: {
                      xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                      sm: 'clamp(0.875rem, 1.5vw, 1rem)',
                    },
                    color: isActive(link.to)
                      ? 'var(--color-primary-dark)'
                      : 'var(--color-primary-darker)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

        {user && user.role === 'admin' && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation('/admin')}
              selected={isActive('/admin')}
              sx={{
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                mx: { xs: 0.25, sm: 0.5 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(163, 130, 76, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(163, 130, 76, 0.15)',
                  borderLeft: '4px solid var(--color-primary)',
                  boxShadow: '0 2px 8px rgba(163,130,76,0.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive('/admin')
                    ? 'var(--color-primary-dark)'
                    : 'var(--color-primary)',
                  transition: 'color 0.3s ease',
                }}
              >
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText
                primary="Admin"
                primaryTypographyProps={{
                  fontWeight: isActive('/admin') ? 500 : 400,
                  fontSize: {
                    xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                    sm: 'clamp(0.875rem, 1.5vw, 1rem)',
                  },
                  color: isActive('/admin')
                    ? 'var(--color-primary-dark)'
                    : 'var(--color-primary-darker)',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {user && (
          <>
            <Divider
              sx={{
                my: { xs: 2, sm: 3 },
                borderColor: 'var(--color-primary-light)',
                opacity: 0.6,
              }}
            />
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 1.5, sm: 2 },
                  borderRadius: 1.5,
                  mx: { xs: 0.25, sm: 0.5 },
                  color: 'var(--color-error)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: 'var(--color-error)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontWeight: 400,
                    fontSize: {
                      xs: 'clamp(0.75rem, 2vw, 0.875rem)',
                      sm: 'clamp(0.875rem, 1.5vw, 1rem)',
                    },
                    color: 'var(--color-error)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        className={`${getFoldableClasses()}}`}
        elevation={1}
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          boxShadow: 4,
          mx: 'auto',
          borderRadius: '0 0 0.25rem 0.25rem',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '64px', md: '56px' },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {!isMobile &&
              !isTablet &&
              !isExtraSmall &&
              !isSmall &&
              !isFoldable && (
                <ImageWithFallback
                  src={logo}
                  alt="Golden Basket Mart"
                  fallbackText="Golden Basket"
                  sx={{
                    height: isFoldable
                      ? 50
                      : isMobile
                      ? 40
                      : isTablet
                      ? 44
                      : 48,
                    width: 'auto',
                    marginRight: isFoldable
                      ? 1.5
                      : isMobile
                      ? 1
                      : isTablet
                      ? 1.5
                      : 2,
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              className={getResponsiveTextClasses()}
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                textShadow: '1px 1px 4px #00000055',
                background:
                  'linear-gradient(90deg, #5d4509 0%, #7a5f35 50%, #453306 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'inline-block' },
                fontSize: {
                  xs: 'clamp(1rem, 3.5vw, 1.25rem)',
                  sm: 'clamp(1.25rem, 3vw, 1.5rem)',
                  md: 'clamp(1.5rem, 2.5vw, 1.75rem)',
                },
              }}
            >
              Golden Basket Mart
            </Typography>
            {isMobile && (
              <Typography
                variant="h6"
                className={getResponsiveTextClasses()}
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  textShadow: '1px 1px 4px #00000055',
                  background:
                    'linear-gradient(90deg, #5d4509 0%, #7a5f35 50%, #453306 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: {
                    xs: 'clamp(1rem, 3.5vw, 1.25rem)',
                    sm: 'clamp(1.125rem, 3vw, 1.375rem)',
                  },
                }}
              >
                Golden Basket
              </Typography>
            )}
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box display="flex" gap={1} alignItems="center">
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  color="inherit"
                  component={Link}
                  to={link.to}
                  startIcon={link.icon}
                  className={getResponsiveButtonSize()}
                  sx={navButtonSx(isActive(link.to))}
                >
                  {link.label}
                </Button>
              ))}

              {user && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/cart"
                  startIcon={
                    cartItemCount > 0 ? (
                      <Badge
                        badgeContent={cartItemCount}
                        color="error"
                        max={99}
                      >
                        <LocalGroceryStoreIcon />
                      </Badge>
                    ) : (
                      <LocalGroceryStoreIcon />
                    )
                  }
                  className={getResponsiveButtonSize()}
                  sx={{ ...navButtonSx(isActive('/cart')) }}
                >
                  Cart
                </Button>
              )}

              {/* Profile Menu */}
              {user ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      p: 0.5,
                      ml: 1,
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'var(--color-primary-light)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        width: isFoldable ? 32 : { xs: 36, sm: 40 },
                        height: isFoldable ? 32 : { xs: 36, sm: 40 },
                        background:
                          'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                        border: '2px solid #e6d897',
                        boxShadow: '0 3px 8px rgba(163, 130, 76, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(163, 130, 76, 0.3)',
                          background:
                            'linear-gradient(135deg, #866422 0%, #a3824c 50%, #b59961 100%)',
                        },
                      }}
                    >
                      {user.firstName.charAt(0) + user.lastName.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={profileMenuOpen}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        background:
                          'linear-gradient(135deg, #FFF8DC 0%, #F5F5DC 50%, #FAF0E6 100%)',
                        border: '2px solid #D2B48C',
                        boxShadow: '0 12px 40px rgba(210, 180, 140, 0.25)',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => handleNavigation('/profile')}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(210, 180, 140, 0.15)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Box
                          sx={{
                            p: 0.5,
                            ml: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              fontWeight: 700,
                              fontSize: 12,
                              width: isFoldable ? 32 : { xs: 36, sm: 40 },
                              height: isFoldable ? 32 : { xs: 36, sm: 40 },
                              background:
                                'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                              border: '2px solid #e6d897',
                              boxShadow: '0 3px 8px rgba(163, 130, 76, 0.2)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(163, 130, 76, 0.3)',
                                background:
                                  'linear-gradient(135deg, #866422 0%, #a3824c 50%, #b59961 100%)',
                              },
                            }}
                          >
                            {user.firstName.charAt(0) + user.lastName.charAt(0)}
                          </Avatar>
                        </Box>
                      </ListItemAvatar>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: '#2F1B14',
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6B4423',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <Divider
                      sx={{ my: 1, borderColor: 'var(--color-primary-light)' }}
                    />
                    <MenuItem
                      onClick={() => handleNavigation('/orders')}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(210, 180, 140, 0.15)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocalOfferIcon sx={{ color: '#4A3728' }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 400 }}>Orders</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleNavigation('/addresses')}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(210, 180, 140, 0.15)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <EmojiNatureIcon sx={{ color: '#4A3728' }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 400 }}>
                        Addresses
                      </Typography>
                    </MenuItem>
                    {user.role === 'admin' && (
                      <MenuItem
                        onClick={() => handleNavigation('/admin')}
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(210, 180, 140, 0.15)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <InventoryIcon sx={{ color: '#4A3728' }} />
                        </ListItemIcon>
                        <Typography sx={{ fontWeight: 400 }}>
                          Admin Panel
                        </Typography>
                      </MenuItem>
                    )}
                    <Divider
                      sx={{ my: 1, borderColor: 'var(--color-primary-light)' }}
                    />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2,
                        color: 'var(--color-error)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LogoutIcon sx={{ color: 'var(--color-error)' }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 400 }}>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box display="flex" gap={1}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    className={getResponsiveButtonSize()}
                    sx={{ ...navButtonSx(false) }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/register"
                    startIcon={<PersonAddAltIcon />}
                    className={getResponsiveButtonSize()}
                    sx={{ ...navButtonSx(false) }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={getResponsiveButtonSize()}
              sx={{
                ml: 'auto',
                minWidth: '48px',
                minHeight: '48px',
                color: '#2F1B14',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className={getFoldableClasses()}
        sx={{
          display: isTablet ? 'block' : 'none',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isUltraWide ? 400 : isFoldable ? 300 : 280,
            backgroundColor: 'var(--color-cream-light)',
            border: 'none',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <>
          {/* Close Button for Mobile Sidebar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                color: 'var(--color-primary-darker)',
                width: { xs: 28, sm: 30 },
                height: { xs: 28, sm: 30 },
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          </Box>
          {drawer}
        </>
      </Drawer>
    </>
  );
};

export default Navbar;
