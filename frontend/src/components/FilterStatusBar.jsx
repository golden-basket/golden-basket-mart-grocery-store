import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
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
  const theme = useTheme();
  
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
          my: 1,
          p: 1,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}25 100%)`,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.primary.main}30`,
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
            color: theme.palette.text.primary,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
          Showing {showing} of {total} {itemType}
          {loading && (
            <Box
              component='span'
              sx={{
                width: 12,
                height: 12,
                border: `1px solid ${theme.palette.primary.main}`,
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
              background: `linear-gradient(90deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.light}30 100%)`,
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}40`,
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 0.75,
              py: 0.5,
              minHeight: 28,
              height: 28,
              borderRadius: 1.5,
            }}
          />
        )}
      </Box>
  );
};

export default FilterStatusBar;
