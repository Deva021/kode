import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LinkItem from '../ui/LinkItem';
import { PrimaryButton, OutlineButton } from '@/components/ui/buttons';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md supports-backdrop-filter:bg-slate-900/60">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative h-16 w-16 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
               <Image
                src="/logo.png"
                alt="BusDispatcher Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight transition-colors group-hover:text-blue-400">
              BusDispatcher
            </span>
          </Link>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-10">
          <LinkItem href="/dashboard">Dashboard</LinkItem>
          <LinkItem href="/routes">Routes</LinkItem>
          <LinkItem href="/schedule">Schedule</LinkItem>
        </nav>

        {/* Auth Buttons - Right Aligned */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <OutlineButton className="btn-sm border-slate-600 text-slate-200 hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">Log in</OutlineButton>
          <PrimaryButton className="btn-sm bg-blue-600 hover:bg-blue-500 border-none text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300">Sign up</PrimaryButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
