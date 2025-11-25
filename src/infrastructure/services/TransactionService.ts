import type { TransactionPayload, TransactionResponse } from '../../core/domain/entities/Transaction';
import type { TransactionRepository } from '../../core/domain/repositories/TransactionRepository';
import api from '../api/ApiClientExport';

export class TransactionService implements TransactionRepository {
  async getTransactions(payload: TransactionPayload): Promise<TransactionResponse> {
    try {
      const data = await api.post('/transaksi-all', payload);
      return data as TransactionResponse;
    } catch (error: any) {
      console.error('Transaction Service Error:', error);
      throw error;
    }
  }

  // Alternative method for external API
  async getTransactionsFromExternalAPI(payload: TransactionPayload): Promise<TransactionResponse> {
    try {
      const { data } = await api.post('/external/transactions', payload);
      return data;
    } catch (error: any) {
      console.error('External Transaction Service Error:', error);
      throw error;
    }
  }

  // Alternative method if you need to use different endpoint
  async getTransactionReport(payload: TransactionPayload): Promise<TransactionResponse> {
    try {
      const data = await $fetch('/api/transaction-report', {
        method: 'POST',
        body: payload
      });
      return data as TransactionResponse;
    } catch (error: any) {
      console.error('Transaction Report Service Error:', error);
      throw error;
    }
  }

  // Method for GET request if your API uses GET with query parameters
  async getTransactionsWithQuery(payload: TransactionPayload): Promise<TransactionResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const data = await $fetch(`/api/transactions?${queryParams.toString()}`);
      return data as TransactionResponse;
    } catch (error: any) {
      console.error('Transaction Query Service Error:', error);
      throw error;
    }
  }
}
