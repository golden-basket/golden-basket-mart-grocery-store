import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../styles/theme';

export const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    const savedSystemTheme = localStorage.getItem('theme-system');
    
    if (savedSystemTheme === 'false' && savedMode) {
      setMode(savedMode);
      setIsSystemTheme(false);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
      setIsSystemTheme(true);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!isSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  // Update document attributes for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setIsSystemTheme(false);
    localStorage.setItem('theme-mode', newMode);
    localStorage.setItem('theme-system', 'false');
  };

  const setLightTheme = () => {
    setMode('light');
    setIsSystemTheme(false);
    localStorage.setItem('theme-mode', 'light');
    localStorage.setItem('theme-system', 'false');
  };

  const setDarkTheme = () => {
    setMode('dark');
    setIsSystemTheme(false);
    localStorage.setItem('theme-mode', 'dark');
    localStorage.setItem('theme-system', 'false');
  };

  const useSystemTheme = () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(systemPrefersDark ? 'dark' : 'light');
    setIsSystemTheme(true);
    localStorage.setItem('theme-system', 'true');
    localStorage.removeItem('theme-mode');
  };

  const theme = createAppTheme(mode);

  const value = {
    mode,
    isDarkMode: mode === 'dark',
    isSystemTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    useSystemTheme,
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
