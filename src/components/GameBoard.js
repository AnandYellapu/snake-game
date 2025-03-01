// import React, { useRef, useEffect } from 'react';
// import { motion, useAnimation } from 'framer-motion';

// const GRID_SIZE_DEFAULT = 28;
// const BOARD_WIDTH = 39;
// const BOARD_HEIGHT = 29;

// const COLORS = {
//   BACKGROUND: '#1a1a1a',
//   GRID: 'rgba(80, 80, 80, 0.3)',
//   GRID_HIGHLIGHT: 'rgba(255, 215, 0, 0.1)',
//   SNAKE_HEAD: '#00ff00',
//   SNAKE_BODY: '#ffeb3b',
//   SNAKE_TAIL: '#ff9800',
//   FOOD: '#f44336',
//   BONUS_FOOD: '#ffd700',
//   OBSTACLE: '#607d8b',
//   OBSTACLE_BORDER: '#455a64',
//   OVERLAY: 'rgba(50, 50, 50, 0.85)',
//   BONUS_TEXT: '#ffd700',
// };

// const GameOverlay = ({ gameState, width, height }) => {
//   const controls = useAnimation();

//   useEffect(() => {
//     if (gameState === 'paused' || gameState === 'over') {
//       controls.start({ opacity: 1 });
//     } else {
//       controls.start({ opacity: 0 });
//     }
//   }, [gameState, controls]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={controls}
//       transition={{ duration: 0.3 }}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: width,
//         height: height,
//         background: COLORS.OVERLAY,
//         pointerEvents: 'none',
//         zIndex: 1,
//       }}
//     />
//   );
// };

// const BonusEffect = ({ bonusEffect, gridSize }) => {
//   if (!bonusEffect) return null;

//   return (
//     <motion.div
//       key={bonusEffect.time}
//       initial={{ opacity: 1, y: 0 }}
//       animate={{ 
//         opacity: 0, 
//         y: -20,
//         transition: { duration: 1, ease: 'easeOut' }
//       }}
//       style={{
//         position: 'absolute',
//         left: bonusEffect.x * gridSize + gridSize / 2,
//         top: bonusEffect.y * gridSize,
//         color: COLORS.BONUS_TEXT,
//         fontSize: `${gridSize}px`,
//         fontFamily: 'Arial',
//         textAlign: 'center',
//         pointerEvents: 'none',
//         zIndex: 2,
//       }}
//     >
//       +200
//     </motion.div>
//   );
// };

// const GameBoard = ({ snake, food, bonusFood, obstacles, gameState, bonusEffect, speed }) => {
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);
//   const foodPulse = useRef(0);
//   const lastMoveTime = useRef(0);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     const container = containerRef.current;

//     const resizeCanvas = () => {
//       canvas.width = container.clientWidth;
//       canvas.height = container.clientHeight;

//       const aspectRatio = BOARD_WIDTH / BOARD_HEIGHT;
//       const windowAspectRatio = canvas.width / canvas.height;
//       let gridSize = windowAspectRatio > aspectRatio 
//         ? canvas.height / BOARD_HEIGHT 
//         : canvas.width / BOARD_WIDTH;

//       canvas.dataset.gridSize = gridSize;
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     const animate = (timestamp) => {
//       const gridSize = parseFloat(canvas.dataset.gridSize);
//       context.fillStyle = COLORS.BACKGROUND;
//       context.fillRect(0, 0, canvas.width, canvas.height);

//       // Draw grid
//       context.lineWidth = 1;
//       for (let x = 0; x <= BOARD_WIDTH; x++) {
//         const gradient = context.createLinearGradient(x * gridSize, 0, x * gridSize, canvas.height);
//         gradient.addColorStop(0, COLORS.GRID);
//         gradient.addColorStop(0.5, COLORS.GRID_HIGHLIGHT);
//         gradient.addColorStop(1, COLORS.GRID);
//         context.strokeStyle = gradient;
//         context.beginPath();
//         context.moveTo(x * gridSize, 0);
//         context.lineTo(x * gridSize, canvas.height);
//         context.stroke();
//       }
//       for (let y = 0; y <= BOARD_HEIGHT; y++) {
//         const gradient = context.createLinearGradient(0, y * gridSize, canvas.width, y * gridSize);
//         gradient.addColorStop(0, COLORS.GRID);
//         gradient.addColorStop(0.5, COLORS.GRID_HIGHLIGHT);
//         gradient.addColorStop(1, COLORS.GRID);
//         context.strokeStyle = gradient;
//         context.beginPath();
//         context.moveTo(0, y * gridSize);
//         context.lineTo(canvas.width, y * gridSize);
//         context.stroke();
//       }

//       // Draw obstacles
//       obstacles.forEach((obstacle) => {
//         context.fillStyle = COLORS.OBSTACLE;
//         context.strokeStyle = COLORS.OBSTACLE_BORDER;
//         context.lineWidth = 1;
//         const fade = Math.min(1, (Date.now() - (obstacle.spawnTime || 0)) / 500);
//         context.globalAlpha = fade;
//         context.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
//         context.strokeRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
//         context.globalAlpha = 1;
//       });

//       // Draw snake
//       const timeSinceMove = timestamp - lastMoveTime.current;
//       const moveProgress = Math.min(1, timeSinceMove / speed);
//       snake.forEach((segment, index) => {
//         let x = segment.x * gridSize + gridSize / 2;
//         let y = segment.y * gridSize + gridSize / 2;

//         if (index > 0 && gameState === 'playing') {
//           const prevSegment = snake[index - 1];
//           x += (prevSegment.x - segment.x) * gridSize * (1 - moveProgress);
//           y += (prevSegment.y - segment.y) * gridSize * (1 - moveProgress);
//         }

//         if (index === 0) {
//           const gradient = context.createRadialGradient(x, y, 2, x, y, gridSize / 2);
//           gradient.addColorStop(0, COLORS.SNAKE_HEAD);
//           gradient.addColorStop(1, '#00cc00');
//           context.fillStyle = gradient;
//           context.beginPath();
//           context.arc(x, y, gridSize / 2 - 1, 0, 2 * Math.PI);
//           context.fill();
//           context.shadowBlur = 8;
//           context.shadowColor = COLORS.SNAKE_HEAD;
//           context.fill();
//           context.shadowBlur = 0;
//         } else if (index === snake.length - 1) {
//           context.fillStyle = COLORS.SNAKE_TAIL;
//           drawTriangle(context, { x: segment.x, y: segment.y }, snake[index - 1], moveProgress, gridSize);
//         } else {
//           const gradient = context.createLinearGradient(
//             segment.x * gridSize,
//             segment.y * gridSize,
//             segment.x * gridSize + gridSize,
//             segment.y * gridSize + gridSize
//           );
//           gradient.addColorStop(0, COLORS.SNAKE_BODY);
//           gradient.addColorStop(1, '#fbc02d');
//           context.fillStyle = gradient;
//           context.beginPath();
//           context.roundRect(
//             x - gridSize / 2 + 2,
//             y - gridSize / 2 + 2,
//             gridSize - 4,
//             gridSize - 4,
//             4
//           );
//           context.fill();
//         }
//       });

//       if (timeSinceMove >= speed) lastMoveTime.current = timestamp;

//       // Draw food
//       foodPulse.current += 0.05;
//       const pulseSize = gridSize / 2.5 + Math.sin(foodPulse.current) * 2;
//       let gradient = context.createRadialGradient(
//         food.x * gridSize + gridSize / 2,
//         food.y * gridSize + gridSize / 2,
//         0,
//         food.x * gridSize + gridSize / 2,
//         food.y * gridSize + gridSize / 2,
//         pulseSize
//       );
//       gradient.addColorStop(0, COLORS.FOOD);
//       gradient.addColorStop(1, 'rgba(244, 67, 54, 0)');
//       context.fillStyle = gradient;
//       context.beginPath();
//       context.arc(
//         food.x * gridSize + gridSize / 2,
//         food.y * gridSize + gridSize / 2,
//         pulseSize,
//         0,
//         2 * Math.PI
//       );
//       context.fill();

//       // Draw bonus food
//       if (bonusFood) {
//         const timeElapsed = Date.now() - bonusFood.spawnTime;
//         const timeLeft = Math.max(0, bonusFood.duration - timeElapsed);
//         const opacity = timeLeft / bonusFood.duration;
//         context.globalAlpha = opacity;
//         gradient = context.createRadialGradient(
//           bonusFood.x * gridSize + gridSize / 2,
//           bonusFood.y * gridSize + gridSize / 2,
//           0,
//           bonusFood.x * gridSize + gridSize / 2,
//           bonusFood.y * gridSize + gridSize / 2,
//           gridSize / 2
//         );
//         gradient.addColorStop(0, COLORS.BONUS_FOOD);
//         gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
//         context.fillStyle = gradient;
//         drawStar(
//           context,
//           bonusFood.x * gridSize + gridSize / 2,
//           bonusFood.y * gridSize + gridSize / 2,
//           gridSize / 2,
//           5
//         );
//         context.globalAlpha = 1;
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     lastMoveTime.current = performance.now();
//     animationRef.current = requestAnimationFrame(animate);

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [snake, food, bonusFood, obstacles, gameState, speed]);

//   const drawTriangle = (context, tail, prevSegment, progress, gridSize) => {
//     const tailX = tail.x * gridSize + gridSize / 2 + (prevSegment.x - tail.x) * gridSize * (1 - progress);
//     const tailY = tail.y * gridSize + gridSize / 2 + (prevSegment.y - tail.y) * gridSize * (1 - progress);
//     const prevX = prevSegment.x * gridSize + gridSize / 2;
//     const prevY = prevSegment.y * gridSize + gridSize / 2;

//     const angle = Math.atan2(prevY - tailY, prevX - tailX);
//     const size = gridSize / 2;

//     context.beginPath();
//     context.moveTo(tailX + size * Math.cos(angle), tailY + size * Math.sin(angle));
//     context.lineTo(
//       tailX + size * Math.cos(angle + (2 * Math.PI) / 3),
//       tailY + size * Math.sin(angle + (2 * Math.PI) / 3)
//     );
//     context.lineTo(
//       tailX + size * Math.cos(angle - (2 * Math.PI) / 3),
//       tailY + size * Math.sin(angle - (2 * Math.PI) / 3)
//     );
//     context.closePath();
//     context.fill();
//   };

//   const drawStar = (context, cx, cy, outerRadius, points) => {
//     const innerRadius = outerRadius / 2;
//     context.beginPath();
//     for (let i = 0; i < points * 2; i++) {
//       const angle = (i * Math.PI) / points - Math.PI / 2;
//       const radius = i % 2 === 0 ? outerRadius : innerRadius;
//       context.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
//     }
//     context.closePath();
//     context.fill();
//   };

//   return (
//     <div 
//       ref={containerRef} 
//       style={{ 
//         position: 'relative', 
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden'
//       }}
//     >
//       <canvas
//         className="game-canvas"
//         ref={canvasRef}
//         style={{ 
//           width: '100%',
//           height: '100%'
//         }}
//       />
//       <GameOverlay 
//         gameState={gameState} 
//         width={canvasRef.current?.width || '100%'} 
//         height={canvasRef.current?.height || '100%'}
//       />
//       <BonusEffect 
//         bonusEffect={bonusEffect} 
//         gridSize={canvasRef.current?.dataset.gridSize || GRID_SIZE_DEFAULT}
//       />
//     </div>
//   );
// };

// export default React.memo(GameBoard, (prevProps, nextProps) => {
//   return (
//     prevProps.gameState === nextProps.gameState &&
//     prevProps.speed === nextProps.speed &&
//     prevProps.snake === nextProps.snake &&
//     prevProps.food === nextProps.food &&
//     prevProps.bonusFood === nextProps.bonusFood &&
//     prevProps.obstacles === nextProps.obstacles &&
//     prevProps.bonusEffect === nextProps.bonusEffect
//   );
// });








import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';

const BOARD_WIDTH = 39;
const BOARD_HEIGHT = 29;
const OBSTACLE_THRESHOLD = 50;
const BONUS_SPAWN_CHANCE = 0.05;
const BONUS_DURATION = 5000;
const BONUS_EFFECT_DURATION = 1000;

const getRandomPosition = (width, height, exclude = []) => {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
  } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));   //eslint-disable-line
  return pos;
};

const DIFFICULTY_SETTINGS = {
  Easy: { startSpeed: 250, speedDecrease: 5, minSpeed: 100, baseScore: 5, obstacleCount: 3 },
  Normal: { startSpeed: 200, speedDecrease: 10, minSpeed: 50, baseScore: 10, obstacleCount: 5 },
  Hard: { startSpeed: 150, speedDecrease: 15, minSpeed: 30, baseScore: 15, obstacleCount: 8 },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
  const [bonusFood, setBonusFood] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('highScore')) || 0);
  const [difficulty, setDifficulty] = useState('Normal');
  const [speed, setSpeed] = useState(DIFFICULTY_SETTINGS.Normal.startSpeed);
  const [bonusEffect, setBonusEffect] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const spawnObstacles = useCallback(() => {
    if (score >= OBSTACLE_THRESHOLD && obstacles.length === 0) {
      const newObstacles = Array.from(
        { length: DIFFICULTY_SETTINGS[difficulty].obstacleCount },
        () => ({ ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food]), spawnTime: Date.now() })
      );
      setObstacles(newObstacles);
    }
  }, [score, difficulty, obstacles, snake, food]);

  const spawnBonusFood = useCallback(() => {
    if (!bonusFood && Math.random() < BONUS_SPAWN_CHANCE) {
      const newBonus = {
        ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food, ...obstacles]),
        spawnTime: Date.now(),
        duration: BONUS_DURATION,
      };
      setBonusFood(newBonus);
      setTimeout(() => setBonusFood((current) => (current === newBonus ? null : current)), BONUS_DURATION);
    }
  }, [bonusFood, snake, food, obstacles]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Enter':
          if (gameState === 'start' || gameState === 'over') resetGame();
          break;
        case ' ':
          if (gameState === 'playing') setGameState('paused');
          else if (gameState === 'paused') setGameState('playing');
          break;
        default:
          if (gameState !== 'playing') return;
          const newDir =
            {
              ArrowUp: { x: 0, y: -1 },
              w: { x: 0, y: -1 },
              ArrowDown: { x: 0, y: 1 },
              s: { x: 0, y: 1 },
              ArrowLeft: { x: -1, y: 0 },
              a: { x: -1, y: 0 },
              ArrowRight: { x: 1, y: 0 },
              d: { x: 1, y: 0 },
            }[e.key] || null;
          if (newDir && (direction.x !== -newDir.x || direction.y !== -newDir.y)) {
            setNextDirection(newDir);
          }
      }
    },
    [gameState, direction]          //eslint-disable-line
  );

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!touchStart || gameState !== 'playing') return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipe = 20;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipe) {
        const newDir = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
          setNextDirection(newDir);
          setTouchStart(null);
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipe) {
        const newDir = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
          setNextDirection(newDir);
          setTouchStart(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, gameState, direction]);         //eslint-disable-line

  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newDirection = nextDirection || direction;
        setDirection(newDirection);
        setNextDirection(null);

        const newHead = { x: prevSnake[0].x + newDirection.x, y: prevSnake[0].y + newDirection.y };
        const newSnake = [newHead, ...prevSnake];

        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_WIDTH ||
          newHead.y < 0 ||
          newHead.y >= BOARD_HEIGHT ||
          prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y) ||
          obstacles.some((o) => o.x === newHead.x && o.y === newHead.y)
        ) {
          setGameState('over');
          return prevSnake;
        }

        let ateFood = false;
        let pointsToAdd = 0;

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...newSnake, ...obstacles]));
          ateFood = true;
          pointsToAdd = DIFFICULTY_SETTINGS[difficulty].baseScore;
        } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
          setBonusEffect({ x: newHead.x, y: newHead.y, time: Date.now() });
          setBonusFood(null);
          ateFood = true;
          pointsToAdd = 100;
          setTimeout(() => setBonusEffect(null), BONUS_EFFECT_DURATION);
        }

        if (ateFood) {
          setScore((prev) => {
            const newScore = prev + pointsToAdd;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('highScore', newScore);
            }
            setSpeed((prevSpeed) =>
              Math.max(
                DIFFICULTY_SETTINGS[difficulty].minSpeed,
                prevSpeed - DIFFICULTY_SETTINGS[difficulty].speedDecrease
              )
            );
            spawnObstacles();
            spawnBonusFood();
            return newScore;
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameState, direction, nextDirection, food, bonusFood, obstacles, speed, highScore, difficulty, spawnObstacles, spawnBonusFood]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
    setBonusFood(null);
    setObstacles([]);
    setDirection({ x: 1, y: 0 });
    setNextDirection(null);
    setGameState('playing');
    setScore(0);
    setSpeed(DIFFICULTY_SETTINGS[difficulty].startSpeed);
    setBonusEffect(null);
    setTouchStart(null);
  };

  const renderContent = () => {
    const isMobile = window.innerWidth <= 768;

    switch (gameState) {
      case 'start':
        return (
          <div className="menu">
            <h1 className="menu-title">Snake Game</h1>
            <p className="menu-text">
              {isMobile 
                ? "Swipe to move. Tap Play to start!"
                : "Use arrow keys or WASD to move. Space to pause/resume. Enter to start!"}
            </p>
            <label className="menu-label">
              Difficulty:
              <select className="menu-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            {isMobile && (
              <button className="play-button" onClick={resetGame}>
                Play
              </button>
            )}
          </div>
        );
      case 'playing':
      case 'paused':
      case 'over':
        return (
          <div className="game-container">
            <div className="stats-bar">
              <span className="stats-item">Score: {score}</span>
              <span className="stats-item">High Score: {highScore}</span>
              <span className="stats-item">Speed: {speed}ms</span>
            </div>
            <div className="game-board-wrapper">
              {gameState === 'over' && (
                <h2 className="game-over">
                  Game Over! {isMobile ? "Tap to Restart" : "Press Enter to Restart"}
                </h2>
              )}
              {gameState === 'paused' && (
                <h2 className="game-paused">
                  Paused - {isMobile ? "Tap to Resume" : "Press Space to Resume"}
                </h2>
              )}
              <GameBoard
                snake={snake}
                food={food}
                bonusFood={bonusFood}
                obstacles={obstacles}
                gameState={gameState}
                bonusEffect={bonusEffect}
                speed={speed}
              />
            </div>
            {isMobile && (
              <div className="mobile-controls">
                {gameState === 'playing' && (
                  <button className="pause-button" onClick={() => setGameState('paused')}>
                    Pause
                  </button>
                )}
                {gameState === 'paused' && (
                  <button className="resume-button" onClick={() => setGameState('playing')}>
                    Resume
                  </button>
                )}
                {gameState === 'over' && (
                  <button className="restart-button" onClick={resetGame}>
                    Restart
                  </button>
                )}
              </div>
            )}
            {gameState === 'over' && (
              <div className="difficulty-selector">
                <label className="difficulty-label">
                  Difficulty:
                  <select className="difficulty-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="Easy">Easy</option>
                    <option value="Normal">Normal</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-wrapper">
      {renderContent()}
      <style jsx>{`
        .game-wrapper {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #1a1a1a;
          overflow: hidden;
          touch-action: none; /* Prevents default touch behaviors */
        }
        .game-container {
          width: 100%;
          max-width: 800px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stats-bar {
          width: 100%;
          padding: 5px 10px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          color: white;
          font-family: Arial, sans-serif;
          z-index: 10;
          font-size: 14px;
        }
        .stats-item {
          margin: 0 5px;
        }
        .game-board-wrapper {
          position: relative;
          width: 100%;
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          max-height: calc(100vh - 100px); /* Leave space for controls */
        }
        .game-over, .game-paused {
          position: absolute;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          z-index: 5;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 18px;
        }
        .difficulty-selector {
          padding: 10px;
          color: white;
          font-size: 14px;
        }
        .menu {
          text-align: center;
          color: white;
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .menu-title {
          font-size: 36px;
          margin-bottom: 15px;
        }
        .menu-text {
          font-size: 16px;
          margin-bottom: 15px;
        }
        .menu-label {
          font-size: 16px;
        }
        .menu-select {
          margin-left: 10px;
          padding: 5px;
          font-size: 14px;
        }
        .play-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .mobile-controls {
          padding: 10px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .pause-button, .resume-button, .restart-button {
          padding: 8px 16px;
          font-size: 14px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .restart-button {
          background: #f44336;
        }
        @media (max-width: 768px) {
          .game-board-wrapper {
            max-height: calc(100vh - 120px);
          }
          .stats-bar {
            font-size: 12px;
            padding: 5px;
          }
          .game-over, .game-paused {
            font-size: 16px;
            padding: 8px 16px;
          }
          .menu-title {
            font-size: 28px;
          }
          .menu-text, .menu-label {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default SnakeGame;