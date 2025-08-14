import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import ApiService from '../services/api';

// Query keys
export const cartKeys = {
  all: ['cart'],
  user: () => [...cartKeys.all, 'user'],
};

// Get user's cart
export const useCart = () => {
  // Use AuthContext instead of directly checking localStorage
  const { user, token } = useAuth();

  return useQuery({
    queryKey: cartKeys.user(),
    queryFn: async () => {
      const cartData = await ApiService.getCart();
      return cartData;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token && !!user, // Only fetch if user is authenticated and token exists
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch on mount when enabled
    refetchOnReconnect: true,
    onError: (error) => {
      console.error('Cart fetch error:', error);
    },
  });
};

// Add to cart mutation
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      ApiService.addToCart(productId, quantity),
    onSuccess: (updatedCart) => {
      // Update cart in cache
      queryClient.setQueryData(cartKeys.user(), updatedCart);
    },
  });
};

// Update cart item mutation
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      ApiService.updateCartItem(productId, quantity),
    onSuccess: (updatedCart) => {
      // Update cart in cache
      queryClient.setQueryData(cartKeys.user(), updatedCart);
    },
  });
};

// Remove from cart mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => ApiService.removeFromCart(productId),
    onSuccess: (updatedCart) => {
      // Update cart in cache
      queryClient.setQueryData(cartKeys.user(), updatedCart);
    },
  });
};

// Clear cart mutation
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.clearCart,
    onSuccess: () => {
      // Clear cart from cache
      queryClient.setQueryData(cartKeys.user(), { items: [] });
    },
  });
};
