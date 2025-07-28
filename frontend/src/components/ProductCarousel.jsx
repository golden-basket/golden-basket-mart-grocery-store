import PropTypes from 'prop-types';
import Slider from 'react-slick';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductCarousel = ({ title, products, renderActions }) => {
  const settings = {
    dots: true,
    infinite: products.length > 4,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    slidesToShow: Math.min(4, products.length),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(3, products.length) },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: Math.min(2, products.length) },
      },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box
      sx={{
        mb: 5,
        px: 2,
        py: 3,
        background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
        borderRadius: 3,
        boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={2}
        sx={{
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
        {title}
      </Typography>
      <Slider {...settings}>
        {products.map((product) => (
          <Card
            key={product._id}
            sx={{
              mx: 2,
              minWidth: 220,
              maxWidth: 260,
              borderRadius: 2,
              boxShadow: '0 1px 6px 0 rgba(163,130,76,0.10)',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              border: '1px solid #e6d897',
              transition: 'box-shadow 0.3s, border-color 0.3s',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(163,130,76,0.18)',
                borderColor: '#a3824c',
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                objectFit: 'contain',
                p: 1,
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                width: '100%',
                height: 180,
                borderRadius: 2,
              }}
              image={
                product.images?.[0] ||
                `https://via.placeholder.com/220x180?text=${encodeURIComponent(
                  product.name
                )}`
              }
              alt={product.name}
            />
            <CardContent
              sx={{
                px: 2,
                py: 1,
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  color: '#a3824c',
                  mb: 0.5,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
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
                  mb: 0.5,
                }}
              >
                ₹{product.price} &nbsp;|&nbsp; {product.category?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#866422',
                  fontSize: '0.95rem',
                  mb: 0.5,
                  minHeight: 38,
                  maxHeight: 38,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.description}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: product.stock > 0 ? '#4caf50' : '#f44336',
                  fontWeight: 600,
                  mb: 0.5,
                  display: 'block',
                }}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : 'Out of Stock'}
              </Typography>
              {/* Primary actions: Add to Cart & Buy Now */}
              {renderActions && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {renderActions(product)}
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

ProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  renderActions: PropTypes.func,
};

export default ProductCarousel;
