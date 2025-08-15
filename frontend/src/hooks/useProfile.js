import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import ApiService from '../services/api';

// Query keys
export const profileKeys = {
  all: ['profile'],
  user: () => [...profileKeys.all, 'user'],
  addresses: () => [...profileKeys.all, 'addresses'],
  orders: () => [...profileKeys.all, 'orders'],
  categories: () => [...profileKeys.all, 'categories'],
  orderStats: () => [...profileKeys.all, 'orderStats'],
};

// Get user addresses
export const useAddresses = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: profileKeys.addresses(),
    queryFn: async () => {
      const addresses = await ApiService.getAddresses();
      return addresses;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token && !!user,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Get user orders
export const useUserOrders = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: profileKeys.orders(),
    queryFn: async () => {
      const orders = await ApiService.getUserOrders();
      return orders;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token && !!user,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: profileKeys.categories(),
    queryFn: async () => {
      const categories = await ApiService.getCategories();
      return categories;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Get order statistics (computed from orders and categories)
export const useOrderStats = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: profileKeys.orderStats(),
    queryFn: async () => {
      const stats = await ApiService.getUserOrderStats();
      return stats;
    },
    enabled: !!token && !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { getProfile } = useAuth();

  return useMutation({
    mutationFn: async profileData => {
      const updatedProfile = await ApiService.updateProfile(profileData);
      return updatedProfile;
    },
    onSuccess: async () => {
      // Update user in auth context
      await getProfile();

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: profileKeys.user() });
    },
  });
};

// Add address mutation
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressData => ApiService.addAddress(addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses() });
    },
  });
};

// Update address mutation
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => ApiService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses() });
    },
  });
};

// Delete address mutation
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: id => ApiService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses() });
    },
  });
};
