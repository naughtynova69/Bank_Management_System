'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { accountApi, Account } from '@/lib/api';
import Link from 'next/link';
import { Eye, Plus, ArrowUp, ArrowDown, X, Users, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await accountApi.getAll();
      setAccounts(data);
      setFilteredAccounts(data);
    } catch (error) {
      toast.error('Failed to load accounts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = accounts;

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter(acc => acc.is_active);
    } else if (filterStatus === 'closed') {
      filtered = filtered.filter(acc => !acc.is_active);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(acc =>
        acc.account_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.account_holder.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAccounts(filtered);
  }, [searchQuery, filterStatus, accounts]);

  const handleCloseAccount = async (accountNumber: string) => {
    if (!confirm(`Are you sure you want to close account ${accountNumber}?`)) {
      return;
    }

    try {
      await accountApi.close(accountNumber);
      toast.success('Account closed successfully');
      fetchAccounts();
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

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">All Accounts</h1>
            <Link
              href="/accounts/create"
              className="glass-card px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-black flex items-center space-x-2 text-white"
            >
              <Plus className="h-5 w-5" />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="glass-card rounded-xl p-4 shadow-black flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by account number or holder name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white/40" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'closed')}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
              >
                <option value="all" className="bg-gray-900">All Accounts</option>
                <option value="active" className="bg-gray-900">Active Only</option>
                <option value="closed" className="bg-gray-900">Closed Only</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAccounts.length === 0 && accounts.length > 0 ? (
          <div className="glass-card rounded-xl p-12 text-center shadow-black-lg">
            <Search className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Accounts Found</h3>
            <p className="text-white/60 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-black text-white"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center shadow-black-lg">
            <Users className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Accounts Found</h3>
            <p className="text-white/60 mb-6">Create your first account to get started!</p>
            <Link
              href="/accounts/create"
              className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-black text-white"
            >
              <Plus className="h-5 w-5" />
              <span>Create Account</span>
            </Link>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden shadow-black-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Account Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Account Holder
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredAccounts.map((account) => (
                    <tr key={account.account_number} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          {account.account_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/90">{account.account_holder}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-400">
                          ${parseFloat(account.balance).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            account.is_active
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {account.is_active ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {account.transaction_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/accounts/${account.account_number}`}
                          className="text-white/70 hover:text-white inline-flex items-center space-x-1 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                        {account.is_active && (
                          <>
                            <Link
                              href={`/accounts/${account.account_number}/deposit`}
                              className="text-green-400 hover:text-green-300 inline-flex items-center space-x-1 transition-colors"
                            >
                              <ArrowUp className="h-4 w-4" />
                              <span>Deposit</span>
                            </Link>
                            <Link
                              href={`/accounts/${account.account_number}/withdraw`}
                              className="text-yellow-400 hover:text-yellow-300 inline-flex items-center space-x-1 transition-colors"
                            >
                              <ArrowDown className="h-4 w-4" />
                              <span>Withdraw</span>
                            </Link>
                            <button
                              onClick={() => handleCloseAccount(account.account_number)}
                              className="text-red-400 hover:text-red-300 inline-flex items-center space-x-1 transition-colors"
                            >
                              <X className="h-4 w-4" />
                              <span>Close</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

