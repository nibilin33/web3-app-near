import styles from '@/styles/app.module.css';
import { Button } from 'react-bootstrap';

export default function Home() {
  return (
    <main className={styles.main}>
      <Button variant="primary">Bootstrap Button</Button>
    </main>
  );
}