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
  } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));      //eslint-disable-line
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
    [gameState, direction]    //eslint-disable-line
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
          pointsToAdd = 100; // Set exactly 100 points for bonus food
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
  };

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className="menu">
            <h1 className="menu-title">Snake Game</h1>
            <p className="menu-text">Use arrow keys or WASD to move. Space to pause/resume. Enter to start!</p>
            <label className="menu-label">
              Difficulty:
              <select className="menu-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
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
              {gameState === 'over' && <h2 className="game-over">Game Over! Press Enter to Restart</h2>}
              {gameState === 'paused' && <h2 className="game-paused">Paused - Press Space to Resume</h2>}
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
        }
        .game-container {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stats-bar {
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          color: white;
          font-family: Arial, sans-serif;
          z-index: 10;
        }
        .stats-item {
          margin: 0 10px;
        }
        .game-board-wrapper {
          position: relative;
          width: 100%;
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
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
        }
        .difficulty-selector {
          padding: 10px;
          color: white;
        }
        .menu {
          text-align: center;
          color: white;
          font-family: Arial, sans-serif;
        }
        .menu-title {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .menu-text {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .menu-label {
          font-size: 18px;
        }
        .menu-select {
          margin-left: 10px;
          padding: 5px;
        }
      `}</style>
    </div>
  );
};

export default SnakeGame;