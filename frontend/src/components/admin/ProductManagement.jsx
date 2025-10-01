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
  Select,
  MenuItem,
  IconButton,
  Alert,
  FormControl,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Loading from '../Loading';
import FilterStatusBar from '../FilterStatusBar';
import ReusableFilterControls from '../ReusableFilterControls';
import {
  useAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useProducts';
import { createAdminStyles } from './adminStyles';
import { useToastNotifications } from '../../hooks/useToast';
import ProductTable from './ProductTable';
import ProductCard from './ProductCard';

const ProductManagement = ({ categories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useToastNotifications();

  // React Query mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load all products
  const { data: products, isLoading, error } = useAllProducts();

  // Get styles from shared utility
  const styles = useMemo(
    () => createAdminStyles(isMobile, theme),
    [isMobile, theme]
  );

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
            category: prod.category._id,
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

  const handleProdSave = useCallback(async () => {
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

      if (prodDialogMode === 'add') {
        await createProductMutation.mutateAsync(payload);
        showSuccess('Product added successfully!');
      } else {
        await updateProductMutation.mutateAsync({
          id: prodForm._id,
          data: payload,
        });
        showSuccess('Product updated successfully!');
      }

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
    createProductMutation,
    updateProductMutation,
    showSuccess,
    showError,
  ]);

  const handleProdDelete = useCallback(
    async id => {
      try {
        await deleteProductMutation.mutateAsync(id);
        showSuccess('Product deleted successfully!');
      } catch (error) {
        console.log('Error in handleProdDelete', error);
        showError('Failed to delete product. Please try again.');
      }
    },
    [deleteProductMutation, showSuccess, showError]
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

  // Render content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display='flex' justifyContent='center' my={4}>
          <Loading />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    return (
      <>
        {/* Desktop Table View */}
        {!isMobile &&
          (filteredProducts?.length > 0 ? (
            <ProductTable
              products={filteredProducts}
              categories={categories}
              theme={theme}
              onEdit={prod => handleProdDialogOpen('edit', prod)}
              onDelete={handleProdDelete}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography
                variant='h6'
                color={theme.palette.primary.main}
                fontWeight={700}
                mb={2}
              >
                No products found
              </Typography>
              <Typography variant='body2' color={theme.palette.text.secondary}>
                {search || filterCat
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first product'}
              </Typography>
            </Box>
          ))}

        {/* Mobile Card View */}
        {isMobile && (
          <Grid container spacing={2}>
            {filteredProducts?.length > 0 ? (
              filteredProducts.map(prod => (
                <Grid item span={12} key={prod._id} sx={{ width: '100%' }}>
                  <ProductCard
                    product={prod}
                    categories={categories}
                    theme={theme}
                    onEdit={prod => handleProdDialogOpen('edit', prod)}
                    onDelete={handleProdDelete}
                  />
                </Grid>
              ))
            ) : (
              <Grid item span={12}>
                <Card sx={styles.cardStyles}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography
                      variant='h6'
                      color={theme.palette.primary.main}
                      fontWeight={700}
                      mb={2}
                    >
                      No products found
                    </Typography>
                    <Typography
                      variant='body2'
                      color={theme.palette.text.secondary}
                    >
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
    );
  };

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
          filterDrawerOpen={filterDrawerOpen}
          setFilterDrawerOpen={setFilterDrawerOpen}
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

      {renderContent()}

      {/* Product Dialog */}
      <Dialog
        open={prodDialogOpen}
        onClose={handleProdDialogClose}
        maxWidth={isMobile ? false : 'md'}
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: styles.dialogStyles,
          },
        }}
      >
        <DialogTitle sx={styles.dialogTitleStyles}>
          {prodDialogMode === 'add' ? 'Add Product' : 'Edit Product'}
          {isMobile && (
            <IconButton
              onClick={handleProdDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.common.white,
              }}
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
                  color: theme.palette.primary.main,
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
              color: theme.palette.primary.main,
              border: '1px solid ' + theme.palette.primary.main,
              borderRadius: theme.shape.borderRadius * 0.17,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: theme.palette.action.hover,
                borderColor: theme.palette.primary.light,
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

ProductManagement.propTypes = {
  categories: PropTypes.array.isRequired,
};
