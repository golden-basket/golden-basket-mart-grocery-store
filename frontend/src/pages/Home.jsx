import { Box, Typography, Button, Stack } from '@mui/material';
import HeroBanner from '../components/HeroBanner';
import ProductCarousel from '../components/ProductCarousel';
import Loading from '../components/Loading';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useState } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const HomeComponent = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState({});
  const { data: products, isLoading, error } = useProducts();

  const filterProducts = (category) => {
    return products?.filter((p) =>
      p?.category.name.toLowerCase().includes(category)
    );
  };

  const uniqueCategories = Array.from(
    new Set(products?.map((p) => p?.category.name.toLowerCase()))
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
    <Box sx={{ px: { xs: 2, md: 5 } }}>
      <HeroBanner />
      {error && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#a3824c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Failed to load products. Please try again later.
          </Typography>
        </Box>
      )}

      {products?.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#a3824c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            No products available. Please check back later.
          </Typography>
        </Box>
      )}

      {Object.keys(filteredProducts).map((category) => (
        <Box key={category} sx={{ mt: 5 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#a3824c',
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 60%, #b59961 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 1,
              textShadow: '0 2px 8px rgba(163,130,76,0.08)',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              display: 'inline-block',
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
                  size="small"
                  startIcon={
                    <LocalMallIcon sx={{ color: '#fffbe6', fontSize: 16 }} />
                  }
                  disabled={product.stock === 0 || actionLoading[product._id]}
                  onClick={() => handleBuyNow(product._id)}
                  sx={{
                    fontWeight: 600,
                    fontSize: 12,
                    minWidth: 0,
                    px: 1.5,
                    py: 0.5,
                    background:
                      'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                      color: '#000',
                    },
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={
                    <AddShoppingCartIcon
                      sx={{ color: '#a3824c', fontSize: 16 }}
                    />
                  }
                  disabled={product.stock === 0 || actionLoading[product._id]}
                  onClick={() => handleAddToCart(product._id)}
                  sx={{
                    fontWeight: 600,
                    minWidth: 0,
                    px: 1.5,
                    py: 0.5,
                    fontSize: 12,
                    borderColor: '#a3824c',
                    color: '#a3824c',
                    textTransform: 'none',
                    borderRadius: 1,
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.07)',
                    '&:hover': {
                      borderColor: '#e6d897',
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                      color: '#866422',
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
    </Box>
  );
};

export default HomeComponent;
