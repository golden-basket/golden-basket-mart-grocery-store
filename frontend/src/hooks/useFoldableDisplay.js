import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Custom hook for detecting and managing foldable display characteristics
 * Optimized for devices like Asus Zenbook Fold and similar foldable displays
 */
export const useFoldableDisplay = () => {
  const theme = useTheme();
  const [orientation, setOrientation] = useState('portrait');
  const [isFoldable, setIsFoldable] = useState(false);
  const [isUltraWide, setIsUltraWide] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isHighDPI, setIsHighDPI] = useState(false);

  // Media queries for different device types
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Foldable-specific media queries
  const isFoldableDevice = useMediaQuery('(max-width: 768px) and (min-width: 280px)');
  const isUltraWideDevice = useMediaQuery('(min-width: 769px) and (max-width: 1200px) and (min-aspect-ratio: 1.8/1)');
  const isCompactDevice = useMediaQuery('(max-width: 768px) and (min-height: 400px) and (max-height: 800px)');
  const isHighDPIDevice = useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');

  useEffect(() => {
    // Detect orientation changes
    const handleOrientationChange = () => {
      setOrientation(window.orientation === 0 ? 'portrait' : 'landscape');
    };

    // Detect foldable characteristics
    const detectFoldableFeatures = () => {
      setIsFoldable(isFoldableDevice);
      setIsUltraWide(isUltraWideDevice);
      setIsCompact(isCompactDevice);
      setIsHighDPI(isHighDPIDevice);
      
      // Set initial orientation
      if (window.orientation !== undefined) {
        setOrientation(window.orientation === 0 ? 'portrait' : 'landscape');
      } else {
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      }
    };

    // Initial detection
    detectFoldableFeatures();

    // Event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', detectFoldableFeatures);

    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', detectFoldableFeatures);
    };
  }, [isFoldableDevice, isUltraWideDevice, isCompactDevice, isHighDPIDevice]);

  // Get appropriate CSS classes for the current device state
  const getFoldableClasses = () => {
    const classes = [];
    
    if (isFoldable) {
      classes.push('foldable-base');
      
      if (orientation === 'landscape') {
        classes.push('foldable-landscape-mode');
        
        // Check for ultra-wide landscape
        if (window.innerWidth / window.innerHeight > 1.5) {
          classes.push('foldable-landscape-wide');
        }
      } else {
        classes.push('foldable-portrait-mode');
      }
    }
    
    if (isUltraWide) {
      classes.push('foldable-ultra-wide');
    }
    
    if (isTablet) {
      classes.push('foldable-tablet');
    }
    
    if (isCompact) {
      classes.push('foldable-compact');
    }
    
    if (isHighDPI) {
      classes.push('foldable-high-dpi-enhanced');
    }
    
    return classes.join(' ');
  };

  // Get responsive values based on device type
  const getResponsiveValue = (mobile, tablet, desktop, foldable) => {
    if (isFoldable && foldable !== undefined) {
      return foldable;
    }
    
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Get spacing values optimized for foldable displays
  const getFoldableSpacing = (base, compact, wide) => {
    if (isCompact) return compact || base * 0.75;
    if (isUltraWide) return wide || base * 1.25;
    return base;
  };

  // Get typography values optimized for foldable displays
  const getFoldableTypography = (base, compact, wide) => {
    if (isCompact) return compact || base * 0.9;
    if (isUltraWide) return wide || base * 1.1;
    return base;
  };

  return {
    // Device detection
    isMobile,
    isTablet,
    isDesktop,
    isFoldable,
    isUltraWide,
    isCompact,
    isHighDPI,
    orientation,
    
    // Utility functions
    getFoldableClasses,
    getResponsiveValue,
    getFoldableSpacing,
    getFoldableTypography,
    
    // Breakpoint helpers
    breakpoints: {
      xs: theme.breakpoints.down('sm'),
      sm: useMediaQuery(theme.breakpoints.between('sm', 'md')),
      md: useMediaQuery(theme.breakpoints.between('md', 'lg')),
      lg: useMediaQuery(theme.breakpoints.between('lg', 'xl')),
      xl: useMediaQuery(theme.breakpoints.up('xl')),
    }
  };
};
