import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';


const getAttendanceReport = async () => {
  const response = await apiClient.get('/reports/attendance');
  return response.data;
};

const getRevenueReport = async () => {
  const response = await apiClient.get('/reports/revenue');
  return response.data;
};

export const useAttendanceReport = () => useQuery({
  queryKey: [ 'attendanceReport' ],
  queryFn: getAttendanceReport
});

export const useRevenueReport = () => useQuery({
  queryKey: [ 'revenueReport' ],
  queryFn: getRevenueReport
});