import { useState, useEffect, useContext } from "react";

import { NearContext } from "@/wallets/near";
import styles from "@/styles/app.module.css";
import { FlicpNearContract } from "@/config";
import { Cards } from "@/components/cards";

// Contract that the app will interact with
const CONTRACT = FlicpNearContract;

export default function FlipNear() {
  const { signedAccountId, wallet } = useContext(NearContext);

  const [points, setPoints] = useState(0);
  const [choice, setChoice] = useState();
  const [result, setResult] = useState("");
  const [amount, setAmount] = useState("");
  const [guess, setGuess] = useState("heads");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    initData();
  }, [wallet]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);
  async function initData() {
    if (!wallet.isSignedIn()) {
      wallet.requestSignIn(CONTRACT);
    } else {
      const points = await wallet.viewMethod({
        contractId: CONTRACT,
        method: "points_of",
        args: { player: signedAccountId },
      });
      setPoints(points);
    }
  }
  const placeBet = async () => {
    if (amount === "") {
      alert("Please enter an amount");
      return;
    }
    await wallet.callMethod({
      contractId: CONTRACT,
      method: "place_bet",
      args: { player_guess: guess, amount: amount },
      amount: amount,
    });
    alert("Bet placed successfully!");
  };
  const handleChoice = async (guess) => {
    setChoice(guess);
    const outcome = await wallet.callMethod({
      contractId: CONTRACT,
      method: "flip_coin",
      args: { player_guess: guess },
    });
    await updateScore();
  };
  const flipCoin = async () => {
    setShowSpinner(true);
    const result = await wallet.callMethod({
      contractId: CONTRACT,
      method: "bet_flip_coin",
    });
    setResult(`Coin flip result: ${result}`);
    await updateScore();
    setShowSpinner(false);
  };
  const updateScore = async () => {
    const score = await wallet.viewMethod({
      contractId: CONTRACT,
      method: "points_of",
      args: { player: signedAccountId },
    });
    setPoints(score);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Interacting with the contract: &nbsp;
          <code className={styles.code}>{CONTRACT}</code>
        </p>
      </div>

      <div className={styles.center}>
        <div className="w-100 text-end align-text-center" hidden={loggedIn}>
          <p className="m-0"> Please login to change the greeting </p>
        </div>
      </div>
      <Cards />
    </main>
  );
}
