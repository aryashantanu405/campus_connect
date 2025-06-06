import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import {Analytics} from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function RootLayout({ children }) {
  const pkey= process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={pkey}>
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="h0pDbBvLuOF5z8i5vafsbrq6TwTAciuUpagQa-odMZk" />
      </head>
      <body
      >
        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
    </ClerkProvider>
  );
}
