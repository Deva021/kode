import Link from 'next/link';
import React from 'react';

interface LinkItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkItem = ({ href, children, className = '' }: LinkItemProps) => {
  return (
    <Link 
      href={href} 
      className={`text-base font-medium text-slate-300 transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${className}`.trim()}
    >
      {children}
    </Link>
  );
};

export default LinkItem;
