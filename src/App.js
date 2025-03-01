// App.js
import React from 'react';
import SnakeGame from './components/SnakeGame';

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'black', fontSize:'15px' }}>🐍 React Snake Game 🐍</h1>
      <SnakeGame />
    </div>
  );
};

export default App;
