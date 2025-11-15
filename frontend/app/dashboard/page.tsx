'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { summaryApi, accountApi, transactionApi, Account, Transaction, BankSummary } from '@/lib/api';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Activity, 
  ArrowUpRight, ArrowDownRight, Building2, CreditCard, PieChart
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function DashboardPage() {
  const [summary, setSummary] = useState<BankSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryData, accountsData, transactionsData] = await Promise.all([
        summaryApi.getSummary(),
        accountApi.getAll(),
        transactionApi.getAll()
      ]);
      
      setSummary(summaryData);
      setAccounts(accountsData);
      setRecentTransactions(transactionsData.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const prepareTransactionChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'MMM dd'),
        deposits: 0,
        withdrawals: 0,
      };
    });

    recentTransactions.forEach(transaction => {
      const date = parseISO(transaction.timestamp);
      const dayIndex = last7Days.findIndex(d => 
        format(parseISO(transaction.timestamp), 'MMM dd') === d.date
      );
      if (dayIndex !== -1) {
        if (transaction.transaction_type === 'DEPOSIT' || transaction.transaction_type === 'INITIAL' || transaction.transaction_type === 'TRANSFER_IN') {
          last7Days[dayIndex].deposits += parseFloat(transaction.amount);
        } else {
          last7Days[dayIndex].withdrawals += parseFloat(transaction.amount);
        }
      }
    });

    return last7Days;
  };

  const prepareAccountDistributionData = () => {
    const activeAccounts = accounts.filter(acc => acc.is_active);
    const totalBalance = activeAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    
    return activeAccounts.slice(0, 5).map(acc => ({
      name: acc.account_holder,
      value: parseFloat(acc.balance),
      percentage: ((parseFloat(acc.balance) / totalBalance) * 100).toFixed(1)
    }));
  };

  const prepareMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      balance: Math.random() * 1000000 + 500000,
      transactions: Math.floor(Math.random() * 100) + 50
    }));
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

  const transactionChartData = prepareTransactionChartData();
  const accountDistributionData = prepareAccountDistributionData();
  const monthlyData = prepareMonthlyData();

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Bank Dashboard</h1>
              <p className="text-white/70 mt-1">Comprehensive overview of your banking operations</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <Building2 className="h-5 w-5" />
              <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="glass-card rounded-xl p-6 mb-8 shadow-black-lg">
          <h2 className="text-xl font-bold text-white mb-4">Spending Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Total Deposits</p>
              <p className="text-2xl font-bold text-green-400">
                ${recentTransactions
                  .filter(t => t.transaction_type === 'DEPOSIT' || t.transaction_type === 'INITIAL' || t.transaction_type === 'TRANSFER_IN')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-400">
                ${recentTransactions
                  .filter(t => t.transaction_type === 'WITHDRAWAL' || t.transaction_type === 'TRANSFER_OUT')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Net Flow</p>
              <p className={`text-2xl font-bold ${
                recentTransactions
                  .filter(t => t.transaction_type === 'DEPOSIT' || t.transaction_type === 'INITIAL' || t.transaction_type === 'TRANSFER_IN')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0) >
                recentTransactions
                  .filter(t => t.transaction_type === 'WITHDRAWAL' || t.transaction_type === 'TRANSFER_OUT')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                ${(recentTransactions
                  .filter(t => t.transaction_type === 'DEPOSIT' || t.transaction_type === 'INITIAL' || t.transaction_type === 'TRANSFER_IN')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0) -
                recentTransactions
                  .filter(t => t.transaction_type === 'WITHDRAWAL' || t.transaction_type === 'TRANSFER_OUT')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0))
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Assets"
            value={`$${summary?.total_deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
            change="+12.5%"
            trend="up"
            icon={DollarSign}
            color="blue"
          />
          <MetricCard
            title="Active Accounts"
            value={summary?.active_accounts || 0}
            change="+3"
            trend="up"
            icon={Users}
            color="green"
          />
          <MetricCard
            title="Total Transactions"
            value={summary?.total_transactions || 0}
            change="+24.2%"
            trend="up"
            icon={Activity}
            color="purple"
          />
          <MetricCard
            title="Total Accounts"
            value={summary?.total_accounts || 0}
            change="+2"
            trend="up"
            icon={CreditCard}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Transaction Flow Chart */}
          <div className="glass-card rounded-xl p-6 shadow-black-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Transaction Flow (Last 7 Days)</h2>
              <PieChart className="h-5 w-5 text-white/40" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionChartData}>
                <defs>
                  <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="deposits" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorDeposits)"
                  name="Deposits"
                />
                <Area 
                  type="monotone" 
                  dataKey="withdrawals" 
                  stroke="#EF4444" 
                  fillOpacity={1} 
                  fill="url(#colorWithdrawals)"
                  name="Withdrawals"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Account Distribution */}
          <div className="glass-card rounded-xl p-6 shadow-black-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Top Accounts by Balance</h2>
              <PieChart className="h-5 w-5 text-white/40" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accountDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {accountDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {accountDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-semibold text-white">
                    ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="glass-card rounded-xl p-6 mb-8 shadow-black-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Monthly Performance</h2>
            <TrendingUp className="h-5 w-5 text-white/40" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="balance" fill="#0066CC" name="Balance" radius={[8, 8, 0, 0]} />
              <Bar dataKey="transactions" fill="#00A3E0" name="Transactions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions Table */}
        <div className="glass-card rounded-xl p-6 shadow-black-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {format(parseISO(transaction.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {transaction.transaction_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.transaction_type === 'DEPOSIT' || 
                        transaction.transaction_type === 'INITIAL' || 
                        transaction.transaction_type === 'TRANSFER_IN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.transaction_type_display}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      transaction.transaction_type === 'DEPOSIT' || 
                      transaction.transaction_type === 'INITIAL' || 
                      transaction.transaction_type === 'TRANSFER_IN'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'DEPOSIT' || 
                       transaction.transaction_type === 'INITIAL' || 
                       transaction.transaction_type === 'TRANSFER_IN' ? '+' : '-'}
                      ${parseFloat(transaction.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${parseFloat(transaction.balance_after).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricCard = ({ title, value, change, trend, icon: Icon, color }: MetricCardProps) => {

  return (
    <div className="glass-card rounded-xl p-6 shadow-black hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </span>
            <span className="text-sm text-white/50">vs last month</span>
          </div>
        </div>
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
          <Icon className={`h-6 w-6 ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : color === 'purple' ? 'text-purple-400' : 'text-orange-400'}`} />
        </div>
      </div>
    </div>
  );
};

