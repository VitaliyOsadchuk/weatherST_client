import React, { useState, useEffect } from 'react';
import './css/MainPage.css';

const MainPage = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('відключена');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchLatestData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/latest`);
      if (!response.ok) {
        throw new Error(`error status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);

      const now = new Date();
      const dataTime = new Date(json.time);
      const fixedDataTime = new Date(dataTime.getTime() - 3 * 60 * 60 * 1000);
      const diffHours = (now - fixedDataTime) / (1000 * 60 * 60);


      setStatus(diffHours <= 1 ? 'активна' : 'відключена');
      // console.log('Поточний час (now):', fixedDataTime);
      // console.log('Поточний час (now):', now);
      // console.log('Різниця в годинах:', diffHours);
      
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 3 * 60 * 1000); //3 хв - оновлення
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-container">
      <div className='wrap-container'>
        <h2 className="lang">Останній запис</h2>
      {data ? (
        <div className="data-container">
          <div className='info-block'>
            <p className="lang">{data.time.replace('T', ' ').replace('.000Z', '')} (UA)</p>
            <p className="lang status">Статус: <span style={{ color: status === 'активна' ? '#328E6E':'#D5451B', fontWeight: 'bold' }}>{status}</span></p>
          </div>
          <div className='info-block'>
            <h3 className="lang"><span style={{color:'#4a4b4b'}}>Кімнатний модуль:</span></h3>
            <p className="lang"><span style={{color:'#ff7300'}}>Температура: </span>{data.htuT}°C</p>
            <p className="lang"><span style={{color:'#387908'}}>Відносна вологість: </span>{data.htuH}%</p>
          </div>
          <div className='info-block'>
            <h3 className="lang"><span style={{color:'#4a4b4b'}}>Вуличний модуль:</span></h3>
            <p className="lang"><span style={{color:'#ff7300'}}>Температура: </span>{data.bmeT}°C</p>
            <p className="lang"><span style={{color:'#387908'}}>Відносна вологість: </span>{data.bmeH}%</p>
            <p className="lang"><span style={{color:'#0033cc'}}>Атмосферний тиск: </span>{data.bmeP} hPa</p>
          </div>
        </div>
      ) : (
        <p className="lang">Завантаження...</p>
      )}
      </div>
    </div>
  );
};

export default MainPage;
