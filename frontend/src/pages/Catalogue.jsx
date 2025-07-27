import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Loading from '../components/Loading';
import { useSearchProducts } from '../hooks/useProducts';

const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'error' };
  if (stock <= 5)
    return { label: `Hurry! Only ${stock} left`, color: 'warning' };
  if (stock <= 15)
    return { label: `Limited Stock: ${stock} left`, color: 'info' };
  return { label: 'In Stock', color: 'success' };
};

const Catalogue = () => {
  const [searchParams, setSearchParams] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([5, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: products, isLoading, error } = useSearchProducts(searchParams);

  const handleSearch = () => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 1000) params.maxPrice = priceRange[1];
    if (inStockOnly) params.inStock = true;

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([5, 1000]);
    setInStockOnly(false);
    setSearchParams({});
  };

  const handleStockAvailability = (stock) => {
    if (stock === 0) return '#f44336'; // Red for out of stock
    if (stock <= 5) return '#ff9800'; // Orange for low stock
    if (stock <= 15) return '#2196f3'; // Blue for limited stock
    return '#4caf50'; // Green for in stock
  };

  return (
    <Box sx={{ mt: 1, px: { xs: 2, md: 5 } }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          mb: 4,
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 8px rgba(163,130,76,0.1)',
        }}
      >
        Product Catalogue
      </Typography>

      {/* Compact Single-Line Filter Bar */}
      {products?.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 1,
            bgcolor: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)',
            borderRadius: 1.5,
            boxShadow: '0 1px 6px rgba(163,130,76,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            width: 'fit-content',
            ml: { xs: 0, sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          }}
        >
          <FilterListIcon sx={{ color: '#a3824c', fontSize: 18 }} />
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 120,
              maxWidth: 200,
              '& .MuiOutlinedInput-root': {
                height: 32,
                fontSize: '0.8rem',
                '&:hover fieldset': { borderColor: '#a3824c' },
                '&.Mui-focused fieldset': { borderColor: '#a3824c' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#a3824c', fontSize: 16 }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Category Dropdown */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 100, maxWidth: 140 }}
          >
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              sx={{
                height: 32,
                fontSize: '0.8rem',
                color: '#a3824c',
                fontWeight: 500,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(163,130,76,0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#a3824c',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#a3824c',
                },
                '& .MuiSelect-icon': { color: '#a3824c', fontSize: 16 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#fffbe8',
                    color: '#a3824c',
                    fontWeight: 500,
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="" sx={{ fontSize: '0.8rem' }}>
                All
              </MenuItem>
              <MenuItem value="vegetable" sx={{ fontSize: '0.8rem' }}>
                Vegetables
              </MenuItem>
              <MenuItem value="dairy" sx={{ fontSize: '0.8rem' }}>
                Dairy
              </MenuItem>
              <MenuItem value="fruit" sx={{ fontSize: '0.8rem' }}>
                Fruits
              </MenuItem>
              <MenuItem value="grain" sx={{ fontSize: '0.8rem' }}>
                Grains
              </MenuItem>
            </Select>
          </FormControl>

          {/* Price Range */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 120,
              maxWidth: 160,
            }}
          >
            <Typography
              sx={{ color: '#a3824c', fontSize: '0.75rem', fontWeight: 500 }}
            >
              ₹{priceRange[0]}
            </Typography>
            <Slider
              size="small"
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              min={5}
              max={1000}
              step={5}
              sx={{
                color: '#a3824c',
                height: 3,
                mx: 1.5, // Add horizontal margin to separate from labels
                flexGrow: 1, // Allow slider to take available space
                '& .MuiSlider-thumb': {
                  backgroundColor: '#a3824c',
                  width: 12,
                  height: 12,
                  '&:hover': { boxShadow: '0 0 0 4px rgba(163,130,76,0.16)' },
                },
                '& .MuiSlider-track': { backgroundColor: '#e6d897', height: 3 },
                '& .MuiSlider-rail': { backgroundColor: '#f0f0f0', height: 3 },
              }}
            />
            <Typography
              sx={{ color: '#a3824c', fontSize: '0.75rem', fontWeight: 500 }}
            >
              ₹{priceRange[1]}
            </Typography>
          </Box>

          {/* In Stock Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                size="small"
                sx={{
                  color: '#a3824c',
                  '&.Mui-checked': { color: '#a3824c' },
                }}
              />
            }
            label="In Stock"
            sx={{
              color: '#a3824c',
              fontWeight: 500,
              fontSize: '0.75rem',
              '& .MuiFormControlLabel-label': { fontSize: '0.75rem' },
            }}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            size="small"
            sx={{
              height: 32,
              fontWeight: 600,
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              color: '#fff',
              textTransform: 'none',
              borderRadius: 1,
              fontSize: '0.75rem',
              px: 1.5,
              '&:hover': {
                background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                color: '#866422',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 6px rgba(163,130,76,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Search
          </Button>

          {/* Clear Button */}
          <Button
            variant="outlined"
            onClick={clearFilters}
            size="small"
            sx={{
              height: 32,
              borderColor: '#a3824c',
              color: '#a3824c',
              borderRadius: 1,
              fontSize: '0.75rem',
              px: 1.5,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#e6d897',
                backgroundColor: 'rgba(163,130,76,0.05)',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 6px rgba(163,130,76,0.3)',
                color: '#866422',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Clear
          </Button>
        </Box>
      )}

      {isLoading && <Loading />}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#f44336',
            },
          }}
        >
          {error.message || 'Failed to load products. Please try again later.'}
        </Alert>
      )}

      {!isLoading &&
        !error &&
        (products?.length > 0 ? (
          <>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: '#a3824c',
                fontWeight: 600,
                mb: 3,
              }}
            >
              Found {products.length} product{products.length !== 1 ? 's' : ''}
            </Typography>
            <Grid
              container
              spacing={3}
              alignItems="stretch"
              justifyContent="flex-start"
            >
              {products.map((p, idx) => {
                const stockStatus = getStockStatus(p.stock);
                const stockPercent = Math.min(
                  100,
                  Math.round(((p.stock || 0) / 30) * 100)
                );

                return (
                  <Grid
                    item
                    key={p._id + idx}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2.4}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'stretch',
                    }}
                  >
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(163,130,76,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(163,130,76,0.15)',
                          transform: 'translateY(-6px) scale(1.02)',
                          borderColor: '#a3824c',
                        },
                        opacity: p.stock === 0 ? 0.6 : 1,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: { xs: 160, sm: 180, md: 200 },
                          background:
                            'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background:
                              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                          },
                        }}
                      >
                        <img
                          src={
                            p.image ||
                            `https://via.placeholder.com/200x200?text=${encodeURIComponent(
                              p.name
                            )}`
                          }
                          alt={p.name}
                          style={{
                            maxHeight: '85%',
                            maxWidth: '85%',
                            objectFit: 'contain',
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            background: '#fff',
                            filter: p.stock === 0 ? 'grayscale(1)' : 'none',
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (p.stock > 0) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: { xs: 2, sm: 2.5 },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              fontWeight: 700,
                              flex: 1,
                              color: '#2c3e50',
                              lineHeight: 1.3,
                              fontSize: {
                                xs: '0.9rem',
                                sm: '1rem',
                                md: '1.1rem',
                              },
                            }}
                          >
                            {p.name}
                          </Typography>
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color}
                            size="small"
                            sx={{
                              ml: 1,
                              fontWeight: 600,
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          }}
                        >
                          {p.description ||
                            'This is a high quality product available at the best price. Order now and enjoy fast delivery!'}
                        </Typography>

                        <Box sx={{ mt: 'auto' }}>
                          <Typography
                            sx={{
                              mb: 1.5,
                              fontSize: {
                                xs: '1rem',
                                sm: '1.1rem',
                                md: '1.2rem',
                              },
                              fontWeight: 700,
                              color: '#a3824c',
                            }}
                          >
                            ₹{p.price}
                          </Typography>

                          {p.category && (
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1.5,
                                color: '#666',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                              }}
                            >
                              Category: {p.category}
                            </Typography>
                          )}

                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 0.5,
                                color: '#666',
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                              }}
                            >
                              Stock: {p.stock} units
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={stockPercent}
                              sx={{
                                height: { xs: 4, sm: 6 },
                                borderRadius: 2,
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: handleStockAvailability(
                                    p.stock
                                  ),
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 6, py: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#a3824c',
                fontWeight: 600,
                mb: 2,
              }}
            >
              No products found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              No products match your current search criteria. Try adjusting your
              filters or search terms.
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default Catalogue;
