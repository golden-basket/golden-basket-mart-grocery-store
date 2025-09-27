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
import { useToastNotifications } from '../hooks/useToast';

const HomeComponent = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastNotifications();
  const [actionLoading, setActionLoading] = useState({});
  const [buyNowLoading, setBuyNowLoading] = useState({});

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

  // Extract responsive variants to avoid nested ternary operations
  const errorVariant = isMobile ? 'h6' : isTablet ? 'h5' : 'h4';
  const warningVariant = isMobile ? 'h6' : isTablet ? 'h5' : 'h4';
  const categoryVariant = isMobile ? 'h5' : isTablet ? 'h4' : 'h3';
  const stackSpacing = isMobile ? 0.5 : isTablet ? 0.75 : 1;

  // Simplified responsive utilities
  const { getResponsiveContainer, getResponsiveSpacingClasses } =
    useFoldableDisplay();

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

  const filterProducts = category => {
    return displayProducts?.filter(p =>
      p?.category?.name?.toLowerCase().includes(category)
    );
  };

  const uniqueCategories = Array.from(
    new Set(
      displayProducts
        ?.map(p => p?.category?.name?.toLowerCase())
        .filter(Boolean)
    )
  );

  const filteredProducts = uniqueCategories.reduce((acc, category) => {
    acc[category] = filterProducts(category);
    return acc;
  }, {});

  // Add to cart handler
  const handleAddToCart = async productId => {
    setActionLoading(prev => ({ ...prev, [productId]: true }));

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      showSuccess('Item added to cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showError(err.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Buy now handler
  const handleBuyNow = async productId => {
    setBuyNowLoading(prev => ({ ...prev, [productId]: true }));

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      navigate('/checkout');
    } catch (err) {
      console.error('Failed to process buy now:', err);
      showError(err.response?.data?.error || 'Failed to process buy now');
    } finally {
      setBuyNowLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      maxWidth='xl'
      className={`${getResponsiveContainer()} ${getResponsiveSpacingClasses()}`}
      sx={{
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
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
            variant={errorVariant}
            sx={{
              color: theme.palette.error.main,
              fontWeight: 700,
              mb: { xs: 2, sm: 3 },
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
            variant={warningVariant}
            sx={{
              color: theme.palette.warning.main,
              fontWeight: 700,
              mb: { xs: 2, sm: 3 },
            }}
          >
            No products available. Please check back later.
          </Typography>
        </Box>
      )}

      {Object.keys(filteredProducts).map(category => (
        <Box
          key={category}
          className={getResponsiveSpacingClasses()}
          sx={{
            mt: { xs: 4, sm: 5, md: 6, lg: 7 },
          }}
        >
          <Typography
            variant={categoryVariant}
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              fontWeight: 700,
              color: theme.palette.primary.main,
              letterSpacing: { xs: '0.5px', sm: '1px' },
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              borderRadius: 0.5,
              display: 'inline-block',
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Products
          </Typography>

          <ProductCarousel
            products={filteredProducts[category]}
            renderActions={product => (
              <Stack direction='column' spacing={stackSpacing} width='100%'>
                <Button
                  fullWidth
                  variant='contained'
                  startIcon={
                    buyNowLoading[product._id] ? (
                      <CircularProgress size={15} />
                    ) : (
                      <LocalMallIcon
                        sx={{ color: theme.palette.primary.contrastText }}
                      />
                    )
                  }
                  disabled={product.stock === 0 || buyNowLoading[product._id]}
                  onClick={() => handleBuyNow(product._id)}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '0.75rem' },
                    px: { xs: 2, sm: 1.5 },
                    py: { xs: 1, sm: 0.5 },
                    minHeight: { xs: '48px', sm: '36px' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[6],
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  Buy Now
                </Button>

                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={
                    actionLoading[product._id] ? (
                      <CircularProgress size={15} />
                    ) : (
                      <AddShoppingCartIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                    )
                  }
                  disabled={product.stock === 0 || actionLoading[product._id]}
                  onClick={() => handleAddToCart(product._id)}
                  sx={{
                    fontWeight: 600,
                    px: { xs: 2, sm: 1.5 },
                    py: { xs: 1, sm: 0.5 },
                    fontSize: { xs: '0.875rem', sm: '0.75rem' },
                    minHeight: { xs: '48px', sm: '36px' },
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    borderRadius: 2,
                    background: theme.palette.background.paper,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
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
            mt: { xs: 4, sm: 5, md: 6 },
            mb: { xs: 2, sm: 3 },
            gap: 2,
            className: getResponsiveSpacingClasses(),
          }}
        >
          <FilterStatusBar
            showing={displayProducts.length}
            total={displayProducts.length}
            itemType='products'
            sx={{
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              p: 0,
              mb: 1,
              '& .MuiTypography-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          />
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' },
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
              color='primary'
              size={isMobile ? 'small' : 'medium'}
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

            {/* Load More Button */}
            {page < totalPages && (
              <Button
                variant='outlined'
                onClick={() => handlePageChange(null, page + 1)}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: { xs: 3, sm: 3 },
                  py: { xs: 1, sm: 1 },
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minHeight: { xs: '44px', sm: '48px' },
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Load More
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HomeComponent;
