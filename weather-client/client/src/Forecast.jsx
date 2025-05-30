import React, { useEffect, useState } from 'react';
import './css/Forecast.css';

const zambrettiRising = {
  20: 'Settled Fine', 21: 'Fine Weather', 22: 'Becoming Fine', 23: 'Fairly Fine, Improving',
  24: 'Fairly Fine, Possibly Showers Early', 25: 'Showery Early, Improving', 26: 'Changeable, Mending',
  27: 'Rather Unsettled, Clearing Later', 28: 'Unsettled, Probably Improving', 29: 'Unsettled, Short Fine Intervals',
  30: 'Very Unsettled, Finer at Times', 31: 'Stormy, Possibly Improving', 32: 'Stormy, Much Rain'
};

const zambrettiFalling = {
  1: 'Settled Fine', 2: 'Fine Weather', 3: 'Fine, Becoming Less Settled',
  4: 'Fairly Fine, Showery Later', 5: 'Showery, Becoming More Unsettled', 6: 'Unsettled, Rain Later',
  7: 'Rain at Times, Worse Later', 8: 'Rain at Times, Becoming Very Unsettled', 9: 'Very Unsettled, Rain'
};

const zambrettiSteady = {
  10: 'Settled Fine', 11: 'Fine Weather', 12: 'Fine, Possibly Showers', 13: 'Fairly Fine, Showers Likely', 14: 'Showery, Bright Intervals',
  15: 'Changeable, Some Rain', 16: 'Unsettled, Rain at Times', 17: 'Rain at Frequent Intervals',
  18: 'Very Unsettled, Rain', 19: 'Stormy, Much Rain'
};

const zambrettiRisingUA = {
  20: 'Стійка ясна погода', 21: 'Ясна погода', 22: 'Покращення погоди, прояснення', 23: 'Переважно ясно, покращення',
  24: 'Переважно ясно, можливі короткочасні опади на початку', 25: 'Короткочасні опади на початку, потім покращення', 26: 'Погода зміннюється, буде покращуватися',
  27: 'Досить нестабільна погода, з проясненням пізніше', 28: 'Нестійка погода, ймовірне покращення', 29: 'Нестійка погода, короткі періоди прояснення',
  30: 'Дуже нестійка погода, іноді прояснення', 31: 'Штормова погода, можливе покращення', 32: 'Штормова погода, багато опадів'
};

const zambrettiFallingUA = {
  1: 'Стійка ясна погода', 2: 'Ясна погода', 3: 'Ясна погода, поступово менш стійка',
  4: 'Переважно ясно, пізніше опади', 5: 'Опади, з подальшим погіршенням погоди', 6: 'Нестійка погода, пізніше опади',
  7: 'Часом опади, надалі погіршення', 8: 'Часом опади, переходить у дуже нестійку погоду', 9: 'Дуже нестабільно, опади'
};

const zambrettiSteadyUA = {
  10: 'Стійка ясна погода', 11: 'Ясна погода', 12: 'Ясна погода, можливі опади', 13: 'Переважно ясно, ймовірні опади', 14: 'Опади, з проясненнями',
  15: 'Змінна погода, місцями опади', 16: 'Нестійка погода, часом опади', 17: 'Часті опади',
  18: 'Дуже нестійка погода, опади', 19: 'Штормова погода, велика кількість опадів'
};

function Forecast() {
  const [altitude, setAltitude] = useState(() => localStorage.getItem('altitude') || '');
  const [forecast, setForecast] = useState({ ua: 'Недостатньо даних для прогнозу', en: '' });
  const [trendText, setTrendText] = useState('');
  const [table, setTable] = useState(null);
  


  useEffect(() => {
    if (altitude) handleConfirm();
  }, []);

  function handleConfirm() {
  localStorage.setItem('altitude', altitude);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  fetch(`${baseUrl}/api/data?range=3hours`) 
    .then(res => res.json())
    .then(raw => {
      if (!raw.length || raw.length < 2) {
        return setForecast({ ua: 'Недостатньо даних для прогнозу', en: 'Forecast unavailable' });
      }

      const [first, last] = raw;

      //-----------------------------------------------------------------------------------------
      const nowUTC = new Date();
      const nowKiev = new Date(nowUTC.getTime() + 3 * 60 * 60 * 1000);
      const lastTime = new Date(last.time);
      const ageMs = nowKiev .getTime() - lastTime.getTime();

      //console.log('Поточний час now:', nowKiev .toISOString());
      //console.log('Час останнього запису:', last.time);
      //console.log('Вік останнього запису (год):', (ageMs / (1000 * 60 * 60)).toFixed(2));

      if (ageMs > 1.5 * 60 * 60 * 1000) {
        return setForecast({ ua: 'Останній запис застарілий', en: 'Last record is outdated' });
      }
      //--------------------------------------------------------------------------------------------
      
      if (new Date(first.time).getTime() === new Date(last.time).getTime()) {
        return setForecast({ ua: 'Недостатньо даних для прогнозу', en: 'Forecast unavailable' });
      }

      const alt = parseFloat(altitude);
      const convert = (p, T) => {
        return p * Math.pow(1 - (0.0065 * alt) / (T + 273.15 + 0.0065 * alt), -5.257);
      };

      const P1 = first.bmeP;
      const T1 = first.bmeT;
      const P2 = last.bmeP;
      const T2 = last.bmeT;

      const P1s = convert(P1, T1);
      const P2s = convert(P2, T2);
      const dP = P2s - P1s;

      let trend = '';
      let Z = 0;

      // за Замбретті:
      if (P2s >= 985 && P2s <= 1050 && dP <= -1.6) {
        trend = 'falling';
        Z = Math.round(127 - 0.12 * P2s);
      } else if (P2s >= 960 && P2s <= 1033 && Math.abs(dP) < 1.6) {
        trend = 'steady';
        Z = Math.round(144 - 0.13 * P2s);
      } else if (P2s >= 947 && P2s <= 1030 && dP >= 1.6) {
        trend = 'rising';
        Z = Math.round(185 - 0.16 * P2s);
      } else {
        return setForecast({ ua: 'Недостатньо даних для прогнозу', en: 'Forecast unavailable' });
      }

      const trendUA = trend === 'rising' ? 'Зростаючий (Rising)' : trend === 'falling' ? 'Падаючий (Falling)' : 'Стабільний (Steady)';

      const forecastMapUA =
        trend === 'rising' ? zambrettiRisingUA :
        trend === 'falling' ? zambrettiFallingUA :
        zambrettiSteadyUA;

      const forecastMapEN =
        trend === 'rising' ? zambrettiRising :
        trend === 'falling' ? zambrettiFalling :
        zambrettiSteady;

      const forecastUA = forecastMapUA[Z];
      const forecastEN = forecastMapEN[Z];

      setForecast({
        ua: forecastUA || 'Прогноз недоступний',
        en: forecastEN || 'Forecast unavailable',
      });

      setTrendText(trendUA);
      const show = val => isNaN(val) ? '-' : val.toFixed(2);
      setTable({
        P1, T1, P2, T2,
        P1s, P2s,
        dP: show(dP),
        Z,
        time1: first.time,
        time2: last.time
      });

    })
    .catch(() => {
      setForecast({ ua: 'Помилка підключення до сервера', en: 'Connection error' });
    });
}

  return (
    <div className='main-container'>
      <div className="forecast-container">
        <div className="forecast-block">
          <h2 className="lang">Прогноз погоди</h2>
          <h3 className="lang forecast-text">{forecast.ua}</h3>
          <h3 className="forecast-text-en">{forecast.en}</h3>
        </div>

        <div className="altitude-input">
            <h3 className="lang input-p">Висота над рівнем моря(м):</h3>
            <input type="number" value={altitude} onChange={e => setAltitude(e.target.value)} />
            <button onClick={handleConfirm} className="lang">Підтвердити</button>
          </div>

        {table && (
          <>
          <div className='left-right'>
             <div className="half-block">
              <h3>Вхідні дані:</h3>
              <p>P1 (3-4 год. тому): {isNaN(table.P1) ? '-' : table.P1.toFixed(2)} hPa</p>
              <p>T1 (3-4 год. тому): {isNaN(table.T1) ? '-' : table.T1.toFixed(2)} °C</p>
              <p>P(зараз): {isNaN(table.P2) ? '-' : table.P2.toFixed(2)} hPa</p>
              <p>Т(зараз): {isNaN(table.T2) ? '-' : table.T2.toFixed(2)} °C</p>  
            </div>

            <div className="half-block">
              <h3>Тиск на рівні моря:</h3>
              <p>P1s: {isNaN(table.P1s) ? '-' : table.P1s.toFixed(2)} hPa</p>
              <p>Ps: {isNaN(table.P2s) ? '-' : table.P2s.toFixed(2)} hPa</p>
              <p>ΔP: {table.dP}</p>
              <p>Z-індекс: {table.Z}</p>
            </div>
          </div>
           
            <div className="forecast-block">
              {trendText && <h3 className="lang">Тенденція тиску: {trendText}</h3>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Forecast;
