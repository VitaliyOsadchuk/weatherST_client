import React, { useEffect, useState } from 'react';
import './css/InsideChart.css';
import './css/OutsideChart.css';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


const RANGE_OPTIONS = [
  { label: 'Тиждень', value: 'week' },
  { label: '30 Днів', value: 'month' },
  { label: '6 місяців', value: '6months' },
  { label: 'Рік', value: 'year' }
];

function InsideChart() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState('week');

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/api/data?range=${range}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(d => ({
          timeUA: d.time.replace('T', ' ').slice(0, 19) + ' UA',
          time: d.time,
          temperature: d.htuT,
          humidity: d.htuH
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
      <h2 className="lang">Кімнатний модуль</h2>

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
            <YAxis yAxisId="left" ticks={[-30, 0, 20, 40, 60, 80, 100]} domain={[-30, 150]} stroke="#3E5879" label={{
              value: '°C, %',
              angle: 0,
              position: 'top',
              offset: 10,
              style: { fill: '#3E5879', fontSize: '14px', transform: 'translateX(1vw)' }
            }}/>
            <Tooltip className="lang"
              formatter={(value, name) => {
                switch (name) {
                  case 'Температура':
                    return [`${value} °C`, name];
                  case 'Відносна вологість':
                    return [`${value} %`, name];
                  default:
                    return [value, name];
                }
              }}
            />
            <Legend className="lang" />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Температура" dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#387908" name="Відносна вологість" dot={false} />
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

export default InsideChart;
