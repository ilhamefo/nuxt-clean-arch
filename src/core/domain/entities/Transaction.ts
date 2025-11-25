export interface TransactionPayload {
  date_end: string;
  date_start: string;
  id_area: string;
  id_induk: string;
  id_pusat: string;
  unit_code: string;
}

export interface TransactionResponse {
  data: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: string;
  unit_code: string;
  area_id: string;
  // Add more fields based on your actual API response
}
