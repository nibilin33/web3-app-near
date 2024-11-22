import { useState, useRef } from 'react';

const CoinFlip = () => {
  const [result, setResult] = useState('');
  const [clicked, setClicked] = useState(false);
  const [coinStyles, setCoinStyles] = useState({});
  const [coinClasses, setCoinClasses] = useState('');
  const coinRef = useRef(null);

  const flipCoin = () => {
    const coin = coinRef.current;
    coin.moveLoopCount = 0;
    coin.maxMoveLoopCount = 90;
    coin.sideRotationCount = Math.floor(Math.random() * 5) * 90;
    coin.maxFlipAngle = (Math.floor(Math.random() * 4) + 3) * Math.PI;
    flipCoinLoop();
  };

  const resetCoin = () => {
    setCoinStyles({
      '--coin-x-multiplier': 0,
      '--coin-scale-multiplier': 0,
      '--coin-rotation-multiplier': 0,
      '--shine-opacity-multiplier': 0.4,
      '--shine-bg-multiplier': '50%',
      'opacity': 1,
    });
    setTimeout(() => {
      setClicked(false);
    }, 300);
  };

  const flipCoinLoop = () => {
    const coin = coinRef.current;
    coin.moveLoopCount++;
    let percentageCompleted = coin.moveLoopCount / coin.maxMoveLoopCount;
    coin.angle = -coin.maxFlipAngle * Math.pow((percentageCompleted - 1), 2) + coin.maxFlipAngle;

    setCoinStyles({
      '--coin-y-multiplier': -11 * Math.pow(percentageCompleted * 2 - 1, 4) + 11,
      '--coin-x-multiplier': percentageCompleted,
      '--coin-scale-multiplier': percentageCompleted * 0.6,
      '--coin-rotation-multiplier': percentageCompleted * coin.sideRotationCount,
      '--front-scale-multiplier': Math.max(Math.cos(coin.angle), 0),
      '--front-y-multiplier': Math.sin(coin.angle),
      '--middle-scale-multiplier': Math.abs(Math.cos(coin.angle), 0),
      '--middle-y-multiplier': Math.cos((coin.angle + Math.PI / 2) % Math.PI),
      '--back-scale-multiplier': Math.max(Math.cos(coin.angle - Math.PI), 0),
      '--back-y-multiplier': Math.sin(coin.angle - Math.PI),
      '--shine-opacity-multiplier': 4 * Math.sin((coin.angle + Math.PI / 2) % Math.PI) - 3.2,
      '--shine-bg-multiplier': -40 * (Math.cos((coin.angle + Math.PI / 2) % Math.PI) - 0.5) + '%',
    });

    if (coin.moveLoopCount < coin.maxMoveLoopCount) {
      if (coin.moveLoopCount === coin.maxMoveLoopCount - 6) setCoinClasses('shrink-landing');
      window.requestAnimationFrame(flipCoinLoop);
    } else {
      setCoinClasses('coin-landed');
      setCoinStyles((prevStyles) => ({ ...prevStyles, 'opacity': 0 }));
      setTimeout(() => {
        setCoinClasses('');
        setTimeout(() => {
          resetCoin();
          setResult(Math.random() > 0.5 ? 'Heads' : 'Tails');
        }, 300);
      }, 1500);
    }
  };

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => {
      flipCoin();
    }, 50);
  };

  return (
    <div className="coin-flip-container">
      <div className={`tip-button ${clicked ? 'clicked' : ''}`} onClick={handleClick}>
        <div className={`coin ${coinClasses}`} ref={coinRef} style={coinStyles}>
          <div className="front">
            <img src="/heads.png" alt="Heads" />
          </div>
          <div className="back">
            <img src="/tails.png" alt="Tails" />
          </div>
        </div>
      </div>
      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default CoinFlip;