import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc,
  fallbackText,
  fallbackIcon = <BrokenImageIcon />,
  onLoad,
  onError,
  sx = {},
  style = {},
  ...props
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageError = event => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
      setImageError(false);
    } else {
      // Both original and fallback failed
      setImageError(true);
      if (onError) {
        onError(event);
      }
    }
  };

  const handleImageLoad = event => {
    setImageLoaded(true);
    setImageError(false);
    if (onLoad) {
      onLoad(event);
    }
  };

  // Reset when src changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  if (imageError || (!src && !fallbackSrc)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.action.hover,
          borderRadius: 8,
          border: `1px dashed ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
          width: '100%',
          height: '100%',
          minWidth: '80px',
          minHeight: '80px',
          aspectRatio: '1',
          ...sx,
        }}
        style={style}
        {...props}
      >
        {fallbackIcon && (
          <Box sx={{ fontSize: '1.5rem', mb: 0.5 }}>{fallbackIcon}</Box>
        )}
        {fallbackText && (
          <Box
            sx={{
              fontSize: '0.7rem',
              textAlign: 'center',
              px: 1,
              color: theme.palette.text.secondary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '90%',
            }}
          >
            {fallbackText}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      component='img'
      src={currentSrc}
      alt={alt}
      onError={handleImageError}
      onLoad={handleImageLoad}
      sx={{
        opacity: imageLoaded ? 1 : 0,
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.standard,
        }),
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block', // Ensure proper display
        ...sx,
      }}
      style={{
        ...style,
        // Ensure these styles are applied
        width: style.width || '100%',
        height: style.height || '100%',
        objectFit: style.objectFit || 'cover',
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;
