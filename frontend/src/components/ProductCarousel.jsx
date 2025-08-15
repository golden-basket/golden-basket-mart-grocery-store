import PropTypes from 'prop-types';
import { memo, useMemo, useCallback } from 'react';
import Slider from 'react-slick';
import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import ImageWithFallback from './ImageWithFallback';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductCarousel = memo(({ title, products, renderActions }) => {
  const {
    isMobile,
    isTablet,
    isFoldable,
    isUltraWide,
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    getFoldableClasses,
    getResponsiveValue,
    getResponsiveSpacing,
    getResponsiveCardSize,
    getResponsiveTextClasses,
    getResponsiveSpacingClasses,
    getResponsiveImageSize,
  } = useFoldableDisplay();

  // Calculate responsive slides to show based on screen size and product count
  const getSlidesToShow = useCallback(() => {
    const maxSlides = isMobile ? 1 : isTablet ? 2 : 3; // Max slides per screen size
    return Math.min(maxSlides, products.length);
  }, [isMobile, isTablet, products.length]);

  // Calculate responsive card width based on number of products and screen size
  const getCardWidth = () => {
    const slidesToShow = getSlidesToShow();
    const containerPadding = getResponsiveSpacing(0.5, 0.75, 1, 1.5, 2, 2.5);
    const slidePadding = getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.5, 2);

    // Calculate width based on number of items
    let itemWidth;
    if (products.length <= 2) {
      // 1-2 items: take half width each
      itemWidth = `calc((100% - ${containerPadding * 2}px - ${
        slidePadding * 2 * slidesToShow
      }px) / 2)`;
    } else {
      // 3+ items: take one-third width each (or based on slidesToShow)
      itemWidth = `calc((100% - ${containerPadding * 2}px - ${
        slidePadding * 2 * slidesToShow
      }px) / ${slidesToShow})`;
    }

    return itemWidth;
  };

  // Memoize settings to prevent unnecessary re-renders
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: products.length > getSlidesToShow(),
      speed: 500,
      autoplay: true,
      autoplaySpeed: 4500,
      arrows: !isMobile && !isFoldable, // Hide arrows on mobile and foldable for better UX
      slidesToShow: getSlidesToShow(),
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200, // Laptop and larger
          settings: {
            slidesToShow:
              products.length <= 2
                ? products.length
                : Math.min(3, products.length),
            arrows: !isFoldable,
            variableWidth: false,
            centerMode: false, // Disable center mode to prevent overlap
            centerPadding: '0px',
          },
        },
        {
          breakpoint: 900, // Tablet
          settings: {
            slidesToShow:
              products.length <= 2
                ? products.length
                : Math.min(2, products.length),
            arrows: !isFoldable,
            variableWidth: false,
            centerMode: false, // Disable center mode to prevent overlap
            centerPadding: '0px',
          },
        },
        {
          breakpoint: 600, // Mobile
          settings: {
            slidesToShow: 1,
            arrows: false,
            dots: true,
            variableWidth: false,
            centerMode: false,
            centerPadding: '0px',
          },
        },
      ],
      // Touch-friendly settings for mobile and foldable
      touchThreshold: isFoldable ? 5 : 10,
      swipeToSlide: true,
      draggable: true,
      centerMode: false, // Disable center mode to prevent overlap
      centerPadding: '0px', // Remove center padding to prevent overlap
      // Add proper spacing between slides
      variableWidth: false, // Use fixed width for better control
      adaptiveHeight: false, // Prevent height issues
    }),
    [products.length, isMobile, isFoldable, getSlidesToShow]
  );

  return (
    <Box
      className={`${getFoldableClasses()} ${getResponsiveCardSize()} ${getResponsiveSpacingClasses()}`}
      sx={{
        mb: getResponsiveSpacing(1.5, 2, 2.5, 3, 3.5, 4),
        px: getResponsiveSpacing(0.5, 0.75, 1, 1.5, 2, 2.5),
        py: getResponsiveSpacing(2, 2.5, 3, 3.5, 4, 4.5),
        minHeight: getResponsiveSpacing(300, 350, 400, 450, 500, 550),
        background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
        borderRadius: getResponsiveSpacing(1, 1.5, 2, 2.5, 3, 3.5),
        boxShadow: '0 4px 20px 0 rgba(163,130,76,0.12)',
        mx: getResponsiveSpacing(0.5, 0.75, 1, 1.5, 2, 2.5),
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isFoldable
            ? '0 4px 20px 0 rgba(163,130,76,0.12)'
            : '0 6px 24px 0 rgba(163,130,76,0.18)',
        },
      }}
    >
      {title && (
        <Typography
          variant={getResponsiveValue(
            'h6',
            'h5',
            'h4',
            'h4',
            'h4',
            'h4',
            isFoldable ? 'h5' : undefined
          )}
          fontWeight={700}
          mb={getResponsiveSpacing(1, 1.5, 2, 2.5, 3, 3.5)}
          className={getResponsiveTextClasses()}
          align='center'
          sx={{
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 60%, #b59961 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: getResponsiveValue(
              '0.25px',
              '0.35px',
              '0.5px',
              '0.6px',
              '0.7px',
              '0.8px',
              isFoldable ? '0.35px' : undefined
            ),
            textShadow: '0 2px 8px rgba(163,130,76,0.08)',
            px: getResponsiveSpacing(0.25, 0.4, 0.6, 0.8, 1, 1.2),
            py: getResponsiveSpacing(0.15, 0.15, 0.25, 0.35, 0.4, 0.45),
            borderRadius: 2,
            display: 'inline-block',
            textAlign: 'center',
            width: '100% !important',
            fontSize: getResponsiveValue(
              '0.65rem', // extra small - reduced from clamp
              '0.7rem', // small - reduced from clamp
              '0.75rem', // medium - reduced from clamp
              '0.8rem', // large - reduced from clamp
              '0.85rem', // extra large - reduced from clamp
              '0.9rem', // ultra wide - reduced from clamp
              isFoldable ? '0.7rem' : undefined
            ),
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          '& .slick-slider': {
            px: getResponsiveSpacing(0, 0.25, 0.5, 1, 1, 1),
          },
          '& .slick-list': {
            // Ensure proper spacing and prevent overlapping
            padding: '0 !important',
            margin: '0 auto',
            overflow: 'hidden', // Prevent overflow issues
            height: 'auto', // Allow natural height expansion
          },
          '& .slick-track': {
            // Center the track and ensure proper alignment
            display: 'flex !important',
            alignItems: 'stretch',
            justifyContent: 'center', // Center the slides
            gap: 0, // Ensure no gaps between slides
            minHeight: getResponsiveValue(
              '300px', // extra small
              '340px', // small
              '380px', // medium
              '420px', // large
              '460px', // extra large
              '500px', // ultra wide
              isFoldable ? '320px' : undefined
            ),
            width: '100%',
          },
          '& .slick-slide': {
            // Ensure slides don't overlap and are properly spaced
            height: 'auto !important',
            display: 'flex !important',
            justifyContent: 'center',
            alignItems: 'stretch',
            padding: `0 ${getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.5, 2)}px`, // Add consistent padding
            boxSizing: 'border-box', // Include padding in width calculation
            minHeight: getResponsiveValue(
              '300px', // extra small
              '340px', // small
              '380px', // medium
              '420px', // large
              '460px', // extra large
              '500px', // ultra wide
              isFoldable ? '320px' : undefined
            ),
            width:
              products.length <= 2
                ? `calc((100% - ${
                    getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.5, 2) * 2 * 2
                  }px) / 2) !important`
                : `calc((100% - ${
                    getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.5, 2) *
                    2 *
                    getSlidesToShow()
                  }px) / ${getSlidesToShow()}) !important`,
            '& > div': {
              justifyContent: 'center',
            },
          },
          '& .slick-dots': {
            bottom: getResponsiveSpacing(-20, -25, -28, -30, -35, -40),
            '& li button': {
              padding: '0 !important',
              width: '0 !important',
            },
            '& li button:before': {
              fontSize: getResponsiveSpacing(
                '5px',
                '6px',
                '7px',
                '8px',
                '10px',
                '12px'
              ),
              color: '#a3824c',
            },
            '& li.slick-active button:before': {
              color: '#866422',
            },
            '& li button:hover:before': {
              color: '#a3824c',
            },
          },
          '& .slick-arrow': {
            width: getResponsiveSpacing(24, 28, 30, 32, 36, 40),
            height: getResponsiveSpacing(24, 28, 30, 32, 36, 40),
            zIndex: 10, // Ensure arrows are above cards
            '&:before': {
              fontSize: getResponsiveSpacing(
                '12px',
                '14px',
                '15px',
                '16px',
                '18px',
                '20px'
              ),
            },
            '&.slick-prev': {
              left: getResponsiveSpacing(-6, -8, -10, -12, -15, -18),
            },
            '&.slick-next': {
              right: getResponsiveSpacing(-6, -8, -10, -12, -15, -18),
            },
          },
          '& .slick-arrow:hover': {
            transform: 'translateY(-20px) !important',
            background: 'rgba(163, 130, 76, 0.1)',
          },
        }}
      >
        <Slider {...settings}>
          {products.map(product => (
            <Box
              key={product._id}
              sx={{
                margin: '0 auto',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Card
                className={getResponsiveCardSize()}
                sx={{
                  margin: 'auto',
                  p: getResponsiveValue(
                    1.5, // extra small
                    1.75, // small
                    2, // medium
                    2.25, // large
                    2.5, // extra large
                    2.75, // ultra wide
                    isFoldable ? 1.5 : undefined
                  ),
                  borderRadius: getResponsiveSpacing(1, 1.5, 2, 2.5, 3, 3.5),
                  position: 'relative', // For absolute positioning of stock chip
                  overflow: 'visible', // Allow chip to overflow slightly
                  background:
                    'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
                  border: '1px solid rgba(163,130,76,0.1)',
                  boxShadow: '0 4px 12px rgba(163,130,76,0.08)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'stretch', // Ensure all cards have same height
                  alignItems: 'center',
                  width: getCardWidth(),
                  minWidth: getResponsiveValue(
                    isExtraSmall ? 240 : 260, // extra small
                    isSmall ? 260 : 280, // small
                    isMedium ? 280 : 300, // medium
                    isLarge ? 300 : 320, // large
                    isUltraWide ? 320 : 340, // extra large
                    isUltraWide ? 340 : 360, // ultra wide
                    isFoldable ? 260 : undefined
                  ),
                  maxWidth: getResponsiveValue(
                    isExtraSmall ? 280 : 300, // extra small
                    isSmall ? 300 : 320, // small
                    isMedium ? 320 : 340, // medium
                    isLarge ? 340 : 360, // large
                    isUltraWide ? 360 : 380, // extra large
                    isUltraWide ? 380 : 400, // ultra wide
                    isFoldable ? 300 : undefined
                  ),
                  height: getResponsiveValue(
                    isExtraSmall ? 380 : 400, // extra small
                    isSmall ? 400 : 420, // small
                    isMedium ? 420 : 440, // medium
                    isLarge ? 440 : 460, // large
                    isUltraWide ? 460 : 480, // extra large
                    isUltraWide ? 480 : 500, // ultra wide
                    isFoldable ? 400 : undefined
                  ),
                  '&:hover': {
                    boxShadow: isFoldable
                      ? '0 8px 24px rgba(163,130,76,0.15)'
                      : '0 8px 32px rgba(163,130,76,0.2)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Stock Chip - Top Right Corner */}
                <Chip
                  label={
                    product.stock === 0
                      ? 'Out of Stock'
                      : product.stock <= 5
                        ? `${product.stock} left`
                        : `Stock`
                  }
                  size='small'
                  sx={{
                    p: getResponsiveSpacing(0.5, 0.75, 1, 1.25, 1.5, 1.75),
                    position: 'absolute',
                    top: getResponsiveSpacing(0.5, 0.75, 1, 1.25, 1.5, 1.75),
                    right: getResponsiveSpacing(0.5, 0.75, 1, 1.25, 1.5, 1.75),
                    zIndex: 2,
                    fontSize: getResponsiveValue(
                      '0.55rem', // extra small
                      '0.6rem', // small
                      '0.65rem', // medium
                      '0.7rem', // large
                      '0.75rem', // extra large
                      '0.8rem', // ultra wide
                      isFoldable ? '0.6rem' : undefined
                    ),
                    fontWeight: 600,
                    height: getResponsiveValue(
                      20, // extra small
                      22, // small
                      24, // medium
                      26, // large
                      28, // extra large
                      30, // ultra wide
                      isFoldable ? 22 : undefined
                    ),
                    m: getResponsiveSpacing(0.1, 0.25, 0.25, 0.5, 0.75, 1),
                    px: getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.25, 1.5),
                    background:
                      product.stock === 0
                        ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
                        : product.stock <= 5
                          ? 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)'
                          : 'linear-gradient(135deg, #a3824c 0%, #e6d897 100%)',
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '& .MuiChip-label': {
                      px: 0.5,
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                    },
                  }}
                />
                <Box
                  className={getResponsiveImageSize()}
                  sx={{
                    p: getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.25, 1.5),
                    background:
                      'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
                    width: '100%',
                    height: getResponsiveValue(
                      isExtraSmall ? 60 : 70, // extra small
                      isSmall ? 70 : 80, // small
                      isMedium ? 80 : 90, // medium
                      isLarge ? 90 : 100, // large
                      isUltraWide ? 100 : 110, // extra large
                      isUltraWide ? 110 : 120, // ultra wide
                      isFoldable ? 70 : undefined
                    ),
                    minHeight: getResponsiveValue(
                      isExtraSmall ? 60 : 70, // extra small
                      isSmall ? 70 : 80, // small
                      isMedium ? 80 : 90, // medium
                      isLarge ? 90 : 100, // large
                      isUltraWide ? 100 : 110, // extra large
                      isUltraWide ? 110 : 120, // ultra wide
                      isFoldable ? 70 : undefined
                    ),
                    borderRadius: getResponsiveSpacing(
                      0.5,
                      0.75,
                      1,
                      1.5,
                      2,
                      2.5
                    ),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0, // Prevent image from shrinking
                  }}
                >
                  <ImageWithFallback
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    fallbackSrc='/golden-basket-rounded.png'
                    fallbackText={product.name}
                    sx={{
                      objectFit: 'contain',
                      objectPosition: 'center',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                    }}
                    loading='lazy'
                  />
                </Box>
                <CardContent
                  className={getResponsiveSpacingClasses()}
                  sx={{
                    p: getResponsiveSpacing(0.5, 0.75, 1, 1.25, 1.5, 1.75),
                    background:
                      'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: getResponsiveSpacing(
                      0.5,
                      0.75,
                      1,
                      1.5,
                      2,
                      2.5
                    ),
                    flex: 1,
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 0, // Allow content to shrink if needed
                    overflow: 'hidden', // Prevent content overflow
                    gap: getResponsiveSpacing(0.25, 0.5, 0.75, 1, 1.25, 1.5),
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        variant={getResponsiveValue(
                          'body2',
                          'body1',
                          'subtitle1',
                          'subtitle1',
                          'subtitle1',
                          'subtitle1',
                          isFoldable ? 'body1' : undefined
                        )}
                        fontWeight={700}
                        className={getResponsiveTextClasses()}
                        sx={{
                          color: '#a3824c',
                          width: '100%',
                          padding: '0 4px',
                          textAlign: 'center',
                          fontSize: getResponsiveValue(
                            'clamp(0.5rem, 2vw, 0.65rem)', // extra small
                            'clamp(0.65rem, 2vw, 0.8rem)', // small
                            'clamp(0.8rem, 2.5vw, 0.9rem)', // medium
                            'clamp(0.9rem, 2vw, 1rem)', // large
                            'clamp(1rem, 1.8vw, 1.15rem)', // extra large
                            'clamp(1.15rem, 1.5vw, 1.3rem)', // ultra wide
                            isFoldable
                              ? 'clamp(0.65rem, 2vw, 0.8rem)'
                              : undefined
                          ),
                          lineHeight: 1.3,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: getResponsiveValue(
                            'calc(1.3em * 2)', // extra small
                            'calc(1.3em * 2)', // small
                            'calc(1.3em * 2)', // medium
                            'calc(1.3em * 2)', // large
                            'calc(1.3em * 2)', // extra large
                            'calc(1.3em * 2)', // ultra wide
                            isFoldable ? 'calc(1.3em * 2)' : undefined
                          ),
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Typography
                        variant='body2'
                        className={getResponsiveTextClasses()}
                        sx={{
                          color: '#7d6033',
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          mb: getResponsiveSpacing(
                            0.25,
                            0.25,
                            0.5,
                            0.75,
                            1,
                            1.25
                          ),
                          textAlign: 'center',
                          fontSize: getResponsiveValue(
                            'clamp(0.7rem, 2vw, 0.8rem)', // extra small
                            'clamp(0.8rem, 2vw, 0.9rem)', // small
                            'clamp(0.9rem, 2.5vw, 1rem)', // medium
                            'clamp(1rem, 2vw, 1.1rem)', // large
                            'clamp(1.1rem, 2vw, 1.2rem)', // extra large
                            'clamp(1.2rem, 1.5vw, 1.3rem)', // ultra wide
                            isFoldable
                              ? 'clamp(0.8rem, 2vw, 0.9rem)'
                              : undefined
                          ),
                          lineHeight: 1.3,
                        }}
                      >
                        ₹{product.price}
                      </Typography>

                      <Typography
                        variant='body2'
                        className={getResponsiveTextClasses()}
                        sx={{
                          color: '#866422',
                          fontSize: getResponsiveValue(
                            'clamp(0.6rem, 2vw, 0.7rem)', // extra small
                            'clamp(0.7rem, 2vw, 0.8rem)', // small
                            'clamp(0.8rem, 2vw, 0.9rem)', // medium
                            'clamp(0.9rem, 1.5vw, 1rem)', // large
                            'clamp(1rem, 1.2vw, 1.1rem)', // extra large
                            'clamp(1.1rem, 1vw, 1.2rem)', // ultra wide
                            isFoldable
                              ? 'clamp(0.7rem, 2vw, 0.8rem)'
                              : undefined
                          ),
                          mb: getResponsiveSpacing(1, 1.25, 1.5, 1.75, 2, 2.25),
                          px: getResponsiveSpacing(
                            0.5,
                            0.75,
                            1,
                            1.25,
                            1.5,
                            1.75
                          ),
                          py: getResponsiveSpacing(
                            0.25,
                            0.5,
                            0.75,
                            1,
                            1.25,
                            1.5
                          ),
                          minHeight: getResponsiveSpacing(
                            56,
                            64,
                            72,
                            80,
                            88,
                            96
                          ),
                          maxHeight: getResponsiveSpacing(
                            84,
                            92,
                            100,
                            108,
                            116,
                            124
                          ),
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal',
                          display: '-webkit-box',
                          WebkitLineClamp: getResponsiveValue(
                            2,
                            2,
                            3,
                            3,
                            3,
                            3,
                            isFoldable ? 2 : undefined
                          ),
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4,
                          textAlign: 'center',
                          fontWeight: 400,
                          borderRadius: 1,
                          backgroundColor: 'rgba(163, 130, 76, 0.04)',
                          border: '1px solid rgba(163, 130, 76, 0.1)',
                          boxSizing: 'border-box',
                        }}
                      >
                        {product.description.split(' ').length > 10
                          ? product.description
                              .split(' ')
                              .slice(0, 10)
                              .join(' ') + '...'
                          : product.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Primary actions: Add to Cart & Buy Now */}
                  {renderActions && (
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 1.5 }}
                      sx={{
                        mt: 'auto',
                        pt: getResponsiveSpacing(
                          0.5,
                          0.75,
                          1,
                          1.25,
                          1.25,
                          1.25
                        ),
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
