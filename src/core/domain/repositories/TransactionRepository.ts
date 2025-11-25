import type { TransactionPayload, TransactionResponse } from '../entities/Transaction';

export interface TransactionRepository {
  getTransactions(payload: TransactionPayload): Promise<TransactionResponse>;
}
