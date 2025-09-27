import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import { useThemeContext } from '../contexts/ThemeContext.jsx';

const DarkModeToggle = ({ sx = {} }) => {
  const { isDarkMode, toggleTheme, isSystemTheme } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getTooltipText = () => {
    if (isSystemTheme) {
      return `System theme (${isDarkMode ? 'Dark' : 'Light'}) - Click to override`;
    }
    return `Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`;
  };

  return (
    <Tooltip title={getTooltipText()} arrow>
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'relative',
          width: isMobile ? 32 : 40,
          height: isMobile ? 32 : 40,
          borderRadius: '50%',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: isDarkMode
              ? theme.palette.action.hover
              : theme.palette.grey[100],
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          ...sx,
        }}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {/* Simple icon with hover effect */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
            transform: isDarkMode ? 'rotate(0deg)' : 'rotate(360deg)',
          }}
        >
          {isDarkMode ? (
            <WbSunnyIcon
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                color: theme.palette.primary.light,
                transition: 'color 0.2s ease',
                '.MuiIconButton-root:hover &': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          ) : (
            <NightsStayIcon
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                color: theme.palette.text.primary,
                transition: 'color 0.2s ease',
                '.MuiIconButton-root:hover &': {
                  color: theme.palette.primary.light,
                },
              }}
            />
          )}
        </Box>

        {/* System theme indicator */}
        {isSystemTheme && (
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.palette.info.main,
              border: `1px solid ${theme.palette.background.paper}`,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.7,
                  transform: 'scale(1.1)',
                },
              },
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
