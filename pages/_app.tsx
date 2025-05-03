import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import '../src/styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Hunt the Wumpus - A classic cave adventure game" />
        <title>Hunt the Wumpus</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
