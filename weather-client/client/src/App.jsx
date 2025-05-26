import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import OutsideChart from './OutsideChart';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
          <OutsideChart />
      </div>
    </div>
  );
}

export default App
