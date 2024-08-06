import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';


const signUp = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/signup', data);
  return response.data;
};

const login = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

const updateCurrentUser = async (data: any) => {
  const response = await apiClient.patch('/auth/me', data);
  return response.data;
};

// React Query hooks
export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'currentUser' ] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'currentUser' ] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'currentUser' ] });
    },
  });
};

export const useCurrentUser = () => useQuery({
  queryKey: [ 'currentUser' ],
  queryFn: getCurrentUser
});

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'currentUser' ] });
    },
  });
};