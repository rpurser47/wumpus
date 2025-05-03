import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect } from 'react';

// Import App component with no SSR to avoid hydration errors
const AppWithNoSSR = dynamic(() => import('../src/App'), {
  ssr: false,
});

export default function Home() {
  // Add a class to the body for fallback styling
  useEffect(() => {
    document.body.style.backgroundColor = '#2c3e50';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <Head>
        <title>Hunt the Wumpus</title>
      </Head>
      <AppWithNoSSR />
    </>
  );
}
