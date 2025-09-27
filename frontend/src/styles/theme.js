import { createTheme } from '@mui/material/styles';

// Design Tokens - CSS Variables for consistent theming
export const CSS_VARIABLES = {
  // Spacing Scale (8px base unit)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  // Border Radius Scale
  borderRadius: {
    xs: '1px',
    sm: '2px',
    md: '3px',
    lg: '4px',
    xl: '6px',
    round: '50%',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    xl: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    hover: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
};

// Modern Color Palette - Inspired by BlinkIt
const colors = {
  // Primary Colors - Fresh Green (BlinkIt style)
  primary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main primary - Fresh green
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    A100: '#86EFAC',
    A200: '#4ADE80',
    A400: '#22C55E',
    A700: '#16A34A',
  },
  
  // Secondary Colors - Vibrant Orange (BlinkIt style)
  secondary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main secondary - Vibrant orange
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    A100: '#FDBA74',
    A200: '#FB923C',
    A400: '#F97316',
    A700: '#EA580C',
  },
  
  // Success Colors - Modern Green
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main success - Fresh green
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    A100: '#86EFAC',
    A200: '#4ADE80',
    A400: '#22C55E',
    A700: '#16A34A',
  },
  
  // Warning Colors - Modern Amber
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main warning - Modern amber
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    A100: '#FDE68A',
    A200: '#FCD34D',
    A400: '#F59E0B',
    A700: '#D97706',
  },
  
  // Error Colors - Modern Red
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main error - Modern red
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    A100: '#FCA5A5',
    A200: '#F87171',
    A400: '#EF4444',
    A700: '#DC2626',
  },
  
  // Info Colors - Modern Blue
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main info - Modern blue
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    A100: '#93C5FD',
    A200: '#60A5FA',
    A400: '#3B82F6',
    A700: '#2563EB',
  },
  
  // Neutral Colors - Modern Gray
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Light Theme Colors - Modern BlinkIt Style
const lightColors = {
  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
    elevated: '#FFFFFF',
    subtle: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  
  // Surface Colors
  surface: {
    primary: colors.primary[50],
    secondary: colors.secondary[50],
    success: colors.success[50],
    warning: colors.warning[50],
    error: colors.error[50],
    info: colors.info[50],
  },
  
  // Text Colors
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    disabled: colors.neutral[400],
    hint: colors.neutral[500],
    inverse: colors.neutral[50],
  },
  
  // Border Colors
  border: {
    light: colors.neutral[200],
    medium: colors.neutral[300],
    dark: colors.neutral[400],
    focus: colors.primary[500],
    error: colors.error[500],
    success: colors.success[500],
  },
  
  // Interactive Colors
  interactive: {
    hover: colors.primary[50],
    active: colors.primary[100],
    focus: colors.primary[100],
    selected: colors.primary[100],
  },
};

// Dark Theme Colors - Modern BlinkIt Style
const darkColors = {
  // Background Colors
  background: {
    default: '#0F172A',
    paper: '#1E293B',
    elevated: '#334155',
    subtle: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Surface Colors
  surface: {
    primary: colors.primary[900],
    secondary: colors.secondary[900],
    success: colors.success[900],
    warning: colors.warning[900],
    error: colors.error[900],
    info: colors.info[900],
  },
  
  // Text Colors
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[300],
    disabled: colors.neutral[600],
    hint: colors.neutral[400],
    inverse: colors.neutral[900],
  },
  
  // Border Colors
  border: {
    light: colors.neutral[700],
    medium: colors.neutral[600],
    dark: colors.neutral[500],
    focus: colors.primary[400],
    error: colors.error[400],
    success: colors.success[400],
  },
  
  // Interactive Colors
  interactive: {
    hover: colors.primary[800],
    active: colors.primary[700],
    focus: colors.primary[700],
    selected: colors.primary[700],
  },
};

// Typography Scale
const typography = {
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    secondary: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Create Material-UI Theme
export const createAppTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  const themeColors = isLight ? lightColors : darkColors;
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary[500],
        light: colors.primary[400],
        dark: colors.primary[700],
        contrastText: '#FFFFFF',
        // Add all required properties
        50: colors.primary[50],
        100: colors.primary[100],
        200: colors.primary[200],
        300: colors.primary[300],
        400: colors.primary[400],
        500: colors.primary[500],
        600: colors.primary[600],
        700: colors.primary[700],
        800: colors.primary[800],
        900: colors.primary[900],
        A100: colors.primary.A100,
        A200: colors.primary.A200,
        A400: colors.primary.A400,
        A700: colors.primary.A700,
      },
      secondary: {
        main: colors.secondary[500],
        light: colors.secondary[400],
        dark: colors.secondary[700],
        contrastText: '#FFFFFF',
        // Add all required properties
        50: colors.secondary[50],
        100: colors.secondary[100],
        200: colors.secondary[200],
        300: colors.secondary[300],
        400: colors.secondary[400],
        500: colors.secondary[500],
        600: colors.secondary[600],
        700: colors.secondary[700],
        800: colors.secondary[800],
        900: colors.secondary[900],
        A100: colors.secondary.A100,
        A200: colors.secondary.A200,
        A400: colors.secondary.A400,
        A700: colors.secondary.A700,
      },
      success: {
        main: colors.success[500],
        light: colors.success[400],
        dark: colors.success[700],
        contrastText: '#FFFFFF',
        // Add all required properties
        50: colors.success[50],
        100: colors.success[100],
        200: colors.success[200],
        300: colors.success[300],
        400: colors.success[400],
        500: colors.success[500],
        600: colors.success[600],
        700: colors.success[700],
        800: colors.success[800],
        900: colors.success[900],
        A100: colors.success.A100,
        A200: colors.success.A200,
        A400: colors.success.A400,
        A700: colors.success.A700,
      },
      warning: {
        main: colors.warning[500],
        light: colors.warning[400],
        dark: colors.warning[700],
        contrastText: '#FFFFFF',
        // Add all required properties
        50: colors.warning[50],
        100: colors.warning[100],
        200: colors.warning[200],
        300: colors.warning[300],
        400: colors.warning[400],
        500: colors.warning[500],
        600: colors.warning[600],
        700: colors.warning[700],
        800: colors.warning[800],
        900: colors.warning[900],
        A100: colors.warning.A100,
        A200: colors.warning.A200,
        A400: colors.warning.A400,
        A700: colors.warning.A700,
      },
      error: {
        main: colors.error[500],
        light: colors.error[400],
        dark: colors.error[700],
        contrastText: '#FFFFFF',
        // Add all required properties
        50: colors.error[50],
        100: colors.error[100],
        200: colors.error[200],
        300: colors.error[300],
        400: colors.error[400],
        500: colors.error[500],
        600: colors.error[600],
        700: colors.error[700],
        800: colors.error[800],
        900: colors.error[900],
        A100: colors.error.A100,
        A200: colors.error.A200,
        A400: colors.error.A400,
        A700: colors.error.A700,
      },
      info: {
        main: colors.info[500],
        light: colors.info[400],
        dark: colors.info[700],
        contrastText: '#FFFFFF',
        // Add all required properties
        50: colors.info[50],
        100: colors.info[100],
        200: colors.info[200],
        300: colors.info[300],
        400: colors.info[400],
        500: colors.info[500],
        600: colors.info[600],
        700: colors.info[700],
        800: colors.info[800],
        900: colors.info[900],
        A100: colors.info.A100,
        A200: colors.info.A200,
        A400: colors.info.A400,
        A700: colors.info.A700,
      },
      background: {
        default: themeColors.background.default,
        paper: themeColors.background.paper,
      },
      text: {
        primary: themeColors.text.primary,
        secondary: themeColors.text.secondary,
        disabled: themeColors.text.disabled,
      },
      divider: themeColors.border.medium,
      // Add common colors
      common: {
        black: '#000000',
        white: '#FFFFFF',
      },
      grey: {
        50: colors.neutral[50],
        100: colors.neutral[100],
        200: colors.neutral[200],
        300: colors.neutral[300],
        400: colors.neutral[400],
        500: colors.neutral[500],
        600: colors.neutral[600],
        700: colors.neutral[700],
        800: colors.neutral[800],
        900: colors.neutral[900],
        A100: colors.neutral[400],
        A200: colors.neutral[500],
        A400: colors.neutral[600],
        A700: colors.neutral[700],
      },
    },
    
    typography: {
      fontFamily: typography.fontFamily.primary,
      h1: {
        fontFamily: typography.fontFamily.secondary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize['5xl'],
        lineHeight: typography.lineHeight.tight,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: typography.fontFamily.secondary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize['4xl'],
        lineHeight: typography.lineHeight.tight,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: typography.fontFamily.secondary,
        fontWeight: typography.fontWeight.semibold,
        fontSize: typography.fontSize['3xl'],
        lineHeight: typography.lineHeight.snug,
      },
      h4: {
        fontFamily: typography.fontFamily.secondary,
        fontWeight: typography.fontWeight.semibold,
        fontSize: typography.fontSize['2xl'],
        lineHeight: typography.lineHeight.snug,
      },
      h5: {
        fontFamily: typography.fontFamily.secondary,
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.xl,
        lineHeight: typography.lineHeight.normal,
      },
      h6: {
        fontFamily: typography.fontFamily.secondary,
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.normal,
      },
      body1: {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.relaxed,
        fontWeight: typography.fontWeight.regular,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.relaxed,
        fontWeight: typography.fontWeight.regular,
      },
      button: {
        fontFamily: typography.fontFamily.primary,
        fontWeight: typography.fontWeight.medium,
        textTransform: 'none',
        letterSpacing: '0.025em',
      },
      caption: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: '0.05em',
      },
      overline: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    },
    
    shape: {
      borderRadius: parseInt(CSS_VARIABLES.borderRadius.md),
    },
    
    shadows: [
      'none',
      CSS_VARIABLES.shadows.sm,
      CSS_VARIABLES.shadows.md,
      CSS_VARIABLES.shadows.lg,
      CSS_VARIABLES.shadows.xl,
      ...Array(20).fill(CSS_VARIABLES.shadows.xl),
    ],
    
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: CSS_VARIABLES.borderRadius.md,
            padding: '12px 24px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            transition: CSS_VARIABLES.transitions.normal,
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              opacity: 0.6,
              cursor: 'not-allowed',
              transform: 'none !important',
            },
          },
          contained: {
            boxShadow: CSS_VARIABLES.shadows.md,
            '&:hover': {
              boxShadow: CSS_VARIABLES.shadows.lg,
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
      
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: CSS_VARIABLES.borderRadius.md,
            boxShadow: CSS_VARIABLES.shadows.sm,
            transition: CSS_VARIABLES.transitions.normal,
            '&:hover': {
              boxShadow: CSS_VARIABLES.shadows.md,
            },
          },
        },
      },
      
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: CSS_VARIABLES.borderRadius.sm,
              transition: CSS_VARIABLES.transitions.fast,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[400],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[500],
                borderWidth: '2px',
              },
            },
          },
        },
      },
      
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: CSS_VARIABLES.borderRadius.sm,
            fontWeight: typography.fontWeight.medium,
            fontSize: typography.fontSize.xs,
          },
        },
      },
      
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

// Export the default light theme
export const theme = createAppTheme('light');

// Export all design tokens and utilities
export const DESIGN_SYSTEM = {
  colors,
  lightColors,
  darkColors,
  typography,
  CSS_VARIABLES,
};

// Legacy exports for backward compatibility
export const COLORS = colors;
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
  success: `linear-gradient(135deg, ${colors.success[500]} 0%, ${colors.success[600]} 100%)`,
  warning: `linear-gradient(135deg, ${colors.warning[500]} 0%, ${colors.warning[600]} 100%)`,
  error: `linear-gradient(135deg, ${colors.error[500]} 0%, ${colors.error[600]} 100%)`,
};
export const SHADOWS = CSS_VARIABLES.shadows;
