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
      if (mode === 'add') {
        ApiService.createUser(userData)
          .then(() => {
            fetchUsers();
            setUserError('');
          })
          .catch(() => setUserError('Failed to create user.'));
      } else if (mode === 'edit') {
        ApiService.request(`/users/${userId}`, {
          method: 'PUT',
          data: userData,
        })
          .then(() => {
            fetchUsers();
            setUserError('');
          })
          .catch(() => setUserError('Failed to update user.'));
      } else if (mode === 'delete') {
        ApiService.request(`/users/${userId}`, { method: 'DELETE' })
          .then(() => {
            fetchUsers();
            setUserError('');
          })
          .catch(() => setUserError('Failed to delete user.'));
      } else if (mode === 'role') {
        ApiService.request(`/users/${userId}/role`, {
          method: 'PATCH',
          data: userData,
        })
          .then(() => {
            fetchUsers();
            setUserError('');
          })
          .catch(() => setUserError('Failed to change user role.'));
      } else if (mode === 'invite') {
        ApiService.request(`/users/${userId}/invite`, {
          method: 'PATCH',
        })
          .then(() => {
            fetchUsers();
            setUserError('');
          })
          .catch(() => setUserError('Failed to send invitation email.'));
      }
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
