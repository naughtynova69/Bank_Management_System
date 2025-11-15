'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { accountApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    account_holder: '',
    initial_balance: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        account_holder: formData.account_holder,
        initial_balance: formData.initial_balance ? parseFloat(formData.initial_balance) : 0,
      };

      const account = await accountApi.create(data);
      toast.success(`Account ${account.account_number} created successfully!`);
      router.push(`/accounts/${account.account_number}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/accounts"
          className="inline-flex items-center space-x-2 text-white mb-6 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Accounts</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Account</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="account_holder" className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                id="account_holder"
                required
                value={formData.account_holder}
                onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter account holder name"
              />
            </div>

            <div>
              <label htmlFor="initial_balance" className="block text-sm font-medium text-gray-700 mb-2">
                Initial Deposit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="initial_balance"
                  min="0"
                  step="0.01"
                  value={formData.initial_balance}
                  onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Leave empty or enter 0 for no initial deposit</p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
              <Link
                href="/accounts"
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

