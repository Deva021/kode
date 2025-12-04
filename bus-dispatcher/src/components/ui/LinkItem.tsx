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
      className={`text-lg font-semibold text-gray-700 transition-all duration-300 hover:text-blue-600 hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.4)] ${className}`.trim()}
    >
      {children}
    </Link>
  );
};

export default LinkItem;
