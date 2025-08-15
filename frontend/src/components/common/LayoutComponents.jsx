import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Skeleton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { COLORS, GRADIENTS, SHADOWS } from '../../styles/theme';

// Page container with consistent spacing and responsive behavior
export const PageContainer = ({
  children,
  maxWidth = 'lg',
  sx = {},
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: '100vh',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

// Page header with title and optional subtitle
export const PageHeader = ({ title, subtitle, action, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        mb: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      <Box>
        <Typography
          variant='h4'
          component='h1'
          sx={{
            fontWeight: 700,
            background: GRADIENTS.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: subtitle ? 1 : 0,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ fontWeight: 500 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

// Section container with consistent styling
export const Section = ({
  children,
  title,
  subtitle,
  action,
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        ...sx,
      }}
      {...props}
    >
      {(title || action) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            {title && (
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  color: COLORS.text.primary,
                  mb: subtitle ? 0.5 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontWeight: 500 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      )}
      {children}
    </Box>
  );
};

// Content card with consistent styling
export const ContentCard = ({
  children,
  title,
  subtitle,
  action,
  elevation = 1,
  sx = {},
  ...props
}) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        background: GRADIENTS.card,
        boxShadow: SHADOWS.card,
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {(title || action) && (
        <>
          <CardContent
            sx={{
              pb: 1,
              '&:last-child': { pb: 1 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                {title && (
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 600,
                      color: COLORS.text.primary,
                      mb: subtitle ? 0.5 : 0,
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontWeight: 500 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {action && <Box>{action}</Box>}
            </Box>
          </CardContent>
          <Divider sx={{ mx: 2 }} />
        </>
      )}
      <CardContent
        sx={{
          pt: title || action ? 2 : 3,
          '&:last-child': { pb: 3 },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

// Loading skeleton for content
export const ContentSkeleton = ({
  lines = 3,
  height = 20,
  width = '100%',
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ ...sx }} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant='text'
          height={height}
          width={index === lines - 1 ? '60%' : width}
          sx={{ mb: index < lines - 1 ? 1 : 0 }}
        />
      ))}
    </Box>
  );
};

// Loading state component
export const LoadingState = ({
  message = 'Loading...',
  size = 'medium',
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      <CircularProgress
        size={size === 'small' ? 24 : size === 'large' ? 48 : 32}
      />
      {message && (
        <Typography variant='body2' color='text.secondary'>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Error state component
export const ErrorState = ({ error, onRetry, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      <Alert severity='error' sx={{ maxWidth: 400 }}>
        {error || 'Something went wrong. Please try again.'}
      </Alert>
      {onRetry && (
        <Typography
          variant='body2'
          color='primary'
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={onRetry}
        >
          Try again
        </Typography>
      )}
    </Box>
  );
};

// Empty state component
export const EmptyState = ({
  title = 'No data found',
  message = 'There are no items to display.',
  action,
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        gap: 2,
        textAlign: 'center',
        ...sx,
      }}
      {...props}
    >
      <Typography variant='h6' color='text.secondary' sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {message}
      </Typography>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

// Responsive grid container
export const ResponsiveGrid = ({
  children,
  spacing = 2,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  sx = {},
  ...props
}) => {
  return (
    <Grid
      container
      spacing={spacing}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {React.Children.map(children, child => (
        <Grid
          item
          xs={columns.xs || 12}
          sm={columns.sm || 6}
          md={columns.md || 4}
          lg={columns.lg || 3}
          xl={columns.xl || 3}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

// Divider with text
export const SectionDivider = ({ text, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        my: 3,
        ...sx,
      }}
      {...props}
    >
      <Divider sx={{ flex: 1 }} />
      {text && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ px: 2, fontWeight: 500 }}
        >
          {text}
        </Typography>
      )}
      <Divider sx={{ flex: 1 }} />
    </Box>
  );
};
