import React from 'react';
import { Navbar } from '@/components/ui/navbar'; // Adjust path if needed

export const metadata = {
  title: 'User Section',
  description: 'User-related pages like profile, clubs, dashboard, etc.',
};

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main> 
      </>
  );
}
