'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { transferApi, accountApi, Account } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TransferPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState({
    from_account: '',
    to_account: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await accountApi.getAll();
      const activeAccounts = data.filter(acc => acc.is_active);
      setAccounts(activeAccounts);
    } catch (error) {
      toast.error('Failed to load accounts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await transferApi.transfer({
        from_account: formData.from_account,
        to_account: formData.to_account,
        amount: parseFloat(formData.amount),
      });
      toast.success(`Successfully transferred $${formData.amount}`);
      router.push('/accounts');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to transfer');
    } finally {
      setLoading(false);
    }
  };

  const fromAccount = accounts.find(acc => acc.account_number === formData.from_account);
  const maxAmount = fromAccount ? parseFloat(fromAccount.balance) : 0;

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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transfer Money</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="from_account" className="block text-sm font-medium text-gray-700 mb-2">
                From Account *
              </label>
              <select
                id="from_account"
                required
                value={formData.from_account}
                onChange={(e) => setFormData({ ...formData, from_account: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="">Select source account</option>
                {accounts.map((account) => (
                  <option key={account.account_number} value={account.account_number}>
                    {account.account_number} - {account.account_holder} (${parseFloat(account.balance).toFixed(2)})
                  </option>
                ))}
              </select>
              {fromAccount && (
                <p className="mt-2 text-sm text-gray-600">
                  Available: <span className="font-semibold text-green-600">${maxAmount.toFixed(2)}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="to_account" className="block text-sm font-medium text-gray-700 mb-2">
                To Account *
              </label>
              <select
                id="to_account"
                required
                value={formData.to_account}
                onChange={(e) => setFormData({ ...formData, to_account: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="">Select destination account</option>
                {accounts
                  .filter(acc => acc.account_number !== formData.from_account)
                  .map((account) => (
                    <option key={account.account_number} value={account.account_number}>
                      {account.account_number} - {account.account_holder}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  required
                  min="0.01"
                  step="0.01"
                  max={maxAmount}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !formData.from_account || !formData.to_account || !formData.amount}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Transfer'}
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

