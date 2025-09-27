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
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../hooks/useAuth';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';
import RoleBasedUI from './RoleBasedUI';
import { useToastNotifications } from '../hooks/useToast';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cart } = useCart();
  const { showSuccess } = useToastNotifications();
  const { toggleTheme } = useThemeContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  // Calculate cart item count
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  // Navigation links
  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/catalogue', label: 'Catalogue', icon: <InventoryIcon /> },
    { to: '/cart', label: 'Cart', icon: <LocalGroceryStoreIcon /> },
  ];

  // Admin navigation links
  const adminLinks = [
    { to: '/admin', label: 'Admin', icon: <AdminPanelSettingsIcon /> },
  ];

  // Authentication links
  const authLinks = [
    { to: '/login', label: 'Login', icon: <LoginIcon /> },
    { to: '/register', label: 'Register', icon: <PersonAddAltIcon /> },
  ];

  // User profile links
  const userLinks = [
    { to: '/profile', label: 'Profile', icon: <PersonIcon /> },
    { to: '/orders', label: 'Orders', icon: <LocalOfferIcon /> },
    { to: '/addresses', label: 'Addresses', icon: <EmojiNatureIcon /> },
  ];

  const isActive = path => location.pathname === path;

  const navButtonSx = active => ({
    fontWeight: 600,
    borderBottom: active
      ? `2px solid ${theme.palette.primary.contrastText}`
      : '2px solid transparent',
    textTransform: 'none',
    minHeight: { xs: '48px', md: '40px' },
    fontSize: { xs: '0.75rem', md: '0.875rem' },
    px: { xs: 1, md: 1.5 },
    borderRadius: 0,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.contrastText}15`,
      borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
    },
  });

  // Event handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = event => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    showSuccess('Logged out successfully!');
    navigate('/');
  };

  const handleNavigation = path => {
    if (isMobile) {
      setMobileOpen(false);
    }
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <AppBar
        position='sticky'
        sx={{
          background: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: '64px', md: '56px' },
            px: { xs: 1, md: 2 },
          }}
        >
          {/* Logo */}
          <Logo onClick={handleLogoClick} size='default' variant='navbar' />

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              flex: 1,
            }}
          >
            {navLinks.map(link => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                onClick={() => handleNavigation(link.to)}
                sx={{
                  ...navButtonSx(isActive(link.to)),
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                {link.to === '/cart' ? (
                  <Badge badgeContent={cartItemCount} color='error'>
                    {link.icon}
                  </Badge>
                ) : (
                  link.icon
                )}
                <Typography
                  sx={{
                    ml: 0.5,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  }}
                >
                  {link.label}
                </Typography>
              </Button>
            ))}

            {/* Admin Navigation Links */}
            <RoleBasedUI adminOnly fallback={null}>
              {adminLinks.map(link => (
                <Button
                  key={link.to}
                  component={Link}
                  to={link.to}
                  onClick={() => handleNavigation(link.to)}
                  sx={{
                    ...navButtonSx(isActive(link.to)),
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  {link.icon}
                  <Typography
                    sx={{
                      ml: 0.5,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Button>
              ))}
            </RoleBasedUI>
          </Box>

          {/* Right Side Actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ml: 'auto',
            }}
          >
            {/* Dark Mode Toggle - Desktop Only */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <DarkModeToggle />
            </Box>

            {/* User Menu / Auth Links - Desktop Only */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {user ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.contrastText}15`,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: '36px',
                        height: '36px',
                        bgcolor: `${theme.palette.primary.contrastText}20`,
                        color: theme.palette.primary.contrastText,
                        fontSize: '0.875rem',
                      }}
                    >
                      {user.firstName?.charAt(0)?.toUpperCase() +
                        user.lastName?.charAt(0)?.toUpperCase() || (
                        <PersonIcon />
                      )}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1,
                          minWidth: 200,
                          borderRadius: 2,
                          boxShadow: `0 8px 32px ${theme.palette.common.black}20`,
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        handleNavigation('/profile');
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        handleNavigation('/orders');
                      }}
                    >
                      <ListItemIcon>
                        <LocalOfferIcon />
                      </ListItemIcon>
                      Orders
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        handleNavigation('/addresses');
                      }}
                    >
                      <ListItemIcon>
                        <EmojiNatureIcon />
                      </ListItemIcon>
                      Addresses
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {authLinks.map(link => (
                    <Button
                      key={link.to}
                      component={Link}
                      to={link.to}
                      onClick={() => handleNavigation(link.to)}
                      variant='outlined'
                      sx={{
                        color: theme.palette.primary.contrastText,
                        borderColor: `${theme.palette.primary.contrastText}60`,
                        borderRadius: 1.5,
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: theme.palette.primary.contrastText,
                          backgroundColor: `${theme.palette.primary.contrastText}15`,
                        },
                      }}
                    >
                      {link.icon}
                      <Typography
                        sx={{
                          ml: 0.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: 'block', md: 'none' },
                color: theme.palette.primary.contrastText,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.contrastText}15`,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant='temporary'
        anchor='right'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 8px 32px ${theme.palette.common.black}20`,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant='h6' fontWeight={600}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {/* Navigation Links */}
            {navLinks.map(link => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.to}
                  onClick={() => handleNavigation(link.to)}
                  selected={isActive(link.to)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {link.to === '/cart' ? (
                      <Badge badgeContent={cartItemCount} color='error'>
                        {link.icon}
                      </Badge>
                    ) : (
                      link.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Dark Mode Toggle */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={toggleTheme}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  <DarkModeToggle />

                  <ListItemText
                    sx={{
                      ml: 1.25,
                    }}
                    primary={`${theme.palette.mode.charAt(0).toUpperCase() + theme.palette.mode.slice(1)} Mode`}
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            {/* Admin Navigation Links */}
            <RoleBasedUI adminOnly fallback={null}>
              <Divider sx={{ my: 2 }} />
              <ListItem>
                <Typography
                  variant='subtitle2'
                  sx={{ color: theme.palette.text.secondary, px: 2, mb: 1 }}
                >
                  Administration
                </Typography>
              </ListItem>
              {adminLinks.map(link => (
                <ListItem key={link.to} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={link.to}
                    onClick={() => handleNavigation(link.to)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: theme.palette.primary.main,
                        minWidth: 40,
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
            </RoleBasedUI>

            <Divider sx={{ my: 2 }} />

            {/* Auth Links */}
            {!user ? (
              authLinks.map(link => (
                <ListItem key={link.to} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={link.to}
                    onClick={() => handleNavigation(link.to)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: theme.palette.primary.main,
                        minWidth: 40,
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <>
                {/* User Info */}
                <ListItem sx={{ mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name || 'User'}
                    secondary={user.email}
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
                </ListItem>

                {/* User Links */}
                {userLinks.map(link => (
                  <ListItem key={link.to} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={link.to}
                      onClick={() => handleNavigation(link.to)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: theme.palette.primary.main,
                          minWidth: 40,
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  </ListItem>
                ))}

                <Divider sx={{ my: 2 }} />

                {/* Logout */}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.contrastText,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'inherit',
                        minWidth: 40,
                      }}
                    >
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary='Logout' />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
