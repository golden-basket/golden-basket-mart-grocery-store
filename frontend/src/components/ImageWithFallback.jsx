import React, { useState } from 'react';
import { Box } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

const ImageWithFallback = ({
  src,
  alt,
  fallbackText,
  fallbackIcon = <BrokenImageIcon />,
  sx = {},
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  if (imageError || !src) {
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
          width: {
            xs: '100%',
            sm: '100%',
            md: '100%',
          },
          minWidth: {
            xs: '80px',
            sm: '100px',
            md: '120px',
          },
          maxWidth: '100%',
          aspectRatio: '1',
          ...sx,
        }}
        {...props}
      >
        {fallbackIcon && (
          <Box sx={{ fontSize: '1.5rem', mb: 0.5 }}>
            {fallbackIcon}
          </Box>
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
      component="img"
      src={src}
      alt={alt}
      onError={handleImageError}
      onLoad={handleImageLoad}
      sx={{
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        ...sx,
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;
