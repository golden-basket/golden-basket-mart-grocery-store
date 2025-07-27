import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../services/api';

// Query keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
};

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: ApiService.getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ApiService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Search products
export const useSearchProducts = (params) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => ApiService.searchProducts(params),
    enabled: !!params && Object.keys(params).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ApiService.createProduct,
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => ApiService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(updatedProduct._id), updatedProduct);
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ApiService.deleteProduct,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}; 