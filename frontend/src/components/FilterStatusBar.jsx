import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const FilterStatusBar = ({
  showing,
  total,
  itemType = 'items',
  filters = {},
  isActive = false,
  customActiveCheck = null,
  sx = {},
  isMobileView = false,
  loading = false,
}) => {
  // Determine if filters are active
  const filtersActive =
    customActiveCheck ||
    isActive ||
    Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        // Handle array values like amountRange [0, 10000]
        return value.some(
          v => v !== 0 && v !== 10000 && v !== null && v !== ''
        );
      }
      return (
        value !== '' && value !== null && value !== undefined && value !== false
      );
    });

  return (
    <Box
      sx={{
        mb: 1,
        p: 1,
        background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
        borderRadius: 2,
        border: '1px solid #e6d897',
        display: 'flex',
        justifyContent: isMobileView ? 'center' : 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        ...sx,
      }}
    >
      <Typography
        variant='body2'
        textAlign='center'
        sx={{
          color: '#a3824c',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <ShoppingBagIcon sx={{ fontSize: 16 }} />
        Showing {showing} of {total} {itemType}
        {loading && (
          <Box
            component='span'
            sx={{
              width: 12,
              height: 12,
              border: '1px solid #a3824c',
              borderTop: '1px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              ml: 1,
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        )}
      </Typography>
      {filtersActive && !isMobileView && (
        <Chip
          label='Filters Active'
          size='small'
          sx={{
            background: 'linear-gradient(90deg, #a3824c20 0%, #a3824c40 100%)',
            color: '#a3824c',
            border: '1px solid #a3824c',
            fontWeight: 600,
            fontSize: '0.8rem',
            px: 0.75,
            py: 0.5,
            minHeight: 28,
            height: 28,
            borderRadius: 1.75,
          }}
        />
      )}
    </Box>
  );
};

export default FilterStatusBar;
