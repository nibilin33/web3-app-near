import styles from '@/styles/app.module.css';
import Coin from '@/components/coin';

export default function Home() {
  return (
    <main className={styles.main}>
      <Coin />
    </main>
  );
}