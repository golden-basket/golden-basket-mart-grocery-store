import React, { useState } from 'react';
import { Box } from '@mui/material';
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
          backgroundColor: 'rgba(163, 130, 76, 0.1)',
          borderRadius: 1,
          border: '1px dashed rgba(163, 130, 76, 0.3)',
          color: 'rgba(163, 130, 76, 0.6)',
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
              color: 'rgba(163, 130, 76, 0.7)',
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
        transition: 'opacity 0.3s ease',
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
