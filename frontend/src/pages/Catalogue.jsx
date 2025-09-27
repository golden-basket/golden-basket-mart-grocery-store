import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  Pagination,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import Loading from '../components/Loading';
import ImageWithFallback from '../components/ImageWithFallback';
import FilterStatusBar from '../components/FilterStatusBar';
import ReusableFilterControls from '../components/ReusableFilterControls';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import ApiService from '../services/api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToastNotifications } from '../hooks/useToast';

const getStockStatus = stock => {
  if (stock === 0) return { label: 'Out of Stock', color: 'error' };
  if (stock <= 5)
    return { label: `Hurry! Only ${stock} left`, color: 'warning' };
  if (stock <= 15)
    return { label: `Limited Stock: ${stock} left`, color: 'info' };
  return { label: 'In Stock', color: 'success' };
};

const Catalogue = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useToastNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([
    { value: '', label: 'All' },
  ]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState({});
  const [buyNowLoading, setBuyNowLoading] = useState({});
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Build server-side filters (exclude search as it's handled client-side)
  const serverFilters = useMemo(
    () => ({
      page,
      limit: 12,
      ...(selectedCategory && { category: selectedCategory }),
      ...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
      ...(priceRange[1] < 10000 && { maxPrice: priceRange[1] }),
      ...(inStockOnly && { inStock: 'true' }),
    }),
    [page, selectedCategory, priceRange, inStockOnly]
  );

  // Load products with server-side pagination and filtering
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts(page, 12, serverFilters);

  // Cart mutation hook
  const addToCartMutation = useAddToCart();

  // Load categories from backend
  useEffect(() => {
    ApiService.getCategories()
      .then(cats => {
        const options = [
          { value: '', label: 'All' },
          ...cats.map(cat => ({
            value: cat._id,
            label: cat.name,
          })),
        ];
        setCategoryOptions(options);
      })
      .catch(() => setCategoryOptions([{ value: '', label: 'All' }]));
  }, []);

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Apply client-side search filtering
  const finalFilteredProducts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return filteredProducts;
    }

    return filteredProducts.filter(
      product =>
        product.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        product.category?.name
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
    );
  }, [filteredProducts, debouncedSearchQuery]);

  // Extract conditional logic to avoid nested ternary operations
  const hasError = !!error;
  const hasProducts = finalFilteredProducts.length > 0;

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setPage(1); // Reset to first page when clearing filters
  };

  const handleStockAvailability = stock => {
    if (stock === 0) return '#f44336';
    if (stock <= 5) return '#ff9800';
    if (stock <= 15) return '#2196f3';
    return '#4caf50';
  };

  const handleAddToCart = async productId => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setActionLoading(prev => ({ ...prev, [productId]: true }));

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      showSuccess('Item added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showError(err.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Buy now handler
  const handleBuyNow = async productId => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setBuyNowLoading(prev => ({ ...prev, [productId]: true }));

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      navigate('/checkout');
    } catch (err) {
      console.error('Error in buy now:', err);
      showError(err.response?.data?.error || 'Failed to process buy now');
    } finally {
      setBuyNowLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Handle search input change
  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = e => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle price range change
  const handlePriceRangeChange = (_, value) => {
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[0] = Math.max(0, Math.min(value[0], newRange[1] || 10000));
      newRange[1] = Math.max(value[1] || 10000, newRange[0]);

      return newRange;
    });
    setPage(1); // Reset to first page when filter changes
  };

  // Handle stock filter change
  const handleStockFilterChange = e => {
    setInStockOnly(e.target.checked);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <Box sx={{ mt: 1, p: { xs: 2, md: 5 } }}>
      <Typography
        variant='h4'
        gutterBottom
        align='center'
        sx={{
          fontWeight: 700,
          fontSize: isMobile ? '1.25rem' : '2.5rem',
          letterSpacing: 1,
          mb: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 2px 8px ${theme.palette.primary.main}20`,
        }}
      >
        Product Catalogue
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <ReusableFilterControls
          isMobile={isMobile}
          filterConfig={{
            search: { placeholder: 'Search products...' },
            category: {
              type: 'select',
              options: categoryOptions,
            },
            priceRange: true,
            inStockOnly: {
              type: 'checkbox',
              label: 'In Stock Only',
            },
          }}
          filterValues={{
            searchQuery: searchQuery,
            category: selectedCategory,
            priceRange: priceRange,
            inStockOnly: inStockOnly,
          }}
          onFilterChange={(field, value) => {
            if (field === 'searchQuery') handleSearch({ target: { value } });
            else if (field === 'category')
              handleCategoryChange({ target: { value } });
            else if (field === 'priceRange')
              handlePriceRangeChange(field, value);
            else if (field === 'inStockOnly')
              handleStockFilterChange({ target: { checked: value } });
          }}
          onClearFilters={clearFilters}
          filterDrawerOpen={filterDrawerOpen}
          setFilterDrawerOpen={setFilterDrawerOpen}
          drawerTitle='Filter Products'
        />
      </Box>

      {/* Product Grid */}
      {(() => {
        if (isLoading) {
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Loading />
            </Box>
          );
        }

        if (hasError) {
          return (
            <Box
              sx={{
                textAlign: 'center',
                mt: 6,
                py: 4,
                color: theme.palette.error.main,
              }}
            >
              <Typography variant='h6' sx={{ mb: 2 }}>
                Error loading products
              </Typography>
              <Typography variant='body1'>
                Please try again later or contact support if the problem
                persists.
              </Typography>
            </Box>
          );
        }

        if (hasProducts) {
          return (
            <>
              <FilterStatusBar
                showing={finalFilteredProducts.length}
                total={filteredProducts.length}
                itemType='products'
                filters={{
                  searchQuery,
                  selectedCategory,
                  priceRange,
                  inStockOnly,
                }}
                sx={{
                  textAlign: 'center',
                  background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 2px 8px ${theme.palette.primary.main}30`,
                  px: 1,
                  py: 1,
                  borderRadius: '6px 6px 0 0',
                  width: '100%',
                  mx: 'auto',
                  mb: 1,
                }}
                isMobileView={isMobile}
              />
              <Box>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    width: '100%',
                  }}
                >
                  {finalFilteredProducts.map(p => {
                    const stockStatus = getStockStatus(p.stock);
                    const stockPercent = Math.min(
                      100,
                      Math.round(((p.stock || 0) / 30) * 100)
                    );
                    return (
                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          md: 4,
                          lg: 3,
                        }}
                        key={p._id}
                      >
                        <Card
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '500px',
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: theme.shadows[2],
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: theme.shadows[4],
                              transform: 'translateY(-2px)',
                              borderColor: theme.palette.primary.main,
                            },
                            opacity: p.stock === 0 ? 0.6 : 1,
                            position: 'relative',
                            overflow: 'hidden',
                            background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                          }}
                        >
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color}
                            size='small'
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              zIndex: 1,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: 28,
                              borderRadius: 2,
                              boxShadow: theme.shadows[2],
                              '& .MuiChip-label': {
                                px: 1.5,
                                py: 0.5,
                              },
                            }}
                          />
                          <Box
                            sx={{
                              height: '200px',
                              background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
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
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                              },
                            }}
                          >
                            <ImageWithFallback
                              src={p.images?.[0]}
                              alt={p.name}
                              fallbackText={p.name}
                              sx={{
                                maxHeight: '85%',
                                maxWidth: '85%',
                                objectFit: 'contain',
                                borderRadius: 4,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                background: '#fff',
                                filter: p.stock === 0 ? 'grayscale(1)' : 'none',
                                transition: 'transform 0.3s ease',
                              }}
                              onMouseEnter={e => {
                                if (p.stock > 0) {
                                  e.target.style.transform = 'scale(1.05)';
                                }
                              }}
                              onMouseLeave={e => {
                                e.target.style.transform = 'scale(1)';
                              }}
                            />
                          </Box>
                          <CardContent
                            sx={{
                              flexGrow: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              p: 2.5,
                              background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                              '&:last-child': {
                                pb: 2.5,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 1.5,
                                maxWidth: '240px',
                                width: '100%',
                              }}
                            >
                              <Typography
                                variant='h6'
                                component='h2'
                                sx={{
                                  fontWeight: 700,
                                  flex: 1,
                                  color: theme.palette.primary.main,
                                  lineHeight: 1.3,
                                  fontSize: '1rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {p.name}
                              </Typography>
                            </Box>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                mb: 2,
                                flex: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                                fontSize: '0.875rem',
                                color: theme.palette.text.secondary,
                                minHeight: '3.5rem',
                                minWidth: '200px',
                                wordWrap: 'break-word',
                                wordBreak: 'break-word',
                                maxWidth: '150px',
                              }}
                            >
                              {p.description || 'No description available'}
                            </Typography>
                            <Box sx={{ mt: 'auto' }}>
                              <Typography
                                sx={{
                                  mb: 1.5,
                                  fontSize: '1.1rem',
                                  fontWeight: 700,
                                  color: theme.palette.primary.main,
                                }}
                              >
                                ₹{p.price}
                              </Typography>
                              {p.category && (
                                <Typography
                                  variant='body2'
                                  sx={{
                                    mb: 1.5,
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    textTransform: 'capitalize',
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  Category: {p.category.name || p.category}
                                </Typography>
                              )}
                              <Box sx={{ mb: 1 }}>
                                <Typography
                                  variant='body2'
                                  sx={{
                                    mb: 0.5,
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  Stock: {p.stock} units
                                </Typography>
                                <LinearProgress
                                  variant='determinate'
                                  value={stockPercent}
                                  sx={{
                                    height: 6,
                                    borderRadius: 1,
                                    backgroundColor: '#f0e6d0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: handleStockAvailability(
                                        p.stock
                                      ),
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                variant='contained'
                                size='small'
                                startIcon={
                                  actionLoading[p._id] ? (
                                    <CircularProgress size={15} />
                                  ) : (
                                    <ShoppingCartIcon />
                                  )
                                }
                                disabled={p.stock === 0 || actionLoading[p._id]}
                                onClick={() => handleAddToCart(p._id)}
                                sx={{
                                  fontWeight: 600,
                                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                  color: theme.palette.primary.contrastText,
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  px: 2,
                                  boxShadow: theme.shadows[2],
                                  '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                    transform: 'translateY(-1px)',
                                    boxShadow: theme.shadows[4],
                                  },
                                }}
                              >
                                Add to Cart
                              </Button>
                              <Button
                                variant='outlined'
                                size='small'
                                startIcon={
                                  buyNowLoading[p._id] ? (
                                    <CircularProgress size={15} />
                                  ) : (
                                    <FlashOnIcon />
                                  )
                                }
                                disabled={p.stock === 0 || buyNowLoading[p._id]}
                                onClick={() => handleBuyNow(p._id)}
                                sx={{
                                  fontWeight: 600,
                                  borderColor: theme.palette.primary.main,
                                  color: theme.palette.primary.main,
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  px: 2,
                                  background: theme.palette.background.paper,
                                  boxShadow: theme.shadows[1],
                                  '&:hover': {
                                    borderColor: theme.palette.primary.dark,
                                    backgroundColor: theme.palette.action.hover,
                                    color: theme.palette.primary.dark,
                                    transform: 'translateY(-1px)',
                                    boxShadow: theme.shadows[3],
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                    mb: 2,
                    '& .MuiPagination-root': {
                      '& .MuiPaginationItem-root': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '&.Mui-selected': {
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                          color: theme.palette.common.white,
                          '&:hover': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          },
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '20',
                          transform: 'translateY(-1px)',
                          transition: 'all 0.2s ease',
                        },
                      },
                    },
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color='primary'
                    size='large'
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          );
        }

        return (
          <Box sx={{ textAlign: 'center', mt: 6, py: 4 }}>
            <Typography
              variant='h6'
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 2,
              }}
            >
              No products found
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              No products match your current search criteria. Try adjusting your
              filters or search terms.
            </Typography>
          </Box>
        );
      })()}
    </Box>
  );
};

export default Catalogue;
