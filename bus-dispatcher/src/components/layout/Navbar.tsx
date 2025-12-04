import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LinkItem from '../ui/LinkItem';
import { PrimaryButton, OutlineButton } from '@/components/ui/buttons';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-gray-100 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex h-28 items-center justify-between px-8">
        {/* Logo Section */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative h-20 w-20 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
               <Image
                src="/logo.png"
                alt="BusDispatcher Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight transition-colors group-hover:text-blue-600">
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
          <OutlineButton className="btn-md border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all duration-300">Log in</OutlineButton>
          <PrimaryButton className="btn-md bg-blue-600 text-white hover:bg-blue-700 border-none shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 font-semibold">Sign up</PrimaryButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
