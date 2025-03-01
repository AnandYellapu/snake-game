// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import GameBoard from './GameBoard';

// // // const BOARD_WIDTH = 39;
// // // const BOARD_HEIGHT = 29;
// // // const OBSTACLE_THRESHOLD = 50;
// // // const BONUS_SPAWN_CHANCE = 0.05;
// // // const BONUS_DURATION = 5000;
// // // const BONUS_EFFECT_DURATION = 1000;

// // // const getRandomPosition = (width, height, exclude = []) => {
// // //   let pos;
// // //   do {
// // //     pos = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
// // //   } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));      //eslint-disable-line
// // //   return pos;
// // // };

// // // const DIFFICULTY_SETTINGS = {
// // //   Easy: { startSpeed: 250, speedDecrease: 5, minSpeed: 100, baseScore: 5, obstacleCount: 3 },
// // //   Normal: { startSpeed: 200, speedDecrease: 10, minSpeed: 50, baseScore: 10, obstacleCount: 5 },
// // //   Hard: { startSpeed: 150, speedDecrease: 15, minSpeed: 30, baseScore: 15, obstacleCount: 8 },
// // // };

// // // const SnakeGame = () => {
// // //   const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
// // //   const [food, setFood] = useState(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
// // //   const [bonusFood, setBonusFood] = useState(null);
// // //   const [obstacles, setObstacles] = useState([]);
// // //   const [direction, setDirection] = useState({ x: 1, y: 0 });
// // //   const [nextDirection, setNextDirection] = useState(null);
// // //   const [gameState, setGameState] = useState('start');
// // //   const [score, setScore] = useState(0);
// // //   const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('highScore')) || 0);
// // //   const [difficulty, setDifficulty] = useState('Normal');
// // //   const [speed, setSpeed] = useState(DIFFICULTY_SETTINGS.Normal.startSpeed);
// // //   const [bonusEffect, setBonusEffect] = useState(null);

// // //   const spawnObstacles = useCallback(() => {
// // //     if (score >= OBSTACLE_THRESHOLD && obstacles.length === 0) {
// // //       const newObstacles = Array.from(
// // //         { length: DIFFICULTY_SETTINGS[difficulty].obstacleCount },
// // //         () => ({ ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food]), spawnTime: Date.now() })
// // //       );
// // //       setObstacles(newObstacles);
// // //     }
// // //   }, [score, difficulty, obstacles, snake, food]);

// // //   const spawnBonusFood = useCallback(() => {
// // //     if (!bonusFood && Math.random() < BONUS_SPAWN_CHANCE) {
// // //       const newBonus = {
// // //         ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food, ...obstacles]),
// // //         spawnTime: Date.now(),
// // //         duration: BONUS_DURATION,
// // //       };
// // //       setBonusFood(newBonus);
// // //       setTimeout(() => setBonusFood((current) => (current === newBonus ? null : current)), BONUS_DURATION);
// // //     }
// // //   }, [bonusFood, snake, food, obstacles]);

// // //   const handleKeyDown = useCallback(
// // //     (e) => {
// // //       switch (e.key) {
// // //         case 'Enter':
// // //           if (gameState === 'start' || gameState === 'over') resetGame();
// // //           break;
// // //         case ' ':
// // //           if (gameState === 'playing') setGameState('paused');
// // //           else if (gameState === 'paused') setGameState('playing');
// // //           break;
// // //         default:
// // //           if (gameState !== 'playing') return;
// // //           const newDir =
// // //             {
// // //               ArrowUp: { x: 0, y: -1 },
// // //               w: { x: 0, y: -1 },
// // //               ArrowDown: { x: 0, y: 1 },
// // //               s: { x: 0, y: 1 },
// // //               ArrowLeft: { x: -1, y: 0 },
// // //               a: { x: -1, y: 0 },
// // //               ArrowRight: { x: 1, y: 0 },
// // //               d: { x: 1, y: 0 },
// // //             }[e.key] || null;
// // //           if (newDir && (direction.x !== -newDir.x || direction.y !== -newDir.y)) {
// // //             setNextDirection(newDir);
// // //           }
// // //       }
// // //     },
// // //     [gameState, direction]    //eslint-disable-line
// // //   );

// // //   useEffect(() => {
// // //     window.addEventListener('keydown', handleKeyDown);
// // //     return () => window.removeEventListener('keydown', handleKeyDown);
// // //   }, [handleKeyDown]);

// // //   useEffect(() => {
// // //     if (gameState !== 'playing') return;

// // //     const moveSnake = () => {
// // //       setSnake((prevSnake) => {
// // //         const newDirection = nextDirection || direction;
// // //         setDirection(newDirection);
// // //         setNextDirection(null);

// // //         const newHead = { x: prevSnake[0].x + newDirection.x, y: prevSnake[0].y + newDirection.y };
// // //         const newSnake = [newHead, ...prevSnake];

// // //         if (
// // //           newHead.x < 0 ||
// // //           newHead.x >= BOARD_WIDTH ||
// // //           newHead.y < 0 ||
// // //           newHead.y >= BOARD_HEIGHT ||
// // //           prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y) ||
// // //           obstacles.some((o) => o.x === newHead.x && o.y === newHead.y)
// // //         ) {
// // //           setGameState('over');
// // //           return prevSnake;
// // //         }

// // //         let ateFood = false;
// // //         let pointsToAdd = 0;

// // //         if (newHead.x === food.x && newHead.y === food.y) {
// // //           setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...newSnake, ...obstacles]));
// // //           ateFood = true;
// // //           pointsToAdd = DIFFICULTY_SETTINGS[difficulty].baseScore;
// // //         } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
// // //           setBonusEffect({ x: newHead.x, y: newHead.y, time: Date.now() });
// // //           setBonusFood(null);
// // //           ateFood = true;
// // //           pointsToAdd = 100; // Set exactly 100 points for bonus food
// // //           setTimeout(() => setBonusEffect(null), BONUS_EFFECT_DURATION);
// // //         }

// // //         if (ateFood) {
// // //           setScore((prev) => {
// // //             const newScore = prev + pointsToAdd;
// // //             if (newScore > highScore) {
// // //               setHighScore(newScore);
// // //               localStorage.setItem('highScore', newScore);
// // //             }
// // //             setSpeed((prevSpeed) =>
// // //               Math.max(
// // //                 DIFFICULTY_SETTINGS[difficulty].minSpeed,
// // //                 prevSpeed - DIFFICULTY_SETTINGS[difficulty].speedDecrease
// // //               )
// // //             );
// // //             spawnObstacles();
// // //             spawnBonusFood();
// // //             return newScore;
// // //           });
// // //         } else {
// // //           newSnake.pop();
// // //         }
// // //         return newSnake;
// // //       });
// // //     };

// // //     const interval = setInterval(moveSnake, speed);
// // //     return () => clearInterval(interval);
// // //   }, [gameState, direction, nextDirection, food, bonusFood, obstacles, speed, highScore, difficulty, spawnObstacles, spawnBonusFood]);

// // //   const resetGame = () => {
// // //     setSnake([{ x: 10, y: 10 }]);
// // //     setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
// // //     setBonusFood(null);
// // //     setObstacles([]);
// // //     setDirection({ x: 1, y: 0 });
// // //     setNextDirection(null);
// // //     setGameState('playing');
// // //     setScore(0);
// // //     setSpeed(DIFFICULTY_SETTINGS[difficulty].startSpeed);
// // //     setBonusEffect(null);
// // //   };

// // //   const renderContent = () => {
// // //     switch (gameState) {
// // //       case 'start':
// // //         return (
// // //           <div className="menu">
// // //             <h1 className="menu-title">Snake Game</h1>
// // //             <p className="menu-text">Use arrow keys or WASD to move. Space to pause/resume. Enter to start!</p>
// // //             <label className="menu-label">
// // //               Difficulty:
// // //               <select className="menu-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
// // //                 <option value="Easy">Easy</option>
// // //                 <option value="Normal">Normal</option>
// // //                 <option value="Hard">Hard</option>
// // //               </select>
// // //             </label>
// // //           </div>
// // //         );
// // //       case 'playing':
// // //       case 'paused':
// // //       case 'over':
// // //         return (
// // //           <div className="game-container">
// // //             <div className="stats-bar">
// // //               <span className="stats-item">Score: {score}</span>
// // //               <span className="stats-item">High Score: {highScore}</span>
// // //               <span className="stats-item">Speed: {speed}ms</span>
// // //             </div>
// // //             <div className="game-board-wrapper">
// // //               {gameState === 'over' && <h2 className="game-over">Game Over! Press Enter to Restart</h2>}
// // //               {gameState === 'paused' && <h2 className="game-paused">Paused - Press Space to Resume</h2>}
// // //               <GameBoard
// // //                 snake={snake}
// // //                 food={food}
// // //                 bonusFood={bonusFood}
// // //                 obstacles={obstacles}
// // //                 gameState={gameState}
// // //                 bonusEffect={bonusEffect}
// // //                 speed={speed}
// // //               />
// // //             </div>
// // //             {gameState === 'over' && (
// // //               <div className="difficulty-selector">
// // //                 <label className="difficulty-label">
// // //                   Difficulty:
// // //                   <select className="difficulty-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
// // //                     <option value="Easy">Easy</option>
// // //                     <option value="Normal">Normal</option>
// // //                     <option value="Hard">Hard</option>
// // //                   </select>
// // //                 </label>
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   return (
// // //     <div className="game-wrapper">
// // //       {renderContent()}
// // //       <style jsx>{`
// // //         .game-wrapper {
// // //           width: 100%;
// // //           height: 100vh;
// // //           display: flex;
// // //           flex-direction: column;
// // //           align-items: center;
// // //           justify-content: center;
// // //           background-color: #1a1a1a;
// // //         }
// // //         .game-container {
// // //           width: 100%;
// // //           max-width: 800px;
// // //           display: flex;
// // //           flex-direction: column;
// // //           align-items: center;
// // //         }
// // //         .stats-bar {
// // //           width: 100%;
// // //           padding: 10px;
// // //           background: rgba(255, 255, 255, 0.1);
// // //           display: flex;
// // //           justify-content: space-between;
// // //           color: white;
// // //           font-family: Arial, sans-serif;
// // //           z-index: 10;
// // //         }
// // //         .stats-item {
// // //           margin: 0 10px;
// // //         }
// // //         .game-board-wrapper {
// // //           position: relative;
// // //           width: 100%;
// // //           flex-grow: 1;
// // //           display: flex;
// // //           justify-content: center;
// // //           align-items: center;
// // //         }
// // //         .game-over, .game-paused {
// // //           position: absolute;
// // //           color: white;
// // //           font-family: Arial, sans-serif;
// // //           text-align: center;
// // //           z-index: 5;
// // //           background: rgba(0, 0, 0, 0.7);
// // //           padding: 10px 20px;
// // //           border-radius: 5px;
// // //         }
// // //         .difficulty-selector {
// // //           padding: 10px;
// // //           color: white;
// // //         }
// // //         .menu {
// // //           text-align: center;
// // //           color: white;
// // //           font-family: Arial, sans-serif;
// // //         }
// // //         .menu-title {
// // //           font-size: 48px;
// // //           margin-bottom: 20px;
// // //         }
// // //         .menu-text {
// // //           font-size: 18px;
// // //           margin-bottom: 20px;
// // //         }
// // //         .menu-label {
// // //           font-size: 18px;
// // //         }
// // //         .menu-select {
// // //           margin-left: 10px;
// // //           padding: 5px;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default SnakeGame;









// // import React, { useState, useEffect, useCallback } from 'react';
// // import { 
// //   Box, Button, Typography, Select, MenuItem, FormControl, InputLabel,
// //   AppBar, Toolbar, Container
// // } from '@mui/material';
// // import GameBoard from './GameBoard';

// // const BOARD_WIDTH = 39;
// // const BOARD_HEIGHT = 29;
// // const OBSTACLE_THRESHOLD = 50;
// // const BONUS_SPAWN_CHANCE = 0.05;
// // const BONUS_DURATION = 5000;
// // const BONUS_EFFECT_DURATION = 1000;

// // const getRandomPosition = (width, height, exclude = []) => {
// //   let pos;
// //   do {
// //     pos = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
// //   } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));
// //   return pos;
// // };

// // const DIFFICULTY_SETTINGS = {
// //   Easy: { startSpeed: 250, speedDecrease: 5, minSpeed: 100, baseScore: 5, obstacleCount: 3 },
// //   Normal: { startSpeed: 200, speedDecrease: 10, minSpeed: 50, baseScore: 10, obstacleCount: 5 },
// //   Hard: { startSpeed: 150, speedDecrease: 15, minSpeed: 30, baseScore: 15, obstacleCount: 8 },
// // };

// // const SnakeGame = () => {
// //   const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
// //   const [food, setFood] = useState(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
// //   const [bonusFood, setBonusFood] = useState(null);
// //   const [obstacles, setObstacles] = useState([]);
// //   const [direction, setDirection] = useState({ x: 1, y: 0 });
// //   const [nextDirection, setNextDirection] = useState(null);
// //   const [gameState, setGameState] = useState('start');
// //   const [score, setScore] = useState(0);
// //   const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('highScore')) || 0);
// //   const [difficulty, setDifficulty] = useState('Normal');
// //   const [speed, setSpeed] = useState(DIFFICULTY_SETTINGS.Normal.startSpeed);
// //   const [bonusEffect, setBonusEffect] = useState(null);
// //   const [touchStart, setTouchStart] = useState(null);

// //   const spawnObstacles = useCallback(() => {
// //     if (score >= OBSTACLE_THRESHOLD && obstacles.length === 0) {
// //       const newObstacles = Array.from(
// //         { length: DIFFICULTY_SETTINGS[difficulty].obstacleCount },
// //         () => ({ ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food]), spawnTime: Date.now() })
// //       );
// //       setObstacles(newObstacles);
// //     }
// //   }, [score, difficulty, obstacles, snake, food]);

// //   const spawnBonusFood = useCallback(() => {
// //     if (!bonusFood && Math.random() < BONUS_SPAWN_CHANCE) {
// //       const newBonus = {
// //         ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food, ...obstacles]),
// //         spawnTime: Date.now(),
// //         duration: BONUS_DURATION,
// //       };
// //       setBonusFood(newBonus);
// //       setTimeout(() => setBonusFood((current) => (current === newBonus ? null : current)), BONUS_DURATION);
// //     }
// //   }, [bonusFood, snake, food, obstacles]);

// //   const handleKeyDown = useCallback(
// //     (e) => {
// //       switch (e.key) {
// //         case 'Enter':
// //           if (gameState === 'start' || gameState === 'over') resetGame();
// //           break;
// //         case ' ':
// //           if (gameState === 'playing') setGameState('paused');
// //           else if (gameState === 'paused') setGameState('playing');
// //           break;
// //         default:
// //           if (gameState !== 'playing') return;
// //           const newDir =
// //             {
// //               ArrowUp: { x: 0, y: -1 },
// //               w: { x: 0, y: -1 },
// //               ArrowDown: { x: 0, y: 1 },
// //               s: { x: 0, y: 1 },
// //               ArrowLeft: { x: -1, y: 0 },
// //               a: { x: -1, y: 0 },
// //               ArrowRight: { x: 1, y: 0 },
// //               d: { x: 1, y: 0 },
// //             }[e.key] || null;
// //           if (newDir && (direction.x !== -newDir.x || direction.y !== -newDir.y)) {
// //             setNextDirection(newDir);
// //           }
// //       }
// //     },
// //     [gameState, direction]
// //   );

// //   const handleTouchStart = (e) => {
// //     const touch = e.touches[0];
// //     setTouchStart({ x: touch.clientX, y: touch.clientY });
// //   };

// //   const handleTouchMove = (e) => {
// //     if (!touchStart || gameState !== 'playing') return;
// //     e.preventDefault();
    
// //     const touch = e.touches[0];
// //     const deltaX = touch.clientX - touchStart.x;
// //     const deltaY = touch.clientY - touchStart.y;
// //     const minSwipe = 20;

// //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
// //       if (Math.abs(deltaX) > minSwipe) {
// //         const newDir = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
// //         if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
// //           setNextDirection(newDir);
// //           setTouchStart(null);
// //         }
// //       }
// //     } else {
// //       if (Math.abs(deltaY) > minSwipe) {
// //         const newDir = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
// //         if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
// //           setNextDirection(newDir);
// //           setTouchStart(null);
// //         }
// //       }
// //     }
// //   };

// //   const handleTouchEnd = () => {
// //     setTouchStart(null);
// //   };

// //   useEffect(() => {
// //     window.addEventListener('keydown', handleKeyDown);
// //     window.addEventListener('touchstart', handleTouchStart);
// //     window.addEventListener('touchmove', handleTouchMove);
// //     window.addEventListener('touchend', handleTouchEnd);
// //     return () => {
// //       window.removeEventListener('keydown', handleKeyDown);
// //       window.removeEventListener('touchstart', handleTouchStart);
// //       window.removeEventListener('touchmove', handleTouchMove);
// //       window.removeEventListener('touchend', handleTouchEnd);
// //     };
// //   }, [handleKeyDown, gameState, direction]);

// //   useEffect(() => {
// //     if (gameState !== 'playing') return;

// //     const moveSnake = () => {
// //       setSnake((prevSnake) => {
// //         const newDirection = nextDirection || direction;
// //         setDirection(newDirection);
// //         setNextDirection(null);

// //         const newHead = { x: prevSnake[0].x + newDirection.x, y: prevSnake[0].y + newDirection.y };
// //         const newSnake = [newHead, ...prevSnake];

// //         if (
// //           newHead.x < 0 ||
// //           newHead.x >= BOARD_WIDTH ||
// //           newHead.y < 0 ||
// //           newHead.y >= BOARD_HEIGHT ||
// //           prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y) ||
// //           obstacles.some((o) => o.x === newHead.x && o.y === newHead.y)
// //         ) {
// //           setGameState('over');
// //           return prevSnake;
// //         }

// //         let ateFood = false;
// //         let pointsToAdd = 0;

// //         if (newHead.x === food.x && newHead.y === food.y) {
// //           setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...newSnake, ...obstacles]));
// //           ateFood = true;
// //           pointsToAdd = DIFFICULTY_SETTINGS[difficulty].baseScore;
// //         } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
// //           setBonusEffect({ x: newHead.x, y: newHead.y, time: Date.now() });
// //           setBonusFood(null);
// //           ateFood = true;
// //           pointsToAdd = 100;
// //           setTimeout(() => setBonusEffect(null), BONUS_EFFECT_DURATION);
// //         }

// //         if (ateFood) {
// //           setScore((prev) => {
// //             const newScore = prev + pointsToAdd;
// //             if (newScore > highScore) {
// //               setHighScore(newScore);
// //               localStorage.setItem('highScore', newScore);
// //             }
// //             setSpeed((prevSpeed) =>
// //               Math.max(
// //                 DIFFICULTY_SETTINGS[difficulty].minSpeed,
// //                 prevSpeed - DIFFICULTY_SETTINGS[difficulty].speedDecrease
// //               )
// //             );
// //             spawnObstacles();
// //             spawnBonusFood();
// //             return newScore;
// //           });
// //         } else {
// //           newSnake.pop();
// //         }
// //         return newSnake;
// //       });
// //     };

// //     const interval = setInterval(moveSnake, speed);
// //     return () => clearInterval(interval);
// //   }, [gameState, direction, nextDirection, food, bonusFood, obstacles, speed, highScore, difficulty, spawnObstacles, spawnBonusFood]);

// //   const resetGame = () => {
// //     setSnake([{ x: 10, y: 10 }]);
// //     setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
// //     setBonusFood(null);
// //     setObstacles([]);
// //     setDirection({ x: 1, y: 0 });
// //     setNextDirection(null);
// //     setGameState('playing');
// //     setScore(0);
// //     setSpeed(DIFFICULTY_SETTINGS[difficulty].startSpeed);
// //     setBonusEffect(null);
// //     setTouchStart(null);
// //   };

// //   const renderContent = () => {
// //     const isMobile = window.innerWidth <= 768;

// //     switch (gameState) {
// //       case 'start':
// //         return (
// //           <Box sx={{ textAlign: 'center', color: 'white', p: 3 }}>
// //             <Typography variant="h3" gutterBottom>Snake Game</Typography>
// //             <Typography variant="body1" gutterBottom>
// //               {isMobile 
// //                 ? "Swipe to move. Tap Play to start!"
// //                 : "Use arrow keys or WASD to move. Space to pause/resume. Enter to start!"}
// //             </Typography>
// //             <FormControl sx={{ m: 1, minWidth: 120 }}>
// //               <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
// //               <Select
// //                 value={difficulty}
// //                 onChange={(e) => setDifficulty(e.target.value)}
// //                 label="Difficulty"
// //                 sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
// //               >
// //                 <MenuItem value="Easy">Easy</MenuItem>
// //                 <MenuItem value="Normal">Normal</MenuItem>
// //                 <MenuItem value="Hard">Hard</MenuItem>
// //               </Select>
// //             </FormControl>
// //             {isMobile && (
// //               <Button
// //                 variant="contained"
// //                 color="success"
// //                 onClick={resetGame}
// //                 sx={{ mt: 2 }}
// //               >
// //                 Play
// //               </Button>
// //             )}
// //           </Box>
// //         );
// //       case 'playing':
// //       case 'paused':
// //       case 'over':
// //         return (
// //           <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
// //             <AppBar position="static" color="transparent" elevation={0}>
// //               <Toolbar>
// //                 <Typography variant="body2" sx={{ flexGrow: 1, color: 'white' }}>
// //                   Score: {score}
// //                 </Typography>
// //                 <Typography variant="body2" sx={{ color: 'white', mx: 2 }}>
// //                   High Score: {highScore}
// //                 </Typography>
// //                 <Typography variant="body2" sx={{ color: 'white' }}>
// //                   Speed: {speed}ms
// //                 </Typography>
// //               </Toolbar>
// //             </AppBar>
// //             <Box sx={{ 
// //               position: 'relative', 
// //               flexGrow: 1, 
// //               display: 'flex', 
// //               justifyContent: 'center', 
// //               alignItems: 'center',
// //               maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)',
// //             }}>
// //               {gameState === 'over' && (
// //                 <Typography variant="h4" sx={{ position: 'absolute', color: 'white', zIndex: 5, bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 1 }}>
// //                   Game Over! {isMobile ? "Tap to Restart" : "Press Enter to Restart"}
// //                 </Typography>
// //               )}
// //               {gameState === 'paused' && (
// //                 <Typography variant="h4" sx={{ position: 'absolute', color: 'white', zIndex: 5, bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 1 }}>
// //                   Paused - {isMobile ? "Tap to Resume" : "Press Space to Resume"}
// //                 </Typography>
// //               )}
// //               <GameBoard
// //                 snake={snake}
// //                 food={food}
// //                 bonusFood={bonusFood}
// //                 obstacles={obstacles}
// //                 gameState={gameState}
// //                 bonusEffect={bonusEffect}
// //                 speed={speed}
// //               />
// //             </Box>
// //             {isMobile && (
// //               <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
// //                 {gameState === 'playing' && (
// //                   <Button variant="contained" color="primary" onClick={() => setGameState('paused')}>
// //                     Pause
// //                   </Button>
// //                 )}
// //                 {gameState === 'paused' && (
// //                   <Button variant="contained" color="primary" onClick={() => setGameState('playing')}>
// //                     Resume
// //                   </Button>
// //                 )}
// //                 {gameState === 'over' && (
// //                   <Button variant="contained" color="error" onClick={resetGame}>
// //                     Restart
// //                   </Button>
// //                 )}
// //               </Box>
// //             )}
// //             {gameState === 'over' && (
// //               <FormControl sx={{ m: 1, minWidth: 120 }}>
// //                 <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
// //                 <Select
// //                   value={difficulty}
// //                   onChange={(e) => setDifficulty(e.target.value)}
// //                   label="Difficulty"
// //                   sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
// //                 >
// //                   <MenuItem value="Easy">Easy</MenuItem>
// //                   <MenuItem value="Normal">Normal</MenuItem>
// //                   <MenuItem value="Hard">Hard</MenuItem>
// //                 </Select>
// //               </FormControl>
// //             )}
// //           </Container>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         width: '100%',
// //         height: '100vh',
// //         bgcolor: '#1a1a1a',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         overflow: 'hidden',
// //         touchAction: 'none',
// //       }}
// //     >
// //       {renderContent()}
// //     </Box>
// //   );
// // };

// // export default SnakeGame;












// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Box, Button, Typography, Select, MenuItem, FormControl, InputLabel,
//   AppBar, Toolbar, Container
// } from '@mui/material';
// import {
//   PlayArrow as PlayIcon,
//   Pause as PauseIcon,
//   Replay as RestartIcon,
//   Speed as SpeedIcon,
//   Star as StarIcon,
//   EmojiEvents as HighScoreIcon,
// } from '@mui/icons-material';
// import GameBoard from './GameBoard';

// const BOARD_WIDTH = 39;
// const BOARD_HEIGHT = 29;
// const OBSTACLE_THRESHOLD = 50;
// const BONUS_SPAWN_CHANCE = 0.05;
// const BONUS_DURATION = 5000;
// const BONUS_EFFECT_DURATION = 1000;

// const getRandomPosition = (width, height, exclude = []) => {
//   let pos;
//   do {
//     pos = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
//   } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));
//   return pos;
// };

// const DIFFICULTY_SETTINGS = {
//   Easy: { startSpeed: 250, speedDecrease: 5, minSpeed: 100, baseScore: 5, obstacleCount: 3 },
//   Normal: { startSpeed: 200, speedDecrease: 10, minSpeed: 50, baseScore: 10, obstacleCount: 5 },
//   Hard: { startSpeed: 150, speedDecrease: 15, minSpeed: 30, baseScore: 15, obstacleCount: 8 },
// };

// const SnakeGame = () => {
//   const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
//   const [food, setFood] = useState(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
//   const [bonusFood, setBonusFood] = useState(null);
//   const [obstacles, setObstacles] = useState([]);
//   const [direction, setDirection] = useState({ x: 1, y: 0 });
//   const [nextDirection, setNextDirection] = useState(null);
//   const [gameState, setGameState] = useState('start');
//   const [score, setScore] = useState(0);
//   const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('highScore')) || 0);
//   const [difficulty, setDifficulty] = useState('Normal');
//   const [speed, setSpeed] = useState(DIFFICULTY_SETTINGS.Normal.startSpeed);
//   const [bonusEffect, setBonusEffect] = useState(null);
//   const [touchStart, setTouchStart] = useState(null);

//   const spawnObstacles = useCallback(() => {
//     if (score >= OBSTACLE_THRESHOLD && obstacles.length === 0) {
//       const newObstacles = Array.from(
//         { length: DIFFICULTY_SETTINGS[difficulty].obstacleCount },
//         () => ({ ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food]), spawnTime: Date.now() })
//       );
//       setObstacles(newObstacles);
//     }
//   }, [score, difficulty, obstacles, snake, food]);

//   const spawnBonusFood = useCallback(() => {
//     if (!bonusFood && Math.random() < BONUS_SPAWN_CHANCE) {
//       const newBonus = {
//         ...getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...snake, food, ...obstacles]),
//         spawnTime: Date.now(),
//         duration: BONUS_DURATION,
//       };
//       setBonusFood(newBonus);
//       setTimeout(() => setBonusFood((current) => (current === newBonus ? null : current)), BONUS_DURATION);
//     }
//   }, [bonusFood, snake, food, obstacles]);

//   const handleKeyDown = useCallback(
//     (e) => {
//       switch (e.key) {
//         case 'Enter':
//           if (gameState === 'start' || gameState === 'over') resetGame();
//           break;
//         case ' ':
//           if (gameState === 'playing') setGameState('paused');
//           else if (gameState === 'paused') setGameState('playing');
//           break;
//         default:
//           if (gameState !== 'playing') return;
//           const newDir =
//             {
//               ArrowUp: { x: 0, y: -1 },
//               w: { x: 0, y: -1 },
//               ArrowDown: { x: 0, y: 1 },
//               s: { x: 0, y: 1 },
//               ArrowLeft: { x: -1, y: 0 },
//               a: { x: -1, y: 0 },
//               ArrowRight: { x: 1, y: 0 },
//               d: { x: 1, y: 0 },
//             }[e.key] || null;
//           if (newDir && (direction.x !== -newDir.x || direction.y !== -newDir.y)) {
//             setNextDirection(newDir);
//           }
//       }
//     },
//     [gameState, direction]
//   );

//   const handleTouchStart = (e) => {
//     const touch = e.touches[0];
//     setTouchStart({ x: touch.clientX, y: touch.clientY });
//   };

//   const handleTouchMove = (e) => {
//     if (!touchStart || gameState !== 'playing') return;
//     e.preventDefault();
    
//     const touch = e.touches[0];
//     const deltaX = touch.clientX - touchStart.x;
//     const deltaY = touch.clientY - touchStart.y;
//     const minSwipe = 20;

//     if (Math.abs(deltaX) > Math.abs(deltaY)) {
//       if (Math.abs(deltaX) > minSwipe) {
//         const newDir = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
//         if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
//           setNextDirection(newDir);
//           setTouchStart(null);
//         }
//       }
//     } else {
//       if (Math.abs(deltaY) > minSwipe) {
//         const newDir = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
//         if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
//           setNextDirection(newDir);
//           setTouchStart(null);
//         }
//       }
//     }
//   };

//   const handleTouchEnd = () => {
//     setTouchStart(null);
//   };

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('touchstart', handleTouchStart);
//     window.addEventListener('touchmove', handleTouchMove);
//     window.addEventListener('touchend', handleTouchEnd);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('touchstart', handleTouchStart);
//       window.removeEventListener('touchmove', handleTouchMove);
//       window.removeEventListener('touchend', handleTouchEnd);
//     };
//   }, [handleKeyDown, gameState, direction]);

//   useEffect(() => {
//     if (gameState !== 'playing') return;

//     const moveSnake = () => {
//       setSnake((prevSnake) => {
//         const newDirection = nextDirection || direction;
//         setDirection(newDirection);
//         setNextDirection(null);

//         const newHead = { x: prevSnake[0].x + newDirection.x, y: prevSnake[0].y + newDirection.y };
//         const newSnake = [newHead, ...prevSnake];

//         if (
//           newHead.x < 0 ||
//           newHead.x >= BOARD_WIDTH ||
//           newHead.y < 0 ||
//           newHead.y >= BOARD_HEIGHT ||
//           prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y) ||
//           obstacles.some((o) => o.x === newHead.x && o.y === newHead.y)
//         ) {
//           setGameState('over');
//           return prevSnake;
//         }

//         let ateFood = false;
//         let pointsToAdd = 0;

//         if (newHead.x === food.x && newHead.y === food.y) {
//           setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT, [...newSnake, ...obstacles]));
//           ateFood = true;
//           pointsToAdd = DIFFICULTY_SETTINGS[difficulty].baseScore;
//         } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
//           setBonusEffect({ x: newHead.x, y: newHead.y, time: Date.now() });
//           setBonusFood(null);
//           ateFood = true;
//           pointsToAdd = 100;
//           setTimeout(() => setBonusEffect(null), BONUS_EFFECT_DURATION);
//         }

//         if (ateFood) {
//           setScore((prev) => {
//             const newScore = prev + pointsToAdd;
//             if (newScore > highScore) {
//               setHighScore(newScore);
//               localStorage.setItem('highScore', newScore);
//             }
//             setSpeed((prevSpeed) =>
//               Math.max(
//                 DIFFICULTY_SETTINGS[difficulty].minSpeed,
//                 prevSpeed - DIFFICULTY_SETTINGS[difficulty].speedDecrease
//               )
//             );
//             spawnObstacles();
//             spawnBonusFood();
//             return newScore;
//           });
//         } else {
//           newSnake.pop();
//         }
//         return newSnake;
//       });
//     };

//     const interval = setInterval(moveSnake, speed);
//     return () => clearInterval(interval);
//   }, [gameState, direction, nextDirection, food, bonusFood, obstacles, speed, highScore, difficulty, spawnObstacles, spawnBonusFood]);

//   const resetGame = () => {
//     setSnake([{ x: 10, y: 10 }]);
//     setFood(getRandomPosition(BOARD_WIDTH, BOARD_HEIGHT));
//     setBonusFood(null);
//     setObstacles([]);
//     setDirection({ x: 1, y: 0 });
//     setNextDirection(null);
//     setGameState('playing');
//     setScore(0);
//     setSpeed(DIFFICULTY_SETTINGS[difficulty].startSpeed);
//     setBonusEffect(null);
//     setTouchStart(null);
//   };

//   const renderContent = () => {
//     const isMobile = window.innerWidth <= 768;

//     switch (gameState) {
//       case 'start':
//         return (
//           <Box sx={{ textAlign: 'center', color: 'white', p: 3 }}>
//             <Typography variant="h3" gutterBottom>Snake Game</Typography>
//             <Typography variant="body1" gutterBottom>
//               {isMobile 
//                 ? "Swipe to move. Tap Play to start!"
//                 : "Use arrow keys or WASD to move. Space to pause/resume. Enter to start!"}
//             </Typography>
//             <FormControl sx={{ m: 1, minWidth: 120 }}>
//               <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
//               <Select
//                 value={difficulty}
//                 onChange={(e) => setDifficulty(e.target.value)}
//                 label="Difficulty"
//                 sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
//               >
//                 <MenuItem value="Easy">Easy</MenuItem>
//                 <MenuItem value="Normal">Normal</MenuItem>
//                 <MenuItem value="Hard">Hard</MenuItem>
//               </Select>
//             </FormControl>
//             {isMobile && (
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={resetGame}
//                 sx={{ mt: 2 }}
//                 startIcon={<PlayIcon />}
//               >
//                 Play
//               </Button>
//             )}
//           </Box>
//         );
//       case 'playing':
//       case 'paused':
//       case 'over':
//         return (
//           <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <AppBar position="static" color="transparent" elevation={0}>
//               <Toolbar>
//                 <Typography variant="body2" sx={{ flexGrow: 1, color: 'white', display: 'flex', alignItems: 'center' }}>
//                   <StarIcon sx={{ mr: 1 }} /> Score: {score}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'white', mx: 2, display: 'flex', alignItems: 'center' }}>
//                   <HighScoreIcon sx={{ mr: 1 }} /> High Score: {highScore}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
//                   <SpeedIcon sx={{ mr: 1 }} /> Speed: {speed}ms
//                 </Typography>
//               </Toolbar>
//             </AppBar>
//             <Box sx={{ 
//               position: 'relative', 
//               flexGrow: 1, 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center',
//               maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)',
//             }}>
//               {gameState === 'over' && (
//                 <Typography variant="h4" sx={{ position: 'absolute', color: 'white', zIndex: 5, bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 1 }}>
//                   Game Over! {isMobile ? "Tap to Restart" : "Press Enter to Restart"}
//                 </Typography>
//               )}
//               {gameState === 'paused' && (
//                 <Typography variant="h4" sx={{ position: 'absolute', color: 'white', zIndex: 5, bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 1 }}>
//                   Paused - {isMobile ? "Tap to Resume" : "Press Space to Resume"}
//                 </Typography>
//               )}
//               <GameBoard
//                 snake={snake}
//                 food={food}
//                 bonusFood={bonusFood}
//                 obstacles={obstacles}
//                 gameState={gameState}
//                 bonusEffect={bonusEffect}
//                 speed={speed}
//               />
//             </Box>
//             {isMobile && (
//               <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
//                 {gameState === 'playing' && (
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => setGameState('paused')}
//                     startIcon={<PauseIcon />}
//                   >
//                     Pause
//                   </Button>
//                 )}
//                 {gameState === 'paused' && (
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => setGameState('playing')}
//                     startIcon={<PlayIcon />}
//                   >
//                     Resume
//                   </Button>
//                 )}
//                 {gameState === 'over' && (
//                   <Button 
//                     variant="contained" 
//                     color="error" 
//                     onClick={resetGame}
//                     startIcon={<RestartIcon />}
//                   >
//                     Restart
//                   </Button>
//                 )}
//               </Box>
//             )}
//             {gameState === 'over' && (
//               <FormControl sx={{ m: 1, minWidth: 120 }}>
//                 <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
//                 <Select
//                   value={difficulty}
//                   onChange={(e) => setDifficulty(e.target.value)}
//                   label="Difficulty"
//                   sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
//                 >
//                   <MenuItem value="Easy">Easy</MenuItem>
//                   <MenuItem value="Normal">Normal</MenuItem>
//                   <MenuItem value="Hard">Hard</MenuItem>
//                 </Select>
//               </FormControl>
//             )}
//           </Container>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: '100%',
//         height: '100vh',
//         bgcolor: '#1a1a1a',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         overflow: 'hidden',
//         touchAction: 'none',
//       }}
//     >
//       {renderContent()}
//     </Box>
//   );
// };

// export default SnakeGame;


















import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Button, Typography, Select, MenuItem, FormControl, InputLabel,
  AppBar, Toolbar, Container
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Replay as RestartIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  EmojiEvents as HighScoreIcon,
} from '@mui/icons-material';
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
  } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));         //eslint-disable-line
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
    [gameState, direction]           //eslint-disable-line
  );

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });

    // Start game on touch if in start or over state
    if (gameState === 'start' || gameState === 'over') {
      resetGame();
      e.preventDefault(); // Prevent default behavior
    }
  }, [gameState]);        //eslint-disable-line

  const handleTouchMove = useCallback((e) => {
    if (!touchStart || gameState !== 'playing') return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipe = 20;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipe) {
        const newDir = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
          setNextDirection(newDir);
          setTouchStart(null);
        }
      }
    } else {
      if (Math.abs(deltaY) > minSwipe) {
        const newDir = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        if (direction.x !== -newDir.x || direction.y !== -newDir.y) {
          setNextDirection(newDir);
          setTouchStart(null);
        }
      }
    }
  }, [touchStart, gameState, direction]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

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
  }, [handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

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
          <Box 
            sx={{ 
              textAlign: 'center', 
              color: 'white', 
              p: 3,
              touchAction: 'manipulation', // Improve touch responsiveness
            }}
            onTouchStart={isMobile ? handleTouchStart : undefined} // Enable touch-to-start
          >
            <Typography variant="h3" gutterBottom>Snake Game</Typography>
            <Typography variant="body1" gutterBottom>
              {isMobile 
                ? "Tap anywhere or swipe to start!"
                : "Use arrow keys or WASD to move. Space to pause/resume. Enter to start!"}
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
            {isMobile && (
              <Button
                variant="contained"
                color="success"
                onClick={resetGame}
                sx={{ mt: 2 }}
                startIcon={<PlayIcon />}
              >
                Play
              </Button>
            )}
          </Box>
        );
      case 'playing':
      case 'paused':
      case 'over':
        return (
          <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar>
                <Typography variant="body2" sx={{ flexGrow: 1, color: 'white', display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ mr: 1 }} /> Score: {score}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mx: 2, display: 'flex', alignItems: 'center' }}>
                  <HighScoreIcon sx={{ mr: 1 }} /> High Score: {highScore}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                  <SpeedIcon sx={{ mr: 1 }} /> Speed: {speed}ms
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{ 
              position: 'relative', 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)',
            }}>
              {gameState === 'over' && (
                <Typography 
                  variant="h4" 
                  sx={{ position: 'absolute', color: 'white', zIndex: 5, bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 1 }}
                  onTouchStart={isMobile ? resetGame : undefined} // Touch to restart
                >
                  Game Over! {isMobile ? "Tap to Restart" : "Press Enter to Restart"}
                </Typography>
              )}
              {gameState === 'paused' && (
                <Typography 
                  variant="h4" 
                  sx={{ position: 'absolute', color: 'white', zIndex: 5, bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 1 }}
                  onTouchStart={isMobile ? () => setGameState('playing') : undefined} // Touch to resume
                >
                  Paused - {isMobile ? "Tap to Resume" : "Press Space to Resume"}
                </Typography>
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
            </Box>
            {isMobile && (
              <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                {gameState === 'playing' && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setGameState('paused')}
                    startIcon={<PauseIcon />}
                  >
                    Pause
                  </Button>
                )}
                {gameState === 'paused' && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setGameState('playing')}
                    startIcon={<PlayIcon />}
                  >
                    Resume
                  </Button>
                )}
                {gameState === 'over' && (
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={resetGame}
                    startIcon={<RestartIcon />}
                  >
                    Restart
                  </Button>
                )}
              </Box>
            )}
            {gameState === 'over' && (
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  label="Difficulty"
                  sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            )}
          </Container>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        touchAction: 'none', // Prevents default touch behaviors
      }}
    >
      {renderContent()}
    </Box>
  );
};

export default SnakeGame;