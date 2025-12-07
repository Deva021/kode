'use client';

import React from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { PrimaryButton, OutlineButton } from '@/components/ui/buttons';
import { useAuth } from '@/context/AuthContext';

export default function NavbarAuth() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={16} />
            </div>
            <span>Agent</span>
          </div>
          <OutlineButton onClick={signOut} className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </OutlineButton>
        </div>
      ) : (
        <Link href="/login">
          <PrimaryButton className="flex items-center gap-2">
            <User size={18} />
            <span>Agent Login</span>
          </PrimaryButton>
        </Link>
      )}
    </div>
  );
}
