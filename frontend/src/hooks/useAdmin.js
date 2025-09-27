import { useState, useCallback, useEffect } from 'react';
import ApiService from '../services/api';

export const useAdmin = () => {
  // User management state
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  // Category state
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');

  // Fetch users
  const fetchUsers = useCallback(() => {
    setUserLoading(true);
    ApiService.request('/users')
      .then(res => setUsers(res))
      .catch(() => setUserError('Failed to load users.'))
      .finally(() => setUserLoading(false));
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(() => {
    setCatLoading(true);
    ApiService.getCategories()
      .then(categories => {
        setCategories(categories);
      })
      .catch(() => setCatError('Failed to load categories'))
      .finally(() => setCatLoading(false));
  }, []);

  // User management handlers
  const handleUserUpdate = useCallback(
    (mode, userData, userId) => {
      let apiCall;
      
      if (mode === 'add') {
        apiCall = ApiService.createUser(userData);
      } else if (mode === 'edit') {
        apiCall = ApiService.request(`/users/${userId}`, {
          method: 'PUT',
          data: userData,
        });
      } else if (mode === 'delete') {
        apiCall = ApiService.request(`/users/${userId}`, { method: 'DELETE' });
      } else if (mode === 'role') {
        apiCall = ApiService.request(`/users/${userId}/role`, {
          method: 'PATCH',
          data: userData,
        });
      } else if (mode === 'invite') {
        apiCall = ApiService.request(`/users/${userId}/invite`, {
          method: 'PATCH',
        });
      }

      return apiCall
        .then(() => {
          fetchUsers();
          setUserError('');
        })
        .catch(error => {
          console.error('User update error:', error);
          const errorMessage = error.message || `Failed to ${mode} user.`;
          setUserError(errorMessage);
          throw error; // Re-throw to be caught by the component handlers
        });
    },
    [fetchUsers]
  );

  // Category management handlers
  const handleCategoryUpdate = useCallback((mode, categoryData) => {
    if (!categoryData.name.trim()) {
      setCatError('Name required');
      return;
    }
    setCatError('');

    ApiService.createOrUpdateCategory(categoryData)
      .then(category => {
        if (mode === 'add') {
          setCategories(c => [...c, category]);
        } else {
          setCategories(c =>
            c.map(cat => (cat._id === category._id ? category : cat))
          );
        }
        setCatError('');
      })
      .catch(() => setCatError('Operation failed'));
  }, []);

  // Product management handlers
  const handleProductUpdate = useCallback((mode, productData, productId) => {
    if (mode === 'add') {
      ApiService.createProduct(productData)
        .then(() => {
          // React Query will automatically refetch and update the cache
        })
        .catch(() => {
          // Error handling is done by React Query
        });
    } else if (mode === 'edit') {
      ApiService.updateProduct(productId, productData)
        .then(() => {
          // React Query will automatically refetch and update the cache
        })
        .catch(() => {
          // Error handling is done by React Query
        });
    } else if (mode === 'delete') {
      ApiService.deleteProduct(productId)
        .then(() => {
          // React Query will automatically refetch and update the cache
        })
        .catch(() => {
          // Error handling is done by React Query
        });
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, [fetchUsers, fetchCategories]);

  return {
    // User management
    users,
    userLoading,
    userError,
    handleUserUpdate,

    // Category management
    categories,
    catLoading,
    catError,
    handleCategoryUpdate,

    // Product management
    handleProductUpdate,
  };
};
