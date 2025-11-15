'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { accountApi, Account } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DepositPage() {
  const params = useParams();
  const router = useRouter();
  const accountNumber = params.accountNumber as string;
  const [account, setAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccount();
  }, [accountNumber]);

  const fetchAccount = async () => {
    try {
      const data = await accountApi.getById(accountNumber);
      setAccount(data);
    } catch (error) {
      toast.error('Failed to load account');
      router.push('/accounts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await accountApi.deposit(accountNumber, {
        amount: parseFloat(formData.amount),
        description: formData.description,
      });
      toast.success(`Successfully deposited $${formData.amount}`);
      router.push(`/accounts/${accountNumber}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to deposit');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/accounts/${accountNumber}`}
          className="inline-flex items-center space-x-2 text-white mb-6 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Account</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Deposit Money</h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Account Number</p>
            <p className="font-semibold text-gray-800">{account.account_number}</p>
            <p className="text-sm text-gray-600 mb-1 mt-2">Account Holder</p>
            <p className="font-semibold text-gray-800">{account.account_holder}</p>
            <p className="text-sm text-gray-600 mb-1 mt-2">Current Balance</p>
            <p className="text-2xl font-bold text-green-600">
              ${parseFloat(account.balance).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Deposit'}
              </button>
              <Link
                href={`/accounts/${accountNumber}`}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

