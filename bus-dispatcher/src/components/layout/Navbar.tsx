import React from 'react';
import Link from 'next/link';
import { Bus } from 'lucide-react';
import LinkItem from '@/components/ui/LinkItem';
import NavbarAuth from './NavbarAuth';

export default function Navbar() {
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
        <NavbarAuth />
      </div>
    </nav>
  );
}
