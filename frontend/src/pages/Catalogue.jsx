import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Slider,
  Button,
  Checkbox,
  FormControlLabel,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Loading from '../components/Loading';
import { useProducts } from '../hooks/useProducts';
import ApiService from '../services/api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'error' };
  if (stock <= 5)
    return { label: `Hurry! Only ${stock} left`, color: 'warning' };
  if (stock <= 15)
    return { label: `Limited Stock: ${stock} left`, color: 'info' };
  return { label: 'In Stock', color: 'success' };
};

const Catalogue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([5, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([
    { value: '', label: 'All' },
  ]);
  const [catLoading, setCatLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState({});

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Load categories from backend
  useEffect(() => {
    setCatLoading(true);
    ApiService.getCategories()
      .then((cats) => {
        const options = [
          { value: '', label: 'All' },
          ...cats.map((cat) => ({
            value: cat._id,
            label: cat.name,
          })),
        ];
        setCategoryOptions(options);
      })
      .catch(() => setCategoryOptions([{ value: '', label: 'All' }]))
      .finally(() => setCatLoading(false));
  }, []);

  // Build filters for pagination
  const filters = {
    page,
    limit: 12, // Fixed limit for catalogue view
    ...(selectedCategory && { category: selectedCategory }),
    ...(priceRange[0] > 5 && { minPrice: priceRange[0] }),
    ...(priceRange[1] < 1000 && { maxPrice: priceRange[1] }),
    ...(inStockOnly && { inStock: 'true' })
  };

  // Load products with pagination
  const { data: productsData, isLoading, error } = useProducts(page, 12, filters);

  // Update products and pagination when data changes
  useEffect(() => {
    if (productsData) {
      if (productsData.products && productsData.pagination) {
        // New paginated response
        setFilteredProducts(productsData.products);
        setTotalPages(productsData.pagination.totalPages);
      } else {
        // Fallback for non-paginated response
        setFilteredProducts(productsData);
        setTotalPages(1);
      }
    }
  }, [productsData]);

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    // The useProducts hook will automatically refetch with new filters
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([5, 1000]);
    setInStockOnly(false);
    setPage(1); // Reset to first page when clearing filters
  };

  const handleStockAvailability = (stock) => {
    if (stock === 0) return '#f44336';
    if (stock <= 5) return '#ff9800';
    if (stock <= 15) return '#2196f3';
    return '#4caf50';
  };

  const handleAddToCart = async (productId) => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await ApiService.addToCart(productId, 1);
      // Optionally show a snackbar or refresh cart state
    } catch (err) {
      // Optionally show error
      console.error('Error adding to cart:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Buy now handler
  const handleBuyNow = async (productId) => {
    await handleAddToCart(productId);
    navigate('/checkout');
  };

  return (
    <Box sx={{ mt: 1, p: { xs: 2, md: 5 } }}>
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
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 8px rgba(163,130,76,0.1)',
        }}
      >
        Product Catalogue
      </Typography>
      {/* Filter Bar */}
      <Box
        sx={{
          mb: 3,
          p: 1,
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)',
          borderRadius: 2,
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
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              borderRadius: 1,
              boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
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
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              borderRadius: 1,
              boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
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
            {catLoading ? (
              <MenuItem value="" disabled>
                Loading...
              </MenuItem>
            ) : (
              categoryOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ fontSize: '0.8rem' }}
                >
                  {opt.label}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
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
            onChange={(_, newValue) => setPriceRange(newValue)}
            min={5}
            max={1000}
            step={5}
            sx={{
              color: '#a3824c',
              height: 3,
              mx: 1.5,
              flexGrow: 1,
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
      {/* Product Grid */}
      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}>
          <Loading />
          <Typography sx={{ color: '#a3824c', fontWeight: 500 }}>
            Loading products...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 6, 
          py: 4,
          color: '#d32f2f'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Error loading products
          </Typography>
          <Typography variant="body1">
            Please try again later or contact support if the problem persists.
          </Typography>
        </Box>
      ) : filteredProducts.length > 0 ? (
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
            Found {filteredProducts.length} product
            {filteredProducts.length !== 1 ? 's' : ''}
          </Typography>
          <Box sx={{ 
            width: '100%',
            overflow: 'hidden',
            '& .MuiGrid-container': {
              margin: 0,
              padding: 0,
              width: '100%'
            },
            '& .MuiGrid-item': {
              padding: '12px !important',
              display: 'flex',
              justifyContent: 'center'
            }
          }}>
            <Grid
              container
              spacing={3}
              alignItems="stretch"
              justifyContent="flex-start"
              sx={{ 
                width: '100%',
                margin: 0,
                padding: 0,
                '& > .MuiGrid-item': {
                  display: 'flex',
                  justifyContent: 'center'
                }
              }}
            >
              {filteredProducts.map((p, idx) => {
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
                      minHeight: 'fit-content',
                      '& .MuiCard-root': {
                        height: '100%',
                        width: '100%',
                      },
                      // Ensure proper spacing on mobile
                      '&:nth-of-type(odd)': {
                        '@media (max-width: 600px)': {
                          paddingLeft: '6px'
                        }
                      },
                      '&:nth-of-type(even)': {
                        '@media (max-width: 600px)': {
                          paddingRight: '6px'
                        }
                      }
                    }}
                  >
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(163,130,76,0.08)',
                        border: '1px solid #e6d897',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(163,130,76,0.15)',
                          transform: 'translateY(-6px) scale(1.02)',
                          borderColor: '#a3824c',
                        },
                        opacity: p.stock === 0 ? 0.6 : 1,
                        position: 'relative',
                        overflow: 'hidden',
                        background:
                          'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                        minHeight: { xs: '400px', sm: '450px', md: '500px' },
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
                            p.images?.[0] ||
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
                          background:
                            'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                          '&:last-child': {
                            pb: { xs: 2, sm: 2.5 }
                          }
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
                              color: '#a3824c',
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
                              background:
                                'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                              color: '#a3824c',
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
                            color: '#7d6033',
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
                                color: '#866422',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                              }}
                            >
                              Category: {p.category.name || p.category}
                            </Typography>
                          )}
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 0.5,
                                color: '#866422',
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
                                backgroundColor: '#f0e6d0',
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
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ShoppingCartIcon />}
                            disabled={p.stock === 0 || actionLoading[p._id]}
                            onClick={() => handleAddToCart(p._id)}
                            sx={{
                              fontWeight: 600,
                              background:
                                'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                              color: '#fff',
                              textTransform: 'none',
                              borderRadius: 1,
                              px: 2,
                              '&:hover': {
                                background:
                                  'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                                color: '#000',
                              },
                            }}
                          >
                            {actionLoading[p._id] ? 'Adding...' : 'Add to Cart'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FlashOnIcon />}
                            disabled={p.stock === 0 || actionLoading[p._id]}
                            onClick={() => handleBuyNow(p._id)}
                            sx={{
                              fontWeight: 600,
                              borderColor: '#a3824c',
                              color: '#a3824c',
                              textTransform: 'none',
                              borderRadius: 1,
                              px: 2,
                              background:
                                'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                              '&:hover': {
                                borderColor: '#e6d897',
                                background:
                                  'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                                color: '#866422',
                              },
                            }}
                          >
                            Buy Now
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4, 
              mb: 2,
              '& .MuiPagination-root': {
                '& .MuiPaginationItem-root': {
                  color: '#a3824c',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(163,130,76,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  },
                },
              }
            }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#a3824c',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      backgroundColor: 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                      color: '#fff',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(163,130,76,0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
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
              color: '#866422',
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            No products match your current search criteria. Try adjusting your
            filters or search terms.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Catalogue;
