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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ReportIcon from '@mui/icons-material/Report';
import { useAuth } from '../hooks/useAuth';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCart } from '../hooks/useCart';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import { useThemeContext } from '../hooks/useTheme';
import Logo from './Logo';
import RoleBasedUI from './RoleBasedUI';
import { useToastNotifications } from '../hooks/useToast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cart } = useCart();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { isMobile, isFoldable } = useFoldableDisplay();
  const { showSuccess } = useToastNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  // Calculate cart item count
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/catalogue', label: 'Catalogue', icon: <InventoryIcon /> },
    { to: '/test', label: 'Test', icon: <ReportIcon /> },
  ];

  // Admin-only navigation links
  const adminLinks = [
    { to: '/admin', label: 'Admin', icon: <AdminPanelSettingsIcon /> },
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

  // Admin-specific links for mobile drawer
  const adminUserLinks = [
    {
      to: '/admin',
      label: 'Admin Dashboard',
      icon: <AdminPanelSettingsIcon />,
    },
  ];

  const isActive = path => location.pathname === path;

  const navButtonSx = active => ({
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

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const handleOrdersClick = () => {
    handleProfileMenuClose();
    navigate('/orders');
  };

  const handleAddressesClick = () => {
    handleProfileMenuClose();
    navigate('/addresses');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleAuthLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleUserLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <>
      <AppBar
        position='sticky'
        sx={{
          background: isDarkMode
            ? 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
            : 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #a3824c 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            minHeight: isFoldable ? '56px' : { xs: '64px', md: '56px' },
            px: isFoldable ? 1 : { xs: 1, md: 2 },
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
                onClick={handleNavLinkClick}
                sx={{
                  ...navButtonSx(isActive(link.to)),
                  color: '#ffffff',
                  '&:hover': {
                    color: '#ffffff',
                  },
                }}
              >
                {link.icon}
                <Typography
                  sx={{
                    ml: 0.5,
                    fontSize: isFoldable ? '0.75rem' : '0.875rem',
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
                  onClick={handleNavLinkClick}
                  sx={{
                    ...navButtonSx(isActive(link.to)),
                    color: '#ffffff',
                    '&:hover': {
                      color: '#ffffff',
                    },
                  }}
                >
                  {link.icon}
                  <Typography
                    sx={{
                      ml: 0.5,
                      fontSize: isFoldable ? '0.75rem' : '0.875rem',
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
            {/* Dark Mode Toggle */}
            <DarkModeToggle onToggle={handleThemeToggle} />

            {/* Cart Icon */}
            <IconButton
              onClick={handleCartClick}
              sx={{
                color: '#ffffff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#ffd700',
                },
              }}
            >
              <Badge badgeContent={cartItemCount} color='error'>
                <LocalGroceryStoreIcon />
              </Badge>
            </IconButton>

            {/* User Menu / Auth Links */}
            {user ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    color: '#ffffff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: '#ffd700',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: isFoldable ? '32px' : { xs: '32px', md: '36px' },
                      height: isFoldable ? '32px' : { xs: '32px', md: '36px' },
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                      fontSize: isFoldable ? '0.75rem' : '0.875rem',
                    }}
                  >
                    {user.firstName?.charAt(0)?.toUpperCase() +
                      user.lastName?.charAt(0)?.toUpperCase() || <PersonIcon />}
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
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleOrdersClick}>
                    <ListItemIcon>
                      <LocalOfferIcon />
                    </ListItemIcon>
                    Orders
                  </MenuItem>
                  <MenuItem onClick={handleAddressesClick}>
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
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {authLinks.map(link => (
                  <Button
                    key={link.to}
                    component={Link}
                    to={link.to}
                    onClick={handleAuthLinkClick}
                    variant='outlined'
                    sx={{
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {link.icon}
                    <Typography
                      sx={{
                        ml: 0.5,
                        fontSize: isFoldable ? '0.75rem' : '0.875rem',
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: 'block', md: 'none' },
                color: '#ffffff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#ffd700',
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
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
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
                  onClick={handleNavLinkClick}
                  selected={isActive(link.to)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
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

            {/* Auth Links */}
            {!user ? (
              authLinks.map(link => (
                <ListItem key={link.to} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={link.to}
                    onClick={handleAuthLinkClick}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'primary.main',
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
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
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
                      onClick={handleUserLinkClick}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: 'primary.main',
                          minWidth: 40,
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  </ListItem>
                ))}

                {/* Admin Links */}
                <RoleBasedUI adminOnly fallback={null}>
                  <Divider sx={{ my: 2 }} />
                  <ListItem>
                    <Typography
                      variant='subtitle2'
                      sx={{ color: 'text.secondary', px: 2, mb: 1 }}
                    >
                      Administration
                    </Typography>
                  </ListItem>
                  {adminUserLinks.map(link => (
                    <ListItem key={link.to} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={link.to}
                        onClick={handleUserLinkClick}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: 'primary.main',
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

                {/* Logout */}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'error.contrastText',
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
