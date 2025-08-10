import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import Slider from 'react-slick';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductCarousel = memo(({ title, products, renderActions }) => {
  const { 
    isMobile, 
    isTablet, 
    isFoldable, 
    isUltraWide, 
    getFoldableClasses, 
    getResponsiveValue, 
    getFoldableSpacing 
  } = useFoldableDisplay();

  // Memoize settings to prevent unnecessary re-renders
  const settings = useMemo(() => ({
    dots: true,
    infinite: products.length > 4,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: !isMobile && !isFoldable, // Hide arrows on mobile and foldable for better UX
    slidesToShow: Math.min(
      isFoldable ? 1 : isMobile ? 1 : isTablet ? 2 : 4, 
      products.length
    ),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { 
          slidesToShow: Math.min(isUltraWide ? 2 : 3, products.length),
          arrows: !isFoldable,
        },
      },
      {
        breakpoint: 900,
        settings: { 
          slidesToShow: Math.min(2, products.length),
          arrows: !isFoldable,
        },
      },
      { 
        breakpoint: 600, 
        settings: { 
          slidesToShow: 1,
          arrows: false,
          dots: true,
        } 
      },
    ],
    // Touch-friendly settings for mobile and foldable
    touchThreshold: isFoldable ? 5 : 10,
    swipeToSlide: true,
    draggable: true,
  }), [products.length, isMobile, isTablet, isFoldable, isUltraWide]);

  return (
    <Box
      className={getFoldableClasses()}
      sx={{
        mb: getResponsiveValue(3, 4, 5, isFoldable ? 3.5 : undefined),
        px: getResponsiveValue(1, 2, 3, isFoldable ? 1.5 : undefined),
        py: getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined),
        background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
        borderRadius: getResponsiveValue(2, 3, 4, isFoldable ? 3 : undefined),
        boxShadow: '0 4px 20px 0 rgba(163,130,76,0.12)',
        mx: getResponsiveValue(1, 2, 3, isFoldable ? 1.5 : undefined),
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isFoldable ? '0 4px 20px 0 rgba(163,130,76,0.12)' : '0 6px 24px 0 rgba(163,130,76,0.18)',
        },
      }}
    >
      {title && (
        <Typography
          variant={getResponsiveValue("h6", "h5", "h4", isFoldable ? "h5" : undefined)}
          fontWeight={700}
          mb={getResponsiveValue(2, 3, 4, isFoldable ? 2.5 : undefined)}
          sx={{
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 60%, #b59961 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: getResponsiveValue('0.5px', '1px', '1px', isFoldable ? '0.75px' : undefined),
            textShadow: '0 2px 8px rgba(163,130,76,0.08)',
            px: getResponsiveValue(1, 2, 2, isFoldable ? 1.5 : undefined),
            py: getResponsiveValue(0.5, 1, 1, isFoldable ? 0.75 : undefined),
            borderRadius: 2,
            display: 'inline-block',
            fontSize: isFoldable 
              ? 'clamp(1.125rem, 4vw, 1.375rem)'
              : { 
                  xs: 'clamp(1.25rem, 5vw, 1.5rem)', 
                  sm: 'clamp(1.5rem, 4vw, 1.75rem)', 
                  md: 'clamp(1.75rem, 3vw, 2rem)'
                },
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ 
        '& .slick-slider': { 
          px: getResponsiveValue(0, 1, 2, isFoldable ? 0.5 : undefined),
        },
        '& .slick-dots': {
          bottom: getResponsiveValue(-30, -35, -40, isFoldable ? -32 : undefined),
          '& li button:before': {
            fontSize: getResponsiveValue('8px', '10px', '12px', isFoldable ? '9px' : undefined),
            color: '#a3824c',
          },
          '& li.slick-active button:before': {
            color: '#866422',
          },
        },
        '& .slick-arrow': {
          width: getResponsiveValue(32, 36, 40, isFoldable ? 34 : undefined),
          height: getResponsiveValue(32, 36, 40, isFoldable ? 34 : undefined),
          '&:before': {
            fontSize: getResponsiveValue('16px', '18px', '20px', isFoldable ? '17px' : undefined),
          },
        },
      }}>
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product._id} sx={{ px: getResponsiveValue(0.5, 1, 1.5, isFoldable ? 0.75 : undefined) }}>
              <Card
                sx={{
                  minWidth: isFoldable ? 180 : { xs: 200, sm: 220, md: 240, lg: 260 },
                  maxWidth: isFoldable ? 260 : { xs: 280, sm: 300, md: 320, lg: 340 },
                  borderRadius: getResponsiveValue(2, 3, 4, isFoldable ? 3 : undefined),
                  boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
                  background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
                  border: '1px solid #e6d897',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: isFoldable ? '0 4px 16px 0 rgba(163,130,76,0.15)' : '0 8px 24px 0 rgba(163,130,76,0.20)',
                    borderColor: '#a3824c',
                    transform: isFoldable ? 'none' : 'translateY(-2px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    objectFit: 'contain',
                    p: getResponsiveValue(1, 1.5, 2, isFoldable ? 1.25 : undefined),
                    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
                    width: '100%',
                    height: isFoldable ? 150 : { xs: 140, sm: 160, md: 180, lg: 200 },
                    borderRadius: getResponsiveValue(1, 2, 3, isFoldable ? 2 : undefined),
                    minHeight: isFoldable ? 150 : { xs: 140, sm: 160, md: 180, lg: 200 },
                  }}
                  image={
                    product.images?.[0] ||
                    `https://via.placeholder.com/220x180?text=${encodeURIComponent(
                      product.name
                    )}`
                  }
                  alt={product.name}
                  loading="lazy"
                />
                <CardContent
                  sx={{
                    px: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 1.75 : undefined),
                    py: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 1.75 : undefined),
                    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: getResponsiveValue(1, 2, 3, isFoldable ? 2 : undefined),
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant={getResponsiveValue("body1", "subtitle1", "subtitle1", isFoldable ? "body1" : undefined)}
                      fontWeight={600}
                      sx={{
                        color: '#a3824c',
                        mb: getResponsiveValue(0.5, 1, 1, isFoldable ? 0.75 : undefined),
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontSize: isFoldable 
                          ? 'clamp(0.8rem, 2.5vw, 0.9rem)'
                          : { 
                              xs: 'clamp(0.875rem, 3vw, 1rem)', 
                              sm: 'clamp(1rem, 2.5vw, 1.125rem)'
                            },
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#7d6033',
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        mb: getResponsiveValue(0.5, 1, 1, isFoldable ? 0.75 : undefined),
                        fontSize: isFoldable 
                          ? 'clamp(0.7rem, 2vw, 0.8rem)'
                          : { 
                              xs: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                              sm: 'clamp(0.875rem, 2vw, 1rem)'
                            },
                      }}
                    >
                      ₹{product.price} &nbsp;|&nbsp; {product.category?.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#866422',
                        fontSize: isFoldable 
                          ? 'clamp(0.7rem, 2vw, 0.8rem)'
                          : { 
                              xs: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                              sm: 'clamp(0.875rem, 2vw, 1rem)'
                            },
                        mb: getResponsiveValue(0.5, 1, 1, isFoldable ? 0.75 : undefined),
                        minHeight: getResponsiveValue(32, 36, 40, isFoldable ? 34 : undefined),
                        maxHeight: getResponsiveValue(32, 36, 40, isFoldable ? 34 : undefined),
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4,
                      }}
                    >
                      {product.description}
                    </Typography>
                    
                    <Typography
                      variant="caption"
                      sx={{
                        color: product.stock > 0 ? '#4caf50' : '#f44336',
                        fontWeight: 600,
                        mb: getResponsiveValue(1, 1.5, 1.5, isFoldable ? 1.25 : undefined),
                        display: 'block',
                        fontSize: isFoldable 
                          ? 'clamp(0.65rem, 1.8vw, 0.75rem)'
                          : { 
                              xs: 'clamp(0.7rem, 2vw, 0.8rem)', 
                              sm: 'clamp(0.8rem, 1.8vw, 0.9rem)'
                            },
                      }}
                    >
                      {product.stock > 0
                        ? `In Stock (${product.stock})`
                        : 'Out of Stock'}
                    </Typography>
                  </Box>

                  {/* Primary actions: Add to Cart & Buy Now */}
                  {renderActions && (
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 1, sm: 1.5 }} 
                      sx={{ 
                        mt: 'auto',
                        pt: getResponsiveValue(1, 1.5, 1.5, isFoldable ? 1.25 : undefined),
                      }}
                    >
                      {renderActions(product)}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
});

ProductCarousel.propTypes = {
  title: PropTypes.string,
  products: PropTypes.array.isRequired,
  renderActions: PropTypes.func,
};

export default ProductCarousel;
