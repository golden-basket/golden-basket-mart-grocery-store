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
  useTheme,
} from '@mui/material';
import {
  Assessment as StatsIcon,
  Payment as PaymentIcon,
  PendingActions as PendingActionsIcon,
} from '@mui/icons-material';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

const OrderStats = ({ stats, isMobile }) => {
  const theme = useTheme();
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
                borderRadius: theme.shape.borderRadius * 0.33,
                border: `1px solid ${theme.palette.primary.light}`,
                width: '100%',
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
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
                sx={{ borderRadius: theme.shape.borderRadius * 0.17 }}
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
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                border: `1px solid ${theme.palette.primary.light}`,
                borderRadius: theme.shape.borderRadius * 0.33,
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
            borderRadius: theme.shape.borderRadius * 0.33,
            border: `1px solid ${theme.palette.primary.light}`,
            width: '100%',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
            boxShadow: `0 2px 8px ${theme.palette.primary.main}1A`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 16px ${theme.palette.primary.main}33`,
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
                color: theme.palette.primary.main,
                flexShrink: 0,
                filter: `drop-shadow(0 1px 2px ${theme.palette.primary.main}4D)`,
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%) !important`,
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: `0 3px 12px ${theme.palette.primary.main}66`,
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
            borderRadius: theme.shape.borderRadius * 0.33,
            border: `1px solid ${theme.palette.success.light}`,
            width: '100%',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}20 100%)`,
            boxShadow: `0 2px 8px ${theme.palette.success.main}1A`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 16px ${theme.palette.success.main}33`,
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
                color: theme.palette.success.main,
                flexShrink: 0,
                filter: `drop-shadow(0 1px 2px ${theme.palette.success.main}4D)`,
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
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%) !important`,
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: `0 3px 12px ${theme.palette.success.main}66`,
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
            borderRadius: theme.shape.borderRadius * 0.33,
            border: `1px solid ${theme.palette.warning.light}`,
            width: '100%',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.warning.light}20 100%)`,
            boxShadow: `0 2px 8px ${theme.palette.warning.main}1A`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 16px ${theme.palette.warning.main}33`,
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
                color: theme.palette.warning.main,
                flexShrink: 0,
                filter: `drop-shadow(0 1px 2px ${theme.palette.warning.main}4D)`,
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
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%) !important`,
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: `0 3px 12px ${theme.palette.warning.main}66`,
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
            borderRadius: theme.shape.borderRadius * 0.33,
            border: `1px solid ${theme.palette.success.light}`,
            width: '100%',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}20 100%)`,
            boxShadow: `0 2px 8px ${theme.palette.success.main}1A`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 16px ${theme.palette.success.main}33`,
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
                color: theme.palette.success.main,
                flexShrink: 0,
                filter: `drop-shadow(0 1px 2px ${theme.palette.success.main}4D)`,
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
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%) !important`,
              color: 'white !important',
              flexShrink: 0,
              '& .MuiChip-label': {
                color: 'white !important',
                fontSize: '0.875rem',
              },
              boxShadow: `0 3px 12px ${theme.palette.success.main}66`,
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
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
            border: `1px solid ${theme.palette.primary.light}`,
            borderRadius: theme.shape.borderRadius * 0.33,
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
                              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 0.5,
              textAlign: 'center',
              width: '100%',
              textShadow: `0 1px 2px ${theme.palette.primary.main}33`,
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
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}20 100%)`,
            border: `1px solid ${theme.palette.success.light}`,
            borderRadius: theme.shape.borderRadius * 0.33,
            height: '100%',
            width: '280px',
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 3px 12px ${theme.palette.success.main}26`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 6px 20px ${theme.palette.success.main}40`,
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
                color: theme.palette.success.main,
                mb: 1,
                alignSelf: 'center',
                filter: `drop-shadow(0 2px 4px ${theme.palette.success.main}4D)`,
              }}
            />
            <Typography
              variant='h6'
              sx={{
                              color: theme.palette.success.main,
              fontWeight: 700,
              mb: 0.5,
              textAlign: 'center',
              width: '100%',
              textShadow: `0 1px 2px ${theme.palette.success.main}33`,
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
                color: theme.palette.warning.main,
                mb: 1,
                alignSelf: 'center',
                filter: `drop-shadow(0 2px 4px ${theme.palette.warning.main}4D)`,
              }}
            />
            <Typography
              variant='h6'
              sx={{
                              color: theme.palette.warning.main,
              fontWeight: 700,
              mb: 0.5,
              textAlign: 'center',
              width: '100%',
              textShadow: `0 1px 2px ${theme.palette.warning.main}33`,
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
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}20 100%)`,
            border: `1px solid ${theme.palette.success.light}`,
            borderRadius: theme.shape.borderRadius * 0.33,
            height: '100%',
            width: '280px',
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 3px 12px ${theme.palette.success.main}26`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 6px 20px ${theme.palette.success.main}40`,
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
                color: theme.palette.success.main,
                mb: 1,
                alignSelf: 'center',
                filter: `drop-shadow(0 2px 4px ${theme.palette.success.main}4D)`,
              }}
            />
            <Typography
              variant='h6'
              sx={{
                              color: theme.palette.success.main,
              fontWeight: 700,
              mb: 0.5,
              textAlign: 'center',
              width: '100%',
              textShadow: `0 1px 2px ${theme.palette.success.main}33`,
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
