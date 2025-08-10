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
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  Pagination,
  FormGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Loading from '../components/Loading';
import ApiService from '../services/api';
import { useProducts } from '../hooks/useProducts';

export default function Admin() {
  const [tab, setTab] = useState(() => {
    // Get the saved tab from localStorage, default to 0 (Products)
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab ? parseInt(savedTab) : 0;
  });

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
    ...(inStockOnly && { inStock: 'true' })
  };

  // Use the paginated products hook
  const { 
    data: productsData, 
    isLoading: prodLoading, 
    error: prodError 
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
  const handleEditUser = (user) => {
    setEditUser(user);
    setUserDialogForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setUserDialogOpen(true);
  };
  const handleUserDialogClose = () => {
    setUserDialogOpen(false);
    setEditUser(null);
  };
  const handleUserDialogSave = () => {
    ApiService.request(`/users/${editUser._id}`, {
      method: 'PUT',
      data: userDialogForm,
    })
      .then(() => {
        fetchUsers();
        handleUserDialogClose();
      })
      .catch(() => setUserError('Failed to update user.'));
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

  console.log(productsData);
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

  return (
    <Container
      sx={{
        mt: 2,
        mb: 2,
        background:
          'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 50%, #fffbe6 100%)',
        borderRadius: 3,
        py: 4,
        px: 3,
        boxShadow: '0 4px 20px 0 rgba(163,130,76,0.15)',
        border: '1px solid #e6d897',
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          mb: 4,
          textShadow: '0 2px 4px rgba(163,130,76,0.1)',
        }}
      >
        Admin Dashboard
      </Typography>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 4,
          '& .MuiTabs-indicator': {
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            height: 4,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(163,130,76,0.3)',
          },
          '& .MuiTabs-flexContainer': {
            gap: 2,
          },
        }}
      >
        <Tab
          label="Products"
          sx={{
            fontWeight: 700,
            color: tab === 0 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            border: '2px solid transparent',
            '&.Mui-selected': {
              color: '#a3824c',
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              borderRadius: '8px',
              border: '2px solid #e6d897',
              boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
              transform: 'translateY(-2px)',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
              borderRadius: '8px',
              border: '2px solid #e6d897',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 12px rgba(163,130,76,0.15)',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
              borderRadius: '8px',
              border: '2px solid #e6d897',
            },
          }}
        />
        <Tab
          label="Categories"
          sx={{
            fontWeight: 700,
            color: tab === 1 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            border: '2px solid transparent',
            '&.Mui-selected': {
              color: '#a3824c',
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              borderRadius: '8px',
              border: '2px solid #e6d897',
              boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
              transform: 'translateY(-2px)',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
              borderRadius: '8px',
              border: '2px solid #e6d897',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 12px rgba(163,130,76,0.15)',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
              borderRadius: '8px',
              border: '2px solid #e6d897',
            },
          }}
        />
        <Tab
          label="Users"
          sx={{
            fontWeight: 700,
            color: tab === 2 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            border: '2px solid transparent',
            '&.Mui-selected': {
              color: '#a3824c',
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              borderRadius: '8px',
              border: '2px solid #e6d897',
              boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
              transform: 'translateY(-2px)',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
              borderRadius: '8px',
              border: '2px solid #e6d897',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 12px rgba(163,130,76,0.15)',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
              borderRadius: '8px',
              border: '2px solid #e6d897',
            },
          }}
        />
      </Tabs>
      {/* Product Management */}
      {tab === 0 && (
        <Box
          sx={{
            background:
              'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
            borderRadius: 3,
            p: 4,
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
              borderRadius: '12px 12px 0 0',
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
            flexWrap="wrap"
            gap={2}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                flex: 1,
                minWidth: 200,
              }}
            >
              Manage Products
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  minWidth: 120,
                  maxWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    height: 32,
                    fontSize: '0.8rem',
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#a3824c', fontSize: 16 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                size="small"
                onClick={handleResetFilters}
                sx={{
                  height: 32,
                  px: 2,
                  fontSize: '0.75rem',
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(163,130,76,0.1)',
                  },
                }}
              >
                Reset
              </Button>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 100, maxWidth: 140 }}
              >
                <Select
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  displayEmpty
                  sx={{
                    height: 32,
                    fontSize: '0.8rem',
                    color: '#a3824c',
                    fontWeight: 500,
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(163,130,76,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a3824c',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a3824c',
                    },
                    '& .MuiSelect-icon': { color: '#a3824c', fontSize: 16 },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#fffbe8',
                        color: '#a3824c',
                        fontWeight: 500,
                        maxHeight: 200,
                      },
                    },
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
                  gap: 0.5,
                  minWidth: 120,
                  maxWidth: 160,
                }}
              >
                <Typography
                  sx={{
                    color: '#a3824c',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  ₹{priceRange[0]}
                </Typography>
                <Slider
                  size="small"
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue)}
                  min={5}
                  max={1000}
                  step={5}
                  sx={{
                    color: '#a3824c',
                    height: 3,
                    mx: 1.5,
                    flexGrow: 1,
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#a3824c',
                      width: 12,
                      height: 12,
                      '&:hover': {
                        boxShadow: '0 0 0 4px rgba(163,130,76,0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#e6d897',
                      height: 3,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#f0f0f0',
                      height: 3,
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: '#a3824c',
                    fontSize: '0.75rem',
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
                    size="small"
                    sx={{
                      color: '#a3824c',
                      '&.Mui-checked': { color: '#a3824c' },
                    }}
                  />
                }
                label="In Stock"
                sx={{
                  color: '#a3824c',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  '& .MuiFormControlLabel-label': { fontSize: '0.75rem' },
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch('');
                  setFilterCat('');
                  setPriceRange([5, 1000]);
                  setInStockOnly(false);
                }}
                size="small"
                sx={{
                  height: 32,
                  borderColor: '#a3824c',
                  color: '#a3824c',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  px: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#e6d897',
                    backgroundColor: 'rgba(163,130,76,0.05)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 6px rgba(163,130,76,0.3)',
                    color: '#866422',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleProdDialogOpen('add')}
                size="small"
                sx={{
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                  height: 32,
                  px: 2,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
                    color: '#000',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
          {prodLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : prodError ? (
            <Alert severity="error">{prodError}</Alert>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px 0 rgba(163,130,76,0.2)',
                border: '2px solid #e6d897',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background:
                        'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                      boxShadow: '0 2px 8px rgba(163,130,76,0.3)',
                    }}
                  >
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Stock
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Images
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Actions
                    </TableCell>
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
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
                            border: '1px solid #a3824c',
                          },
                          transition: 'all 0.3s ease',
                          border: '1px solid transparent',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#a3824c' }}>
                          {prod.name}
                        </TableCell>
                        <TableCell sx={{ color: '#b59961' }}>
                          {prod.description}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#a3824c' }}>
                          ₹{prod.price}
                        </TableCell>
                        <TableCell sx={{ color: '#b59961' }}>
                          {categories.find(
                            (cat) => cat._id === prod.category._id
                          )?.name || 'N/A'}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color:
                              prod.stock > 10
                                ? '#4caf50'
                                : prod.stock > 0
                                ? '#ff9800'
                                : '#f44336',
                          }}
                        >
                          {prod.stock}
                        </TableCell>
                        <TableCell sx={{ color: '#b59961' }}>
                          {prod.images && prod.images.length > 0 ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <span>{prod.images.length}</span>
                              <span
                                style={{ fontSize: '0.8rem', opacity: 0.7 }}
                              >
                                ({prod.images.length === 1 ? 'image' : 'images'}
                                )
                              </span>
                            </Box>
                          ) : (
                            <span
                              style={{ color: '#999', fontStyle: 'italic' }}
                            >
                              No images
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleProdDialogOpen('edit', prod)}
                            sx={{
                              color: '#a3824c',
                              '&:hover': {
                                background:
                                  'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleProdDelete(prod._id)}
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                background:
                                  'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Box
                          sx={{
                            background:
                              'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                            borderRadius: 3,
                            p: 4,
                            border: '2px solid #e6d897',
                            boxShadow: '0 4px 16px rgba(163,130,76,0.1)',
                          }}
                        >
                          <Typography
                            variant="h6"
                            color="#a3824c"
                            fontWeight={700}
                            mb={2}
                          >
                            No products found
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#b59961"
                            sx={{ fontSize: '1.1rem' }}
                          >
                            {search || filterCat
                              ? 'Try adjusting your search or filter criteria'
                              : 'Start by adding your first product'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
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
            </TableContainer>
          )}
          {/* Product Dialog */}
          <Dialog
            open={prodDialogOpen}
            onClose={handleProdDialogClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
                border: '1px solid #e6d897',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px 12px 0 0',
              }}
            >
              {prodDialogMode === 'add' ? 'Add Product' : 'Edit Product'}
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                p: 3,
              }}
            >
              <TextField
                label="Name"
                value={prodForm.name}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, name: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <TextField
                label="Description"
                value={prodForm.description}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, description: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <TextField
                label="Price"
                type="number"
                value={prodForm.price}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, price: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <FormControl
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              >
                <Select
                  value={prodForm.category}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, category: e.target.value }))
                  }
                  displayEmpty
                  sx={{
                    fontSize: '0.875rem',
                    color: '#a3824c',
                    fontWeight: 500,
                    background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(163,130,76,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a3824c',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a3824c',
                    },
                    '& .MuiSelect-icon': { color: '#a3824c', fontSize: 16 },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#fffbe8',
                        color: '#a3824c',
                        fontWeight: 500,
                        maxHeight: 200,
                      },
                    },
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
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <TextField
                multiline
                rows={3}
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
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              {/* prodError && ( // This line is no longer needed */}
              {/*   <Alert // This line is no longer needed */}
              {/*     severity="error" // This line is no longer needed */}
              {/*     sx={{ // This line is no longer needed */}
              {/*       background: // This line is no longer needed */}
              {/*         'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)', // This line is no longer needed */}
              {/*       color: '#a3824c', // This line is no longer needed */}
              {/*       border: '1px solid #e6d897', // This line is no longer needed */}
              {/*       borderRadius: 2, // This line is no longer needed */}
              {/*       '& .MuiAlert-icon': { // This line is no longer needed */}
              {/*         color: '#a3824c', // This line is no longer needed */}
              {/*       }, // This line is no longer needed */}
              {/*     }} // This line is no longer needed */}
              {/*   > // This line is no longer needed */}
              {/*     {prodError} // This line is no longer needed */}
              {/*   </Alert> // This line is no longer needed */}
              {/* ) // This line is no longer needed */}
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                p: 2,
                borderRadius: '0 0 12px 12px',
              }}
            >
              <Button
                onClick={handleProdDialogClose}
                sx={{
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  px: 3,
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
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 1,
                  px: 3,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                  },
                  transition: 'all 0.3s ease',
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
        <Box
          sx={{
            background:
              'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
            borderRadius: 3,
            p: 4,
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
              borderRadius: '12px 12px 0 0',
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography
              variant="h4"
              gutterBottom
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
              sx={{
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                color: '#fff',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                height: 40,
                px: 3,
                borderRadius: 2,
                fontSize: '1rem',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
                  color: '#000',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Category
            </Button>
          </Box>

          {catLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress sx={{ color: '#a3824c' }} />
            </Box>
          ) : catError ? (
            <Alert
              severity="error"
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                color: '#a3824c',
                border: '1px solid #e6d897',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#a3824c',
                },
              }}
            >
              {catError}
            </Alert>
          ) : categories.length > 0 ? (
            <List sx={{ mt: 2 }}>
              {categories.map((cat, index) => (
                <ListItem
                  key={cat._id}
                  sx={{
                    background:
                      index % 2 === 0
                        ? 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)'
                        : 'linear-gradient(135deg, #f7e7c4 0%, #fffbe6 100%)',
                    borderRadius: 3,
                    mb: 2,
                    border: '2px solid #e6d897',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.1)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #e6d897 0%, #f7e7c4 100%)',
                      transform: 'translateX(8px) scale(1.02)',
                      boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                      border: '2px solid #a3824c',
                    },
                  }}
                  secondaryAction={
                    <>
                      <IconButton
                        onClick={() => handleCatDialogOpen('edit', cat)}
                        sx={{
                          color: '#a3824c',
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{ color: '#a3824c', fontWeight: 700 }}
                      >
                        {cat.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: '#b59961', mt: 0.5 }}
                      >
                        {cat.description}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                borderRadius: 3,
                border: '2px solid #e6d897',
                boxShadow: '0 4px 16px rgba(163,130,76,0.1)',
                p: 4,
              }}
            >
              <Typography variant="h6" color="#a3824c" fontWeight={700} mb={2}>
                No Categories Found
              </Typography>
              <Typography color="#b59961" sx={{ fontSize: '1.1rem' }}>
                Start by adding your first category
              </Typography>
            </Box>
          )}
          {/* Category Dialog */}
          <Dialog
            open={catDialogOpen}
            onClose={handleCatDialogClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
                border: '1px solid #e6d897',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px 12px 0 0',
              }}
            >
              {catDialogMode === 'add' ? 'Add Category' : 'Edit Category'}
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                paddingTop: 2,
                paddingBottom: 2,
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                p: 3,
              }}
            >
              <TextField
                label="Name"
                value={catForm.name}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, name: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <TextField
                label="Description"
                value={catForm.description}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, description: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              {catError && (
                <Alert
                  severity="error"
                  sx={{
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                    color: '#a3824c',
                    border: '1px solid #e6d897',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#a3824c',
                    },
                  }}
                >
                  {catError}
                </Alert>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                p: 2,
                borderRadius: '0 0 12px 12px',
              }}
            >
              <Button
                onClick={handleCatDialogClose}
                sx={{
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  px: 3,
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
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 1,
                  px: 3,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                  },
                  transition: 'all 0.3s ease',
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
        <Box
          sx={{
            background:
              'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
            borderRadius: 3,
            p: 4,
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
              borderRadius: '12px 12px 0 0',
            },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 3,
            }}
          >
            Manage Users
          </Typography>
          {userError && (
            <Alert
              severity="error"
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                color: '#a3824c',
                border: '1px solid #e6d897',
                borderRadius: 2,
                mb: 2,
                '& .MuiAlert-icon': {
                  color: '#a3824c',
                },
              }}
            >
              {userError}
            </Alert>
          )}
          {userLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress sx={{ color: '#a3824c' }} />
            </Box>
          ) : users.length > 0 ? (
            <List sx={{ mt: 2 }}>
              {users.map((user, index) => (
                <ListItem
                  key={user._id}
                  sx={{
                    background:
                      index % 2 === 0
                        ? 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)'
                        : 'linear-gradient(135deg, #f7e7c4 0%, #fffbe6 100%)',
                    borderRadius: 3,
                    mb: 2,
                    border: '2px solid #e6d897',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(163,130,76,0.1)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #e6d897 0%, #f7e7c4 100%)',
                      transform: 'translateX(8px) scale(1.02)',
                      boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
                      border: '2px solid #a3824c',
                    },
                  }}
                  secondaryAction={
                    <>
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeUserRole(user, e.target.value)
                        }
                        size="small"
                        sx={{
                          mr: 2,
                          minWidth: 90,
                          background:
                            'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                          borderRadius: 1,
                          border: '1px solid #e6d897',
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                          },
                        }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                      <Button
                        onClick={() => handleEditUser(user)}
                        size="small"
                        sx={{
                          mr: 1,
                          fontWeight: 600,
                          color: '#a3824c',
                          border: '1px solid #a3824c',
                          textTransform: 'none',
                          background:
                            'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                          borderRadius: 1,
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                            color: '#fff',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        onClick={() => handleDeleteUser(user._id)}
                        sx={{
                          color: '#f44336',
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{ color: '#a3824c', fontWeight: 700 }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#b59961', mb: 0.5 }}
                        >
                          {user.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#a3824c', fontWeight: 600 }}
                        >
                          Role: {user.role}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
                borderRadius: 3,
                border: '2px solid #e6d897',
                boxShadow: '0 4px 16px rgba(163,130,76,0.1)',
                p: 4,
              }}
            >
              <Typography variant="h6" color="#a3824c" fontWeight={700} mb={2}>
                No Users Found
              </Typography>
              <Typography color="#b59961" sx={{ fontSize: '1.1rem' }}>
                No users are currently registered
              </Typography>
            </Box>
          )}
          <Dialog
            open={userDialogOpen}
            onClose={handleUserDialogClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
                border: '1px solid #e6d897',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px 12px 0 0',
              }}
            >
              Edit User
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                p: 3,
              }}
            >
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
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <TextField
                label="Last Name"
                value={userDialogForm.lastName}
                onChange={(e) =>
                  setUserDialogForm((f) => ({ ...f, lastName: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <TextField
                label="Email"
                value={userDialogForm.email}
                onChange={(e) =>
                  setUserDialogForm((f) => ({ ...f, email: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&:focus fieldset': { borderColor: '#a3824c' },
                  },
                }}
              />
              <Select
                label="Role"
                value={userDialogForm.role}
                onChange={(e) =>
                  setUserDialogForm((f) => ({ ...f, role: e.target.value }))
                }
                fullWidth
                sx={{
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e6d897',
                  },
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                  },
                }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                p: 2,
                borderRadius: '0 0 12px 12px',
              }}
            >
              <Button
                onClick={handleUserDialogClose}
                sx={{
                  color: '#a3824c',
                  border: '1px solid #a3824c',
                  borderRadius: 1,
                  px: 3,
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
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 1,
                  px: 3,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                  },
                  transition: 'all 0.3s ease',
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
