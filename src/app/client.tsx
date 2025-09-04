'use client';

import NavBar from '@src/components/layout/NavBar';
import Swap from '@src/modules/swap';
// import dynamic from 'next/dynamic';

// const App = dynamic(() => import('../pages'), { ssr: false });

export function ClientOnly() {
  return (
    <>
      <NavBar />
      <Swap />
    </>
  );
}
