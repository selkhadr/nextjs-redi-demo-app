import Head from 'next/head';

export default function Layout({ children, title = 'Next.js Redis Demo' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Next.js application with Redis integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header>
        <div className="container">
          <h1 className="site-title" style={{ color: 'black' }}>Next.js + Redis Demo</h1>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer>
        <div className="container">
          <p style={{ color: 'black' }}>Next.js Application with Redis Integration - Technical Test</p>
        </div>
      </footer>
    </>
  );
}
