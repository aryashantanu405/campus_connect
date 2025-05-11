import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }) {
  const pkey= process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={pkey}>
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
