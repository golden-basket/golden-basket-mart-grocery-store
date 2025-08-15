import React, { useCallback, useEffect, useState } from 'react';
import {
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  InputAdornment,
  Box,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ReusableFilterControls - A comprehensive filter component with debouncing support
 *
 * Features:
 * - Debounced search and price range inputs to reduce API calls
 * - Responsive design with mobile drawer support
 * - Customizable styling with theme integration
 * - Visual feedback during search operations
 *
 * Debouncing Implementation:
 * - Search queries are debounced to prevent excessive API calls while typing
 * - Price range inputs are debounced to avoid rapid filter updates
 * - Visual spinner indicator shows when search is in progress
 * - Configurable debounce delay (default: 500ms)
 * - Option to disable debouncing for immediate updates
 *
 * Usage Example:
 * ```jsx
 * <ReusableFilterControls
 *   filterConfig={{
 *     search: { placeholder: 'Search products...' },
 *     priceRange: true,
 *   }}
 *   filterValues={filterValues}
 *   onFilterChange={handleFilterChange}
 *   debounceDelay={300} // Custom delay
 *   enableDebouncing={true} // Enable/disable debouncing
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.isMobile] - Force mobile view
 * @param {Object} props.filterConfig - Configuration for filter fields
 * @param {Object} props.filterValues - Current filter values
 * @param {Function} props.onFilterChange - Callback for filter changes
 * @param {Function} props.onClearFilters - Callback for clearing filters
 * @param {boolean} [props.filterDrawerOpen] - Mobile drawer open state
 * @param {Function} [props.setFilterDrawerOpen] - Mobile drawer state setter
 * @param {string} [props.drawerTitle] - Mobile drawer title
 * @param {Object} [props.sx] - Custom styling
 * @param {number} [props.debounceDelay=500] - Debounce delay in milliseconds
 * @param {boolean} [props.enableDebouncing=true] - Enable/disable debouncing for search and price inputs
 */
const ReusableFilterControls = ({
  // Configuration
  isMobile,
  filterConfig = {},
  filterValues = {},
  onFilterChange = () => {},
  onClearFilters = () => {},

  // Mobile drawer props
  filterDrawerOpen = false,
  setFilterDrawerOpen = () => {},
  drawerTitle = 'Filter Items',

  // Custom styling
  sx = {},

  // Debouncing configuration
  debounceDelay = 500,
  enableDebouncing = true,
}) => {
  const theme = useTheme();
  const mediaQueryResult = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileView = isMobile !== undefined ? isMobile : mediaQueryResult;

  // Local state for debounced inputs
  const [localSearchQuery, setLocalSearchQuery] = useState(
    filterValues.searchQuery || ''
  );
  const [localPriceRange, setLocalPriceRange] = useState(
    filterValues.priceRange || [0, 1000]
  );
  const [isSearching, setIsSearching] = useState(false);

  // Store timeout IDs for cleanup
  const timeoutRefs = React.useRef({});

  // Enhanced debounced filter change handler with proper cleanup
  const debouncedFilterChangeWithCleanup = useCallback(
    (fieldName, value) => {
      // Clear existing timeout for this field
      if (timeoutRefs.current[fieldName]) {
        clearTimeout(timeoutRefs.current[fieldName]);
      }

      // Set searching state for search queries
      if (fieldName === 'searchQuery') {
        setIsSearching(true);
      }

      // Set new timeout
      timeoutRefs.current[fieldName] = setTimeout(() => {
        onFilterChange(fieldName, value);
        delete timeoutRefs.current[fieldName];

        // Clear searching state
        if (fieldName === 'searchQuery') {
          setIsSearching(false);
        }
      }, debounceDelay);
    },
    [onFilterChange, debounceDelay]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    const currentTimeouts = timeoutRefs.current;
    return () => {
      Object.values(currentTimeouts).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  // Handle search input with debouncing
  const handleSearchChange = useCallback(
    (value) => {
      setLocalSearchQuery(value);
      if (enableDebouncing) {
        debouncedFilterChangeWithCleanup('searchQuery', value);
      } else {
        onFilterChange('searchQuery', value);
      }
    },
    [debouncedFilterChangeWithCleanup, enableDebouncing, onFilterChange]
  );

  // Handle price range input with debouncing
  const handlePriceRangeChange = useCallback(
    (index, value) => {
      const newRange = [...localPriceRange];
      newRange[index] = value;
      setLocalPriceRange(newRange);
      if (enableDebouncing) {
        debouncedFilterChangeWithCleanup('priceRange', newRange);
      } else {
        onFilterChange('priceRange', newRange);
      }
    },
    [
      localPriceRange,
      debouncedFilterChangeWithCleanup,
      enableDebouncing,
      onFilterChange,
    ]
  );

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSearchQuery(filterValues.searchQuery || '');
  }, [filterValues.searchQuery]);

  useEffect(() => {
    setLocalPriceRange(filterValues.priceRange || [0, 1000]);
  }, [filterValues.priceRange]);

  // Common styling for form elements
  const commonInputStyles = {
    '& .MuiOutlinedInput-root': {
      background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
      borderRadius: 1.5,
      boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
      height: 28,
      padding: '2px 6px',
      '& fieldset': { borderRadius: 1.5 },
      '&:hover fieldset': {
        borderColor: '#a3824c',
        borderRadius: 1.5,
      },
      '&.Mui-focused fieldset': {
        borderColor: '#a3824c',
        borderRadius: 1.5,
        borderWidth: '2px',
      },
      '&.Mui-disabled': {
        background: 'linear-gradient(90deg, #f8f5e6 0%, #f0e8d1 100%)',
        opacity: 0.8,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '4px 6px',
      fontSize: '0.75rem',
      '&:focus': {
        outline: 'none',
      },
    },
  };

  // Render search field
  const renderSearchField = () => {
    if (!filterConfig.search) return null;

    return (
      <TextField
        size="small"
        placeholder={filterConfig.search.placeholder || 'Search...'}
        value={localSearchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{
          width: isMobileView ? '100%' : filterConfig.search.width || 150,
          maxWidth: isMobileView ? '100%' : filterConfig.search.maxWidth || 180,
          minWidth: isMobileView ? '100%' : filterConfig.search.minWidth || 120,
          ...commonInputStyles,
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#a3824c', fontSize: 14 }} />
              </InputAdornment>
            ),
            endAdornment: isSearching ? (
              <InputAdornment position="end">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    border: '1px solid #a3824c',
                    borderTop: '1px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </InputAdornment>
            ) : null,
          },
        }}
      />
    );
  };

  // Render select field
  const renderSelectField = (fieldName, config) => {
    return (
      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: isMobileView ? '100%' : config.width || 120,
          maxWidth: isMobileView ? '100%' : config.maxWidth || 120,
          width: isMobileView ? '100%' : config.width || 120,
        }}
      >
        <Select
          size="small"
          value={filterValues[fieldName] || ''}
          onChange={(e) => onFilterChange(fieldName, e.target.value)}
          displayEmpty
          sx={{
            width: isMobileView ? '100%' : config.width || 120,
            maxWidth: isMobileView ? '100%' : config.maxWidth || 120,
            height: 28,
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
            borderRadius: 1.5,
            boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
            '& .MuiOutlinedInput-root': {
              height: 28,
              '& fieldset': { borderRadius: 1.5 },
              '&:hover fieldset': {
                borderColor: '#a3824c',
                borderRadius: 1.5,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#a3824c',
                borderRadius: 1.5,
              },
            },
            '& .MuiSelect-select': {
              padding: '4px 6px',
              fontSize: '0.75rem',
            },
            '& .MuiSelect-icon': {
              color: '#a3824c',
              fontSize: 14,
            },
          }}
        >
          {config.options?.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: '0.75rem' }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Render price range
  const renderPriceRange = () => {
    if (!filterConfig.priceRange) return null;

    return (
      <Stack
        direction={isMobileView ? 'column' : 'row'}
        spacing={isMobileView ? 2 : 1}
        alignItems={isMobileView ? 'stretch' : 'center'}
        justifyContent="flex-start"
        sx={{
          minWidth: isMobileView ? '100%' : 140,
          flex: 'none',
        }}
      >
        <TextField
          size="small"
          placeholder="Min"
          value={localPriceRange[0]}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            handlePriceRangeChange(0, value);
          }}
          sx={{
            minWidth: isMobileView ? '100%' : 50,
            maxWidth: isMobileView ? '100%' : 65,
            ...commonInputStyles,
            '& .MuiOutlinedInput-root': {
              ...commonInputStyles['& .MuiOutlinedInput-root'],
              padding: '4px 8px',
            },
            '& .MuiOutlinedInput-input': {
              ...commonInputStyles['& .MuiOutlinedInput-input'],
              padding: '6px 8px',
              pt: 1,
              pl: 0.5,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <Typography
                    sx={{
                      color: '#a3824c',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}
                  >
                    ₹
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
        {!isMobileView && (
          <Typography
            sx={{
              color: '#a3824c',
              fontSize: '0.7rem',
              fontWeight: 500,
              px: 0.3,
            }}
          >
            to
          </Typography>
        )}
        <TextField
          size="small"
          placeholder="Max"
          value={localPriceRange[1]}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 1000;
            handlePriceRangeChange(1, value);
          }}
          sx={{
            minWidth: isMobileView ? '100%' : 50,
            maxWidth: isMobileView ? '100%' : 65,
            ...commonInputStyles,
            '& .MuiOutlinedInput-root': {
              ...commonInputStyles['& .MuiOutlinedInput-root'],
              padding: '4px 8px',
            },
            '& .MuiOutlinedInput-input': {
              ...commonInputStyles['& .MuiOutlinedInput-input'],
              padding: '6px 8px',
              pt: 1,
              pl: 0.5,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <Typography
                    sx={{
                      color: '#a3824c',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}
                  >
                    ₹
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    );
  };

  // Render date picker
  const renderDatePicker = (fieldName, config) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: isMobileView ? '100%' : config.width || 140,
            maxWidth: isMobileView ? '100%' : config.maxWidth || 140,
            width: isMobileView ? '100%' : config.width || 140,
          }}
        >
          <DatePicker
            label={config.label}
            value={filterValues[fieldName]}
            onChange={(date) => onFilterChange(fieldName, date)}
            size="small"
            sx={{
              width: isMobileView ? '100%' : config.width || 140,
              maxWidth: isMobileView ? '100%' : config.maxWidth || 140,
              height: 28,
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              borderRadius: 1.5,
              boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
              '& .MuiOutlinedInput-root': {
                height: 28,
                '& fieldset': { borderRadius: 1.5 },
                '&:hover fieldset': {
                  borderColor: '#a3824c',
                  borderRadius: 1.5,
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#a3824c',
                  borderRadius: 1.5,
                },
              },
              '& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root': {
                width: isMobileView ? '100%' : config.width || 140,
                maxWidth: isMobileView ? '100%' : config.maxWidth || 140,
                overflow: 'hidden',
              },
              '& .MuiPickersSectionList-root, & .MuiPickersInputBase-sectionsContainer, & .MuiPickersOutlinedInput-sectionsContainer':
                {
                  fontSize: '0.75rem',
                },
              '& .MuiPickersInputBase-input, & .MuiPickersOutlinedInput-input':
                {
                  height: 28,
                  padding: '4px 6px',
                  fontSize: '0.75rem',
                },
              '& .MuiInputAdornment-root': {
                height: 28,
                width: 28,
              },
              '& .MuiButtonBase-root': {
                height: 20,
                width: 20,
                minHeight: 20,
                minWidth: 20,
                maxHeight: 20,
                maxWidth: 20,
              },
              '& .MuiIconButton-root': {
                height: 20,
                width: 20,
                minHeight: 20,
                minWidth: 20,
                maxHeight: 20,
                maxWidth: 20,
                '&:hover': {
                  backgroundColor: 'rgba(163,130,76,0.1)',
                },
              },
              '& .MuiSvgIcon-root': {
                height: 16,
                width: 16,
                fontSize: 16,
              },
              '& .MuiInputLabel-root': {
                height: 28,
                fontSize: '0.75rem',
                color: '#a3824c',
                transform: 'translate(8px, 6px) scale(1)',
                '&.Mui-focused, &.MuiFormLabel-filled': {
                  transform: 'translate(8px, -6px) scale(0.75)',
                },
              },
              '& .MuiPickersSectionList-sectionContent': {
                fontSize: '0.75rem',
                color: '#a3824c',
              },
              '& .MuiPickersInputBase-sectionContent': {
                fontSize: '0.75rem',
                color: '#a3824c',
              },
            }}
          />
        </FormControl>
      </LocalizationProvider>
    );
  };

  // Render checkbox
  const renderCheckbox = (fieldName, config) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={filterValues[fieldName] || false}
            onChange={(e) => onFilterChange(fieldName, e.target.checked)}
            sx={{
              color: '#a3824c',
              '&.Mui-checked': {
                color: '#a3824c',
              },
            }}
          />
        }
        label={
          <Typography
            variant="caption"
            sx={{
              color: '#a3824c',
              fontWeight: 600,
              fontSize: '0.65rem',
            }}
          >
            {config.label}
          </Typography>
        }
      />
    );
  };

  // Render filter controls
  const renderFilterControls = () => (
    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="flex-end"
      alignItems="center"
      spacing={1.5}
      sx={{
        width: '100%',
        ...sx,
      }}
    >
      {/* Search Field */}
      {renderSearchField()}

      {/* Select Fields */}
      {Object.entries(filterConfig).map(([fieldName, config]) => {
        if (
          fieldName === 'search' ||
          fieldName === 'priceRange' ||
          fieldName === 'checkbox'
        ) {
          return null;
        }
        if (config.type === 'select' || config.options) {
          return (
            <Box key={fieldName}>{renderSelectField(fieldName, config)}</Box>
          );
        }
        if (config.type === 'date') {
          return (
            <Box key={fieldName}>{renderDatePicker(fieldName, config)}</Box>
          );
        }
        return null;
      })}

      {/* Price Range */}
      {renderPriceRange()}

      {/* Checkboxes */}
      {Object.entries(filterConfig).map(([fieldName, config]) => {
        if (config.type === 'checkbox') {
          return <Box key={fieldName}>{renderCheckbox(fieldName, config)}</Box>;
        }
        return null;
      })}

      {/* Reset Button */}
      <Button
        onClick={onClearFilters}
        size="small"
        sx={{
          height: 28,
          width: 60,
          minHeight: 28,
          minWidth: 60,
          maxHeight: 28,
          maxWidth: 60,
          borderColor: '#a3824c',
          border: '1px solid #a3824c',
          color: '#a3824c',
          fontSize: '0.75rem',
          borderRadius: 1.5,
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
          boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
          fontWeight: 500,
          '&:hover': {
            borderColor: '#e6d897',
            backgroundColor: 'rgba(163,130,76,0.1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(163,130,76,0.15)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        Reset
      </Button>
    </Stack>
  );

  // Mobile view with drawer
  if (isMobileView) {
    return (
      <>
        <Box>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="stretch"
            spacing={1.5}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{
                borderColor: '#a3824c',
                color: '#a3824c',
                fontSize: '0.8rem',
                px: 1.5,
                py: 0.75,
                minHeight: 32,
                height: 32,
                borderRadius: 1.5,
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#e6d897',
                  backgroundColor: 'rgba(163,130,76,0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(163,130,76,0.15)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Filters
            </Button>
          </Stack>
        </Box>

        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: { xs: '100%', sm: 400 },
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
              borderLeft: '2px solid #e6d897',
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              height: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              sx={{
                borderBottom: '2px solid #e6d897',
                pb: 2,
                flexShrink: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#a3824c',
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                {drawerTitle}
              </Typography>
              <IconButton
                onClick={() => setFilterDrawerOpen(false)}
                sx={{
                  color: '#a3824c',
                  '&:hover': { backgroundColor: 'rgba(163,130,76,0.1)' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            {/* Mobile Filter Layout */}
            <Stack
              direction="column"
              spacing={3}
              sx={{
                width: '100%',
                flex: 1,
                overflow: 'auto',
              }}
            >
              {/* Search Field */}
              {renderSearchField() && (
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#a3824c',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    Search
                  </Typography>
                  <Box sx={{ width: '100%' }}>{renderSearchField()}</Box>
                </Box>
              )}

              {/* Select Fields */}
              {Object.entries(filterConfig).map(([fieldName, config]) => {
                if (
                  fieldName === 'search' ||
                  fieldName === 'priceRange' ||
                  fieldName === 'checkbox'
                ) {
                  return null;
                }
                if (config.type === 'select' || config.options) {
                  return (
                    <Box key={fieldName} sx={{ width: '100%' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#a3824c',
                          fontWeight: 600,
                          mb: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        {config.label ||
                          fieldName.charAt(0).toUpperCase() +
                            fieldName.slice(1)}
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        {renderSelectField(fieldName, config)}
                      </Box>
                    </Box>
                  );
                }
                if (config.type === 'date') {
                  return (
                    <Box key={fieldName} sx={{ width: '100%' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#a3824c',
                          fontWeight: 600,
                          mb: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        {config.label ||
                          fieldName.charAt(0).toUpperCase() +
                            fieldName.slice(1)}
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        {renderDatePicker(fieldName, config)}
                      </Box>
                    </Box>
                  );
                }
                return null;
              })}

              {/* Price Range */}
              {renderPriceRange() && (
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#a3824c',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    Price Range
                  </Typography>
                  <Box sx={{ width: '100%' }}>{renderPriceRange()}</Box>
                </Box>
              )}

              {/* Checkboxes and Reset Button Row */}
              {(() => {
                const checkboxFields = Object.entries(filterConfig).filter(
                  ([, config]) => config.type === 'checkbox'
                );
                const hasCheckboxes = checkboxFields.length > 0;

                return (
                  <Box
                    sx={{
                      width: '100%',
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid #e6d897',
                    }}
                  >
                    {hasCheckboxes && (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#a3824c',
                          fontWeight: 600,
                          mb: 2,
                          fontSize: '0.875rem',
                        }}
                      >
                        Options
                      </Typography>
                    )}
                    <Stack
                      direction={hasCheckboxes ? 'row' : 'column'}
                      spacing={hasCheckboxes ? 2 : 0}
                      alignItems={hasCheckboxes ? 'center' : 'stretch'}
                      justifyContent={
                        hasCheckboxes ? 'space-between' : 'center'
                      }
                      sx={{ width: '100%' }}
                    >
                      {/* Checkboxes */}
                      {hasCheckboxes && (
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          {checkboxFields.map(([fieldName, config]) => (
                            <Box key={fieldName}>
                              {renderCheckbox(fieldName, config)}
                            </Box>
                          ))}
                        </Stack>
                      )}

                      {/* Reset Button */}
                      <Button
                        onClick={onClearFilters}
                        size="small"
                        sx={{
                          height: 36,
                          width: hasCheckboxes ? 90 : '100%',
                          minHeight: 36,
                          minWidth: hasCheckboxes ? 90 : '100%',
                          maxHeight: 36,
                          maxWidth: hasCheckboxes ? 90 : '100%',
                          borderColor: '#a3824c',
                          border: '1px solid #a3824c',
                          color: '#a3824c',
                          fontSize: '0.8rem',
                          borderRadius: 1.5,
                          background:
                            'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                          boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: '#e6d897',
                            backgroundColor: 'rgba(163,130,76,0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(163,130,76,0.15)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </Box>
                );
              })()}
            </Stack>
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop view
  return renderFilterControls();
};

export default ReusableFilterControls;
