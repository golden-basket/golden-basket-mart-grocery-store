import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../services/api';

// Query keys
export const cartKeys = {
  all: ['cart'],
  user: () => [...cartKeys.all, 'user'],
};

// Get user's cart
export const useCart = () => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: cartKeys.user(),
    queryFn: ApiService.getCart,
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token, // Only fetch if user is authenticated
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if disabled
  });
};

// Add to cart mutation
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }) => ApiService.addToCart(productId, quantity),
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
    mutationFn: ({ productId, quantity }) => ApiService.updateCartItem(productId, quantity),
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
    mutationFn: ApiService.removeFromCart,
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