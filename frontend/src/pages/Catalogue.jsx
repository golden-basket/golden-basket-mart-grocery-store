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
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 8px rgba(163,130,76,0.1)',
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
      {isLoading ? (
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
      ) : error ? (
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            py: 4,
            color: '#d32f2f',
          }}
        >
          <Typography variant='h6' sx={{ mb: 2 }}>
            Error loading products
          </Typography>
          <Typography variant='body1'>
            Please try again later or contact support if the problem persists.
          </Typography>
        </Box>
      ) : finalFilteredProducts.length > 0 ? (
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
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              borderBottom: '2px solid #a3824c',
              boxShadow: '0 2px 8px rgba(163,130,76,0.15)',
              px: 1,
              py: 1,
              borderRadius: '8px 8px 0 0',
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
                p: 1,
                m: 'auto',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                justifyItems: 'space-between',
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
                    span={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                      xl: 2.4,
                    }}
                    key={p._id}
                  >
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '500px',
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
                      }}
                    >
                      <Chip
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size='small'
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          background:
                            'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                          color: '#a3824c',
                        }}
                      />
                      <Box
                        sx={{
                          height: '200px',
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
                        <ImageWithFallback
                          src={p.images?.[0]}
                          alt={p.name}
                          fallbackText={p.name}
                          sx={{
                            maxHeight: '85%',
                            maxWidth: '85%',
                            objectFit: 'contain',
                            borderRadius: 8,
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
                          background:
                            'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
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
                              color: '#a3824c',
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
                            color: '#7d6033',
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
                              color: '#a3824c',
                            }}
                          >
                            ₹{p.price}
                          </Typography>
                          {p.category && (
                            <Typography
                              variant='body2'
                              sx={{
                                mb: 1.5,
                                color: '#866422',
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
                                color: '#866422',
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
            <Box
              sx={{
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
                      background:
                        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                      color: '#fff',
                      '&:hover': {
                        background:
                          'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(163,130,76,0.1)',
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
                    color: '#a3824c',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      backgroundColor:
                        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
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
            variant='h6'
            sx={{
              color: '#a3824c',
              fontWeight: 600,
              mb: 2,
            }}
          >
            No products found
          </Typography>
          <Typography
            variant='body1'
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
