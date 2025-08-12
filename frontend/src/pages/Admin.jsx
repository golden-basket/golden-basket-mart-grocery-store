import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Alert,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  Pagination,
  useTheme,
  useMediaQuery,
  Drawer,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Stack,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ApiService from '../services/api';
import { useProducts } from '../hooks/useProducts';
import Loading from '../components/Loading';

export default function Admin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [tab, setTab] = useState(() => {
    // Get the saved tab from localStorage, default to 0 (Products)
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab ? parseInt(savedTab) : 0;
  });

  // Mobile drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Save tab to localStorage whenever it changes
  const handleTabChange = (_, newTab) => {
    setTab(newTab);
    localStorage.setItem('adminActiveTab', newTab.toString());
  };

  // User management state
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState('add'); // 'add' or 'edit'
  const [userDialogForm, setUserDialogForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
  });

  // Category state
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catDialogMode, setCatDialogMode] = useState('add'); // 'add' or 'edit'
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    _id: null,
  });

  // Product state
  const [prodDialogOpen, setProdDialogOpen] = useState(false);
  const [prodDialogMode, setProdDialogMode] = useState('add');
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
  });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [priceRange, setPriceRange] = useState([5, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Build filters for the API
  const filters = {
    page,
    limit: 10, // Fixed limit for admin view
    ...(filterCat && { category: filterCat }),
    ...(search && { search }),
    ...(priceRange[0] > 5 && { minPrice: priceRange[0] }),
    ...(priceRange[1] < 1000 && { maxPrice: priceRange[1] }),
    ...(inStockOnly && { inStock: 'true' }),
  };

  // Use the paginated products hook
  const {
    data: productsData,
    isLoading: prodLoading,
    error: prodError,
  } = useProducts(page, 10, filters);

  // Update pagination when data changes
  useEffect(() => {
    if (productsData) {
      if (productsData.products && productsData.pagination) {
        // New paginated response
        setTotalPages(productsData.pagination.totalPages);
      } else {
        // Fallback for non-paginated response
        setTotalPages(1);
      }
    }
  }, [productsData]);

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  // Reset filters and pagination
  const handleResetFilters = () => {
    setSearch('');
    setFilterCat('');
    setPriceRange([5, 1000]);
    setInStockOnly(false);
    setPage(1);
  };

  // Fetch categories
  useEffect(() => {
    setCatLoading(true);
    ApiService.getCategories()
      .then((categories) => {
        setCategories(categories);
      })
      .catch(() => setCatError('Failed to load categories'))
      .finally(() => setCatLoading(false));
  }, []);

  // Category handlers
  const handleCatDialogOpen = (mode, cat = null) => {
    setCatDialogMode(mode);
    setCatForm(cat ? { ...cat } : { name: '', description: '', _id: null });
    setCatDialogOpen(true);
  };
  const handleCatDialogClose = () => setCatDialogOpen(false);
  const handleCatSave = () => {
    if (!catForm.name.trim()) return setCatError('Name required');
    setCatError('');

    ApiService.createOrUpdateCategory(catForm)
      .then((category) => setCategories((c) => [...c, category]))
      .catch(() => setCatError('Add failed'))
      .finally(handleCatDialogClose);
  };

  // User management handlers
  const handleUserDialogOpen = (mode, user = null) => {
    setUserDialogMode(mode);
    setEditUser(user);
    setUserDialogForm(
      user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          }
        : {
            firstName: '',
            lastName: '',
            email: '',
            role: 'user',
          }
    );
    setUserDialogOpen(true);
  };

  const handleEditUser = (user) => {
    handleUserDialogOpen('edit', user);
  };
  const handleUserDialogClose = () => {
    setUserDialogOpen(false);
    setEditUser(null);
    setUserDialogMode('add');
  };
  const handleUserDialogSave = () => {
    if (userDialogMode === 'add') {
      ApiService.createUser(userDialogForm)
        .then(() => {
          fetchUsers();
          handleUserDialogClose();
        })
        .catch(() => setUserError('Failed to create user.'));
    } else {
      ApiService.request(`/users/${editUser._id}`, {
        method: 'PUT',
        data: userDialogForm,
      })
        .then(() => {
          fetchUsers();
          handleUserDialogClose();
        })
        .catch(() => setUserError('Failed to update user.'));
    }
  };
  const handleDeleteUser = (id) => {
    ApiService.request(`/users/${id}`, { method: 'DELETE' })
      .then(() => fetchUsers())
      .catch(() => setUserError('Failed to delete user.'));
  };
  const handleChangeUserRole = (user, newRole) => {
    ApiService.request(`/users/${user._id}/role`, {
      method: 'PATCH',
      data: { role: newRole },
    })
      .then(() => fetchUsers())
      .catch(() => setUserError('Failed to change user role.'));
  };

  const handleInviteUser = (userId) => {
    ApiService.request(`/users/${userId}/invite`, {
      method: 'PATCH',
    })
      .then(() => {
        fetchUsers();
        setUserError('');
      })
      .catch(() => setUserError('Failed to send invitation email.'));
  };

  // Fetch users
  const fetchUsers = () => {
    setUserLoading(true);
    ApiService.request('/users')
      .then((res) => setUsers(res))
      .catch(() => setUserError('Failed to load users.'))
      .finally(() => setUserLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Product handlers
  const handleProdDialogOpen = (mode, prod = null) => {
    setProdDialogMode(mode);
    setProdForm(
      prod
        ? {
            ...prod,
            price: prod.price.toString(),
            stock: prod.stock.toString(),
            images: prod.images || [],
          }
        : {
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            images: [],
          }
    );
    setProdDialogOpen(true);
  };
  const handleProdDialogClose = () => setProdDialogOpen(false);
  const handleProdSave = () => {
    if (
      !prodForm.name ||
      !prodForm.description ||
      !prodForm.price ||
      !prodForm.category ||
      !prodForm.stock
    ) {
      return; // Error handling is now done by React Query
    }

    // Validate image URLs if provided
    if (prodForm.images && prodForm.images.length > 0) {
      const urlPattern = /^https?:\/\/.+/;
      const invalidUrls = prodForm.images.filter(
        (url) => !urlPattern.test(url)
      );
      if (invalidUrls.length > 0) {
        return; // Error handling is now done by React Query
      }
    }

    const payload = {
      ...prodForm,
      price: Number(prodForm.price),
      stock: Number(prodForm.stock),
    };

    if (prodDialogMode === 'add') {
      ApiService.createProduct(payload)
        .then(() => {
          handleProdDialogClose();
          // React Query will automatically refetch and update the cache
        })
        .catch(() => {
          // Error handling is now done by React Query
        });
    } else {
      ApiService.updateProduct(prodForm._id, payload)
        .then(() => {
          handleProdDialogClose();
          // React Query will automatically refetch and update the cache
        })
        .catch(() => {
          // Error handling is now done by React Query
        });
    }
  };

  const handleProdDelete = (id) => {
    ApiService.deleteProduct(id)
      .then(() => {
        // React Query will automatically refetch and update the cache
      })
      .catch(() => {
        // Error handling is now done by React Query
      });
  };

  const handleImageUrlsChange = (e) => {
    const urls = parseImageUrls(e.target.value);
    setProdForm((f) => ({ ...f, images: urls }));
  };

  const parseImageUrls = (urlString) => {
    if (!urlString || typeof urlString !== 'string') return [];
    return urlString.split(',').map((url) => url.trim());
  };

  // Filtered products
  const filteredProducts = productsData?.products
    ? productsData.products.filter(
        (p) =>
          (!filterCat || p.category === filterCat) &&
          (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
          p.price >= priceRange[0] &&
          p.price <= priceRange[1] &&
          (!inStockOnly || p.stock > 0)
      )
    : [];

  // Common styles for consistent UI
  const containerStyles = {
    mt: isMobile ? 1 : 2,
    mb: isMobile ? 1 : 2,
    px: isMobile ? 1 : 3,
    py: isMobile ? 2 : 4,
    background:
      'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 50%, #fffbe6 100%)',
    borderRadius: isMobile ? 2 : 3,
    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.15)',
    border: '1px solid #e6d897',
  };

  const sectionStyles = {
    background:
      'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
    borderRadius: isMobile ? 2 : 3,
    p: isMobile ? 2 : 4,
    border: '2px solid #e6d897',
    boxShadow: '0 6px 24px 0 rgba(163,130,76,0.15)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background:
        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
      borderRadius: isMobile ? '8px 8px 0 0' : '12px 12px 0 0',
    },
  };

  const buttonStyles = {
    fontWeight: 700,
    background:
      'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
    color: '#fff',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
    borderRadius: isMobile ? 1 : 2,
    '&:hover': {
      background: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
    },
    transition: 'all 0.3s ease',
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
      borderRadius: isMobile ? 1 : 2,
      boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
      '&:hover fieldset': { borderColor: '#a3824c' },
      '&.Mui-focused fieldset': { borderColor: '#a3824c' },
    },
    '& .MuiInputLabel-root': {
      color: '#a3824c',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#a3824c',
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#b59961',
      fontSize: '0.75rem',
      marginLeft: 0,
    },
    '& .MuiSelect-icon': {
      color: '#a3824c',
    },
  };

  const tabStyles = {
    fontWeight: 700,
    outline: 'none !important',
    borderRadius: isMobile ? '6px' : '8px',
    textTransform: 'none',
    px: isMobile ? 2 : 4,
    py: isMobile ? 1 : 2,
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    '&.Mui-selected': {
      color: '#a3824c',
      background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
      border: '2px solid #e6d897',
      boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
      transform: 'translateY(-2px)',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
      color: '#a3824c',
      border: '2px solid #e6d897',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 12px rgba(163,130,76,0.15)',
    },
  };

  // Filter component for reusability
  const FilterControls = ({ showInDrawer = false }) => (
    <Stack
      direction={isMobile && !showInDrawer ? 'column' : 'row'}
      spacing={isMobile ? 2 : 1}
      flexWrap="wrap"
      sx={{ width: '100%' }}
    >
      <TextField
        size={isMobile ? 'medium' : 'small'}
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          minWidth: isMobile ? '100%' : 200,
          ...inputStyles,
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: '#a3824c', fontSize: isMobile ? 20 : 16 }}
                />
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl
        variant="outlined"
        size={isMobile ? 'medium' : 'small'}
        sx={{ minWidth: isMobile ? '100%' : 140 }}
      >
        <Select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          displayEmpty
          sx={{
            fontSize: isMobile ? '1rem' : '0.8rem',
            color: '#a3824c',
            fontWeight: 500,
            ...inputStyles['& .MuiOutlinedInput-root'],
            '& .MuiSelect-icon': { color: '#a3824c' },
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: isMobile ? '100%' : 160,
          px: isMobile ? 2 : 0,
        }}
      >
        <Typography
          sx={{
            color: '#a3824c',
            fontSize: isMobile ? '0.9rem' : '0.75rem',
            fontWeight: 500,
          }}
        >
          ₹{priceRange[0]}
        </Typography>
        <Slider
          size={isMobile ? 'medium' : 'small'}
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue)}
          min={5}
          max={1000}
          step={5}
          sx={{
            color: '#a3824c',
            height: isMobile ? 4 : 3,
            mx: 1.5,
            flexGrow: 1,
            '& .MuiSlider-thumb': {
              backgroundColor: '#a3824c',
              width: isMobile ? 16 : 12,
              height: isMobile ? 16 : 12,
            },
          }}
        />
        <Typography
          sx={{
            color: '#a3824c',
            fontSize: isMobile ? '0.9rem' : '0.75rem',
            fontWeight: 500,
          }}
        >
          ₹{priceRange[1]}
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            size={isMobile ? 'medium' : 'small'}
            sx={{ color: '#a3824c', '&.Mui-checked': { color: '#a3824c' } }}
          />
        }
        label="In Stock Only"
        sx={{
          color: '#a3824c',
          fontWeight: 500,
          '& .MuiFormControlLabel-label': {
            fontSize: isMobile ? '1rem' : '0.75rem',
          },
        }}
      />

      <Button
        variant="outlined"
        onClick={handleResetFilters}
        size={isMobile ? 'medium' : 'small'}
        sx={{
          borderColor: '#a3824c',
          color: '#a3824c',
          fontSize: isMobile ? '0.9rem' : '0.75rem',
          px: isMobile ? 3 : 1.5,
          py: isMobile ? 1 : 0.5,
          '&:hover': {
            borderColor: '#e6d897',
            backgroundColor: 'rgba(163,130,76,0.05)',
          },
        }}
        fullWidth={isMobile}
      >
        Clear Filters
      </Button>
    </Stack>
  );

  return (
    <Container maxWidth="xl" sx={containerStyles}>
      <Typography
        variant={isMobile ? 'h4' : 'h3'}
        align="center"
        gutterBottom
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          mb: isMobile ? 2 : 4,
        }}
      >
        Admin Dashboard
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered={!isMobile}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        sx={{
          mb: isMobile ? 2 : 4,
          '& .MuiTabs-indicator': {
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            height: 4,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(163,130,76,0.3)',
          },
          '& .MuiTabs-flexContainer': {
            gap: isMobile ? 1 : 2,
          },
        }}
      >
        <Tab
          label="Products"
          sx={{ ...tabStyles, color: tab === 0 ? '#a3824c' : '#7d6033ff' }}
        />
        <Tab
          label="Categories"
          sx={{ ...tabStyles, color: tab === 1 ? '#a3824c' : '#7d6033ff' }}
        />
        <Tab
          label="Users"
          sx={{ ...tabStyles, color: tab === 2 ? '#a3824c' : '#7d6033ff' }}
        />
      </Tabs>

      {/* Product Management */}
      {tab === 0 && (
        <Box sx={sectionStyles}>
          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'stretch' : 'center'}
            mb={3}
            spacing={2}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              Manage Products
            </Typography>

            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={1}
              alignItems="stretch"
            >
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{
                    borderColor: '#a3824c',
                    color: '#a3824c',
                    '&:hover': {
                      borderColor: '#e6d897',
                      backgroundColor: 'rgba(163,130,76,0.05)',
                    },
                  }}
                >
                  Filters
                </Button>
              )}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleProdDialogOpen('add')}
                size={isMobile ? 'medium' : 'small'}
                sx={{
                  ...buttonStyles,
                  height: isMobile ? 48 : 32,
                  px: isMobile ? 3 : 2,
                  fontSize: isMobile ? '1rem' : '0.75rem',
                }}
              >
                Add Product
              </Button>
            </Stack>
          </Stack>

          {/* Desktop filters */}
          {!isMobile && (
            <Box sx={{ mb: 3 }}>
              <FilterControls />
            </Box>
          )}

          {/* Mobile filter drawer */}
          <Drawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: '100%',
                maxWidth: 400,
                background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h6"
                  sx={{ color: '#a3824c', fontWeight: 700 }}
                >
                  Filter Products
                </Typography>
                <IconButton onClick={() => setFilterDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <FilterControls showInDrawer={true} />
            </Box>
          </Drawer>

          {prodLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <Loading />
            </Box>
          ) : prodError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {prodError}
            </Alert>
          ) : (
            <>
              {/* Desktop Table View */}
              {!isMobile && (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.2)',
                    border: '2px solid #e6d897',
                    overflow: 'hidden',
                    background:
                      'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                        }}
                      >
                        {[
                          'Name',
                          'Description',
                          'Price',
                          'Category',
                          'Stock',
                          'Images',
                          'Actions',
                        ].map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts?.length > 0 ? (
                        filteredProducts.map((prod) => (
                          <TableRow
                            key={prod._id}
                            sx={{
                              '&:nth-of-type(even)': {
                                background:
                                  'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                              },
                              '&:nth-of-type(odd)': {
                                background:
                                  'linear-gradient(135deg, #f7e7c4 0%, #fffbe6 100%)',
                              },
                              '&:hover': {
                                background:
                                  'linear-gradient(135deg, #e6d897 0%, #f7e7c4 100%)',
                                transform: 'scale(1.01)',
                                boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
                                border: '1px solid #a3824c',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <TableCell
                              sx={{ fontWeight: 600, color: '#a3824c' }}
                            >
                              {prod.name}
                            </TableCell>
                            <TableCell sx={{ color: '#b59961', maxWidth: 200 }}>
                              {prod.description.length > 50
                                ? `${prod.description.substring(0, 50)}...`
                                : prod.description}
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: '#a3824c' }}
                            >
                              ₹{prod.price}
                            </TableCell>
                            <TableCell sx={{ color: '#b59961' }}>
                              {categories.find(
                                (cat) => cat._id === prod.category._id
                              )?.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={prod.stock}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    prod.stock > 10
                                      ? '#4caf50'
                                      : prod.stock > 0
                                      ? '#ff9800'
                                      : '#f44336',
                                  color: '#fff',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#b59961' }}>
                              <Chip
                                label={`${prod.images?.length || 0} images`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#a3824c',
                                  color: '#a3824c',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  onClick={() =>
                                    handleProdDialogOpen('edit', prod)
                                  }
                                  sx={{
                                    color: '#a3824c',
                                    '&:hover': {
                                      background: 'rgba(163,130,76,0.1)',
                                    },
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleProdDelete(prod._id)}
                                  sx={{
                                    color: '#f44336',
                                    '&:hover': {
                                      background: 'rgba(244,67,54,0.1)',
                                    },
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                            <Typography
                              variant="h6"
                              color="#a3824c"
                              fontWeight={700}
                              mb={2}
                            >
                              No products found
                            </Typography>
                            <Typography variant="body2" color="#b59961">
                              {search || filterCat
                                ? 'Try adjusting your search or filter criteria'
                                : 'Start by adding your first product'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Mobile Card View */}
              {isMobile && (
                <Grid container spacing={2}>
                  {filteredProducts?.length > 0 ? (
                    filteredProducts.map((prod) => (
                      <Grid item xs={12} key={prod._id} sx={{ width: '100%' }}>
                        <Card
                          sx={{
                            background:
                              'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                            border: '2px solid #e6d897',
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <CardContent>
                            <Stack spacing={2}>
                              <Typography
                                variant="h6"
                                sx={{ color: '#a3824c', fontWeight: 700 }}
                              >
                                {prod.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#b59961' }}
                              >
                                {prod.description}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                <Chip
                                  label={`₹${prod.price}`}
                                  sx={{
                                    backgroundColor: '#a3824c',
                                    color: '#fff',
                                  }}
                                />
                                <Chip
                                  label={
                                    categories.find(
                                      (cat) => cat._id === prod.category._id
                                    )?.name || 'N/A'
                                  }
                                  variant="outlined"
                                  sx={{
                                    borderColor: '#a3824c',
                                    color: '#a3824c',
                                  }}
                                />
                                <Chip
                                  label={`Stock: ${prod.stock}`}
                                  sx={{
                                    backgroundColor:
                                      prod.stock > 10
                                        ? '#4caf50'
                                        : prod.stock > 0
                                        ? '#ff9800'
                                        : '#f44336',
                                    color: '#fff',
                                  }}
                                />
                                <Chip
                                  label={`${prod.images?.length || 0} images`}
                                  variant="outlined"
                                  sx={{
                                    borderColor: '#e6d897',
                                    color: '#b59961',
                                  }}
                                />
                              </Stack>
                            </Stack>
                          </CardContent>
                          <CardActions>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => handleProdDialogOpen('edit', prod)}
                              sx={{ color: '#a3824c' }}
                            >
                              Edit
                            </Button>
                            <Button
                              startIcon={<DeleteIcon />}
                              onClick={() => handleProdDelete(prod._id)}
                              sx={{ color: '#f44336' }}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          background:
                            'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                          border: '2px solid #e6d897',
                          textAlign: 'center',
                          py: 4,
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            color="#a3824c"
                            fontWeight={700}
                            mb={2}
                          >
                            No products found
                          </Typography>
                          <Typography variant="body2" color="#b59961">
                            {search || filterCat
                              ? 'Try adjusting your search or filter criteria'
                              : 'Start by adding your first product'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? 'large' : 'medium'}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#a3824c',
                        '&.Mui-selected': {
                          backgroundColor: '#a3824c',
                          color: '#fff',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(163,130,76,0.1)',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* Product Dialog */}
          <Dialog
            open={prodDialogOpen}
            onClose={handleProdDialogClose}
            maxWidth={isMobile ? false : 'md'}
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
                border: isMobile ? 'none' : '1px solid #e6d897',
                maxWidth: isMobile ? '100%' : '800px',
                width: isMobile ? '100%' : '90%',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: isMobile ? 0 : '12px 12px 0 0',
                position: 'relative',
              }}
            >
              {prodDialogMode === 'add' ? 'Add Product' : 'Edit Product'}
              {isMobile && (
                <IconButton
                  onClick={handleProdDialogClose}
                  sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                p: isMobile ? 2 : 3,
                minHeight: isMobile ? 'auto' : '400px',
              }}
            >
              <Stack spacing={isMobile ? 2 : 3}>
                <TextField
                  label="Name"
                  value={prodForm.name}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, name: e.target.value }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <TextField
                  label="Description"
                  value={prodForm.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setProdForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }));
                    }
                  }}
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 3}
                  helperText={`${prodForm.description.length}/500 characters`}
                  sx={inputStyles}
                />
                <TextField
                  label="Price"
                  type="number"
                  value={prodForm.price}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, price: e.target.value }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <FormControl variant="outlined" fullWidth>
                  <Select
                    value={prodForm.category}
                    onChange={(e) =>
                      setProdForm((f) => ({ ...f, category: e.target.value }))
                    }
                    displayEmpty
                    sx={{
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      color: '#a3824c',
                      fontWeight: 500,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Category
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Stock"
                  type="number"
                  value={prodForm.stock}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <TextField
                  multiline
                  rows={isMobile ? 2 : 3}
                  label="Image URLs (comma separated)"
                  value={
                    Array.isArray(prodForm.images)
                      ? prodForm.images.join(', ')
                      : ''
                  }
                  onChange={handleImageUrlsChange}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  helperText={`${
                    prodForm.images ? prodForm.images.length : 0
                  } image${
                    prodForm.images && prodForm.images.length !== 1 ? 's' : ''
                  } added`}
                  fullWidth
                  sx={inputStyles}
                />
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                p: 2,
                borderRadius: isMobile ? 0 : '0 0 12px 12px',
                justifyContent: isMobile ? 'stretch' : 'flex-end',
                gap: 1,
              }}
            >
              <Button
                onClick={handleProdDialogClose}
                sx={{
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  px: 3,
                  flex: isMobile ? 1 : 'none',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                    borderColor: '#e6d897',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProdSave}
                variant="contained"
                sx={{
                  ...buttonStyles,
                  px: 3,
                  flex: isMobile ? 1 : 'none',
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Category Management */}
      {tab === 1 && (
        <Box sx={sectionStyles}>
          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'stretch' : 'center'}
            mb={3}
            spacing={2}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              Manage Categories
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleCatDialogOpen('add')}
              size={isMobile ? 'medium' : 'small'}
              sx={{
                ...buttonStyles,
                height: isMobile ? 48 : 32,
                px: isMobile ? 3 : 2,
                fontSize: isMobile ? '1rem' : '0.75rem',
              }}
            >
              Add Category
            </Button>
          </Stack>

          {catLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <Loading />
            </Box>
          ) : catError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {catError}
            </Alert>
          ) : categories.length > 0 ? (
            <>
              {/* Desktop Table View */}
              {!isMobile && !isTablet && (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.2)',
                    border: '2px solid #e6d897',
                    overflow: 'hidden',
                    background:
                      'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                        }}
                      >
                        {['Name', 'Description', 'Actions'].map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((cat) => (
                        <TableRow
                          key={cat._id}
                          sx={{
                            '&:nth-of-type(even)': {
                              background:
                                'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                            },
                            '&:nth-of-type(odd)': {
                              background:
                                'linear-gradient(135deg, #f7e7c4 0%, #fffbe6 100%)',
                            },
                            '&:hover': {
                              background:
                                'linear-gradient(135deg, #e6d897 0%, #f7e7c4 100%)',
                              transform: 'scale(1.01)',
                              boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
                              border: '1px solid #a3824c',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <TableCell sx={{ fontWeight: 600, color: '#a3824c' }}>
                            {cat.name || 'Unnamed Category'}
                          </TableCell>
                          <TableCell sx={{ color: '#b59961', maxWidth: 300 }}>
                            {cat.description && cat.description.length > 0
                              ? cat.description.length > 100
                                ? `${cat.description.substring(0, 100)}...`
                                : cat.description
                              : 'No description available'}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleCatDialogOpen('edit', cat)}
                              sx={{
                                color: '#a3824c',
                                '&:hover': {
                                  background: 'rgba(163,130,76,0.1)',
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Tablet Card View */}
              {isTablet && !isMobile && (
                <Grid container spacing={2}>
                  {categories.map((cat) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={cat._id}
                      sx={{ width: '100%' }}
                    >
                      <Card
                        sx={{
                          background:
                            'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                          border: '2px solid #e6d897',
                          borderRadius: 2,
                          height: 280,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Stack spacing={2} sx={{ height: '100%' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#a3824c',
                                fontWeight: 700,
                                minHeight: '1.5rem',
                                lineHeight: 1.2,
                              }}
                            >
                              {cat.name || 'Unnamed Category'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#b59961',
                                flexGrow: 1,
                                minHeight: '3rem',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {cat.description && cat.description.length > 0
                                ? cat.description.length > 80
                                  ? `${cat.description.substring(0, 80)}...`
                                  : cat.description
                                : 'No description available'}
                            </Typography>
                            <Chip
                              label="Category"
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: '#a3824c',
                                color: '#a3824c',
                                alignSelf: 'flex-start',
                                mt: 'auto',
                              }}
                            />
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ mt: 'auto' }}>
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => handleCatDialogOpen('edit', cat)}
                            sx={{ color: '#a3824c' }}
                            fullWidth
                          >
                            Edit
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Mobile Card View */}
              {isMobile && (
                <Grid container spacing={2}>
                  {categories.map((cat) => (
                    <Grid item xs={12} key={cat._id} sx={{ width: '100%' }}>
                      <Card
                        sx={{
                          background:
                            'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                          border: '2px solid #e6d897',
                          borderRadius: 2,
                          minHeight: 200,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Stack spacing={2} sx={{ height: '100%' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#a3824c',
                                fontWeight: 700,
                                minHeight: '1.5rem',
                                lineHeight: 1.2,
                              }}
                            >
                              {cat.name || 'Unnamed Category'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#b59961',
                                flexGrow: 1,
                                minHeight: '2.5rem',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {cat.description && cat.description.length > 0
                                ? cat.description.length > 120
                                  ? `${cat.description.substring(0, 120)}...`
                                  : cat.description
                                : 'No description available'}
                            </Typography>
                            <Chip
                              label="Category"
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: '#a3824c',
                                color: '#a3824c',
                                alignSelf: 'flex-start',
                                mt: 'auto',
                              }}
                            />
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ mt: 'auto' }}>
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => handleCatDialogOpen('edit', cat)}
                            sx={{ color: '#a3824c' }}
                            fullWidth
                          >
                            Edit
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Card
              sx={{
                background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                border: '2px solid #e6d897',
                textAlign: 'center',
                py: isMobile ? 3 : 4,
                px: isMobile ? 2 : 3,
              }}
            >
              <CardContent>
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  color="#a3824c"
                  fontWeight={700}
                  mb={2}
                >
                  No Categories Found
                </Typography>
                <Typography
                  variant={isMobile ? 'body2' : 'body1'}
                  color="#b59961"
                >
                  Start by adding your first category
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Category Dialog */}
          <Dialog
            open={catDialogOpen}
            onClose={handleCatDialogClose}
            maxWidth={isMobile ? false : 'md'}
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
                border: isMobile ? 'none' : '1px solid #e6d897',
                maxWidth: isMobile ? '100%' : '600px',
                width: isMobile ? '100%' : '90%',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: isMobile ? 0 : '12px 12px 0 0',
                position: 'relative',
              }}
            >
              {catDialogMode === 'add' ? 'Add Category' : 'Edit Category'}
              {isMobile && (
                <IconButton
                  onClick={handleCatDialogClose}
                  sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                p: isMobile ? 2 : 3,
                minHeight: isMobile ? 'auto' : '400px',
              }}
            >
              <Stack spacing={isMobile ? 2 : 3}>
                <TextField
                  label="Name"
                  value={catForm.name}
                  onChange={(e) =>
                    setCatForm((f) => ({ ...f, name: e.target.value }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <TextField
                  label="Description"
                  value={catForm.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setCatForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }));
                    }
                  }}
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 3}
                  helperText={`${catForm.description.length}/500 characters`}
                  sx={inputStyles}
                />
                {catError && <Alert severity="error">{catError}</Alert>}
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                p: 2,
                borderRadius: isMobile ? 0 : '0 0 12px 12px',
                justifyContent: isMobile ? 'stretch' : 'flex-end',
                gap: 1,
              }}
            >
              <Button
                onClick={handleCatDialogClose}
                sx={{
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  px: 3,
                  flex: isMobile ? 1 : 'none',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                    borderColor: '#e6d897',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCatSave}
                variant="contained"
                sx={{
                  ...buttonStyles,
                  px: 3,
                  flex: isMobile ? 1 : 'none',
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* User Management */}
      {tab === 2 && (
        <Box sx={sectionStyles}>
          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'stretch' : 'center'}
            mb={3}
            spacing={2}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              Manage Users
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleUserDialogOpen('add')}
              size={isMobile ? 'medium' : 'small'}
              sx={{
                ...buttonStyles,
                height: isMobile ? 48 : 32,
                px: isMobile ? 3 : 2,
                fontSize: isMobile ? '1rem' : '0.75rem',
              }}
            >
              Add User
            </Button>
          </Stack>

          {userError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {userError}
            </Alert>
          )}

          {userLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <Loading />
            </Box>
          ) : users.length > 0 ? (
            <>
              {/* Desktop Table View */}
              {!isMobile && !isTablet && (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.2)',
                    border: '2px solid #e6d897',
                    overflow: 'hidden',
                    background:
                      'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                        }}
                      >
                        {['Name', 'Email', 'Role', 'Status', 'Actions'].map(
                          (header) => (
                            <TableCell
                              key={header}
                              sx={{
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                              }}
                            >
                              {header}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={user._id}
                          sx={{
                            '&:nth-of-type(even)': {
                              background:
                                'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                            },
                            '&:nth-of-type(odd)': {
                              background:
                                'linear-gradient(135deg, #f7e7c4 0%, #fffbe6 100%)',
                            },
                            '&:hover': {
                              background:
                                'linear-gradient(135deg, #e6d897 0%, #f7e7c4 100%)',
                              transform: 'scale(1.01)',
                              boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
                              border: '1px solid #a3824c',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <TableCell sx={{ fontWeight: 600, color: '#a3824c' }}>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell sx={{ color: '#b59961' }}>
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              size="small"
                              sx={{
                                backgroundColor:
                                  user.role === 'admin' ? '#a3824c' : '#e6d897',
                                color:
                                  user.role === 'admin' ? '#fff' : '#a3824c',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                            >
                              <Chip
                                label={
                                  user.isVerified ? 'Verified' : 'Unverified'
                                }
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: user.isVerified
                                    ? '#4caf50'
                                    : '#ff9800',
                                  color: user.isVerified
                                    ? '#4caf50'
                                    : '#ff9800',
                                  fontSize: '0.6rem',
                                  height: 18,
                                  '& .MuiChip-label': {
                                    px: 0.5,
                                  },
                                }}
                              />
                              {user.isDefaultPassword && (
                                <Chip
                                  label="Default Password"
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: '#f44336',
                                    color: '#f44336',
                                    fontSize: '0.6rem',
                                    height: 18,
                                    '& .MuiChip-label': {
                                      px: 0.5,
                                    },
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Select
                                value={user.role}
                                onChange={(e) =>
                                  handleChangeUserRole(user, e.target.value)
                                }
                                size="small"
                                sx={{
                                  minWidth: 90,
                                  background:
                                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                  },
                                  '& .MuiSelect-icon': { color: '#a3824c' },
                                  color: '#a3824c',
                                  fontWeight: 500,
                                }}
                              >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                              </Select>
                              {!user.isVerified && (
                                <IconButton
                                  onClick={() => handleInviteUser(user._id)}
                                  sx={{
                                    color: '#4caf50',
                                    '&:hover': {
                                      background: 'rgba(76,175,80,0.1)',
                                    },
                                  }}
                                  title="Send Invitation Email"
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )}
                              <IconButton
                                onClick={() => handleEditUser(user)}
                                sx={{
                                  color: '#a3824c',
                                  '&:hover': {
                                    background: 'rgba(163,130,76,0.1)',
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteUser(user._id)}
                                sx={{
                                  color: '#f44336',
                                  '&:hover': {
                                    background: 'rgba(244,67,54,0.1)',
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Tablet Card View */}
              {isTablet && !isMobile && (
                <Grid container spacing={2}>
                  {users.map((user) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={user._id}
                      sx={{ width: '100%' }}
                    >
                      <Card
                        sx={{
                          background:
                            'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                          border: '2px solid #e6d897',
                          borderRadius: 2,
                          height: '100%',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Stack spacing={2}>
                            <Typography
                              variant="h6"
                              sx={{ color: '#a3824c', fontWeight: 700 }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#b59961' }}
                            >
                              {user.email}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                            >
                              <Chip
                                label={user.role}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    user.role === 'admin'
                                      ? '#a3824c'
                                      : '#e6d897',
                                  color:
                                    user.role === 'admin' ? '#fff' : '#a3824c',
                                  fontWeight: 600,
                                }}
                              />
                              <Chip
                                label={
                                  user.isVerified ? 'Verified' : 'Unverified'
                                }
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: user.isVerified
                                    ? '#4caf50'
                                    : '#ff9800',
                                  color: user.isVerified
                                    ? '#4caf50'
                                    : '#ff9800',
                                  fontSize: '0.6rem',
                                  height: 18,
                                  '& .MuiChip-label': {
                                    px: 0.5,
                                  },
                                }}
                              />
                              {user.isDefaultPassword && (
                                <Chip
                                  label="Default Password"
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: '#f44336',
                                    color: '#f44336',
                                    fontSize: '0.6rem',
                                    height: 18,
                                    '& .MuiChip-label': {
                                      px: 0.5,
                                    },
                                  }}
                                />
                              )}
                            </Stack>
                          </Stack>
                        </CardContent>
                        <Divider />
                        <CardActions
                          sx={{
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          <Select
                            value={user.role}
                            onChange={(e) =>
                              handleChangeUserRole(user, e.target.value)
                            }
                            size="small"
                            sx={{
                              minWidth: 90,
                              background:
                                'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiSelect-icon': { color: '#a3824c' },
                              color: '#a3824c',
                              fontWeight: 500,
                            }}
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                          <Stack direction="row" spacing={1}>
                            {!user.isVerified && (
                              <Button
                                onClick={() => handleInviteUser(user._id)}
                                size="small"
                                sx={{ color: '#4caf50', minWidth: 'unset' }}
                                title="Send Invitation Email"
                              >
                                <CheckCircleIcon fontSize="small" />
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEditUser(user)}
                              size="small"
                              sx={{ color: '#a3824c', minWidth: 'unset' }}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user._id)}
                              size="small"
                              sx={{ color: '#f44336', minWidth: 'unset' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Stack>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Mobile Card View */}
              {isMobile && (
                <Grid container spacing={2}>
                  {users.map((user) => (
                    <Grid item xs={12} key={user._id} sx={{ width: '100%' }}>
                      <Card
                        sx={{
                          background:
                            'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                          border: '2px solid #e6d897',
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2}>
                            <Typography
                              variant="h6"
                              sx={{ color: '#a3824c', fontWeight: 700 }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#b59961' }}
                            >
                              {user.email}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                            >
                              <Chip
                                label={user.role}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    user.role === 'admin'
                                      ? '#a3824c'
                                      : '#e6d897',
                                  color:
                                    user.role === 'admin' ? '#fff' : '#a3824c',
                                  fontWeight: 600,
                                }}
                              />
                              <Chip
                                label={
                                  user.isVerified ? 'Verified' : 'Unverified'
                                }
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: user.isVerified
                                    ? '#4caf50'
                                    : '#ff9800',
                                  color: user.isVerified
                                    ? '#4caf50'
                                    : '#ff9800',
                                  fontSize: '0.6rem',
                                  height: 18,
                                  '& .MuiChip-label': {
                                    px: 0.5,
                                  },
                                }}
                              />
                              {user.isDefaultPassword && (
                                <Chip
                                  label="Default Password"
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: '#f44336',
                                    color: '#f44336',
                                    fontSize: '0.6rem',
                                    height: 18,
                                    '& .MuiChip-label': {
                                      px: 0.5,
                                    },
                                  }}
                                />
                              )}
                            </Stack>
                          </Stack>
                        </CardContent>
                        <Divider />
                        <CardActions
                          sx={{
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          <Select
                            value={user.role}
                            onChange={(e) =>
                              handleChangeUserRole(user, e.target.value)
                            }
                            size="small"
                            sx={{
                              minWidth: 90,
                              background:
                                'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiSelect-icon': { color: '#a3824c' },
                              color: '#a3824c',
                              fontWeight: 500,
                            }}
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                          <Stack direction="row" spacing={1}>
                            {!user.isVerified && (
                              <Button
                                onClick={() => handleInviteUser(user._id)}
                                size="small"
                                sx={{ color: '#4caf50', minWidth: 'unset' }}
                                title="Send Invitation Email"
                              >
                                <CheckCircleIcon fontSize="small" />
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEditUser(user)}
                              size="small"
                              sx={{ color: '#a3824c', minWidth: 'unset' }}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user._id)}
                              size="small"
                              sx={{ color: '#f44336', minWidth: 'unset' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Stack>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Card
              sx={{
                background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                border: '2px solid #e6d897',
                textAlign: 'center',
                py: 4,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="#a3824c"
                  fontWeight={700}
                  mb={2}
                >
                  No Users Found
                </Typography>
                <Typography color="#b59961">
                  No users are currently registered
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* User Dialog */}
          <Dialog
            open={userDialogOpen}
            onClose={handleUserDialogClose}
            maxWidth={isMobile ? false : 'md'}
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
                border: isMobile ? 'none' : '1px solid #e6d897',
                maxWidth: isMobile ? '100%' : '600px',
                width: isMobile ? '100%' : '90%',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: isMobile ? 0 : '12px 12px 0 0',
                position: 'relative',
              }}
            >
              {userDialogMode === 'add' ? 'Add User' : 'Edit User'}
              {isMobile && (
                <IconButton
                  onClick={handleUserDialogClose}
                  sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                p: isMobile ? 2 : 3,
                minHeight: isMobile ? 'auto' : '400px',
              }}
            >
              <Stack spacing={isMobile ? 2 : 3}>
                <TextField
                  label="First Name"
                  value={userDialogForm.firstName}
                  onChange={(e) =>
                    setUserDialogForm((f) => ({
                      ...f,
                      firstName: e.target.value,
                    }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <TextField
                  label="Last Name"
                  value={userDialogForm.lastName}
                  onChange={(e) =>
                    setUserDialogForm((f) => ({
                      ...f,
                      lastName: e.target.value,
                    }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <TextField
                  label="Email"
                  value={userDialogForm.email}
                  onChange={(e) =>
                    setUserDialogForm((f) => ({ ...f, email: e.target.value }))
                  }
                  fullWidth
                  sx={inputStyles}
                />
                <FormControl variant="outlined" fullWidth>
                  <Select
                    value={userDialogForm.role}
                    onChange={(e) =>
                      setUserDialogForm((f) => ({ ...f, role: e.target.value }))
                    }
                    displayEmpty
                    sx={{
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      color: '#a3824c',
                      fontWeight: 500,
                    }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                p: 2,
                borderRadius: isMobile ? 0 : '0 0 12px 12px',
                justifyContent: isMobile ? 'stretch' : 'flex-end',
                gap: 1,
              }}
            >
              <Button
                onClick={handleUserDialogClose}
                sx={{
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  px: 3,
                  flex: isMobile ? 1 : 'none',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                    borderColor: '#e6d897',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUserDialogSave}
                variant="contained"
                sx={{
                  ...buttonStyles,
                  px: 3,
                  flex: isMobile ? 1 : 'none',
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  );
}
