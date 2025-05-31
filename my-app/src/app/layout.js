import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import {Analytics} from '@vercel/analytics/next';
export default function RootLayout({ children }) {
  const pkey= process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={pkey}>
    <html lang="en">
      <body
      >
        {children}
        <Analytics />
      </body>
    </html>
    </ClerkProvider>
  );
}
