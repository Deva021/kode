'use client';

import React from 'react';
import Link from 'next/link';
import { Bus, User, LogOut } from 'lucide-react';
import { PrimaryButton, OutlineButton } from '@/components/ui/buttons';
import LinkItem from '@/components/ui/LinkItem';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:opacity-90 transition-opacity">
          <Bus size={28} />
          <span className="text-xl font-bold tracking-tight">BusDispatcher</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <LinkItem href="/">Home</LinkItem>
          <LinkItem href="/schedule">Schedule</LinkItem>
          <LinkItem href="/contact">Contact</LinkItem>
        </div>

        {/* Auth Buttons */}
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
      </div>
    </nav>
  );
}
