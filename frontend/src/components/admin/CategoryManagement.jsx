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
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { createAdminStyles } from './adminStyles';
import { useToastNotifications } from '../../hooks/useToast';

const CategoryManagement = ({ categories, onCategoryUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { showSuccess, showError } = useToastNotifications();

  // Category state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catDialogMode, setCatDialogMode] = useState('add');
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    _id: null,
  });

  // Get styles from shared utility
  const styles = useMemo(() => createAdminStyles(isMobile, theme), [isMobile, theme]);

  // Category handlers
  const handleCatDialogOpen = useCallback((mode, cat = null) => {
    setCatDialogMode(mode);
    setCatForm(cat ? { ...cat } : { name: '', description: '', _id: null });
    setCatDialogOpen(true);
  }, []);

  const handleCatDialogClose = useCallback(() => setCatDialogOpen(false), []);

  const handleCatSave = useCallback(() => {
    if (!catForm.name.trim()) {
      showError('Category name is required.');
      return;
    }

    try {
      onCategoryUpdate(catDialogMode, catForm);
      showSuccess(
        catDialogMode === 'add'
          ? 'Category added successfully!'
          : 'Category updated successfully!'
      );
      handleCatDialogClose();
    } catch (error) {
      console.error('Error in handleCatSave', error);
      showError(
        catDialogMode === 'add'
          ? 'Failed to add category. Please try again.'
          : 'Failed to update category. Please try again.'
      );
    }
  }, [
    catForm,
    catDialogMode,
    handleCatDialogClose,
    onCategoryUpdate,
    showSuccess,
    showError,
  ]);

  // Form change handlers
  const handleCatFormChange = useCallback((field, value) => {
    setCatForm(f => ({ ...f, [field]: value }));
  }, []);

  // Enhanced mobile category card rendering
  const renderMobileCategoryCard = category => (
    <Card
      key={category._id}
      sx={{
        mb: 2,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        border: `1px solid ${theme.palette.primary.light}`,
        borderRadius: theme.shape.borderRadius * 2,
      }}
      className='card-golden'
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h6'
              sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 1 }}
            >
              {category.name}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {category.description || 'No description available'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size='small'
            variant='outlined'
            startIcon={<EditIcon />}
            onClick={() => handleCatDialogOpen('edit', category)}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Edit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced responsive table with mobile cards
  const renderCategoriesTable = () => {
    if (isMobile || isTablet) {
      return (
        <Box>
          {categories.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography color='textSecondary'>No categories found</Typography>
            </Box>
          ) : (
            categories.map(renderMobileCategoryCard)
          )}
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={styles.tableContainerStyles}>
        <Table>
          <TableHead sx={styles.tableHeaderStyles}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCellStyles}>Name</TableCell>
              <TableCell sx={styles.tableHeaderCellStyles}>
                Description
              </TableCell>
              <TableCell sx={styles.tableHeaderCellStyles}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category._id} sx={styles.tableRowStyles}>
                <TableCell>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='body2'>
                    {category.description || 'No description available'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size='small'
                      onClick={() => handleCatDialogOpen('edit', category)}
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          Manage Categories
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => handleCatDialogOpen('add')}
          size={isMobile ? 'medium' : 'small'}
          sx={{
            ...styles.buttonStyles,
            height: isMobile ? 48 : 32,
            px: isMobile ? 3 : 2,
            fontSize: isMobile ? '1rem' : '0.75rem',
          }}
        >
          Add Category
        </Button>
      </Stack>

      {/* Categories Table */}
      {renderCategoriesTable()}

      {/* Category Dialog */}
      <Dialog
        open={catDialogOpen}
        onClose={handleCatDialogClose}
        maxWidth={isMobile ? false : 'md'}
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              boxShadow: theme.shadows[8],
              maxWidth: isMobile ? '100%' : '600px',
              width: isMobile ? '100%' : '90%',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.common.white,
            fontWeight: 700,
            borderRadius: isMobile ? 0 : `${theme.shape.borderRadius * 2.67}px ${theme.shape.borderRadius * 2.67}px 0 0`,
            position: 'relative',
          }}
        >
          {catDialogMode === 'add' ? 'Add Category' : 'Edit Category'}
          {isMobile && (
            <IconButton
              onClick={handleCatDialogClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: theme.palette.common.white }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: theme.palette.background.paper,
            p: isMobile ? 2 : 3,
            minHeight: isMobile ? 'auto' : '400px',
          }}
        >
          <Stack spacing={isMobile ? 2 : 3}>
            <TextField
              label='Name'
              value={catForm.name}
              onChange={e => handleCatFormChange('name', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              label='Description'
              value={catForm.description}
              onChange={e => {
                if (e.target.value.length <= 500) {
                  handleCatFormChange('description', e.target.value);
                }
              }}
              fullWidth
              multiline
              rows={isMobile ? 2 : 3}
              helperText={`${catForm.description.length}/500 characters`}
              sx={styles.inputStyles}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: theme.palette.background.paper,
            p: 2,
            borderRadius: isMobile ? 0 : `0 0 ${theme.shape.borderRadius * 2.67}px ${theme.shape.borderRadius * 2.67}px`,
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={handleCatDialogClose}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: theme.shape.borderRadius * 1.33,
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
            onClick={handleCatSave}
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

export default CategoryManagement;
