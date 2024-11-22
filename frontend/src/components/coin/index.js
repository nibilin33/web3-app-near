import { useState } from 'react';
import Image from 'next/image';
import styles from './coin.module.css';
import HeadPng from '/public/head.png';
import TailPng from '/public/tail.png';

const Coin = ({onFlipComplete, disabled = false }) => {
    const [isFlipped, setIsFlipped] = useState(false); // 是否翻转
    const [isSpinning, setIsSpinning] = useState(false); // 是否旋转中
  
    const flipCoin = async () => {
      if(disabled) return; // 禁用状态不可翻转
      if (isSpinning) return; // 防止多次点击
      setIsSpinning(true);
      if(typeof onFlipComplete === 'function') {
        const result = await onFlipComplete();
        setIsFlipped(result);
        setIsSpinning(false);
        return;
      }
      // 模拟旋转 2 秒后随机确定正反面
      setTimeout(() => {
        const randomSide = Math.random() > 0.5; // 随机选择正面或反面
        setIsFlipped(randomSide);
        setIsSpinning(false);
      }, 2000); 
    };
  return (
    <div className={styles.container}>
    
     <div
        className={`${styles.coin} ${isSpinning ? styles.spinning : ''} ${
          isFlipped ? styles.flipped : ''
        }`}
        onClick={flipCoin}
      >
      {!isSpinning && <p className={styles.clickText}>Click me</p>}
       {/* 正面图片 */}
      <div className={`${styles.side} ${styles.front}`}>
          <Image src={HeadPng} alt="Heads" className={styles.image} />
        </div>
        {/* 反面图片 */}
        <div className={`${styles.side} ${styles.back}`}>
          <Image src={TailPng} alt="Tails" className={styles.image} />
        </div>
      </div>

    </div>
  );
};

export default Coin;
