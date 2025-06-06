import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './css/OutsideChart.css';

const RANGE_OPTIONS = [
  { label: 'Тиждень', value: 'week' },
  { label: '30 Днів', value: 'month' },
  { label: '6 місяців', value: '6months' },
  { label: 'Рік', value: 'year' }
];

function OutsideChart() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState('week');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
   fetch(`${baseUrl}/api/data?range=${range}`)   //посилання
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(d => ({
          timeUA: d.time.replace('T', ' ').slice(0, 19) + ' UA',
          time: d.time,
          temperature: d.bmeT,
          humidity: d.bmeH,
          pressure: d.bmeP
        }));
        setData(formatted);
      })
      .catch(err => console.error('Error loading data:', err));
  }, [range]);

   const formatDateLabel = (isoStr) => {
    const date = new Date(isoStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  const fromDate = data.length ? new Date(data[0].time) : null;
  const toDate = data.length ? new Date(data[data.length - 1].time) : null;


  return (
    <div className="chart-container">
      <h2 className="lang">Вуличний модуль</h2>

      {fromDate && toDate && (
        <h3 className="range-label lang">
          {formatDateLabel(fromDate)} — {formatDateLabel(toDate)}
        </h3>
      )}
  
       <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={data} margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeUA" stroke="#3E5879" tick={false} />
            <YAxis yAxisId="left"  ticks={[-30, 0, 20, 40, 60, 80, 100]} domain={[-30, 150]} stroke="#3E5879"  label={{
              value: '°C, %',
              angle: 0,
              position: 'top',
              offset: 10,
              style: { fill: '#3E5879', fontSize: '14px', transform: 'translateX(1vw)' }
            }}/>
            
            <YAxis yAxisId="right" orientation="right"  ticks={[300, 600, 700, 800, 900, 1000, 1100]} domain={[0, 1200]}  stroke="#3E5879"  label={{
              value: 'hPa',
              angle: 0,
              position: 'top',
              offset: 10,
              style: { fill: '#3E5879', fontSize: '14px' }
            }}/>
            <Tooltip className="lang"
              formatter={(value, name) => {
                switch (name) {
                  case 'Температура':
                    return [`${value} °C`, name];
                  case 'Відносна вологість':
                    return [`${value} %`, name];
                  case 'Атмосферний тиск':
                    return [`${value} hPa`, name];
                  default:
                    return [value, name];
                }
              }} />
            <Legend className="lang" />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Температура" dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#387908" name="Відносна вологість" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#0033cc" name="Атмосферний тиск" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="range-selector">
        {RANGE_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => setRange(option.value)}
            className={`range-btn lang ${range === option.value ? 'active' : ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OutsideChart;
