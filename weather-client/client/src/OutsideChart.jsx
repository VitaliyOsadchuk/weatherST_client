import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './css/OutsideChart.css';

const RANGE_OPTIONS = [
  { label: 'Тиждень', value: 'week' },
  { label: 'Місяць', value: 'month' },
  { label: '6 місяців', value: '6months' },
  { label: 'Рік', value: 'year' }
];

function OutsideChart() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState('week');

  useEffect(() => {
   fetch(`http://localhost:3000/api/data?range=${range}`)   //посилання
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
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={data} margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeUA" stroke="#3E5879" tick={false} />
            <YAxis yAxisId="left" domain={[0, 100]} stroke="#3E5879" tick={false} />
            <YAxis yAxisId="left" domain={[0, 100]}  tick={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 1200]}  stroke="#3E5879" tick={false} />
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
        <button onClick={() => setRange('week')} className={`range-btn lang ${range === 'week' ? 'active' : ''}`}>Тиждень</button>
        <button onClick={() => setRange('month')} className={`range-btn lang ${range === 'month' ? 'active' : ''}`}>Місяць</button>
        <button onClick={() => setRange('6months')} className={`range-btn lang ${range === '6months' ? 'active' : ''}`}>6 місяців</button>
        <button onClick={() => setRange('year')} className={`range-btn lang ${range === 'year' ? 'active' : ''}`}>Рік</button>
      </div>
    </div>
  );
}

export default OutsideChart;
