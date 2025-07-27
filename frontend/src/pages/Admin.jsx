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
        /* Optionally handle error with a snackbar */
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
    // eslint-disable-next-line
  }, [tab]);

  const deleteProduct = (id) => {
    ApiService.deleteProduct(id)
      .then(() => {
        fetchProducts();
      })
      .catch(() => {
        /* Optionally handle error with a snackbar */
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

  return (
    <Container sx={{ mt: 4 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Products" />
        <Tab label="Users" />
      </Tabs>
      {tab === 0 && (
        <>
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
              Manage Products
            </Typography>
            <Button
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
              sx={{
                fontWeight: 600,
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                color: '#fff',
                textTransform: 'none',
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
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 220 }}
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              displayEmpty
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {loading ? (
            <Loading />
          ) : filteredProducts.length === 0 ? (
            <Typography colSpan={7} align="center">
              No products found.
            </Typography>
          ) : (
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
                            {Array.isArray(product.images)
                              ? product.images.join(', ')
                              : product.images}
                          </TableCell>
                          <TableCell>
                            {/* Add edit functionality if needed */}
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
                  {/* Show uncategorized products if any */}
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
                          {Array.isArray(product.images)
                            ? product.images.join(', ')
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
          )}
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
        <Box>
          <Typography variant="h4" gutterBottom>
            Manage Users
          </Typography>
          {userError && <Alert severity="error">{userError}</Alert>}
          {userLoading ? (
            <Loading />
          ) : (
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
                        sx={{ mr: 2, minWidth: 90 }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                      <Button
                        onClick={() => handleEditUser(user)}
                        size="small"
                        sx={{ mr: 1 }}
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
                    primary={`${user.firstName} ${user.lastName} (${user.email})`}
                    secondary={`Role: ${user.role}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Dialog open={userDialogOpen} onClose={handleUserDialogClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
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
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUserDialogClose}>Cancel</Button>
              <Button onClick={handleUserDialogSave} variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  );
}
