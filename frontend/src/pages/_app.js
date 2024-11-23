import { useEffect, useState } from 'react';

import '@/styles/globals.css';
import "react-toastify/dist/ReactToastify.css";
import { Navigation } from '@/components/navigation';
import { Wallet, NearContext } from '@/wallets/near';
import { NetworkId,FlicpNearContract } from '@/config';
import { ToastContainer } from "react-toastify";


const wallet = new Wallet({ networkId: NetworkId,createAccessKeyFor: FlicpNearContract });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <Navigation />
      <Component {...pageProps} />
      <ToastContainer />
    </NearContext.Provider>
  );
}
