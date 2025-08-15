import React, { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../styles/theme';
import ThemeContext from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(createAppTheme(false));

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedPreference = localStorage.getItem('darkMode');
    const systemPreference = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedPreference !== null) {
      const shouldUseDarkMode = savedPreference === 'true';
      setIsDarkMode(shouldUseDarkMode);
      setTheme(createAppTheme(shouldUseDarkMode));
    } else {
      setIsDarkMode(systemPreference);
      setTheme(createAppTheme(systemPreference));
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => {
      if (localStorage.getItem('darkMode') === null) {
        const newMode = e.matches;
        setIsDarkMode(newMode);
        setTheme(createAppTheme(newMode));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(createAppTheme(newMode));
    localStorage.setItem('darkMode', newMode.toString());
  };

  const setThemeMode = mode => {
    setIsDarkMode(mode);
    setTheme(createAppTheme(mode));
    localStorage.setItem('darkMode', mode.toString());
  };

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
