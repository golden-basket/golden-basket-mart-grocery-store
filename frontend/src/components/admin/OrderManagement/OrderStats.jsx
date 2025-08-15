import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  Assessment as StatsIcon,
  Payment as PaymentIcon,
  PendingActions as PendingActionsIcon,
} from '@mui/icons-material';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

const OrderStats = ({ stats, isMobile }) => {
  const getResponsiveSpacing = () => {
    if (isMobile) return 2;
    return 3;
  };

  // Enhanced skeleton loader for stats
  const renderStatSkeleton = isMobile => {
    if (isMobile) {
      return (
        <Stack spacing={2} sx={{ width: '100%', mb: getResponsiveSpacing() }}>
          {[1, 2, 3, 4].map(item => (
            <Box
              key={item}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid var(--color-primary-light)',
                width: '100%',
                background:
                  'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}
              >
                <Skeleton variant='circular' width={20} height={20} />
                <Skeleton variant='text' width={80} height={20} />
              </Box>
              <Skeleton
                variant='rectangular'
                width={60}
                height={24}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          ))}
        </Stack>
      );
    }

    return (
      <Grid
        container
        spacing={getResponsiveSpacing()}
        sx={{ mb: getResponsiveSpacing() }}
      >
        {[1, 2, 3, 4].map(item => (
          <Grid item size={{ xs: 12, sm: 6, md: 2.8 }} key={item}>
            <Card
              sx={{
                background:
                  'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
                border: '1px solid var(--color-primary-light)',
                borderRadius: 2,
                height: '100%',
                width: '100%',
                maxWidth: '280px',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Skeleton
                  variant='circular'
                  width={40}
                  height={40}
                  sx={{ mx: 'auto', mb: 1 }}
                />
                <Skeleton
                  variant='text'
                  width={60}
                  height={32}
                  sx={{ mx: 'auto', mb: 0.5 }}
                />
                <Skeleton
                  variant='text'
                  width={100}
                  height={20}
                  sx={{ mx: 'auto' }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Show skeleton if stats are not loaded yet
  if (!stats || Object.keys(stats).length === 0) {
    return renderStatSkeleton(isMobile);
  }

  // Mobile stats cards
  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ width: '100%', mb: getResponsiveSpacing() }}>
        {/* Total Orders Card */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid var(--color-primary-light)',
            width: '100%',
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
            boxShadow: '0 2px 8px rgba(163, 130, 76, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(163, 130, 76, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            <StatsIcon
              sx={{
                fontSize: '1.2rem',
                color: 'var(--color-primary)',
                flexShrink: 0,
                filter: 'drop-shadow(0 1px 2px rgba(163, 130, 76, 0.3))',
              }}
            />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                fontSize: '0.875rem',
                wordBreak: 'break-word',
                fontWeight: 500,
              }}
            >
              Total Orders
            </Typography>
          </Box>
          <Chip
            label={stats.totalOrders || 0}
            size='small'
            sx={{
              fontWeight: 700,
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%) !important',
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: '0 3px 12px rgba(163, 130, 76, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>

        {/* Total Revenue Card */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid var(--color-accent-light)',
            width: '100%',
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-accent-light) 100%)',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            <PaymentIcon
              sx={{
                fontSize: '1.2rem',
                color: 'var(--color-accent)',
                flexShrink: 0,
                filter: 'drop-shadow(0 1px 2px rgba(76, 175, 80, 0.3))',
              }}
            />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                fontSize: '0.875rem',
                wordBreak: 'break-word',
                fontWeight: 500,
              }}
            >
              Total Revenue(₹)
            </Typography>
          </Box>
          <Chip
            label={`${stats.totalRevenue?.toFixed(2) || '0.00'}`}
            size='small'
            sx={{
              fontWeight: 700,
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%) !important',
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: '0 3px 12px rgba(76, 175, 80, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>

        {/* Pending Orders Card */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid var(--color-warning-light)',
            width: '100%',
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-warning-light) 100%)',
            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(255, 152, 0, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            <PendingActionsIcon
              sx={{
                fontSize: '1.2rem',
                color: 'var(--color-warning)',
                flexShrink: 0,
                filter: 'drop-shadow(0 1px 2px rgba(255, 152, 0, 0.3))',
              }}
            />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                fontSize: '0.875rem',
                wordBreak: 'break-word',
                fontWeight: 500,
              }}
            >
              Pending Orders
            </Typography>
          </Box>
          <Chip
            label={stats.pendingOrders || 0}
            size='small'
            sx={{
              fontWeight: 700,
              background:
                'linear-gradient(135deg, var(--color-warning) 0%, var(--color-warning-dark) 100%) !important',
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: '0 3px 12px rgba(255, 152, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>

        {/* Delivered Orders Card */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid var(--color-success-light)',
            width: '100%',
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-success-light) 100%)',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            <DoneOutlineIcon
              sx={{
                fontSize: '1.2rem',
                color: 'var(--color-success)',
                flexShrink: 0,
                filter: 'drop-shadow(0 1px 2px rgba(76, 175, 80, 0.3))',
              }}
            />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                fontSize: '0.875rem',
                wordBreak: 'break-word',
                fontWeight: 500,
              }}
            >
              Delivered Orders
            </Typography>
          </Box>
          <Chip
            label={stats.deliveredOrders || 0}
            size='small'
            sx={{
              fontWeight: 700,
              background:
                'linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%) !important',
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: '0 3px 12px rgba(76, 175, 80, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>
      </Stack>
    );
  }

  // Desktop stats cards
  return (
    <Grid
      container
      spacing={getResponsiveSpacing()}
      sx={{
        mb: getResponsiveSpacing(),
        justifyContent: 'center',
        alignItems: 'stretch',
        '& .MuiGrid-item': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Grid
        size={{ xs: 12, sm: 6, md: 2.8 }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
            border: '1px solid var(--color-primary-light)',
            borderRadius: 2,
            height: '100%',
            width: '280px',
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 3px 12px rgba(163, 130, 76, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(163, 130, 76, 0.25)',
            },
          }}
          className='card-golden'
        >
          <CardContent
            sx={{
              textAlign: 'center',
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <StatsIcon
              sx={{
                fontSize: 40,
                color: 'var(--color-primary)',
                mb: 1,
                alignSelf: 'center',
                filter: 'drop-shadow(0 2px 4px rgba(163, 130, 76, 0.3))',
              }}
            />
            <Typography
              variant='h6'
              sx={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                mb: 0.5,
                textAlign: 'center',
                width: '100%',
                textShadow: '0 1px 2px rgba(163, 130, 76, 0.2)',
              }}
            >
              {stats.totalOrders || 0}
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{
                fontSize: '0.75rem',
                textAlign: 'center',
                width: '100%',
                fontWeight: 500,
              }}
            >
              Total Orders
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={2.8}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-accent-light) 100%)',
            border: '1px solid var(--color-accent-light)',
            borderRadius: 2,
            height: '100%',
            width: '280px',
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 3px 12px rgba(76, 175, 80, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.25)',
            },
          }}
          className='card-golden'
        >
          <CardContent
            sx={{
              textAlign: 'center',
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <PaymentIcon
              sx={{
                fontSize: 40,
                color: 'var(--color-accent)',
                mb: 1,
                alignSelf: 'center',
                filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))',
              }}
            />
            <Typography
              variant='h6'
              sx={{
                color: 'var(--color-accent)',
                fontWeight: 700,
                mb: 0.5,
                textAlign: 'center',
                width: '100%',
                textShadow: '0 1px 2px rgba(76, 175, 80, 0.2)',
              }}
            >
              {`${stats.totalRevenue?.toFixed(2) || '0.00'}`}
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{
                fontSize: '0.75rem',
                textAlign: 'center',
                width: '100%',
                fontWeight: 500,
              }}
            >
              Total Revenue(₹)
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={2.8}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-warning-light) 100%)',
            border: '1px solid var(--color-warning-light)',
            borderRadius: 2,
            height: '100%',
            width: '280px',
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 3px 12px rgba(255, 152, 0, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(255, 152, 0, 0.25)',
            },
          }}
          className='card-golden'
        >
          <CardContent
            sx={{
              textAlign: 'center',
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <PendingActionsIcon
              sx={{
                fontSize: 40,
                color: 'var(--color-warning)',
                mb: 1,
                alignSelf: 'center',
                filter: 'drop-shadow(0 2px 4px rgba(255, 152, 0, 0.3))',
              }}
            />
            <Typography
              variant='h6'
              sx={{
                color: 'var(--color-warning)',
                fontWeight: 700,
                mb: 0.5,
                textAlign: 'center',
                width: '100%',
                textShadow: '0 1px 2px rgba(255, 152, 0, 0.2)',
              }}
            >
              {stats.pendingOrders || 0}
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{
                fontSize: '0.75rem',
                textAlign: 'center',
                width: '100%',
                fontWeight: 500,
              }}
            >
              Pending Orders
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={2.8}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-success-light) 100%)',
            border: '1px solid var(--color-success-light)',
            borderRadius: 2,
            height: '100%',
            width: '280px',
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 3px 12px rgba(76, 175, 80, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.25)',
            },
          }}
          className='card-golden'
        >
          <CardContent
            sx={{
              textAlign: 'center',
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <DoneOutlineIcon
              sx={{
                fontSize: 40,
                color: 'var(--color-success)',
                mb: 1,
                alignSelf: 'center',
                filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))',
              }}
            />
            <Typography
              variant='h6'
              sx={{
                color: 'var(--color-success)',
                fontWeight: 700,
                mb: 0.5,
                textAlign: 'center',
                width: '100%',
                textShadow: '0 1px 2px rgba(76, 175, 80, 0.2)',
              }}
            >
              {stats.deliveredOrders || 0}
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{
                fontSize: '0.75rem',
                textAlign: 'center',
                width: '100%',
                fontWeight: 500,
              }}
            >
              Delivered Orders
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OrderStats;
