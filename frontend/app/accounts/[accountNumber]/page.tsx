'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { accountApi, Account, Transaction } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowUp, ArrowDown, X, Clock, Wallet, TrendingUp, TrendingDown, ArrowLeftRight, CreditCard, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountNumber = params.accountNumber as string;
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccount();
    fetchTransactions();
  }, [accountNumber]);

  const fetchAccount = async () => {
    try {
      const data = await accountApi.getById(accountNumber);
      setAccount(data);
    } catch (error) {
      toast.error('Failed to load account');
      router.push('/accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await accountApi.getTransactions(accountNumber);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions');
    }
  };

  const handleCloseAccount = async () => {
    if (!confirm(`Are you sure you want to close account ${accountNumber}?`)) {
      return;
    }

    try {
      await accountApi.close(accountNumber);
      toast.success('Account closed successfully');
      fetchAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to close account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative z-10">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 border-t-white"></div>
        </div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/accounts"
          className="inline-flex items-center space-x-2 text-white mb-6 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Accounts</span>
        </Link>

        {/* Large Balance Display */}
        <div className="glass-card rounded-2xl p-8 mb-6 shadow-black-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm uppercase tracking-wider mb-1">{account.account_holder}</p>
              <p className="text-white/40 text-xs">Account #{account.account_number}</p>
            </div>
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                account.is_active
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {account.is_active ? 'Active' : 'Closed'}
            </span>
          </div>
          <div className="mb-6">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Available Balance</p>
            <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg">
              ${parseFloat(account.balance).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
          </div>

          {account.is_active && (
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/accounts/${accountNumber}/deposit`}
                className="glass-card flex items-center space-x-2 px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-black text-white border border-green-500/30 bg-green-500/10"
              >
                <ArrowUp className="h-5 w-5 text-green-400" />
                <span className="font-semibold">Deposit</span>
              </Link>
              <Link
                href={`/accounts/${accountNumber}/withdraw`}
                className="glass-card flex items-center space-x-2 px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-black text-white border border-yellow-500/30 bg-yellow-500/10"
              >
                <ArrowDown className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">Withdraw</span>
              </Link>
              <button
                onClick={handleCloseAccount}
                className="glass-card flex items-center space-x-2 px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-black text-white border border-red-500/30 bg-red-500/10"
              >
                <X className="h-5 w-5 text-red-400" />
                <span className="font-semibold">Close Account</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="glass-card rounded-xl p-6 shadow-black">
            <h2 className="text-lg font-bold text-white mb-4">Quick Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{account.transaction_count || 0}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Created</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(account.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-black-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="h-6 w-6 text-white/80" />
            <h2 className="text-2xl font-bold text-white">Transaction History</h2>
          </div>

          {transactions.length === 0 ? (
            <p className="text-white/60 text-center py-8">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const isPositive = transaction.transaction_type === 'DEPOSIT' || 
                                  transaction.transaction_type === 'INITIAL' || 
                                  transaction.transaction_type === 'TRANSFER_IN';
                
                const getTransactionIcon = () => {
                  if (transaction.transaction_type === 'DEPOSIT' || transaction.transaction_type === 'INITIAL') {
                    return <TrendingUp className="h-5 w-5 text-green-400" />;
                  } else if (transaction.transaction_type === 'WITHDRAWAL') {
                    return <TrendingDown className="h-5 w-5 text-red-400" />;
                  } else if (transaction.transaction_type === 'TRANSFER_IN' || transaction.transaction_type === 'TRANSFER_OUT') {
                    return <ArrowLeftRight className="h-5 w-5 text-blue-400" />;
                  }
                  return <CreditCard className="h-5 w-5 text-white/60" />;
                };

                return (
                  <div
                    key={transaction.id}
                    className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 shadow-black flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        isPositive ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                      }`}>
                        {getTransactionIcon()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-semibold ${
                            isPositive ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.transaction_type_display}
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/70">{transaction.description || 'Transaction'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-white/50">
                        Balance: ${parseFloat(transaction.balance_after).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

