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

// Common gradient patterns
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #a3824c 0%, #866422 100%)',
  primaryHover: 'linear-gradient(135deg, #866422 0%, #7d6033 100%)',
  background: 'linear-gradient(135deg, #f7fbe8 0%, #fffbe6 100%)',
  card: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
  adminSection: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
  button: 'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
  buttonHover: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
};

// Common shadows
export const SHADOWS = {
  card: '0 6px 24px rgba(163, 130, 76, 0.12)',
  button: '0 2px 8px rgba(163, 130, 76, 0.2)',
  buttonHover: '0 4px 16px rgba(163, 130, 76, 0.3)',
  adminSection: '0 6px 24px 0 rgba(163,130,76,0.15)',
  table: '0 4px 20px 0 rgba(163,130,76,0.2)',
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

// Create the main theme
export const createAppTheme = () => createTheme({
  palette: {
    ...COLORS,
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h1: { fontWeight: 700, color: COLORS.text.primary },
    h2: { fontWeight: 600, color: COLORS.text.primary },
    h3: { fontWeight: 600, color: COLORS.text.primary },
    h4: { fontWeight: 600, color: COLORS.text.primary },
    h5: { fontWeight: 600, color: COLORS.text.primary },
    h6: { fontWeight: 600, color: COLORS.text.primary },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.background.paper,
          boxShadow: SHADOWS.card,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: COMPONENT_STYLES.card,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: COMPONENT_STYLES.button,
        contained: {
          background: GRADIENTS.primary,
          '&:hover': {
            background: GRADIENTS.primaryHover,
          },
        },
        outlined: {
          borderColor: COLORS.primary.main,
          color: COLORS.primary.dark,
          '&:hover': {
            borderColor: COLORS.primary.dark,
            backgroundColor: 'rgba(163, 130, 76, 0.08)',
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
          backgroundColor: COLORS.background.default,
          backgroundImage: GRADIENTS.background,
        },
        '#root': {
          width: '100vw',
        },
      },
    },
  },
});

export default createAppTheme;
