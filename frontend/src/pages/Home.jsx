import { Box, Typography } from '@mui/material';
import HeroBanner from '../components/HeroBanner';
import ProductCarousel from '../components/ProductCarousel';
import Loading from '../components/Loading';
import { useProducts } from '../hooks/useProducts';

const HomeComponent = () => {
  const { data: products, isLoading, error } = useProducts();

  // Group products by category for carousels
  const vegetables = products?.filter(p => 
    p.category && p.category.toLowerCase().includes('vegetable')
  ).slice(0, 6) || [];
  
  const dairy = products?.filter(p => 
    p.category && p.category.toLowerCase().includes('dairy')
  ).slice(0, 6) || [];

  if (isLoading) return <Loading />;
  if (error) return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h6" color="error">
        Failed to load products. Please try again later.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ px: 5 }}>
      <HeroBanner />
      {vegetables.length > 0 && (
        <ProductCarousel title="Fresh Vegetables" products={vegetables} />
      )}
      {dairy.length > 0 && (
        <ProductCarousel title="Dairy Products" products={dairy} />
      )}
      {vegetables.length === 0 && dairy.length === 0 && products?.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No products available. Please check back later.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HomeComponent;
