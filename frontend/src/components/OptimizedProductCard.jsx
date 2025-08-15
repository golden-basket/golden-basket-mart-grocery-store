import React, { memo, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import { useAddToCart } from '../hooks/useCart';
import { useToastNotifications } from '../hooks/useToast';

const getStockStatus = stock => {
  if (stock === 0) return { label: 'Out of Stock', color: 'error' };
  if (stock <= 5)
    return { label: `Hurry! Only ${stock} left`, color: 'warning' };
  if (stock <= 15)
    return { label: `Limited Stock: ${stock} left`, color: 'info' };
  return { label: 'In Stock', color: 'success' };
};

const OptimizedProductCard = memo(
  ({ product, onAddToCart, loading = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToastNotifications();

    const [imageLoading, setImageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [buyNowLoading, setBuyNowLoading] = useState(false);

    const addToCartMutation = useAddToCart();

    const stockStatus = getStockStatus(product?.stock || 0);

    const handleAddToCart = useCallback(async () => {
      if (!user) {
        showError('Please login to add items to cart');
        navigate('/login');
        return;
      }

      if (!product || product.stock === 0) {
        showError('Product is out of stock');
        return;
      }

      setActionLoading(true);
      try {
        await addToCartMutation.mutateAsync({
          productId: product._id,
          quantity: 1,
        });

        showSuccess(`${product.name} added to cart!`);
        if (onAddToCart) onAddToCart(product);
      } catch (error) {
        showError('Failed to add item to cart');
        console.error('Add to cart error:', error);
      } finally {
        setActionLoading(false);
      }
    }, [
      user,
      product,
      addToCartMutation,
      onAddToCart,
      showSuccess,
      showError,
      navigate,
    ]);

    const handleBuyNow = useCallback(async () => {
      if (!user) {
        showError('Please login to purchase items');
        navigate('/login');
        return;
      }

      if (!product || product.stock === 0) {
        showError('Product is out of stock');
        return;
      }

      setBuyNowLoading(true);
      try {
        // Add to cart first, then navigate to checkout
        await addToCartMutation.mutateAsync({
          productId: product._id,
          quantity: 1,
        });

        showSuccess(
          `${product.name} added to cart! Redirecting to checkout...`
        );
        navigate('/cart');
      } catch (error) {
        showError('Failed to process purchase');
        console.error('Buy now error:', error);
      } finally {
        setBuyNowLoading(false);
      }
    }, [user, product, addToCartMutation, showSuccess, showError, navigate]);

    const handleImageLoad = useCallback(() => {
      setImageLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageLoading(false);
    }, []);

    if (loading) {
      return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant='rectangular' height={200} animation='wave' />
          <CardContent
            sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Skeleton variant='text' width='80%' height={24} />
            <Skeleton variant='text' width='60%' height={20} sx={{ mt: 1 }} />
            <Skeleton variant='text' width='40%' height={20} sx={{ mt: 1 }} />
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Skeleton variant='rectangular' width='100%' height={40} />
            </Box>
          </CardContent>
        </Card>
      );
    }

    if (!product) {
      return null;
    }

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
          cursor: 'pointer',
        }}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='div'
            sx={{
              height: 200,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {imageLoading && (
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100%'
                animation='wave'
              />
            )}
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fallbackSrc='/golden-basket-rounded.png'
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoading ? 'none' : 'block',
              }}
            />
          </CardMedia>

          {/* Stock Status Chip */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <Chip
              label={stockStatus.label}
              color={stockStatus.color}
              size='small'
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: theme.palette[stockStatus.color].main,
                color: theme.palette[stockStatus.color].contrastText,
              }}
            />
          </Box>

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: theme.palette.error.main,
                color: 'white',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}
            >
              -{product.discount}%
            </Box>
          )}
        </Box>

        <CardContent
          sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}
        >
          {/* Product Name */}
          <Typography
            variant='h6'
            component='h3'
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </Typography>

          {/* Category */}
          {product.category && (
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mb: 1, fontSize: '0.875rem' }}
            >
              {product.category.name}
            </Typography>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography
              variant='h6'
              component='span'
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: isMobile ? '1.125rem' : '1.25rem',
              }}
            >
              ₹{product.price}
            </Typography>

            {product.originalPrice && product.originalPrice > product.price && (
              <Typography
                variant='body2'
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                ₹{product.originalPrice}
              </Typography>
            )}
          </Box>

          {/* Stock Info */}
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 'auto', fontSize: '0.875rem' }}
          >
            Stock: {product.stock} units
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant='contained'
              startIcon={<ShoppingCartIcon />}
              onClick={e => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={actionLoading || product.stock === 0}
              loading={actionLoading}
              sx={{
                flex: 1,
                minHeight: 40,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {actionLoading ? 'Adding...' : 'Add to Cart'}
            </Button>

            <Button
              variant='outlined'
              startIcon={<FlashOnIcon />}
              onClick={e => {
                e.stopPropagation();
                handleBuyNow();
              }}
              disabled={buyNowLoading || product.stock === 0}
              loading={buyNowLoading}
              sx={{
                minWidth: 100,
                minHeight: 40,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {buyNowLoading ? 'Processing...' : 'Buy Now'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;
