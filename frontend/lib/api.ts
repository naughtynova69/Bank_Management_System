import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Account {
  account_number: string;
  account_holder: string;
  balance: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  transaction_count?: number;
  transactions?: Transaction[];
}

export interface Transaction {
  id: number;
  transaction_type: string;
  transaction_type_display: string;
  amount: string;
  balance_after: string;
  description: string;
  timestamp: string;
}

export interface BankSummary {
  total_accounts: number;
  active_accounts: number;
  total_deposits: number;
  total_transactions: number;
}

export interface CreateAccountData {
  account_holder: string;
  initial_balance?: number;
}

export interface DepositWithdrawData {
  amount: number;
  description?: string;
}

export interface TransferData {
  from_account: string;
  to_account: string;
  amount: number;
}

// Account APIs
export const accountApi = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get('/accounts/');
    return response.data.results || response.data;
  },

  getById: async (accountNumber: string): Promise<Account> => {
    const response = await api.get(`/accounts/${accountNumber}/`);
    return response.data;
  },

  create: async (data: CreateAccountData): Promise<Account> => {
    const response = await api.post('/accounts/', data);
    return response.data;
  },

  deposit: async (accountNumber: string, data: DepositWithdrawData): Promise<Account> => {
    const response = await api.post(`/accounts/${accountNumber}/deposit/`, data);
    return response.data.account;
  },

  withdraw: async (accountNumber: string, data: DepositWithdrawData): Promise<Account> => {
    const response = await api.post(`/accounts/${accountNumber}/withdraw/`, data);
    return response.data.account;
  },

  close: async (accountNumber: string): Promise<Account> => {
    const response = await api.post(`/accounts/${accountNumber}/close/`);
    return response.data.account;
  },

  getTransactions: async (accountNumber: string): Promise<Transaction[]> => {
    const response = await api.get(`/accounts/${accountNumber}/transactions/`);
    return response.data;
  },
};

// Transaction APIs
export const transactionApi = {
  getAll: async (accountNumber?: string): Promise<Transaction[]> => {
    const params = accountNumber ? { account: accountNumber } : {};
    const response = await api.get('/transactions/', { params });
    return response.data.results || response.data;
  },
};

// Transfer API
export const transferApi = {
  transfer: async (data: TransferData): Promise<{ from_account: Account; to_account: Account }> => {
    const response = await api.post('/transfer/', data);
    return response.data;
  },
};

// Summary API
export const summaryApi = {
  getSummary: async (): Promise<BankSummary> => {
    const response = await api.get('/summary/');
    return response.data;
  },
};

export default api;

