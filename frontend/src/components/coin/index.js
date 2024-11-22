import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './coin.module.css';
import HeadPng from '/public/head.png';
import TailPng from '/public/tail.png';
import {
  BET_CHOICES
} from '@/config';

const Coin = ({onFlipComplete, disabled = false, onFlipClick }) => {
    const [isFlipped, setIsFlipped] = useState(false); // 是否翻转
    const [isSpinning, setIsSpinning] = useState(false); // 是否旋转中
    const [isShowText, setIsShowText] = useState(true); // 是否显示点击文字
  
    const flipCoin = async () => {
      setIsShowText(false);
      if(onFlipClick) {
        onFlipClick();
      }
      if(disabled) {
        return;
      }
      if (isSpinning) return; // 防止多次点击
      setIsSpinning(true);
      if(typeof onFlipComplete === 'function') {
        const result = await onFlipComplete();
        setTimeout(() => {
            setIsFlipped(result === BET_CHOICES.HEAD);
            setIsSpinning(false);
        },1000);
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
      { isShowText && <p className={styles.clickText}>Click me</p>}
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
