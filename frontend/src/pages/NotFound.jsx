import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Home,
  ShoppingCart,
  Search,
  ArrowBack,
  ErrorOutline,
} from '@mui/icons-material';
import { ROUTES } from '../utils/routeConstants';

const NotFound = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Go Home',
      description: 'Return to the main page',
      icon: <Home sx={{ fontSize: 40, color: '#a3824c' }} />,
      action: () => navigate(ROUTES.HOME),
      color: '#a3824c',
    },
    {
      title: 'Browse Catalogue',
      description: 'Explore our products',
      icon: <Search sx={{ fontSize: 40, color: '#a3824c' }} />,
      action: () => navigate(ROUTES.CATALOGUE),
      color: '#a3824c',
    },
    {
      title: 'View Cart',
      description: 'Check your shopping cart',
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#a3824c' }} />,
      action: () => navigate(ROUTES.CART),
      color: '#a3824c',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 800,
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <ErrorOutline
              sx={{
                fontSize: 120,
                color: '#a3824c',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: '#a3824c',
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              }}
            >
              404
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2e3a1b',
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              Page Not Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: '1.1rem',
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Oops! The page you're looking for doesn't exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#2e3a1b',
                fontWeight: 600,
                mb: 3,
                textAlign: 'center',
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(163, 130, 76, 0.2)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        '&:last-child': { pb: 3 },
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{action.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#2e3a1b',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.5,
                        }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                borderColor: '#a3824c',
                color: '#a3824c',
                '&:hover': {
                  borderColor: '#8b6f3f',
                  backgroundColor: 'rgba(163, 130, 76, 0.04)',
                },
              }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.HOME)}
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #8b6f3f 0%, #d4c085 50%, #a08555 100%)',
                },
              }}
            >
              Go to Homepage
            </Button>
          </Box>

          {/* Help Section */}
          <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(163, 130, 76, 0.05)', borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#2e3a1b',
                fontWeight: 600,
                mb: 2,
                textAlign: 'center',
              }}
            >
              Need Help?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              If you believe this is an error, please contact our support team or try refreshing the page. 
              You can also use the search bar above to find what you're looking for.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
