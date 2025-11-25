// Pinia store for transaction management
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TransactionPayload, TransactionResponse } from '../../core/domain/entities/Transaction';
import { TransactionService } from '../../infrastructure/services/TransactionService';

const transactionService = new TransactionService();

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<string>('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  function getErrorType(params: string): string | null {
    switch (params) {
      case "validation_failed":
        return "Validation Failed";
      case "invalid_date_range":
        return "Invalid date range provided";
      case "no_data_found":
        return "No transaction data found for the specified criteria";
      default:
        return "Unknown Error";
    }
  }

  async function getTransactions(payload: TransactionPayload): Promise<TransactionResponse | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await transactionService.getTransactions(payload);
      
      transactions.value = response.data || "";
      
      return response;
    } catch (e: any) {
      console.error('Transaction Store Error:', e);

      if (e.response) {
        if (e.response.status === 422) {
          error.value = "Validation error: Please check your input data";
        } else if (e.response.status === 404) {
          error.value = "No data found for the specified criteria";
        } else if (e.response.status === 500) {
          error.value = "Server error: Please try again later";
        } else {
          error.value = getErrorType(e.response.data?.error) || `Error: ${e.response.status}`;
        }
      } else {
        error.value = e.message || 'Network error: Please check your connection';
      }

      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function getTransactionReport(payload: TransactionPayload): Promise<TransactionResponse | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await transactionService.getTransactionReport(payload);
      return response;
    } catch (e: any) {
      console.error('Transaction Report Store Error:', e);
      error.value = e.message || 'Failed to get transaction report';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function clearTransactions() {
    transactions.value = "";
    error.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    transactions,
    loading,
    error,
    
    // Actions
    getTransactions,
    getTransactionReport,
    clearTransactions,
    clearError,
  };
});
