import { createTheme } from '@mui/material/styles';

// Color palette constants
export const COLORS = {
  primary: {
    main: '#a3824c',
    light: '#e6d897',
    dark: '#866422',
    contrastText: '#fff',
  },
  secondary: {
    main: '#388e3c',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#fff',
  },
  success: {
    main: '#388e3c',
    light: '#4caf50',
    dark: '#1b5e20',
  },
  warning: {
    main: '#ffb300',
    light: '#ffc107',
    dark: '#f57c00',
  },
  error: {
    main: '#d32f2f',
    light: '#f44336',
    dark: '#b71c1c',
  },
  info: {
    main: '#0288d1',
    light: '#29b6f6',
    dark: '#01579b',
  },
  background: {
    default: '#f7fbe8',
    paper: '#fffbe6',
  },
  text: {
    primary: '#2e3a1b',
    secondary: '#7d6033',
  },
};

// Dark mode colors
export const DARK_COLORS = {
  primary: {
    main: '#e6d897',
    light: '#f7f0d0',
    dark: '#a3824c',
    contrastText: '#1a1a1a',
  },
  secondary: {
    main: '#4caf50',
    light: '#66bb6a',
    dark: '#388e3c',
    contrastText: '#1a1a1a',
  },
  success: {
    main: '#4caf50',
    light: '#66bb6a',
    dark: '#388e3c',
  },
  warning: {
    main: '#ffc107',
    light: '#ffd54f',
    dark: '#ffb300',
  },
  error: {
    main: '#f44336',
    light: '#ef5350',
    dark: '#d32f2f',
  },
  info: {
    main: '#29b6f6',
    light: '#42a5f5',
    dark: '#0288d1',
  },
  background: {
    default: '#1a1a1a',
    paper: '#2d2d2d',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
  },
};

// Common gradient patterns
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #a3824c 0%, #866422 100%)',
  primaryHover: 'linear-gradient(135deg, #866422 0%, #7d6033 100%)',
  background: 'linear-gradient(135deg, #f7fbe8 0%, #fffbe6 100%)',
  card: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
  adminSection:
    'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
  button: 'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
  buttonHover: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
};

// Dark mode gradients
export const DARK_GRADIENTS = {
  primary: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
  primaryHover: 'linear-gradient(135deg, #a3824c 0%, #866422 100%)',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  card: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
  adminSection:
    'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 50%, #2d2d2d 100%)',
  button: 'linear-gradient(135deg, #e6d897 0%, #a3824c 50%, #f7f0d0 100%)',
  buttonHover: 'linear-gradient(135deg, #a3824c 0%, #e6d897 100%)',
};

// Common shadows
export const SHADOWS = {
  card: '0 6px 24px rgba(163, 130, 76, 0.12)',
  button: '0 2px 8px rgba(163, 130, 76, 0.2)',
  buttonHover: '0 4px 16px rgba(163, 130, 76, 0.3)',
  adminSection: '0 6px 24px 0 rgba(163,130,76,0.15)',
  table: '0 4px 20px 0 rgba(163,130,76,0.2)',
};

// Dark mode shadows
export const DARK_SHADOWS = {
  card: '0 6px 24px rgba(0, 0, 0, 0.3)',
  button: '0 2px 8px rgba(0, 0, 0, 0.4)',
  buttonHover: '0 4px 16px rgba(0, 0, 0, 0.5)',
  adminSection: '0 6px 24px 0 rgba(0,0,0,0.4)',
  table: '0 4px 20px 0 rgba(0,0,0,0.5)',
};

// Responsive breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Common component styles
export const COMPONENT_STYLES = {
  card: {
    backgroundColor: COLORS.background.paper,
    boxShadow: SHADOWS.card,
    borderRadius: 16,
    border: '1px solid rgba(163, 130, 76, 0.1)',
  },
  button: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: SHADOWS.button,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.buttonHover,
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      background: GRADIENTS.card,
      borderRadius: 1.5,
      boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
      '&:hover fieldset': { borderColor: COLORS.primary.main },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary.main },
    },
  },
};

// Dark mode component styles
export const DARK_COMPONENT_STYLES = {
  card: {
    backgroundColor: DARK_COLORS.background.paper,
    boxShadow: DARK_SHADOWS.card,
    borderRadius: 16,
    border: '1px solid rgba(230, 216, 151, 0.2)',
  },
  button: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: DARK_SHADOWS.button,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: DARK_SHADOWS.buttonHover,
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      background: DARK_GRADIENTS.card,
      borderRadius: 1.5,
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.3)',
      '&:hover fieldset': { borderColor: DARK_COLORS.primary.main },
      '&.Mui-focused fieldset': { borderColor: DARK_COLORS.primary.main },
    },
  },
};

// Create the main theme
export const createAppTheme = (isDarkMode = false) => {
  const colors = isDarkMode ? DARK_COLORS : COLORS;
  const gradients = isDarkMode ? DARK_GRADIENTS : GRADIENTS;
  const shadows = isDarkMode ? DARK_SHADOWS : SHADOWS;
  const componentStyles = isDarkMode ? DARK_COMPONENT_STYLES : COMPONENT_STYLES;

  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      ...colors,
      background: {
        ...colors.background,
        default: isDarkMode
          ? DARK_COLORS.background.default
          : COLORS.background.default,
        paper: isDarkMode
          ? DARK_COLORS.background.paper
          : COLORS.background.paper,
      },
      text: {
        ...colors.text,
        primary: isDarkMode ? DARK_COLORS.text.primary : COLORS.text.primary,
        secondary: isDarkMode
          ? DARK_COLORS.text.secondary
          : COLORS.text.secondary,
      },
    },
    typography: {
      fontFamily: 'Poppins, Roboto, sans-serif',
      h1: { fontWeight: 700, color: colors.text.primary },
      h2: { fontWeight: 600, color: colors.text.primary },
      h3: { fontWeight: 600, color: colors.text.primary },
      h4: { fontWeight: 600, color: colors.text.primary },
      h5: { fontWeight: 600, color: colors.text.primary },
      h6: { fontWeight: 600, color: colors.text.primary },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background.paper,
            boxShadow: shadows.card,
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: componentStyles.card,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: componentStyles.button,
          contained: {
            background: gradients.primary,
            '&:hover': {
              background: gradients.primaryHover,
            },
          },
          outlined: {
            borderColor: colors.primary.main,
            color: colors.primary.dark,
            '&:hover': {
              borderColor: colors.primary.dark,
              backgroundColor: isDarkMode
                ? 'rgba(230, 216, 151, 0.08)'
                : 'rgba(163, 130, 76, 0.08)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 600,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            width: '100vw',
            overflowX: 'hidden',
            backgroundColor: colors.background.default,
            backgroundImage: gradients.background,
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '#root': {
            width: '100vw',
          },
        },
      },
    },
  });
};

export default createAppTheme;
