import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

// Generic hook for API queries with React Query
export function useApiQuery<TData, TError = Error>(
  queryKey: string | string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    retry: 1,
    ...options
  });
}

// Generic hook for API mutations with React Query
export function useApiMutation<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options
  });
}

// Custom hook to handle errors from API
export function useErrorHandler() {
  return (error: Error | unknown) => {
    if (error instanceof Error) {
      if (error.message.includes('No auth token found')) {
        // Handle authentication errors
        // You could redirect to login page or show a specific message
        console.error('Authentication error:', error.message);
        return 'Please log in to continue';
      }
      return error.message;
    }
    return 'An unknown error occurred';
  };
}