import React from 'react';
import Slider from 'react-slick';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductCarousel = ({ title, products }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: false,
    centerPadding: '0px',
    variableWidth: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        {title}
      </Typography>
      <Slider {...settings}>
        {products.map((product) => (
          <Card key={product._id} sx={{ mx: 1 }}>
            <CardMedia
              component="img"
              sx={{
                objectFit: 'contain',
                p: 1,
                backgroundColor: '#fafafa',
                width: '100%',
                maxHeight: 200,
              }}
              image={product.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight={500}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹{product.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default ProductCarousel;
