'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import { summaryApi, BankSummary } from '@/lib/api';
import { Users, CheckCircle, DollarSign, ListChecks, BarChart3, Send, CreditCard, Shield, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight, Plus, ArrowLeftRight, TrendingUp } from 'lucide-react';

export default function Home() {
  const [summary, setSummary] = useState<BankSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await summaryApi.getSummary();
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

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
        {/* Hero Section with Total Balance */}
        <div className="text-center mb-12">
          <div className="glass-card rounded-2xl p-8 mb-6 shadow-black-lg max-w-2xl mx-auto">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Assets</p>
            <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg">
              ${summary?.total_deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">All accounts secure</span>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 text-white/60">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm">Bank-Grade Security</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">FDIC Insured</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons - Floating Style */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <Link
            href="/accounts/create"
            className="glass-card px-6 py-4 rounded-xl hover:scale-110 transition-all duration-300 shadow-black hover:shadow-black-lg group flex items-center space-x-3"
          >
            <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
              <Plus className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-white font-semibold">New Account</span>
          </Link>
          
          <Link
            href="/transfer"
            className="glass-card px-6 py-4 rounded-xl hover:scale-110 transition-all duration-300 shadow-black hover:shadow-black-lg group flex items-center space-x-3"
          >
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <Send className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-white font-semibold">Send Money</span>
          </Link>
          
          <Link
            href="/accounts"
            className="glass-card px-6 py-4 rounded-xl hover:scale-110 transition-all duration-300 shadow-black hover:shadow-black-lg group flex items-center space-x-3"
          >
            <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-white font-semibold">My Accounts</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="glass-card px-6 py-4 rounded-xl hover:scale-110 transition-all duration-300 shadow-black hover:shadow-black-lg group flex items-center space-x-3"
          >
            <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30">
              <BarChart3 className="h-5 w-5 text-yellow-400" />
            </div>
            <span className="text-white font-semibold">Analytics</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Accounts"
            value={summary?.total_accounts || 0}
            icon={Users}
            color="text-blue-400"
          />
          <StatCard
            title="Active Accounts"
            value={summary?.active_accounts || 0}
            icon={CheckCircle}
            color="text-green-400"
          />
          <StatCard
            title="Total Deposits"
            value={`$${summary?.total_deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
            icon={DollarSign}
            color="text-yellow-400"
          />
          <StatCard
            title="Transactions"
            value={summary?.total_transactions || 0}
            icon={ListChecks}
            color="text-purple-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/accounts/create"
            className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 group shadow-black hover:shadow-black-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create Account</h3>
            <p className="text-white/70">Open a new bank account with just a few clicks</p>
          </Link>

          <Link
            href="/accounts"
            className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 group shadow-black hover:shadow-black-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <Users className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">View Accounts</h3>
            <p className="text-white/70">Browse and manage all your bank accounts</p>
          </Link>

          <Link
            href="/transfer"
            className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 group shadow-black hover:shadow-black-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <ArrowLeftRight className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Transfer Money</h3>
            <p className="text-white/70">Transfer funds between accounts securely</p>
          </Link>
        </div>

        {/* Dashboard Link */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 glass-card px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-black hover:shadow-black-lg text-white"
          >
            <BarChart3 className="h-6 w-6" />
            <span>View Professional Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

