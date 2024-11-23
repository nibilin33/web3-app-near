import React, { useState, useContext, useEffect, use } from "react";
import Image from "next/image";
import styles from "./bet.module.css";
import BetPng from "/public/bet-m.png";
import { Button } from "react-bootstrap";
import { NearContext } from "@/wallets/near";
import { toast } from "react-toastify";
import {
    BET_CHOICES
} from '@/config';

const BetMachine = ({ onBet }) => {
  const [betCount, setBetCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedSide, setSelectedSide] = useState(BET_CHOICES.HEAD); // 新增状态变量
  const { wallet, signedAccountId } = useContext(NearContext);
  const updateBetCount = (newBetCount) => {
    setBetCount(newBetCount);
    if(onBet) {
        onBet({
            side: selectedSide,
            amount: newBetCount
        }); 
    }
  }
  useEffect(() => {
    if (!signedAccountId) return;
    getAccountBalance();
  }, [signedAccountId]);

  const getAccountBalance = async () => {
    const balance = await wallet.getBalance(signedAccountId);
    setBalance(balance);
  }
  const handleBet = () => {
    if(betCount > balance) {
        toast.error("Insufficient balance");
        return;
    }
    if (betCount < 5) {
        const newBetCount = betCount + 1;
        updateBetCount(newBetCount);
    } else {
        toast.error("You have reached the bet limit");
    }
  };
  const handleReduceBet = () => {
    if (betCount > 0) {
      const newBetCount = betCount - 1;
      updateBetCount(newBetCount);
    }
  };
  const handleSelectSide = (side) => {
    setSelectedSide(side);
  };
  return (
    <div className={styles.container}>
      <div className={styles.betStack}>
        {[...Array(betCount)].map((_, index) => (
          <Image src={BetPng} alt="Bill" key={index} className={styles.bill} />
        ))}
      </div>
      <div className={styles.balance}>
        <p>Your Balance: {balance} NEAR</p>
      </div>
      <div className={styles.sideSelector}>
        <Button
          onClick={() => handleSelectSide(BET_CHOICES.HEAD)}
          variant={selectedSide === BET_CHOICES.HEAD ? "primary" : "secondary"}
          className={styles.sideButton}
        >
          Head
        </Button>
        <Button
          onClick={() => handleSelectSide(BET_CHOICES.TAIL)}
          variant={selectedSide === BET_CHOICES.TAIL ? "primary" : "secondary"}
          className={styles.sideButton}
        >
          Tail
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleBet} variant="danger" className={styles.betButton}>
          Bet
        </Button>
        <Button onClick={handleReduceBet} variant="success" className={styles.betButton}>
          Reduce Bet
        </Button>
      </div>
    </div>
  );
};

export default BetMachine;
