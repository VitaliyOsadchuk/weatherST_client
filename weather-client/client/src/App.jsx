import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import MainPage from './MainPage';
import Forecast from './Forecast';
import OutsideChart from './OutsideChart';
import InsideChart from './InsideChart';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
             <Route path="/" element={<MainPage />} />
            <Route path="/OutdoorModule" element={<OutsideChart />} />
            <Route path="/IndoorModule" element={<InsideChart />} />
            <Route path="/Forecast" element={<Forecast />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
