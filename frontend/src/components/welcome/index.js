import React, { useEffect, useState, useRef } from "react";
import styles from "./welcome.module.css";

const WelcomeAnimation = ({ targetId }) => {
  const [isMoving, setIsMoving] = useState(true);
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const characterRef = useRef();

  useEffect(() => {
    if (characterRef.current && targetId) {
      const character = characterRef.current;
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        console.error(`Element with id "${targetId}" not found.`);
        return;
      }
      const moveCharacter = () => {
        if (!isMoving) return;
        const charRect = character.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        // 如果人物到达目标位置
        if (
          Math.abs(charRect.left - targetRect.left) < 35 &&
          Math.abs(charRect.top - targetRect.top) < 35
        ) {
          setIsMoving(false); // 停止移动
          setShowWelcomeText(false);
          setTimeout(() => {
            character.style.opacity = 0; 
            character.style.zIndex = -1;
          }, 1000);
          return;
        }
        if (Math.abs(charRect.left - targetRect.left) < 300 && Math.abs(charRect.top - targetRect.top) < 300) {
            character.style.transform = 'scale(1)';
        }
        // 向目标靠近
        const currentLeft = parseInt(
          window.getComputedStyle(character).left,
          10
        );
        const currentTop = parseInt(window.getComputedStyle(character).top, 10);
        const moveStepX = targetRect.left - charRect.left > 0 ? 2 : -2; // 根据方向移动
        const moveStepY = targetRect.top - charRect.top > 0 ? 2 : -2; // 根据方向移动
        character.style.left = `${currentLeft + moveStepX}px`;
        character.style.top = `${currentTop + moveStepY}px`;
        requestAnimationFrame(moveCharacter);
      };
      moveCharacter();
    }
  }, [isMoving, targetId]);

  return (
      <div
        className={styles.character}
        ref={characterRef}
        style={{ backgroundImage: "url(/deadpool-heart.gif)" }}
      >
        {showWelcomeText && <div className={styles.welcomeText}>Welcome！</div>}
      </div>
  );
};

export default WelcomeAnimation;
