import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const GRID_SIZE_DEFAULT = 28;
const BOARD_WIDTH = 39;
const BOARD_HEIGHT = 29;

const COLORS = {
  BACKGROUND: '#1a1a1a',
  GRID: 'rgba(80, 80, 80, 0.3)',
  GRID_HIGHLIGHT: 'rgba(255, 215, 0, 0.1)',
  SNAKE_HEAD: '#00ff00',
  SNAKE_BODY: '#ffeb3b',
  SNAKE_TAIL: '#ff9800',
  FOOD: '#f44336',
  BONUS_FOOD: '#ffd700',
  OBSTACLE: '#607d8b',
  OBSTACLE_BORDER: '#455a64',
  OVERLAY: 'rgba(50, 50, 50, 0.85)',
  BONUS_TEXT: '#ffd700',
};

const GameOverlay = ({ gameState, width, height }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (gameState === 'paused' || gameState === 'over') {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [gameState, controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        background: COLORS.OVERLAY,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

const BonusEffect = ({ bonusEffect, gridSize }) => {
  if (!bonusEffect) return null;

  return (
    <motion.div
      key={bonusEffect.time}
      initial={{ opacity: 1, y: 0 }}
      animate={{ 
        opacity: 0, 
        y: -20,
        transition: { duration: 1, ease: 'easeOut' }
      }}
      style={{
        position: 'absolute',
        left: bonusEffect.x * gridSize + gridSize / 2,
        top: bonusEffect.y * gridSize,
        color: COLORS.BONUS_TEXT,
        fontSize: `${gridSize}px`,
        fontFamily: 'Arial',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      +200
    </motion.div>
  );
};

const GameBoard = ({ snake, food, bonusFood, obstacles, gameState, bonusEffect, speed }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const foodPulse = useRef(0);
  const lastMoveTime = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const container = containerRef.current;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const aspectRatio = BOARD_WIDTH / BOARD_HEIGHT;
      const windowAspectRatio = canvas.width / canvas.height;
      let gridSize = windowAspectRatio > aspectRatio 
        ? canvas.height / BOARD_HEIGHT 
        : canvas.width / BOARD_WIDTH;

      canvas.dataset.gridSize = gridSize;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (timestamp) => {
      const gridSize = parseFloat(canvas.dataset.gridSize);
      context.fillStyle = COLORS.BACKGROUND;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      context.lineWidth = 1;
      for (let x = 0; x <= BOARD_WIDTH; x++) {
        const gradient = context.createLinearGradient(x * gridSize, 0, x * gridSize, canvas.height);
        gradient.addColorStop(0, COLORS.GRID);
        gradient.addColorStop(0.5, COLORS.GRID_HIGHLIGHT);
        gradient.addColorStop(1, COLORS.GRID);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(x * gridSize, 0);
        context.lineTo(x * gridSize, canvas.height);
        context.stroke();
      }
      for (let y = 0; y <= BOARD_HEIGHT; y++) {
        const gradient = context.createLinearGradient(0, y * gridSize, canvas.width, y * gridSize);
        gradient.addColorStop(0, COLORS.GRID);
        gradient.addColorStop(0.5, COLORS.GRID_HIGHLIGHT);
        gradient.addColorStop(1, COLORS.GRID);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(0, y * gridSize);
        context.lineTo(canvas.width, y * gridSize);
        context.stroke();
      }

      // Draw obstacles
      obstacles.forEach((obstacle) => {
        context.fillStyle = COLORS.OBSTACLE;
        context.strokeStyle = COLORS.OBSTACLE_BORDER;
        context.lineWidth = 1;
        const fade = Math.min(1, (Date.now() - (obstacle.spawnTime || 0)) / 500);
        context.globalAlpha = fade;
        context.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
        context.strokeRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
        context.globalAlpha = 1;
      });

      // Draw snake
      const timeSinceMove = timestamp - lastMoveTime.current;
      const moveProgress = Math.min(1, timeSinceMove / speed);
      snake.forEach((segment, index) => {
        let x = segment.x * gridSize + gridSize / 2;
        let y = segment.y * gridSize + gridSize / 2;

        if (index > 0 && gameState === 'playing') {
          const prevSegment = snake[index - 1];
          x += (prevSegment.x - segment.x) * gridSize * (1 - moveProgress);
          y += (prevSegment.y - segment.y) * gridSize * (1 - moveProgress);
        }

        if (index === 0) {
          const gradient = context.createRadialGradient(x, y, 2, x, y, gridSize / 2);
          gradient.addColorStop(0, COLORS.SNAKE_HEAD);
          gradient.addColorStop(1, '#00cc00');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(x, y, gridSize / 2 - 1, 0, 2 * Math.PI);
          context.fill();
          context.shadowBlur = 8;
          context.shadowColor = COLORS.SNAKE_HEAD;
          context.fill();
          context.shadowBlur = 0;
        } else if (index === snake.length - 1) {
          context.fillStyle = COLORS.SNAKE_TAIL;
          drawTriangle(context, { x: segment.x, y: segment.y }, snake[index - 1], moveProgress, gridSize);
        } else {
          const gradient = context.createLinearGradient(
            segment.x * gridSize,
            segment.y * gridSize,
            segment.x * gridSize + gridSize,
            segment.y * gridSize + gridSize
          );
          gradient.addColorStop(0, COLORS.SNAKE_BODY);
          gradient.addColorStop(1, '#fbc02d');
          context.fillStyle = gradient;
          context.beginPath();
          context.roundRect(
            x - gridSize / 2 + 2,
            y - gridSize / 2 + 2,
            gridSize - 4,
            gridSize - 4,
            4
          );
          context.fill();
        }
      });

      if (timeSinceMove >= speed) lastMoveTime.current = timestamp;

      // Draw food
      foodPulse.current += 0.05;
      const pulseSize = gridSize / 2.5 + Math.sin(foodPulse.current) * 2;
      let gradient = context.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        pulseSize
      );
      gradient.addColorStop(0, COLORS.FOOD);
      gradient.addColorStop(1, 'rgba(244, 67, 54, 0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        pulseSize,
        0,
        2 * Math.PI
      );
      context.fill();

      // Draw bonus food
      if (bonusFood) {
        const timeElapsed = Date.now() - bonusFood.spawnTime;
        const timeLeft = Math.max(0, bonusFood.duration - timeElapsed);
        const opacity = timeLeft / bonusFood.duration;
        context.globalAlpha = opacity;
        gradient = context.createRadialGradient(
          bonusFood.x * gridSize + gridSize / 2,
          bonusFood.y * gridSize + gridSize / 2,
          0,
          bonusFood.x * gridSize + gridSize / 2,
          bonusFood.y * gridSize + gridSize / 2,
          gridSize / 2
        );
        gradient.addColorStop(0, COLORS.BONUS_FOOD);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        context.fillStyle = gradient;
        drawStar(
          context,
          bonusFood.x * gridSize + gridSize / 2,
          bonusFood.y * gridSize + gridSize / 2,
          gridSize / 2,
          5
        );
        context.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    lastMoveTime.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [snake, food, bonusFood, obstacles, gameState, speed]);

  const drawTriangle = (context, tail, prevSegment, progress, gridSize) => {
    const tailX = tail.x * gridSize + gridSize / 2 + (prevSegment.x - tail.x) * gridSize * (1 - progress);
    const tailY = tail.y * gridSize + gridSize / 2 + (prevSegment.y - tail.y) * gridSize * (1 - progress);
    const prevX = prevSegment.x * gridSize + gridSize / 2;
    const prevY = prevSegment.y * gridSize + gridSize / 2;

    const angle = Math.atan2(prevY - tailY, prevX - tailX);
    const size = gridSize / 2;

    context.beginPath();
    context.moveTo(tailX + size * Math.cos(angle), tailY + size * Math.sin(angle));
    context.lineTo(
      tailX + size * Math.cos(angle + (2 * Math.PI) / 3),
      tailY + size * Math.sin(angle + (2 * Math.PI) / 3)
    );
    context.lineTo(
      tailX + size * Math.cos(angle - (2 * Math.PI) / 3),
      tailY + size * Math.sin(angle - (2 * Math.PI) / 3)
    );
    context.closePath();
    context.fill();
  };

  const drawStar = (context, cx, cy, outerRadius, points) => {
    const innerRadius = outerRadius / 2;
    context.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      context.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    context.closePath();
    context.fill();
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <canvas
        className="game-canvas"
        ref={canvasRef}
        style={{ 
          width: '100%',
          height: '100%'
        }}
      />
      <GameOverlay 
        gameState={gameState} 
        width={canvasRef.current?.width || '100%'} 
        height={canvasRef.current?.height || '100%'}
      />
      <BonusEffect 
        bonusEffect={bonusEffect} 
        gridSize={canvasRef.current?.dataset.gridSize || GRID_SIZE_DEFAULT}
      />
    </div>
  );
};

export default React.memo(GameBoard, (prevProps, nextProps) => {
  return (
    prevProps.gameState === nextProps.gameState &&
    prevProps.speed === nextProps.speed &&
    prevProps.snake === nextProps.snake &&
    prevProps.food === nextProps.food &&
    prevProps.bonusFood === nextProps.bonusFood &&
    prevProps.obstacles === nextProps.obstacles &&
    prevProps.bonusEffect === nextProps.bonusEffect
  );
});