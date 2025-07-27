import { Box, Typography } from '@mui/material';

const HeroBanner = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
        color: '#fffde4',
        py: 1,
        textAlign: 'center',
        mb: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h2" fontWeight={700} gutterBottom>
        Welcome to Golden Basket Mart
      </Typography>
      <Typography variant="h5">
        Fresh groceries, dairy, and more delivered to your doorstep!
      </Typography>
    </Box>
  );
};
export default HeroBanner;
