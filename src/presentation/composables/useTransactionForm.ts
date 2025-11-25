import { computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'
import type { TransactionPayload } from '../../core/domain/entities/Transaction'

export const useTransactionForm = () => {
  const transactionStore = useTransactionStore()

  // Computed properties
  const loading = computed(() => transactionStore.loading)
  const error = computed(() => transactionStore.error)
  const transactions = computed(() => transactionStore.transactions)

  // Helper functions
  const validateDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) {
      return false
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return start <= end
  }

  const formatDateForApi = (date: string): string => {
    return date.replace(/-/g, '/')
  }

  const createPayload = (formData: any): TransactionPayload => {
    return {
      date_end: formData.date_end ? formatDateForApi(formData.date_end) : '',
      date_start: formData.date_start ? formatDateForApi(formData.date_start) : '',
      id_area: formData.id_area || '',
      id_induk: formData.id_induk || '',
      id_pusat: formData.id_pusat || '',
      unit_code: formData.unit_code || ''
    }
  }

  const getCurrentMonthRange = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
    
    return {
      start: `${year}-${month}-01`,
      end: `${year}-${month}-${String(lastDay).padStart(2, '0')}`
    }
  }

  // Actions
  const fetchTransactions = async (payload: TransactionPayload) => {
    return await transactionStore.getTransactions(payload)
  }

  const fetchTransactionReport = async (payload: TransactionPayload) => {
    return await transactionStore.getTransactionReport(payload)
  }

  const clearData = () => {
    transactionStore.clearTransactions()
    transactionStore.clearError()
  }

  return {
    // State
    loading,
    error,
    transactions,
    
    // Helpers
    validateDateRange,
    formatDateForApi,
    createPayload,
    getCurrentMonthRange,
    
    // Actions
    fetchTransactions,
    fetchTransactionReport,
    clearData
  }
}
