import React, { Suspense } from 'react';
import { Navbar } from '@/components/ui/navbar'; // Adjust path if needed
import Loading from './loading';

export const metadata = {
  title: 'User Section',
  description: 'User-related pages like profile, clubs, dashboard, etc.',
};

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <main className="pt-16">{children}</main>
      </Suspense>
    </>
  );
}
