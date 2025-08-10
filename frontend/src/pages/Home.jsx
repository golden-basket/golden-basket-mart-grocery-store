import { Box, Typography, Button, Container, useTheme, useMediaQuery, Pagination } from '@mui/material';
import HeroBanner from '../components/HeroBanner';
import ProductCarousel from '../components/ProductCarousel';
import Loading from '../components/Loading';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useState, useEffect } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const HomeComponent = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState({});
  
  // Pagination state for home page
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [displayProducts, setDisplayProducts] = useState([]);
  
  // Use paginated products hook with a reasonable limit for home page
  const { data: productsData, isLoading, error } = useProducts(page, 20); // Show 20 products per page
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
    new Set(displayProducts?.map((p) => p?.category?.name?.toLowerCase()).filter(Boolean))
  );

  const filteredProducts = uniqueCategories.reduce((acc, category) => {
    acc[category] = filterProducts(category);
    return acc;
  }, {});

  // Add to cart handler
  const handleAddToCart = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await ApiService.addToCart(productId, 1);
      // Optionally show a snackbar or refresh cart state
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Buy now handler
  const handleBuyNow = async (productId) => {
    await handleAddToCart(productId);
    navigate('/checkout');
  };

  if (isLoading) return <Loading />;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
      <HeroBanner />
      
      {error && (
        <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 4, md: 5 } }}>
          <Typography
            variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
            sx={{
              color: '#a3824c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 3 },
              fontSize: { 
                xs: 'clamp(1.125rem, 4vw, 1.5rem)', 
                sm: 'clamp(1.25rem, 3.5vw, 1.75rem)', 
                md: 'clamp(1.5rem, 3vw, 2rem)'
              },
            }}
          >
            Failed to load products. Please try again later.
          </Typography>
        </Box>
      )}

      {displayProducts?.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 4, md: 5 } }}>
          <Typography
            variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
            sx={{
              color: '#a3824c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 3 },
              fontSize: { 
                xs: 'clamp(1.125rem, 4vw, 1.5rem)', 
                sm: 'clamp(1.25rem, 3.5vw, 1.75rem)', 
                md: 'clamp(1.5rem, 3vw, 2rem)'
              },
            }}
          >
            No products available. Please check back later.
          </Typography>
        </Box>
      )}

      {Object.keys(filteredProducts).map((category) => (
        <Box key={category} sx={{ mt: { xs: 4, sm: 5, md: 6, lg: 7 } }}>
          <Typography
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              fontWeight: 700,
              color: '#a3824c',
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 60%, #b59961 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: { xs: '0.5px', sm: '1px' },
              textShadow: '0 2px 8px rgba(163,130,76,0.08)',
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              borderRadius: 2,
              display: 'inline-block',
              fontSize: { 
                xs: 'clamp(1.5rem, 5vw, 2rem)', 
                sm: 'clamp(1.75rem, 4vw, 2.25rem)', 
                md: 'clamp(2rem, 3.5vw, 2.5rem)',
                lg: 'clamp(2.25rem, 3vw, 3rem)'
              },
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Products
          </Typography>
          
          <ProductCarousel
            products={filteredProducts[category]}
            renderActions={(product) => (
              <>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "small"}
                  startIcon={
                    <LocalMallIcon sx={{ 
                      color: '#fffbe6', 
                      fontSize: { xs: 18, sm: 16 } 
                    }} />
                  }
                  disabled={product.stock === 0 || actionLoading[product._id]}
                  onClick={() => handleBuyNow(product._id)}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '0.75rem' },
                    minWidth: { xs: '100%', sm: 'auto' },
                    px: { xs: 2, sm: 1.5 },
                    py: { xs: 1, sm: 0.5 },
                    minHeight: { xs: '48px', sm: '36px' },
                    background:
                      'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: { xs: 2, sm: 1 },
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
                  {actionLoading[product._id] ? 'Processing...' : 'Buy Now'}
                </Button>
                
                <Button
                  variant="outlined"
                  size={isMobile ? "medium" : "small"}
                  startIcon={
                    <AddShoppingCartIcon
                      sx={{ 
                        color: '#a3824c', 
                        fontSize: { xs: 18, sm: 16 } 
                      }}
                    />
                  }
                  disabled={product.stock === 0 || actionLoading[product._id]}
                  onClick={() => handleAddToCart(product._id)}
                  sx={{
                    fontWeight: 600,
                    minWidth: { xs: '100%', sm: 'auto' },
                    px: { xs: 2, sm: 1.5 },
                    py: { xs: 1, sm: 0.5 },
                    fontSize: { xs: '0.875rem', sm: '0.75rem' },
                    minHeight: { xs: '48px', sm: '36px' },
                    borderColor: '#a3824c',
                    color: '#a3824c',
                    textTransform: 'none',
                    borderRadius: { xs: 2, sm: 1 },
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
                  {actionLoading[product._id] ? 'Adding...' : 'Add to Cart'}
                </Button>
              </>
            )}
          />
        </Box>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          mt: { xs: 4, sm: 5, md: 6 }, 
          mb: { xs: 2, sm: 3 },
          gap: 2
        }}>
          <Typography
            variant="body2"
            sx={{
              color: '#a3824c',
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            Page {page} of {totalPages} • Showing {displayProducts.length} products
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
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
            
            {/* Load More Button */}
            {page < totalPages && (
              <Button
                variant="outlined"
                onClick={() => handlePageChange(null, page + 1)}
                sx={{
                  borderColor: '#a3824c',
                  color: '#a3824c',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
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
    </Container>
  );
};

export default HomeComponent;
