import apiClient from '../client';
import type { ApiResponse, UserStats, SiteStats, Transaction } from '@/types';

export const statsService = {
  async getUserStats() {
    const { data } = await apiClient.get<ApiResponse<UserStats>>('/users/stats');
    return data;
  },

  async getSiteStats() {
    const { data } = await apiClient.get<ApiResponse<SiteStats>>('/stats');
    return data;
  },
};

export const paymentService = {
  async createTransaction(eventId: string) {
    const { data } = await apiClient.post<ApiResponse<{ transaction: Transaction; paymentInfo: { orderId: string; amount: number; eventTitle: string } }>>(
      '/payments/create-transaction',
      { eventId }
    );
    return data;
  },

  async simulateSuccess(orderId: string) {
    const { data } = await apiClient.post<ApiResponse<{ transaction: Transaction }>>(
      '/payments/simulate-success',
      { orderId }
    );
    return data;
  },

  async simulateFailure(orderId: string) {
    const { data } = await apiClient.post<ApiResponse<{ transaction: Transaction }>>(
      '/payments/simulate-failure',
      { orderId }
    );
    return data;
  },

  async getMyTransactions() {
    const { data } = await apiClient.get<ApiResponse<Transaction[]>>(
      '/payments/my-transactions'
    );
    return data;
  },
};
