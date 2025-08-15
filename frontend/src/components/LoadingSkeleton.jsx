import { Box, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Product card skeleton
export const ProductCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
      }}
    >
      <Skeleton
        variant='rectangular'
        width='100%'
        height={200}
        animation='wave'
        sx={{ backgroundColor: theme.palette.grey[200] }}
      />
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant='text' width='80%' height={24} />
        <Skeleton variant='text' width='60%' height={20} sx={{ mt: 1 }} />
        <Skeleton variant='text' width='40%' height={20} sx={{ mt: 1 }} />
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Skeleton variant='rectangular' width='100%' height={40} />
        </Box>
      </Box>
    </Box>
  );
};

// Product list skeleton
export const ProductListSkeleton = ({ count = 8, columns = 4 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: `repeat(${Math.min(columns, 2)}, 1fr)`,
          md: `repeat(${Math.min(columns, 3)}, 1fr)`,
          lg: `repeat(${columns}, 1fr)`,
        },
        gap: 3,
        p: 2,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </Box>
  );
};

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 2,
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant='text'
              width='100%'
              height={20}
              animation='wave'
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

// Form skeleton
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
      {Array.from({ length: fields }).map((_, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Skeleton variant='text' width='30%' height={20} sx={{ mb: 1 }} />
          <Skeleton variant='rectangular' width='100%' height={56} />
        </Box>
      ))}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant='rectangular' width={120} height={48} />
      </Box>
    </Box>
  );
};

// Navigation skeleton
export const NavigationSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Skeleton variant='circular' width={40} height={40} />
      <Skeleton variant='text' width={100} height={24} />
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        <Skeleton variant='rectangular' width={80} height={36} />
        <Skeleton variant='rectangular' width={80} height={36} />
      </Box>
    </Box>
  );
};

export default {
  ProductCardSkeleton,
  ProductListSkeleton,
  TableSkeleton,
  FormSkeleton,
  NavigationSkeleton,
};
