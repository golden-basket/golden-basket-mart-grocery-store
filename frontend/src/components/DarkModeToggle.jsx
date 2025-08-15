import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkModeToggle = ({ onToggle, sx = {} }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference and user preference
  useEffect(() => {
    const savedPreference = localStorage.getItem('darkMode');
    const systemPreference = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedPreference !== null) {
      setIsDarkMode(savedPreference === 'true');
    } else {
      setIsDarkMode(systemPreference);
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());

    if (onToggle) {
      onToggle(newMode);
    }
  };

  return (
    <Tooltip
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <IconButton
        onClick={handleToggle}
        sx={{
          color: 'inherit',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
            color: isDarkMode ? '#ffd700' : '#1976d2',
          },
          ...sx,
        }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
