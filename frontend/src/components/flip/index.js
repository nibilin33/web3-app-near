import { useState, useEffect, useContext } from "react";
import { NearContext } from "@/wallets/near";
import styles from "@/styles/app.module.css";
import { FlicpNearContract } from "@/config";
import Coin from "@/components/coin";
import BetMachine from "@/components/bet";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
// Contract that the app will interact with
const CONTRACT = FlicpNearContract;

export default function FlipNear() {
  const { signedAccountId, wallet } = useContext(NearContext);

  const [points, setPoints] = useState(0); // 赢得的金额
  const [result, setResult] = useState("");
  const [betConfig, setBetConfig] = useState({});
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    initData();
  }, [wallet]);

  async function initData() {
    if (!signedAccountId) {
      return;
    }
    const points = await wallet.viewMethod({
      contractId: CONTRACT,
      method: "points_of",
      args: { player: signedAccountId },
    });
    setPoints(points);
  }
  const placeBet = async () => {
    await wallet.callMethod({
      contractId: CONTRACT,
      method: "place_bet",
      args: { player_guess: betConfig.side, amount: betConfig.amount},
      amount: betConfig.amount,
    });
  };
  const flipCoin = async () => {
    await placeBet();
    const result = await wallet.callMethod({
      contractId: CONTRACT,
      method: "bet_flip_coin",
    });
    setResult(`Coin flip result: ${result}`);
    setIsWinner(result === betConfig.side);
    await updateScore();
    return result;
  };
  const updateScore = async () => {
    const score = await wallet.viewMethod({
      contractId: CONTRACT,
      method: "points_of",
      args: { player: signedAccountId },
    });
    setPoints(score);
  };
  const handleHint = () => {
    if (!signedAccountId) {
      toast.error("Please log in before placing a bet");
      return;
    }
    if(!betConfig.amount || !betConfig.side) {
      toast.error("Please set the bet amount and side");
      return;
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Interacting with the contract &nbsp;
          <code className={styles.code}>{CONTRACT}</code>
        </p>
      </div>
      {isWinner && <Confetti />}
      <Coin onFlipComplete={flipCoin} disabled={!signedAccountId && !betConfig.amount || !betConfig.side} onFlipClick={handleHint}/>
      <BetMachine onBet={setBetConfig}></BetMachine>
      {!signedAccountId && (
        <div className={styles.center}>
          <div className="w-100 text-end align-text-center">
            <p className="m-0"> Please log in before placing a bet </p>
          </div>
        </div>
      )}
    </main>
  );
}
