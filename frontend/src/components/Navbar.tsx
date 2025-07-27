import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Badge,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cart } = useCart();

  // Calculate cart item count
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/catalogue', label: 'Catalogue', icon: <InventoryIcon /> },
    { to: '/login', label: 'Login', icon: <LoginIcon /> },
    { to: '/register', label: 'Register', icon: <PersonAddAltIcon /> },
  ];

  const userLinks = [
    { to: '/orders', label: 'Orders', icon: <LocalOfferIcon /> },
    { to: '/addresses', label: 'Addresses', icon: <EmojiNatureIcon /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const navButtonSx = (active: boolean) => ({
    fontWeight: 600,
    borderBottom: active ? '4px solid #e6d897' : '4px solid transparent',
    // No background or text color change for active tab
    '&:hover': {
      color: '#000',
      background:
        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
    },
  });

  return (
    <AppBar
      position="static"
      sx={{
        background:
          'linear-gradient(90deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
        boxShadow: 4,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
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
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              textShadow: '1px 1px 4px #00000055',
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Golden Basket Mart
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {navLinks.map((link) => {
            // Only show Login/Register if user is not logged in
            if ((link.to === '/login' || link.to === '/register') && user)
              return null;
            return (
              <Button
                key={link.to}
                color="inherit"
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={(navButtonSx(isActive(link.to)), { textTransform: 'none' })}
              >
                {link.label}
              </Button>
            );
          })}

          {/* Cart button - only show when user is logged in */}
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
              sx={(navButtonSx(isActive('/cart')), { textTransform: 'none' })}
            >
              Cart
            </Button>
          )}

          {user &&
            userLinks.map((link) => (
              <Button
                key={link.to}
                color="inherit"
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={(navButtonSx(isActive(link.to)), { textTransform: 'none' })}
              >
                {link.label}
              </Button>
            ))}
          {user ? (
            <>
              <Avatar
                {...stringAvatar(`${user.firstName} ${user.lastName}`)}
                sx={{ width: 30, height: 30 }}
              />
              <Button
                color="inherit"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                startIcon={<LogoutIcon />}
                sx={(navButtonSx(isActive('')), { textTransform: 'none' })}
              >
                Logout
              </Button>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
