/*
import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../components/Loading';
import { useAuth } from '../AuthContext';
import AddProductDialog from '../components/AddProductDialog';
import SearchIcon from '@mui/icons-material/Search';
import ApiService from '../services/api';

export default function Admin() {
  const { token } = useAuth();
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  // Filtered and searched products
  const filteredProducts = products.filter(
    (p) =>
      (!categoryFilter || p.category === categoryFilter) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Group products by category
  const productsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = filteredProducts.filter((p) => p.category === cat);
    return acc;
  }, {});

  const fetchProducts = () => {
    setLoading(true);
    ApiService.getProducts()
      .then((data) => setProducts(data))
      .catch(() => {
        console.error('Failed to load products');
      })
      .finally(() => setLoading(false));
  };

  // Fetch users
  const fetchUsers = () => {
    setUserLoading(true);
    ApiService.request('/users')
      .then((res) => setUsers(res))
      .catch(() => setUserError('Failed to load users.'))
      .finally(() => setUserLoading(false));
  };

  useEffect(fetchProducts, []);
  useEffect(() => {
    if (tab === 1) fetchUsers();
  }, [tab]);

  const deleteProduct = (id) => {
    ApiService.deleteProduct(id)
      .then(() => {
        fetchProducts();
      })
      .catch(() => {
        console.error('Failed to delete product');
      });
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

  let productTableContent;
  if (loading) {
    productTableContent = <Loading />;
  } else if (filteredProducts.length === 0) {
    productTableContent = (
      <Typography colSpan={7} align="center">
        No products found.
      </Typography>
    );
  } else {
    productTableContent = (
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <React.Fragment key={cat}>
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{
                      fontWeight: 700,
                      background:
                        'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                    }}
                  >
                    {cat}
                  </TableCell>
                </TableRow>
                {productsByCategory[cat].map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {Array.isArray(product.images) ? product.images.join(', ')
                        : product.images}
                    </TableCell>
                    <TableCell>
                      // Add edit functionality if needed 
                      <IconButton
                        onClick={() => deleteProduct(product._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            // Show uncategorized products if any
            {filteredProducts
              .filter((p) => !p.category)
              .map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {Array.isArray(product.images) ? product.images.join(', ')
                      : product.images}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => deleteProduct(product._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            outline: 'none !important',
          },
        }}
      >
        <Tab
          label="Products"
          sx={{
            fontWeight: 700,
            color: tab === 0 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '4px',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#a3824c',
            },
            '&:hover': {
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
          }}
        />
        <Tab
          label="Categories"
          sx={{
            fontWeight: 700,
            color: tab === 1 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '4px',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#a3824c',
            },
            '&:hover': {
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
          }}
        />
        <Tab
          label="Users"
          sx={{
            fontWeight: 700,
            color: tab === 2 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '4px',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#a3824c',
            },
            '&:hover': {
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
          }}
        />
      </Tabs>
      {tab === 0 && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
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
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
              sx={{ mb: { xs: 1, md: 0 } }}
            >
              <TextField
                label="Search by name"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    transition: 'background 0.3s, box-shadow 0.3s',
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                      boxShadow: '0 2px 8px 0 rgba(163,130,76,0.12)',
                    },
                    '&.Mui-focused': {
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                      boxShadow: '0 0 0 2px #e6d897',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a3824c !important',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e6d897',
                  },
                  '& .MuiInputAdornment-root': {
                    color: '#a3824c',
                  },
                }}
              />
              <Select
                value={categoryFilter}
                size="small"
                onChange={(e) => setCategoryFilter(e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 120,
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: 1,
                  transition: 'background 0.3s, box-shadow 0.3s',
                  boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                    boxShadow: '0 2px 8px 0 rgba(163,130,76,0.12)',
                  },
                  '&.Mui-focused': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                    boxShadow: '0 0 0 2px #e6d897',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a3824c !important',
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                onClick={() => setAddDialogOpen(true)}
                size="small"
                sx={{
                  fontWeight: 600,
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  boxShadow: 2,
                  height: 36,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    color: '#000',
                  },
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
          {productTableContent}
          <AddProductDialog
            open={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            onSuccess={() => {
              setAddDialogOpen(false);
              fetchProducts();
            }}
            token={token}
          />
        </>
      )}
      {tab === 1 && (
        // List all the available categories with actions like edit, and a form to add new category
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
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
        </Box>
      )}
      
    </Container>
  );
}
 */

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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ApiService from '../services/api';

export default function Admin() {
  const [tab, setTab] = useState(0);

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
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState('');
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

  // Fetch categories
  useEffect(() => {
    setCatLoading(true);
    ApiService.getCategories()
      .then((categories) => {
        console.log('Categories loaded:', categories);
        setCategories(categories);
      })
      .catch(() => setCatError('Failed to load categories'))
      .finally(() => setCatLoading(false));
  }, []);

  // Fetch products
  useEffect(() => {
    setProdLoading(true);
    ApiService.getProducts()
      .then((products) => {
        console.log('Products loaded:', products);
        setProducts(products);
      })
      .catch(() => setProdError('Failed to load products'))
      .finally(() => setProdLoading(false));
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

  // Product handlers
  const handleProdDialogOpen = (mode, prod = null) => {
    setProdDialogMode(mode);
    setProdForm(
      prod
        ? {
            ...prod,
            price: prod.price.toString(),
            stock: prod.stock.toString(),
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
      !prodForm.name.trim() ||
      !prodForm.price ||
      !prodForm.category ||
      !prodForm.stock
    ) {
      setProdError('All fields required');
      return;
    }
    setProdError('');
    const payload = {
      ...prodForm,
      price: Number(prodForm.price),
      stock: Number(prodForm.stock),
    };
    if (prodDialogMode === 'add') {
      ApiService.createProduct(payload)
        .then((product) => setProducts((p) => [...p, product]))
        .catch(() => setProdError('Add failed'))
        .finally(handleProdDialogClose);
    } else {
      ApiService.updateProduct(prodForm._id, payload)
        .then((product) =>
          setProducts((p) =>
            p.map((prod) => (prod._id === product._id ? product : prod))
          )
        )
        .catch(() => setProdError('Edit failed'))
        .finally(handleProdDialogClose);
    }
  };
  const handleProdDelete = (id) => {
    ApiService.deleteProduct(id)
      .then(() => setProducts((p) => p.filter((prod) => prod._id !== id)))
      .catch(() => setProdError('Delete failed'));
  };

  // Filtered products
  const filteredProducts = products
    ? products.filter(
        (p) =>
          (!filterCat || p.category === filterCat) &&
          (!search || p.name.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <Container sx={{ mt: 4 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            background:
              'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            height: 4,
          },
        }}
      >
        <Tab
          label="Products"
          sx={{
            fontWeight: 700,
            color: tab === 0 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '4px',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#a3824c',
            },
            '&:hover': {
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
          }}
        />
        <Tab
          label="Categories"
          sx={{
            fontWeight: 700,
            color: tab === 1 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '4px',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#a3824c',
            },
            '&:hover': {
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
          }}
        />
        <Tab
          label="Users"
          sx={{
            fontWeight: 700,
            color: tab === 2 ? '#a3824c' : '#7d6033ff',
            outline: 'none !important',
            borderRadius: '4px',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#a3824c',
            },
            '&:hover': {
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              color: '#a3824c',
            },
          }}
        />
      </Tabs>
      {/* Product Management */}
      {tab === 0 && (
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
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
                label="Search by name"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: 1,
                    transition: 'background 0.3s, box-shadow 0.3s',
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                      boxShadow: '0 2px 8px 0 rgba(163,130,76,0.12)',
                    },
                    '&.Mui-focused': {
                      background:
                        'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                      boxShadow: '0 0 0 2px #e6d897',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a3824c !important',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e6d897',
                  },
                  '& .MuiInputAdornment-root': {
                    color: '#a3824c',
                  },
                }}
              />
              <Select
                value={filterCat}
                size="small"
                onChange={(e) => setFilterCat(e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 120,
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: 1,
                  transition: 'background 0.3s, box-shadow 0.3s',
                  boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
                    boxShadow: '0 2px 8px 0 rgba(163,130,76,0.12)',
                  },
                  '&.Mui-focused': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                    boxShadow: '0 0 0 2px #e6d897',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a3824c !important',
                    borderWidth: 2,
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleProdDialogOpen('add')}
                size="small"
                sx={{
                  fontWeight: 600,
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  boxShadow: 2,
                  height: 36,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    color: '#000',
                  },
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
              sx={{ borderRadius: 2, boxShadow: 2 }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background:
                        'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    }}
                  >
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts?.length > 0 &&
                    filteredProducts.map((prod) => (
                      <TableRow key={prod._id}>
                        <TableCell>{prod.name}</TableCell>
                        <TableCell>{prod.description}</TableCell>
                        <TableCell>₹{prod.price}</TableCell>
                        <TableCell>
                          {categories.find((cat) => cat._id === prod.category)
                            ?.name || 'N/A'}
                        </TableCell>
                        <TableCell>{prod.stock}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleProdDialogOpen('edit', prod)}
                            sx={{ color: '#a3824c' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleProdDelete(prod._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/* Product Dialog */}
          <Dialog
            open={prodDialogOpen}
            onClose={handleProdDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              {prodDialogMode === 'add' ? 'Add Product' : 'Edit Product'}
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              }}
            >
              <TextField
                label="Name"
                value={prodForm.name}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, name: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                value={prodForm.description}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, description: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Price"
                type="number"
                value={prodForm.price}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, price: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <Select
                label="Category"
                value={prodForm.category}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, category: e.target.value }))
                }
                fullWidth
                sx={{
                  mb: 2,
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Stock"
                type="number"
                value={prodForm.stock}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, stock: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* Images can be handled here if needed */}
              {prodError && <Alert severity="error">{prodError}</Alert>}
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
              }}
            >
              <Button onClick={handleProdDialogClose}>Cancel</Button>
              <Button
                onClick={handleProdSave}
                variant="contained"
                sx={{
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    color: '#3e2d14',
                  },
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
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
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
                fontWeight: 600,
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                color: '#fff',
                textTransform: 'none',
                boxShadow: 2,
                height: 36,
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                  color: '#000',
                },
              }}
            >
              Add Category
            </Button>
          </Box>

          {catLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : catError ? (
            <Alert severity="error">{catError}</Alert>
          ) : categories.length > 0 ? (
            <List>
              {categories.map((cat) => (
                <ListItem
                  key={cat._id}
                  secondaryAction={
                    <>
                      <IconButton
                        onClick={() => handleCatDialogOpen('edit', cat)}
                        sx={{ color: '#a3824c' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <span style={{ color: '#3e2d14', fontWeight: 600 }}>
                        {cat.name}
                      </span>
                    }
                    secondary={
                      <span style={{ color: '#a3824c' }}>
                        {cat.description}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography align="center" color="textSecondary">
              No categories found.
            </Typography>
          )}
          {/* Category Dialog */}
          <Dialog
            open={catDialogOpen}
            onClose={handleCatDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
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
              }}
            >
              <TextField
                label="Name"
                value={catForm.name}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, name: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                value={catForm.description}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, description: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              {catError && <Alert severity="error">{catError}</Alert>}
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
              }}
            >
              <Button onClick={handleCatDialogClose}>Cancel</Button>
              <Button
                onClick={handleCatSave}
                variant="contained"
                sx={{
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    color: '#3e2d14',
                  },
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
        <Box>
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
            Manage Users
          </Typography>
          {userError && <Alert severity="error">{userError}</Alert>}
          {userLoading ? (
            <Loading />
          ) : users.length > 0 ? (
            <List>
              {users.map((user) => (
                <ListItem
                  key={user._id}
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
                          background: '#fffbe6',
                          '&:hover': {
                            background: '#e6d897',
                            color: '#3e2d14',
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        onClick={() => handleDeleteUser(user._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <span style={{ color: '#3e2d14', fontWeight: 600 }}>
                        {user.firstName} {user.lastName} ({user.email})
                      </span>
                    }
                    secondary={
                      <span style={{ color: '#a3824c' }}>
                        Role: {user.role}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography align="center" color="textSecondary">
              No users found.
            </Typography>
          )}
          <Dialog open={userDialogOpen} onClose={handleUserDialogClose}>
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              Edit User
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
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
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                value={userDialogForm.lastName}
                onChange={(e) =>
                  setUserDialogForm((f) => ({ ...f, lastName: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                value={userDialogForm.email}
                onChange={(e) =>
                  setUserDialogForm((f) => ({ ...f, email: e.target.value }))
                }
                fullWidth
                sx={{ mb: 2 }}
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
                }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions
              sx={{
                background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
              }}
            >
              <Button onClick={handleUserDialogClose}>Cancel</Button>
              <Button
                onClick={handleUserDialogSave}
                variant="contained"
                sx={{
                  background:
                    'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    color: '#3e2d14',
                  },
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
