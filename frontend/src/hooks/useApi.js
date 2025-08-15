import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../services/api';

// Generic API hook for GET requests
export const useApiQuery = (key, fetcher, options = {}) => {
  return useQuery({
    queryKey: key,
    queryFn: fetcher,
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes
    retry: options.retry !== undefined ? options.retry : 3,
    retryDelay: options.retryDelay || 1000,
    enabled: options.enabled !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus !== false,
    ...options,
  });
};

// Generic API hook for mutations (POST, PUT, DELETE)
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Optimistic updates
      if (options.optimisticUpdate) {
        options.optimisticUpdate(data, variables, context);
      }

      // Custom success handler
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Custom error handler
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Custom hook for paginated data
export const usePaginatedQuery = (key, fetcher, page, limit, options = {}) => {
  return useApiQuery([...key, page, limit], () => fetcher(page, limit), {
    keepPreviousData: true,
    ...options,
  });
};

// Custom hook for search with debouncing
export const useSearchQuery = (key, fetcher, searchTerm, options = {}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, options.debounceMs || 500);

    return () => clearTimeout(timer);
  }, [searchTerm, options.debounceMs]);

  return useApiQuery(
    [...key, debouncedSearchTerm],
    () => fetcher(debouncedSearchTerm),
    {
      enabled:
        !!debouncedSearchTerm &&
        debouncedSearchTerm.length >= (options.minLength || 2),
      ...options,
    }
  );
};

// Custom hook for infinite scroll
export const useInfiniteQuery = (key, fetcher, options = {}) => {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
    ...options,
  });
};

// Predefined hooks for common API operations
export const useProducts = (filters = {}) => {
  return useApiQuery(
    ['products', filters],
    () => ApiService.getProducts(new URLSearchParams(filters).toString()),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for products
    }
  );
};

export const useProduct = id => {
  return useApiQuery(['product', id], () => ApiService.getProduct(id), {
    enabled: !!id,
  });
};

export const useCart = () => {
  return useApiQuery(['cart'], () => ApiService.getCart(), {
    staleTime: 30 * 1000, // 30 seconds for cart
  });
};

export const useOrders = (filters = {}) => {
  return useApiQuery(['orders', filters], () => ApiService.getUserOrders(), {
    staleTime: 5 * 60 * 1000, // 5 minutes for orders
  });
};

export const useAddresses = () => {
  return useApiQuery(['addresses'], () => ApiService.getAddresses(), {
    staleTime: 10 * 60 * 1000, // 10 minutes for addresses
  });
};

export const useCategories = () => {
  return useApiQuery(['categories'], () => ApiService.getCategories(), {
    staleTime: 30 * 60 * 1000, // 30 minutes for categories
  });
};

// Mutation hooks
export const useAddToCart = () => {
  return useApiMutation(
    ({ productId, quantity }) => ApiService.addToCart(productId, quantity),
    {
      invalidateQueries: [['cart']],
    }
  );
};

export const useUpdateCartItem = () => {
  return useApiMutation(
    ({ productId, quantity }) => ApiService.updateCartItem(productId, quantity),
    {
      invalidateQueries: [['cart']],
    }
  );
};

export const useRemoveFromCart = () => {
  return useApiMutation(productId => ApiService.removeFromCart(productId), {
    invalidateQueries: [['cart']],
  });
};

export const usePlaceOrder = () => {
  return useApiMutation(orderData => ApiService.placeOrder(orderData), {
    invalidateQueries: [['cart'], ['orders']],
  });
};

export const useUpdateProfile = () => {
  return useApiMutation(profileData => ApiService.updateProfile(profileData), {
    invalidateQueries: [['profile']],
  });
};

export const useAddAddress = () => {
  return useApiMutation(addressData => ApiService.addAddress(addressData), {
    invalidateQueries: [['addresses']],
  });
};

export const useUpdateAddress = () => {
  return useApiMutation(
    ({ id, addressData }) => ApiService.updateAddress(id, addressData),
    {
      invalidateQueries: [['addresses']],
    }
  );
};

export const useDeleteAddress = () => {
  return useApiMutation(id => ApiService.deleteAddress(id), {
    invalidateQueries: [['addresses']],
  });
};

// Admin mutation hooks
export const useCreateProduct = () => {
  return useApiMutation(productData => ApiService.createProduct(productData), {
    invalidateQueries: [['products']],
  });
};

export const useUpdateProduct = () => {
  return useApiMutation(
    ({ id, productData }) => ApiService.updateProduct(id, productData),
    {
      invalidateQueries: [['products']],
    }
  );
};

export const useDeleteProduct = () => {
  return useApiMutation(id => ApiService.deleteProduct(id), {
    invalidateQueries: [['products']],
  });
};

export const useUpdateOrderStatus = () => {
  return useApiMutation(
    ({ orderId, statusData }) =>
      ApiService.updateOrderStatus(orderId, statusData),
    {
      invalidateQueries: [['orders'], ['orders', 'admin']],
    }
  );
};

// Custom hook for optimistic updates
export const useOptimisticUpdate = (queryKey, updateFn) => {
  const queryClient = useQueryClient();

  return useCallback(
    newData => {
      queryClient.setQueryData(queryKey, oldData => {
        if (!oldData) return newData;
        return updateFn(oldData, newData);
      });
    },
    [queryClient, queryKey, updateFn]
  );
};

// Custom hook for error handling
export const useApiError = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback(error => {
    const message =
      error?.response?.data?.error || error?.message || 'An error occurred';
    setError(message);

    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
