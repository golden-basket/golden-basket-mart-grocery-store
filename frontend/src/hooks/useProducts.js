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
    queryFn: async () => {
      // ApiService.getProducts returns an array
      const products = await ApiService.getProducts();
      return products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      // ApiService.getProduct returns a product object
      const product = await ApiService.getProduct(id);
      return product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Search products
export const useSearchProducts = (params) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      if (!params || Object.keys(params).length === 0) return [];
      // ApiService.searchProducts returns an array
      const products = await ApiService.searchProducts(params);
      return products;
    },
    enabled: !!params && Object.keys(params).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData) => ApiService.createProduct(productData),
    onSuccess: () => {
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
      queryClient.setQueryData(
        productKeys.detail(updatedProduct._id),
        updatedProduct
      );
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ApiService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
