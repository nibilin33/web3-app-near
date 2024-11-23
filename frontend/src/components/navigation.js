import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';

import { NearContext } from '@/wallets/near';
import CoinLogo from '/public/coin-logo.svg';

const Labels = {
  LOGIN: 'Login',
  Loading: 'Loading...',
  LOUGOUT: 'Logout'
};
export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState(Labels.Loading);

  useEffect(() => {
    if (!wallet) return;
    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`${Labels.LOUGOUT} ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel(Labels.LOGIN);
    }
  }, [signedAccountId, wallet]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link href="/history" passHref legacyBehavior>
          <Image priority src={CoinLogo} alt="NEAR" width="30" height="24" className="d-inline-block align-text-top" />
        </Link>
        <div className='navbar-nav pt-1'>
          <button id="loginbutton" className="btn btn-secondary" onClick={action} > {label} </button>
        </div>
      </div>
    </nav>
  );
};