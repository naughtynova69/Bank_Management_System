'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, Users, Plus, ArrowLeftRight, PieChart } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header - Just Icon */}
        <div className="flex justify-center py-4">
          <Link href="/" className="flex items-center">
            <Building2 className="h-10 w-10 text-white hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>

        {/* Bubble Navigation Buttons */}
        <div className="flex justify-center items-center gap-3 pb-4 flex-wrap">
          <Link
            href="/"
            className={`glass-card px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-black hover:scale-110 ${
              isActive('/') 
                ? 'bg-white/25 border-2 border-white/40 scale-110' 
                : 'bg-white/10 border border-white/20 hover:bg-white/15'
            }`}
          >
            <Home className={`h-5 w-5 ${isActive('/') ? 'text-white' : 'text-white/70'}`} />
            <span className={`font-medium ${isActive('/') ? 'text-white' : 'text-white/70'}`}>
              Home
            </span>
          </Link>
          
          <Link
            href="/accounts"
            className={`glass-card px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-black hover:scale-110 ${
              isActive('/accounts') 
                ? 'bg-white/25 border-2 border-white/40 scale-110' 
                : 'bg-white/10 border border-white/20 hover:bg-white/15'
            }`}
          >
            <Users className={`h-5 w-5 ${isActive('/accounts') ? 'text-white' : 'text-white/70'}`} />
            <span className={`font-medium ${isActive('/accounts') ? 'text-white' : 'text-white/70'}`}>
              Accounts
            </span>
          </Link>
          
          <Link
            href="/accounts/create"
            className={`glass-card px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-black hover:scale-110 ${
              isActive('/accounts/create') 
                ? 'bg-white/25 border-2 border-white/40 scale-110' 
                : 'bg-white/10 border border-white/20 hover:bg-white/15'
            }`}
          >
            <Plus className={`h-5 w-5 ${isActive('/accounts/create') ? 'text-white' : 'text-white/70'}`} />
            <span className={`font-medium ${isActive('/accounts/create') ? 'text-white' : 'text-white/70'}`}>
              Create
            </span>
          </Link>
          
          <Link
            href="/transfer"
            className={`glass-card px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-black hover:scale-110 ${
              isActive('/transfer') 
                ? 'bg-white/25 border-2 border-white/40 scale-110' 
                : 'bg-white/10 border border-white/20 hover:bg-white/15'
            }`}
          >
            <ArrowLeftRight className={`h-5 w-5 ${isActive('/transfer') ? 'text-white' : 'text-white/70'}`} />
            <span className={`font-medium ${isActive('/transfer') ? 'text-white' : 'text-white/70'}`}>
              Transfer
            </span>
          </Link>
          
          <Link
            href="/dashboard"
            className={`glass-card px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-black hover:scale-110 ${
              isActive('/dashboard') 
                ? 'bg-white/25 border-2 border-white/40 scale-110' 
                : 'bg-white/10 border border-white/20 hover:bg-white/15'
            }`}
          >
            <PieChart className={`h-5 w-5 ${isActive('/dashboard') ? 'text-white' : 'text-white/70'}`} />
            <span className={`font-medium ${isActive('/dashboard') ? 'text-white' : 'text-white/70'}`}>
              Dashboard
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

