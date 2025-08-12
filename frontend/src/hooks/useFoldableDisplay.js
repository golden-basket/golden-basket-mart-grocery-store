import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Enhanced custom hook for detecting and managing foldable display characteristics
 * Optimized for devices like Asus Zenbook Fold and similar foldable displays
 * Now includes comprehensive responsive utilities and breakpoint management
 */
export const useFoldableDisplay = () => {
  const theme = useTheme();
  const [orientation, setOrientation] = useState('portrait');
  const [isFoldable, setIsFoldable] = useState(false);
  const [isUltraWide, setIsUltraWide] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isHighDPI, setIsHighDPI] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  // Enhanced media queries for different device types
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  // Enhanced breakpoint detection
  const isExtraSmall = useMediaQuery('(max-width: 480px)');
  const isSmall = useMediaQuery('(min-width: 481px) and (max-width: 640px)');
  const isMedium = useMediaQuery('(min-width: 641px) and (max-width: 768px)');
  const isLarge = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isExtraLarge = useMediaQuery('(min-width: 1025px) and (max-width: 1440px)');
  const isUltraWideScreen = useMediaQuery('(min-width: 1441px)');

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

    // Detect screen size category
    const detectScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 480) setScreenSize('extra-small');
      else if (width <= 640) setScreenSize('small');
      else if (width <= 768) setScreenSize('medium');
      else if (width <= 1024) setScreenSize('large');
      else if (width <= 1440) setScreenSize('extra-large');
      else setScreenSize('ultra-wide');
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

      // Detect initial screen size
      detectScreenSize();
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

    // Add screen size classes
    classes.push(`screen-${screenSize}`);
    
    return classes.join(' ');
  };

  // Enhanced responsive value getter with more granular control
  const getResponsiveValue = (extraSmall, small, medium, large, extraLarge, ultraWide, foldable) => {
    if (isFoldable && foldable !== undefined) {
      return foldable;
    }
    
    if (isExtraSmall) return extraSmall;
    if (isSmall) return small;
    if (isMedium) return medium;
    if (isLarge) return large;
    if (isExtraLarge) return extraLarge;
    if (isUltraWideScreen) return ultraWide;
    
    return large; // Default fallback
  };

  // Get spacing values optimized for different screen sizes
  const getResponsiveSpacing = (extraSmall, small, medium, large, extraLarge, ultraWide) => {
    if (isExtraSmall) return extraSmall;
    if (isSmall) return small;
    if (isMedium) return medium;
    if (isLarge) return large;
    if (isExtraLarge) return extraLarge;
    if (isUltraWideScreen) return ultraWide;
    return large;
  };

  // Get typography values optimized for different screen sizes
  const getResponsiveTypography = (extraSmall, small, medium, large, extraLarge, ultraWide) => {
    if (isExtraSmall) return extraSmall;
    if (isSmall) return small;
    if (isMedium) return medium;
    if (isLarge) return large;
    if (isExtraLarge) return extraLarge;
    if (isUltraWideScreen) return ultraWide;
    return large;
  };

  // Get responsive container classes
  const getResponsiveContainer = () => {
    if (isExtraSmall || isSmall) return 'container-fluid';
    if (isMedium) return 'container-sm';
    if (isLarge) return 'container-md';
    if (isExtraLarge) return 'container-lg';
    return 'container-xl';
  };

  // Get responsive grid classes
  const getResponsiveGrid = () => {
    if (isExtraSmall || isSmall) return 'grid-cols-1';
    if (isMedium) return 'grid-cols-2';
    if (isLarge) return 'grid-cols-3';
    if (isExtraLarge) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  // Get responsive button size
  const getResponsiveButtonSize = () => {
    if (isExtraSmall || isSmall) return 'btn-responsive-lg';
    if (isMedium) return 'btn-responsive-md';
    if (isLarge) return 'btn-responsive-sm';
    return 'btn-responsive-xs';
  };

  // Get responsive card size
  const getResponsiveCardSize = () => {
    if (isExtraSmall || isSmall) return 'card-responsive-lg';
    if (isMedium) return 'card-responsive-md';
    if (isLarge) return 'card-responsive-sm';
    return 'card-responsive-xs';
  };

  // Get responsive spacing classes
  const getResponsiveSpacingClasses = () => {
    if (isExtraSmall || isSmall) return 'responsive-padding-sm responsive-margin-sm';
    if (isMedium) return 'responsive-padding-md responsive-margin-md';
    if (isLarge) return 'responsive-padding-lg responsive-margin-lg';
    return 'responsive-padding-xl responsive-margin-xl';
  };

  // Get responsive text classes
  const getResponsiveTextClasses = () => {
    if (isExtraSmall || isSmall) return 'text-responsive-lg line-height-responsive-lg';
    if (isMedium) return 'text-responsive-md line-height-responsive-md';
    if (isLarge) return 'text-responsive-sm line-height-responsive-sm';
    return 'text-responsive-xs line-height-responsive-xs';
  };

  // Get responsive layout classes
  const getResponsiveLayoutClasses = () => {
    if (isExtraSmall || isSmall) return 'layout-responsive-mobile';
    if (isMedium) return 'layout-responsive-tablet';
    if (isLarge) return 'layout-responsive-desktop';
    return 'layout-responsive-desktop';
  };

  // Get responsive navigation classes
  const getResponsiveNavClasses = () => {
    if (isExtraSmall || isSmall) return 'nav-responsive-mobile';
    if (isMedium) return 'nav-responsive-tablet';
    if (isLarge) return 'nav-responsive-desktop';
    return 'nav-responsive-desktop';
  };

  // Get responsive form classes
  const getResponsiveFormClasses = () => {
    if (isExtraSmall || isSmall) return 'form-responsive-mobile';
    if (isMedium) return 'form-responsive-tablet';
    if (isLarge) return 'form-responsive-desktop';
    return 'form-responsive-desktop';
  };

  // Get responsive input size
  const getResponsiveInputSize = () => {
    if (isExtraSmall || isSmall) return 'input-responsive-lg';
    if (isMedium) return 'input-responsive-md';
    if (isLarge) return 'input-responsive-sm';
    return 'input-responsive-xs';
  };

  // Get responsive alert size
  const getResponsiveAlertSize = () => {
    if (isExtraSmall || isSmall) return 'alert-responsive-lg';
    if (isMedium) return 'alert-responsive-md';
    if (isLarge) return 'alert-responsive-sm';
    return 'alert-responsive-xs';
  };

  // Get responsive notification position
  const getResponsiveNotificationPosition = () => {
    if (isExtraSmall || isSmall) return 'notification-responsive-mobile';
    if (isMedium) return 'notification-responsive-tablet';
    if (isLarge) return 'notification-responsive-desktop';
    return 'notification-responsive-desktop';
  };

  // Get responsive image size
  const getResponsiveImageSize = () => {
    if (isExtraSmall || isSmall) return 'img-responsive-lg';
    if (isMedium) return 'img-responsive-md';
    if (isLarge) return 'img-responsive-sm';
    return 'img-responsive-xs';
  };

  // Get responsive shadow
  const getResponsiveShadow = () => {
    if (isExtraSmall || isSmall) return 'shadow-lg-responsive';
    if (isMedium) return 'shadow-md-responsive';
    if (isLarge) return 'shadow-sm-responsive';
    return 'shadow-responsive';
  };

  // Get responsive animation
  const getResponsiveAnimation = () => {
    if (isExtraSmall || isSmall) return 'animate-responsive-fast';
    if (isMedium) return 'animate-responsive';
    if (isLarge) return 'animate-responsive';
    return 'animate-responsive-slow';
  };

  return {
    // Device detection
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isFoldable,
    isUltraWide,
    isCompact,
    isHighDPI,
    orientation,
    screenSize,
    
    // Enhanced breakpoint detection
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isUltraWideScreen,
    
    // Utility functions
    getFoldableClasses,
    getResponsiveValue,
    getResponsiveSpacing,
    getResponsiveTypography,
    
    // Enhanced responsive utilities
    getResponsiveContainer,
    getResponsiveGrid,
    getResponsiveButtonSize,
    getResponsiveCardSize,
    getResponsiveSpacingClasses,
    getResponsiveTextClasses,
    getResponsiveLayoutClasses,
    getResponsiveNavClasses,
    getResponsiveFormClasses,
    getResponsiveInputSize,
    getResponsiveAlertSize,
    getResponsiveNotificationPosition,
    getResponsiveImageSize,
    getResponsiveShadow,
    getResponsiveAnimation,
    
    // Legacy functions for backward compatibility
    getFoldableSpacing: getResponsiveSpacing,
    getFoldableTypography: getResponsiveTypography,
    
    // Breakpoint helpers
    breakpoints: {
      xs: isExtraSmall,
      sm: isSmall,
      md: isMedium,
      lg: isLarge,
      xl: isExtraLarge,
      ultraWide: isUltraWideScreen,
    }
  };
};
