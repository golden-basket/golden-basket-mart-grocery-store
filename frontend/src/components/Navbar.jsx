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
import { useAuth } from '../hooks/useAuth';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useCart } from '../hooks/useCart';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import { useState } from 'react';

const stringToColor = (str) => {
  let hash = 0;
  let i;

  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `0F0${value.toString(16)}`.slice(-2);
  }

  return color;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cart } = useCart();
  const { isMobile, isTablet, isFoldable, isUltraWide, getFoldableClasses } =
    useFoldableDisplay();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  // Calculate cart item count
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

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
    { to: '/orders', label: 'Orders', icon: <LocalOfferIcon /> },
    { to: '/addresses', label: 'Addresses', icon: <EmojiNatureIcon /> },
  ];

  const isActive = (path) => location.pathname === path;

  const navButtonSx = (active) => ({
    fontWeight: 400, // Reduced from 600
    borderBottom: active
      ? '4px solid var(--color-primary-light)'
      : '4px solid transparent',
    textTransform: 'none',
    minHeight: isFoldable ? '44px' : { xs: '48px', md: '40px' },
    fontSize: isFoldable ? '0.875rem' : { xs: '0.875rem', md: '0.9rem' },
    px: isFoldable ? 1.5 : { xs: 1, md: 1.5 },
    borderRadius: isFoldable ? 2 : 1,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#000',
      background:
        'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary-medium) 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(163, 130, 76, 0.2)',
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
        background:
          'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
        height: '100%',
        borderRight: '2px solid var(--color-primary-light)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <img
          src="/golden-basket-rounded.png"
          alt="Golden Basket Mart"
          style={{
            width: 50,
            height: 50,
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
        <Typography
          sx={{
            fontWeight: 500, // Reduced from 700
            ml: 1.5,
            background:
              'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary-medium) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: {
              xs: 'clamp(1.25rem, 4vw, 1.5rem)',
              sm: 'clamp(1.5rem, 3.5vw, 1.75rem)',
            },
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(163,130,76,0.08)',
          }}
        >
          Golden Basket
        </Typography>
      </Box>
      <Divider
        sx={{
          mb: { xs: 2, sm: 3 },
          borderColor: 'var(--color-primary-light)',
          opacity: 0.6,
        }}
      />

      <List sx={{ px: { xs: 1, sm: 1.5 } }}>
        {navLinks.map((link) => (
          <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(link.to)}
              selected={isActive(link.to)}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                mx: { xs: 0.5, sm: 1 },
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
                  minWidth: 44,
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
                  fontWeight: isActive(link.to) ? 500 : 400, // Reduced from 600/500
                  fontSize: {
                    xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                    sm: 'clamp(1rem, 2vw, 1.125rem)',
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
        {!user && authLinks.map((link) => (
          <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(link.to)}
              selected={isActive(link.to)}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                mx: { xs: 0.5, sm: 1 },
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
                  minWidth: 44,
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
                  fontWeight: isActive(link.to) ? 500 : 400, // Reduced from 600/500
                  fontSize: {
                    xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                    sm: 'clamp(1rem, 2vw, 1.125rem)',
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
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                mx: { xs: 0.5, sm: 1 },
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
                  minWidth: 44,
                  color: isActive('/cart')
                    ? 'var(--color-primary-dark)'
                    : 'var(--color-primary)',
                  transition: 'color 0.3s ease',
                }}
              >
                <Badge badgeContent={cartItemCount} color="error" max={99}>
                  <LocalGroceryStoreIcon />
                </Badge>
              </ListItemIcon>
                              <ListItemText
                  primary="Cart"
                  primaryTypographyProps={{
                    fontWeight: isActive('/cart') ? 500 : 400, // Reduced from 600/500
                    fontSize: {
                      xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                      sm: 'clamp(1rem, 2vw, 1.125rem)',
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
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  mx: { xs: 0.5, sm: 1 },
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
                    minWidth: 44,
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
                    fontWeight: isActive(link.to) ? 500 : 400, // Reduced from 600/500
                    fontSize: {
                      xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                      sm: 'clamp(1rem, 2vw, 1.125rem)',
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
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                mx: { xs: 0.5, sm: 1 },
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
                  minWidth: 44,
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
                    fontWeight: isActive('/admin') ? 500 : 400, // Reduced from 600/500
                    fontSize: {
                      xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                      sm: 'clamp(1rem, 2vw, 1.125rem)',
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
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  mx: { xs: 0.5, sm: 1 },
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
                    minWidth: 44,
                    color: 'var(--color-error)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontWeight: 400, // Reduced from 500
                    fontSize: {
                      xs: 'clamp(0.875rem, 2.5vw, 1rem)',
                      sm: 'clamp(1rem, 2vw, 1.125rem)',
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
        className={getFoldableClasses()}
        sx={{
          background:
            'linear-gradient(90deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
          boxShadow: 4,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '64px', md: '56px' },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src="/golden-basket-rounded.png"
              alt="Golden Basket Mart"
              style={{
                width: 50,
                height: 50,
                objectFit: 'contain',
                borderRadius: '10px',
              }}
            />
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 500, // Reduced from 700
                letterSpacing: 1,
                textShadow: '1px 1px 4px #00000055',
                background:
                  'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary-medium) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'inline-block' },
              }}
            >
              Golden Basket Mart
            </Typography>
            {isMobile && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500, // Reduced from 700
                  letterSpacing: 1,
                  textShadow: '1px 1px 4px #00000055',
                  background:
                    'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary-medium) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
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
                    <Badge badgeContent={cartItemCount} color="error" max={99}>
                      <LocalGroceryStoreIcon />
                    </Badge>
                  }
                  sx={{ ...navButtonSx(isActive('/cart')) }}
                >
                  Cart
                </Button>
              )}

              {/* User-specific navigation items moved to Profile dropdown */}

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
                        fontWeight: 500, // Reduced from 600
                        fontSize: 12,
                        width: 32,
                        height: 32,
                        background: stringToColor(
                          user.firstName + ' ' + user.lastName
                        ),
                        cursor: 'pointer',
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
                        background: 'var(--color-cream-light)',
                        border: '1px solid var(--color-primary-light)',
                        boxShadow: '0 8px 32px rgba(163, 130, 76, 0.15)',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => handleNavigation('/profile')}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(163, 130, 76, 0.08)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            background: stringToColor(
                              user.firstName + ' ' + user.lastName
                            ),
                          }}
                        >
                          {user.firstName.charAt(0) + user.lastName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--color-primary-darker)',
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'var(--color-primary-medium)',
                            fontSize: '0.75rem',
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <Divider sx={{ my: 1, borderColor: 'var(--color-primary-light)' }} />
                    <MenuItem
                      onClick={() => handleNavigation('/orders')}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(163, 130, 76, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocalOfferIcon sx={{ color: 'var(--color-primary)' }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 400 }}>Orders</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleNavigation('/addresses')}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(163, 130, 76, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <EmojiNatureIcon sx={{ color: 'var(--color-primary)' }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 400 }}>Addresses</Typography>
                    </MenuItem>
                    {user.role === 'admin' && (
                      <MenuItem
                        onClick={() => handleNavigation('/admin')}
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(163, 130, 76, 0.08)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <InventoryIcon sx={{ color: 'var(--color-primary)' }} />
                        </ListItemIcon>
                        <Typography sx={{ fontWeight: 400 }}>Admin Panel</Typography>
                      </MenuItem>
                    )}
                    <Divider sx={{ my: 1, borderColor: 'var(--color-primary-light)' }} />
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
                    sx={{ ...navButtonSx(false) }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/register"
                    startIcon={<PersonAddAltIcon />}
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
              sx={{
                ml: 'auto',
                minWidth: '48px',
                minHeight: '48px',
                color: 'var(--color-primary-light)',
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
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
