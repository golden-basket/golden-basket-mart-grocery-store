import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Popper,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ClearIcon from '@mui/icons-material/Clear';
import { useToastNotifications } from '../hooks/useToast';

const SEARCH_HISTORY_KEY = 'searchHistory';
const POPULAR_SEARCHES = [
  'Fresh Vegetables',
  'Organic Fruits',
  'Dairy Products',
  'Bread & Bakery',
  'Meat & Fish',
  'Beverages',
  'Snacks',
  'Household Items',
];

const EnhancedSearch = ({
  onSearch,
  placeholder = 'Search products...',
  initialValue = '',
  sx = {},
  showSuggestions = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showInfo } = useToastNotifications();

  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(parsed);
        setRecentSearches(parsed.slice(0, 5)); // Show last 5 searches
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback(
    query => {
      if (!query.trim()) return;

      const newHistory = [
        query.trim(),
        ...searchHistory.filter(item => item !== query.trim()),
      ].slice(0, 20); // Keep only last 20 searches

      setSearchHistory(newHistory);
      setRecentSearches(newHistory.slice(0, 5));
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    },
    [searchHistory]
  );

  // Generate search suggestions
  const generateSuggestions = useCallback(
    query => {
      if (!query.trim()) {
        return [];
      }

      const queryLower = query.toLowerCase();
      const suggestions = [];

      // Add search history matches
      searchHistory.forEach(item => {
        if (
          item.toLowerCase().includes(queryLower) &&
          !suggestions.includes(item)
        ) {
          suggestions.push({
            text: item,
            type: 'history',
            icon: <HistoryIcon />,
          });
        }
      });

      // Add popular search matches
      POPULAR_SEARCHES.forEach(item => {
        if (
          item.toLowerCase().includes(queryLower) &&
          !suggestions.includes(item)
        ) {
          suggestions.push({
            text: item,
            type: 'popular',
            icon: <TrendingUpIcon />,
          });
        }
      });

      // Add smart suggestions based on query
      if (queryLower.includes('veg') || queryLower.includes('vegetable')) {
        suggestions.push({
          text: 'Fresh Vegetables',
          type: 'smart',
          icon: <SearchIcon />,
        });
      }
      if (queryLower.includes('fruit')) {
        suggestions.push({
          text: 'Organic Fruits',
          type: 'smart',
          icon: <SearchIcon />,
        });
      }
      if (queryLower.includes('milk') || queryLower.includes('dairy')) {
        suggestions.push({
          text: 'Dairy Products',
          type: 'smart',
          icon: <SearchIcon />,
        });
      }

      return suggestions.slice(0, 8); // Limit to 8 suggestions
    },
    [searchHistory]
  );

  // Handle search input change
  const handleInputChange = useCallback(
    (event, value) => {
      const query = value || event?.target?.value || '';
      setSearchQuery(query);

      if (query.trim()) {
        const newSuggestions = generateSuggestions(query);
        setSuggestions(newSuggestions);
        setShowAutocomplete(true);
      } else {
        setSuggestions([]);
        setShowAutocomplete(false);
      }
    },
    [generateSuggestions]
  );

  // Handle search submission
  const handleSearch = useCallback(
    (query = searchQuery) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        showInfo('Please enter a search term');
        return;
      }

      saveSearchHistory(trimmedQuery);
      setShowAutocomplete(false);

      if (onSearch) {
        onSearch(trimmedQuery);
      }
    },
    [searchQuery, onSearch, saveSearchHistory, showInfo]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    suggestion => {
      setSearchQuery(suggestion.text);
      handleSearch(suggestion.text);
    },
    [handleSearch]
  );

  // Handle search history item click
  const handleHistoryItemClick = useCallback(
    item => {
      setSearchQuery(item);
      handleSearch(item);
    },
    [handleSearch]
  );

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    showInfo('Search history cleared');
  }, [showInfo]);

  // Handle key press
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Handle click away
  const handleClickAway = useCallback(() => {
    setShowAutocomplete(false);
  }, []);

  // Custom Popper component for better positioning
  const CustomPopper = useCallback(
    ({ style, ...props }) => (
      <Popper
        {...props}
        style={{
          ...style,
          zIndex: theme.zIndex.modal + 1,
          width: searchRef.current?.offsetWidth || 'auto',
        }}
        placement='bottom-start'
      />
    ),
    [theme.zIndex.modal]
  );

  return (
    <Box ref={searchRef} sx={{ position: 'relative', width: '100%', ...sx }}>
      <TextField
        ref={inputRef}
        fullWidth
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        variant='outlined'
        size={isMobile ? 'medium' : 'small'}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon color='action' />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position='end'>
              <IconButton
                size='small'
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowAutocomplete(false);
                }}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
      />

      {/* Search Suggestions */}
      {showAutocomplete && showSuggestions && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: theme.zIndex.modal + 1,
              mt: 1,
              borderRadius: 2,
              maxHeight: 400,
              overflow: 'auto',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Box>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon fontSize='small' color='action' />
                    <Typography variant='body2' color='text.secondary'>
                      Recent Searches
                    </Typography>
                  </Box>
                  <IconButton
                    size='small'
                    onClick={clearSearchHistory}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ClearIcon fontSize='small' />
                  </IconButton>
                </Box>
                <List dense>
                  {recentSearches.map((item, index) => (
                    <ListItem
                      key={`history-${index}`}
                      button
                      onClick={() => handleHistoryItemClick(item)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon fontSize='small' color='action' />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.primary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <Box>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Suggestions
                  </Typography>
                </Box>
                <List dense>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={`suggestion-${index}`}
                      button
                      onClick={() => handleSuggestionSelect(suggestion)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {suggestion.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.primary',
                        }}
                      />
                      <Chip
                        label={suggestion.type}
                        size='small'
                        variant='outlined'
                        sx={{
                          fontSize: '0.625rem',
                          height: 20,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Popular Searches */}
            {!searchQuery && (
              <Box>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Popular Searches
                  </Typography>
                </Box>
                <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {POPULAR_SEARCHES.map((item, index) => (
                    <Chip
                      key={`popular-${index}`}
                      label={item}
                      size='small'
                      variant='outlined'
                      onClick={() => handleHistoryItemClick(item)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default EnhancedSearch;
