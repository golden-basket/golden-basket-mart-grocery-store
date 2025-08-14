import {
  Box,
  Stack,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Pagination,
  CircularProgress,
} from '@mui/material';
import HeroBanner from '../components/HeroBanner';
import ProductCarousel from '../components/ProductCarousel';
import Loading from '../components/Loading';
import FilterStatusBar from '../components/FilterStatusBar';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import ThemeSnackbar from '../components/ThemeSnackbar';

const HomeComponent = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState({});
  const [buyNowLoading, setBuyNowLoading] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Pagination state for home page
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [displayProducts, setDisplayProducts] = useState([]);

  // Use paginated products hook with a reasonable limit for home page
  const { data: productsData, isLoading, error } = useProducts(page, 20); // Show 20 products per page

  // Cart mutation hook
  const addToCartMutation = useAddToCart();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Enhanced responsive utilities
  const {
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    getResponsiveContainer,
    getResponsiveSpacingClasses,
    getResponsiveTextClasses,
    getResponsiveButtonSize,
  } = useFoldableDisplay();

  // Update products and pagination when data changes
  useEffect(() => {
    if (productsData) {
      if (productsData.products && productsData.pagination) {
        // New paginated response
        setDisplayProducts(productsData.products);
        setTotalPages(productsData.pagination.totalPages);
      } else {
        // Fallback for non-paginated response
        setDisplayProducts(productsData);
        setTotalPages(1);
      }
    }
  }, [productsData]);

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  const filterProducts = (category) => {
    return displayProducts?.filter((p) =>
      p?.category?.name?.toLowerCase().includes(category)
    );
  };

  const uniqueCategories = Array.from(
    new Set(
      displayProducts
        ?.map((p) => p?.category?.name?.toLowerCase())
        .filter(Boolean)
    )
  );

  const filteredProducts = uniqueCategories.reduce((acc, category) => {
    acc[category] = filterProducts(category);
    return acc;
  }, {});

  // Add to cart handler
  const handleAddToCart = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      setSnackbar({
        open: true,
        message: 'Item added to cart successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to add item to cart',
        severity: 'error',
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Buy now handler
  const handleBuyNow = async (productId) => {
    setBuyNowLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      navigate('/checkout');
    } catch (err) {
      console.error('Failed to process buy now:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to process buy now',
        severity: 'error',
      });
    } finally {
      setBuyNowLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      maxWidth="xl"
      className={`${getResponsiveContainer()} ${getResponsiveSpacingClasses()}`}
      sx={{
        px: {
          xs: isExtraSmall ? 0.5 : 1,
          sm: isSmall ? 1.5 : 2,
          md: isMedium ? 2.5 : 3,
          lg: isLarge ? 3.5 : 4,
        },
      }}
    >
      <HeroBanner />

      {error && (
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 3, sm: 4, md: 5 },
            className: getResponsiveSpacingClasses(),
          }}
        >
          <Typography
            variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h4'}
            className={getResponsiveTextClasses()}
            sx={{
              color: '#a3824c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 3 },
              fontSize: {
                xs: isExtraSmall
                  ? 'clamp(1rem, 3.5vw, 1.25rem)'
                  : 'clamp(1.125rem, 4vw, 1.5rem)',
                sm: isSmall
                  ? 'clamp(1.25rem, 3.5vw, 1.75rem)'
                  : 'clamp(1.25rem, 3.5vw, 1.75rem)',
                md: isMedium
                  ? 'clamp(1.5rem, 3vw, 2rem)'
                  : 'clamp(1.5rem, 3vw, 2rem)',
              },
            }}
          >
            Failed to load products. Please try again later.
          </Typography>
        </Box>
      )}

      {displayProducts?.length === 0 && !isLoading && (
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 3, sm: 4, md: 5 },
            className: getResponsiveSpacingClasses(),
          }}
        >
          <Typography
            variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h4'}
            className={getResponsiveTextClasses()}
            sx={{
              color: '#a3824c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 3 },
              fontSize: {
                xs: isExtraSmall
                  ? 'clamp(1rem, 3.5vw, 1.25rem)'
                  : 'clamp(1.125rem, 4vw, 1.5rem)',
                sm: isSmall
                  ? 'clamp(1.25rem, 3.5vw, 1.75rem)'
                  : 'clamp(1.25rem, 3.5vw, 1.75rem)',
                md: isMedium
                  ? 'clamp(1.5rem, 3vw, 2rem)'
                  : 'clamp(1.5rem, 3vw, 2rem)',
              },
            }}
          >
            No products available. Please check back later.
          </Typography>
        </Box>
      )}

      {Object.keys(filteredProducts).map((category) => (
        <Box
          key={category}
          className={getResponsiveSpacingClasses()}
          sx={{
            mt: {
              xs: isExtraSmall ? 3 : 4,
              sm: isSmall ? 4 : 5,
              md: isMedium ? 5 : 6,
              lg: isLarge ? 6 : 7,
            },
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
            className={getResponsiveTextClasses()}
            sx={{
              mb: {
                xs: isExtraSmall ? 1.5 : 2,
                sm: isSmall ? 2 : 3,
                md: isMedium ? 3 : 4,
              },
              fontWeight: 700,
              color: '#a3824c',
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 60%, #b59961 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: { xs: '0.5px', sm: '1px' },
              textShadow: '0 2px 8px rgba(163,130,76,0.08)',
              px: {
                xs: isExtraSmall ? 0.5 : 1,
                sm: isSmall ? 1.5 : 2,
              },
              py: {
                xs: isExtraSmall ? 0.25 : 0.5,
                sm: isSmall ? 0.75 : 1,
              },
              borderRadius: 2,
              display: 'inline-block',
              fontSize: {
                xs: isExtraSmall
                  ? 'clamp(1.25rem, 4.5vw, 1.75rem)'
                  : 'clamp(1.5rem, 5vw, 2rem)',
                sm: isSmall
                  ? 'clamp(1.75rem, 4vw, 2.25rem)'
                  : 'clamp(1.75rem, 4vw, 2.25rem)',
                md: isMedium
                  ? 'clamp(2rem, 3.5vw, 2.5rem)'
                  : 'clamp(2rem, 3.5vw, 2.5rem)',
                lg: isLarge
                  ? 'clamp(2.25rem, 3vw, 3rem)'
                  : 'clamp(2.25rem, 3vw, 3rem)',
              },
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Products
          </Typography>

          <ProductCarousel
            products={filteredProducts[category]}
            renderActions={(product) => (
              <Stack
                direction="column"
                spacing={isMobile ? 0.5 : isTablet ? 0.75 : 1}
                width="100%"
              >
                <Button
                  fullWidth
                  variant="contained"
                  className={getResponsiveButtonSize()}
                  startIcon={
                    buyNowLoading[product._id] ? (
                      <CircularProgress size={15} />
                    ) : (
                      <LocalMallIcon
                        sx={{
                          color: '#fffbe6',
                          fontSize: {
                            xs: isExtraSmall ? 16 : 18,
                            sm: isSmall ? 17 : 16,
                          },
                        }}
                      />
                    )
                  }
                  disabled={product.stock === 0 || buyNowLoading[product._id]}
                  onClick={() => handleBuyNow(product._id)}
                  sx={{
                    fontWeight: 600,
                    fontSize: {
                      xs: isExtraSmall ? '0.8rem' : '0.875rem',
                      sm: isSmall ? '0.85rem' : '0.75rem',
                    },
                    minWidth: {
                      xs: isExtraSmall ? '100%' : '100%',
                      sm: isSmall ? '100%' : 'auto',
                    },
                    px: {
                      xs: isExtraSmall ? 1.5 : 2,
                      sm: isSmall ? 1.75 : 1.5,
                    },
                    py: {
                      xs: isExtraSmall ? 0.75 : 1,
                      sm: isSmall ? 0.875 : 0.5,
                    },
                    minHeight: {
                      xs: isExtraSmall ? '44px' : '48px',
                      sm: isSmall ? '46px' : '36px',
                    },
                    background:
                      'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: {
                      xs: isExtraSmall ? 1.5 : 2,
                      sm: isSmall ? 1.75 : 1,
                    },
                    boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                      color: '#000',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(163,130,76,0.15)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  Buy Now
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  className={getResponsiveButtonSize()}
                  startIcon={
                    actionLoading[product._id] ? (
                      <CircularProgress size={15} />
                    ) : (
                      <AddShoppingCartIcon
                        sx={{
                          color: '#a3824c',
                          fontSize: {
                            xs: isExtraSmall ? 16 : 18,
                            sm: isSmall ? 17 : 16,
                          },
                        }}
                      />
                    )
                  }
                  disabled={product.stock === 0 || actionLoading[product._id]}
                  onClick={() => handleAddToCart(product._id)}
                  sx={{
                    fontWeight: 600,
                    minWidth: {
                      xs: isExtraSmall ? '100%' : '100%',
                      sm: isSmall ? '100%' : 'auto',
                    },
                    px: {
                      xs: isExtraSmall ? 1.5 : 2,
                      sm: isSmall ? 1.75 : 1.5,
                    },
                    py: {
                      xs: isExtraSmall ? 0.75 : 1,
                      sm: isSmall ? 0.875 : 0.5,
                    },
                    fontSize: {
                      xs: isExtraSmall ? '0.8rem' : '0.875rem',
                      sm: isSmall ? '0.85rem' : '0.75rem',
                    },
                    minHeight: {
                      xs: isExtraSmall ? '44px' : '48px',
                      sm: isSmall ? '46px' : '36px',
                    },
                    borderColor: '#a3824c',
                    color: '#a3824c',
                    textTransform: 'none',
                    borderRadius: {
                      xs: isExtraSmall ? 1.5 : 2,
                      sm: isSmall ? 1.75 : 1,
                    },
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.07)',
                    '&:hover': {
                      borderColor: '#e6d897',
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                      color: '#866422',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(163,130,76,0.12)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </Stack>
            )}
          />
        </Box>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: {
              xs: isExtraSmall ? 3 : 4,
              sm: isSmall ? 4 : 5,
              md: isMedium ? 5 : 6,
            },
            mb: {
              xs: isExtraSmall ? 1.5 : 2,
              sm: isSmall ? 2 : 3,
            },
            gap: 2,
            className: getResponsiveSpacingClasses(),
          }}
        >
          <FilterStatusBar
            showing={displayProducts.length}
            total={displayProducts.length}
            itemType="products"
            sx={{
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              p: 0,
              mb: 1,
              '& .MuiTypography-root': {
                fontSize: {
                  xs: isExtraSmall
                    ? 'clamp(0.75rem, 2.5vw, 0.875rem)'
                    : 'clamp(0.875rem, 3vw, 1rem)',
                  sm: isSmall
                    ? 'clamp(0.875rem, 2.5vw, 1rem)'
                    : 'clamp(0.875rem, 2.5vw, 1rem)',
                },
              },
            }}
          />
          <Typography
            variant="body2"
            className={getResponsiveTextClasses()}
            sx={{
              color: '#a3824c',
              fontWeight: 500,
              textAlign: 'center',
              fontSize: {
                xs: isExtraSmall
                  ? 'clamp(0.75rem, 2.5vw, 0.875rem)'
                  : 'clamp(0.875rem, 3vw, 1rem)',
                sm: isSmall
                  ? 'clamp(0.875rem, 2.5vw, 1rem)'
                  : 'clamp(0.875rem, 2.5vw, 1rem)',
              },
            }}
          >
            Page {page} of {totalPages}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
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

            {/* Load More Button */}
            {page < totalPages && (
              <Button
                variant="outlined"
                className={getResponsiveButtonSize()}
                onClick={() => handlePageChange(null, page + 1)}
                sx={{
                  borderColor: '#a3824c',
                  color: '#a3824c',
                  fontWeight: 600,
                  px: {
                    xs: isExtraSmall ? 2 : 3,
                    sm: isSmall ? 2.5 : 3,
                  },
                  py: {
                    xs: isExtraSmall ? 0.75 : 1,
                    sm: isSmall ? 0.875 : 1,
                  },
                  borderRadius: 2,
                  fontSize: {
                    xs: isExtraSmall ? '0.8rem' : '0.875rem',
                    sm: isSmall ? '0.85rem' : '1rem',
                  },
                  minHeight: {
                    xs: isExtraSmall ? '40px' : '44px',
                    sm: isSmall ? '42px' : '48px',
                  },
                  '&:hover': {
                    borderColor: '#e6d897',
                    backgroundColor: 'rgba(163,130,76,0.1)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Load More
              </Button>
            )}
          </Box>
        </Box>
      )}

      <ThemeSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  );
};

export default HomeComponent;
