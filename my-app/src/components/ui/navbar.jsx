'use client';

import { ChevronDown, Menu } from 'lucide-react';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import clsx from 'clsx';

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Community', href: '/community' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="h-8 w-8 text-blue-600" aria-label="Home">
              <span className="sr-only">Home</span>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
              </svg>
            </Link>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Unify
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Features <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/lost-found">Lost & Found</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/senior-corner">Senior Corner</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/clubs">clubs</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/challenges">Challenges</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'px-3 py-2 rounded transition-colors',
                  pathname === item.href
                    ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                )}
              >
                {item.name}
              </Link>
            ))}

            {user && <UserButton />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full text-left justify-between">
                  Features <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Lost & Found</DropdownMenuItem>
                <DropdownMenuItem>Senior Connect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'block px-4 py-2 rounded transition-colors',
                  pathname === item.href
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}

            {user && <div className="px-4"><UserButton afterSignOutUrl="/" /></div>}
          </div>
        )}
      </div>
    </nav>
  );
}
