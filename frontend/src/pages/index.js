import { NearContext } from "@/wallets/near";
import { useEffect, useContext, useState } from "react";
import styles from "@/styles/app.module.css";
import FlipNear from "@/components/flip";
import WelcomeAnimation from "@/components/welcome";


export default function Home() {
  const { signedAccountId } = useContext(NearContext);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsFirstVisit(!signedAccountId);
    }
  }, [signedAccountId]);

  return (
    <main className={styles.main}>
      {isFirstVisit && <WelcomeAnimation targetId="loginbutton" />}
      <FlipNear></FlipNear>
    </main>
  );
}