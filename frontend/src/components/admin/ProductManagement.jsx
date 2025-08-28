import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
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
  FormControl,
  useTheme,
  useMediaQuery,
  Chip,
  Card,
  CardContent,
  CardActions,
  Stack,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Loading from '../Loading';
import FilterStatusBar from '../FilterStatusBar';
import ReusableFilterControls from '../ReusableFilterControls';
import { useAllProducts } from '../../hooks/useProducts';
import { createAdminStyles } from './adminStyles';
import { useToastNotifications } from '../../hooks/useToast';

const ProductManagement = ({ categories, onProductUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useToastNotifications();

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

  // Load all products
  const { data: products, isLoading, error } = useAllProducts();

  // Get styles from shared utility
  const styles = useMemo(() => createAdminStyles(isMobile), [isMobile]);

  // Memoized filter handlers
  const handleSearchChange = useCallback(e => {
    setSearch(e.target.value);
  }, []);

  const handleCategoryChange = useCallback(e => {
    setFilterCat(e.target.value);
  }, []);

  const handlePriceRangeChange = useCallback((index, value) => {
    setPriceRange(prev => {
      const newRange = [...prev];
      if (index === 0) {
        newRange[0] = Math.max(5, Math.min(value, newRange[1]));
      } else {
        newRange[1] = Math.max(value, newRange[0]);
      }
      return newRange;
    });
  }, []);

  const handleStockFilterChange = useCallback(e => {
    setInStockOnly(e.target.checked);
  }, []);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCat) {
      filtered = filtered.filter(
        product =>
          product.category._id === filterCat || product.category === filterCat
      );
    }
    if (priceRange[0] > 5) {
      filtered = filtered.filter(product => product.price >= priceRange[0]);
    }
    if (priceRange[1] < 1000) {
      filtered = filtered.filter(product => product.price <= priceRange[1]);
    }
    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    return filtered;
  }, [products, search, priceRange, inStockOnly, filterCat]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearch('');
    setFilterCat('');
    setPriceRange([5, 1000]);
    setInStockOnly(false);
  }, []);

  // Product handlers
  const handleProdDialogOpen = useCallback((mode, prod = null) => {
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
  }, []);

  const handleProdDialogClose = useCallback(() => setProdDialogOpen(false), []);

  const handleProdSave = useCallback(() => {
    if (
      !prodForm.name ||
      !prodForm.description ||
      !prodForm.price ||
      !prodForm.category ||
      !prodForm.stock
    ) {
      showError('Please fill in all required fields.');
      return;
    }

    // Validate image URLs if provided
    if (prodForm.images && prodForm.images.length > 0) {
      const urlPattern = /^https?:\/\/.+/;
      const invalidUrls = prodForm.images.filter(url => !urlPattern.test(url));
      if (invalidUrls.length > 0) {
        showError(
          'Please provide valid image URLs starting with http:// or https://'
        );
        return;
      }
    }

    try {
      const payload = {
        ...prodForm,
        price: Number(prodForm.price),
        stock: Number(prodForm.stock),
      };

      onProductUpdate(prodDialogMode, payload, prodForm._id);
      showSuccess(
        prodDialogMode === 'add'
          ? 'Product added successfully!'
          : 'Product updated successfully!'
      );
      handleProdDialogClose();
    } catch (error) {
      console.log('Error in handleProdSave', error);
      showError(
        prodDialogMode === 'add'
          ? 'Failed to add product. Please try again.'
          : 'Failed to update product. Please try again.'
      );
    }
  }, [
    prodForm,
    prodDialogMode,
    handleProdDialogClose,
    onProductUpdate,
    showSuccess,
    showError,
  ]);

  const handleProdDelete = useCallback(
    id => {
      try {
        onProductUpdate('delete', null, id);
        showSuccess('Product deleted successfully!');
      } catch (error) {
        console.log('Error in handleProdDelete', error);
        showError('Failed to delete product. Please try again.');
      }
    },
    [onProductUpdate, showSuccess, showError]
  );

  const parseImageUrls = useCallback(urlString => {
    if (!urlString || typeof urlString !== 'string') return [];
    return urlString.split(',').map(url => url.trim());
  }, []);

  const handleImageUrlsChange = useCallback(
    e => {
      const urls = parseImageUrls(e.target.value);
      setProdForm(f => ({ ...f, images: urls }));
    },
    [parseImageUrls]
  );
  // Form change handlers
  const handleProdFormChange = useCallback((field, value) => {
    setProdForm(f => ({ ...f, [field]: value }));
  }, []);

  return (
    <Box sx={styles.sectionStyles}>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent='space-between'
        alignItems={isMobile ? 'stretch' : 'center'}
        mb={3}
        spacing={2}
      >
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={styles.titleStyles}>
          Manage Products
        </Typography>

        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={1}
          alignItems='stretch'
        >
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => handleProdDialogOpen('add')}
            size={isMobile ? 'medium' : 'small'}
            sx={{
              ...styles.buttonStyles,
              height: isMobile ? 48 : 32,
              px: isMobile ? 3 : 2,
              fontSize: isMobile ? '1rem' : '0.75rem',
            }}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>

      {/* Filter Controls */}
      <Box sx={{ mb: 3 }}>
        <ReusableFilterControls
          isMobile={isMobile}
          filterConfig={{
            search: {
              placeholder: 'Search products...',
              width: 150,
              maxWidth: 180,
            },
            category: {
              type: 'select',
              options: [
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({
                  value: cat._id,
                  label: cat.name,
                })),
              ],
              width: 120,
              maxWidth: 120,
            },
            priceRange: {
              type: 'range',
              min: 5,
              max: 1000,
              step: 1,
            },
            inStockOnly: {
              type: 'checkbox',
              label: 'In Stock',
            },
          }}
          filterValues={{
            searchQuery: search,
            category: filterCat,
            priceRange,
            inStockOnly,
          }}
          onFilterChange={(field, value) => {
            switch (field) {
              case 'searchQuery':
                handleSearchChange({ target: { value } });
                break;
              case 'category':
                handleCategoryChange({ target: { value } });
                break;
              case 'priceRange':
                if (Array.isArray(value)) {
                  handlePriceRangeChange(0, value[0]);
                  handlePriceRangeChange(1, value[1]);
                }
                break;
              case 'inStockOnly':
                handleStockFilterChange({ target: { checked: value } });
                break;
              default:
                break;
            }
          }}
          onClearFilters={handleResetFilters}
          drawerTitle='Filter Products'
        />
      </Box>

      {/* Filter Summary */}
      {!isLoading && products && products.length > 0 && (
        <FilterStatusBar
          showing={filteredProducts.length}
          total={products.length}
          itemType='products'
          filters={{
            searchQuery: search,
            category: filterCat,
            priceRange,
            inStockOnly,
          }}
          customActiveCheck={
            search ||
            filterCat ||
            priceRange[0] > 5 ||
            priceRange[1] < 1000 ||
            inStockOnly
          }
        />
      )}

      {isLoading ? (
        <Box display='flex' justifyContent='center' my={4}>
          <Loading />
        </Box>
      ) : error ? (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Desktop Table View */}
          {!isMobile && (
            <TableContainer component={Paper} sx={styles.tableContainerStyles}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeaderStyles}>
                    {[
                      'Name',
                      'Description',
                      'Price',
                      'Category',
                      'Stock',
                      'Images',
                      'Actions',
                    ].map(header => (
                      <TableCell key={header} sx={styles.tableHeaderCellStyles}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts?.length > 0 ? (
                    filteredProducts.map(prod => (
                      <TableRow key={prod._id} sx={styles.tableRowStyles}>
                        <TableCell sx={{ fontWeight: 600, color: '#a3824c' }}>
                          {prod.name}
                        </TableCell>
                        <TableCell sx={{ color: '#b59961', maxWidth: 200 }}>
                          {prod.description.length > 50
                            ? `${prod.description.substring(0, 50)}...`
                            : prod.description}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#a3824c' }}>
                          ₹{prod.price}
                        </TableCell>
                        <TableCell sx={{ color: '#b59961' }}>
                          {categories.find(cat => cat._id === prod.category._id)
                            ?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={prod.stock}
                            size='small'
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
                            size='small'
                            variant='outlined'
                            sx={{
                              borderColor: '#a3824c',
                              color: '#a3824c',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction='row' spacing={1}>
                            <IconButton
                              onClick={() => handleProdDialogOpen('edit', prod)}
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
                      <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                        <Typography
                          variant='h6'
                          color='#a3824c'
                          fontWeight={700}
                          mb={2}
                        >
                          No products found
                        </Typography>
                        <Typography variant='body2' color='#b59961'>
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
                filteredProducts.map(prod => (
                  <Grid item span={12} key={prod._id} sx={{ width: '100%' }}>
                    <Card sx={styles.cardStyles}>
                      <CardContent>
                        <Stack spacing={2}>
                          <Typography
                            variant='h6'
                            sx={{ color: '#a3824c', fontWeight: 700 }}
                          >
                            {prod.name}
                          </Typography>
                          <Typography variant='body2' sx={{ color: '#b59961' }}>
                            {prod.description}
                          </Typography>
                          <Grid
                            container
                            spacing={1}
                            justifyContent='space-between'
                            sx={{ mt: 1 }}
                          >
                            <Grid item>
                              <Chip
                                label={`₹${prod.price}`}
                                size='small'
                                sx={{
                                  backgroundColor: '#a3824c',
                                  color: '#fff',
                                  height: 24,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Chip
                                label={
                                  categories.find(
                                    cat => cat._id === prod.category._id
                                  )?.name || 'N/A'
                                }
                                variant='outlined'
                                size='small'
                                sx={{
                                  borderColor: '#a3824c',
                                  color: '#a3824c',
                                  height: 24,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Chip
                                label={`Stock: ${prod.stock}`}
                                size='small'
                                sx={{
                                  backgroundColor:
                                    prod.stock > 10
                                      ? '#4caf50'
                                      : prod.stock > 0
                                        ? '#ff9800'
                                        : '#f44336',
                                  color: '#fff',
                                  height: 24,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Chip
                                label={`${prod.images?.length || 0} images`}
                                variant='outlined'
                                size='small'
                                sx={{
                                  borderColor: '#e6d897',
                                  color: '#b59961',
                                  height: 24,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              />
                            </Grid>
                          </Grid>
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
                <Grid item span={12}>
                  <Card sx={styles.cardStyles}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Typography
                        variant='h6'
                        color='#a3824c'
                        fontWeight={700}
                        mb={2}
                      >
                        No products found
                      </Typography>
                      <Typography variant='body2' color='#b59961'>
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
        </>
      )}

      {/* Product Dialog */}
      <Dialog
        open={prodDialogOpen}
        onClose={handleProdDialogClose}
        maxWidth={isMobile ? false : 'md'}
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: styles.dialogStyles }}
      >
        <DialogTitle sx={styles.dialogTitleStyles}>
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
        <DialogContent dividers sx={styles.dialogContentStyles}>
          <Stack spacing={isMobile ? 2 : 3}>
            <TextField
              label='Name'
              value={prodForm.name}
              onChange={e => handleProdFormChange('name', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              label='Description'
              value={prodForm.description}
              onChange={e => {
                if (e.target.value.length <= 500) {
                  handleProdFormChange('description', e.target.value);
                }
              }}
              fullWidth
              multiline
              rows={isMobile ? 2 : 3}
              helperText={`${prodForm.description.length}/500 characters`}
              sx={styles.inputStyles}
            />
            <TextField
              label='Price'
              type='number'
              value={prodForm.price}
              onChange={e => handleProdFormChange('price', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <FormControl variant='outlined' fullWidth>
              <Select
                value={prodForm.category}
                onChange={e => handleProdFormChange('category', e.target.value)}
                displayEmpty
                sx={{
                  ...styles.inputStyles['& .MuiOutlinedInput-root'],
                  color: '#a3824c',
                  fontWeight: 500,
                }}
              >
                <MenuItem value='' disabled>
                  Select Category
                </MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label='Stock'
              type='number'
              value={prodForm.stock}
              onChange={e => handleProdFormChange('stock', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              multiline
              rows={isMobile ? 2 : 3}
              label='Image URLs (comma separated)'
              value={
                Array.isArray(prodForm.images) ? prodForm.images.join(', ') : ''
              }
              onChange={handleImageUrlsChange}
              placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg'
              helperText={`${
                prodForm.images ? prodForm.images.length : 0
              } image${
                prodForm.images && prodForm.images.length !== 1 ? 's' : ''
              } added`}
              fullWidth
              sx={styles.inputStyles}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={styles.dialogActionsStyles}>
          <Button
            onClick={handleProdDialogClose}
            sx={{
              color: '#a3824c',
              border: '1px solid #a3824c',
              borderRadius: 1,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                borderColor: '#e6d897',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProdSave}
            variant='contained'
            sx={{
              ...styles.buttonStyles,
              px: 3,
              flex: isMobile ? 1 : 'none',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
