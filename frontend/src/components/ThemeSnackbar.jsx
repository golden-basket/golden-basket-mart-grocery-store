import React from 'react';
import { Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';

const ThemeSnackbar = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 6000,
  action,
  showCloseButton = true,
  persistent = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  // Responsive positioning and sizing
  const getResponsiveProps = () => {
    if (isSmallScreen) {
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        sx: { mt: 1, mx: 1 },
        maxWidth: 'calc(100vw - 32px)',
        fontSize: '0.8rem',
        padding: '4px 12px',
        borderRadius: 2,
      };
    }
    if (isMobile) {
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        sx: { mt: 2, mx: 2 },
        maxWidth: 'calc(100vw - 64px)',
        fontSize: '0.85rem',
        padding: '6px 16px',
        borderRadius: 2.5,
      };
    }
    if (isTablet) {
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        sx: { mt: 3, mx: 3 },
        maxWidth: 500,
        fontSize: '0.9rem',
        padding: '8px 20px',
        borderRadius: 3,
      };
    }
    // Desktop
    return {
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      sx: { mt: 4, mx: 4 },
      maxWidth: 600,
      fontSize: '0.95rem',
      padding: '10px 24px',
      borderRadius: 3,
    };
  };

  const responsiveProps = getResponsiveProps();

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={responsiveProps.anchorOrigin}
      sx={responsiveProps.sx}
      // Mobile-friendly touch interactions
      disableWindowBlurListener={isMobile}
      // Responsive auto-hide duration (don't auto-hide if persistent)
      autoHideDuration={persistent ? null : (isMobile ? 5000 : autoHideDuration)}
    >
      <Alert
        onClose={showCloseButton ? onClose : undefined}
        severity={severity}
        action={action}
        sx={{
          width: '100%',
          maxWidth: responsiveProps.maxWidth,
          borderRadius: responsiveProps.borderRadius,
          fontSize: responsiveProps.fontSize,
          boxShadow: isMobile
            ? '0 2px 8px rgba(0,0,0,0.15)'
            : '0 4px 16px rgba(0,0,0,0.12)',

          // Ultra-minimal Alert padding for very compact height
          padding: isMobile ? '0px 4px' : '1px 6px',
          minHeight: isMobile ? '20px' : '24px',

          // Ensure proper alignment with flexbox
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',

          // Responsive typography
          '& .MuiAlert-message': {
            fontWeight: 500,
            fontSize: 'inherit',
            letterSpacing: '0.1px',
            lineHeight: 1.0,
            wordBreak: 'break-word',
            hyphens: 'auto',
            padding: 0,
            margin: 0,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            minHeight: isMobile ? '16px' : '20px',
          },

          // Ultra-compact icon sizing and spacing with upward positioning
          '& .MuiAlert-icon': {
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            marginRight: isMobile ? '2px' : '3px',
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            transform: isMobile ? 'translateY(-1px)' : 'translateY(-1px)',
            paddingTop: isMobile ? '0px' : '1px',
          },

          // Ultra-compact close button spacing with upward positioning
          '& .MuiAlert-action': {
            padding: 0,
            margin: 0,
            marginLeft: isMobile ? '2px' : '3px',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'flex-start',
            transform: isMobile ? 'translateY(-1px)' : 'translateY(-1px)',
            paddingTop: isMobile ? '0px' : '1px',
            '& .MuiIconButton-root': {
              padding: isMobile ? '0px' : '0px',
              fontSize: isMobile ? '0.6rem' : '0.7rem',
              minWidth: 'auto',
              minHeight: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },

          // Theme-based styling for different message types
          ...(severity === 'success' && {
            background:
              'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(76, 175, 80, 0.95) 100%)',
            color: 'white',
            border: '1px solid #4caf50',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }),
          ...(severity === 'error' && {
            background:
              'linear-gradient(135deg, rgba(211, 47, 47, 0.9) 0%, rgba(211, 47, 47, 0.95) 100%)',
            color: 'white',
            border: '1px solid #d32f2f',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }),
          ...(severity === 'info' && {
            background:
              'linear-gradient(135deg, rgba(163, 130, 76, 0.9) 0%, rgba(230, 216, 151, 0.95) 100%)',
            color: 'white',
            border: '1px solid #e6d897',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }),
          ...(severity === 'warning' && {
            background:
              'linear-gradient(135deg, rgba(255, 179, 0, 0.9) 0%, rgba(255, 179, 0, 0.95) 100%)',
            color: 'white',
            border: '1px solid #ffb300',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }),

          // Responsive transitions
          transition: 'all 0.2s ease',

          // Hover effects (desktop only)
          ...(!isMobile && {
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
          }),

          // Mobile-specific optimizations
          ...(isMobile && {
            textAlign: 'left',
            position: 'relative',
            zIndex: theme.zIndex.snackbar,
          }),

          // Tablet optimizations
          ...(isTablet &&
            !isMobile && {
              textAlign: 'left',
            }),

          // Desktop enhancements
          ...(!isTablet && {
            textAlign: 'left',
            '&:focus': {
              outline: '1px solid rgba(163, 130, 76, 0.5)',
              outlineOffset: '1px',
            },
          }),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ThemeSnackbar;
