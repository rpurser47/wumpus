import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Hunt the Wumpus - A classic cave adventure game" />
      </Head>
      <body style={{ backgroundColor: '#2c3e50' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
