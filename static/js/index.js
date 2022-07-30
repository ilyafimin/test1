import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { writeSerialPort, readSerialPort, closeSerialPort, clearData } from "./get";

const state = ['Температура', 'Пульс', 'GSR датчик'];

const App = () => {

  const [scanerValues, setScanerValues] = useState([]);
  const [showSuccesModal, setshowSuccesModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentStateId, setCurrentStateId] = useState(1);
  const [temp, setTemp] = useState(0);
  const [pulse, setPulse] = useState({ beat_per_m: 0, bet_avg: 0 });
  const [gsr, setGsr] = useState(0);

  function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
  };

  function processing() {
    const filtred = scanerValues.filter((i) => Number(i.split(',')[1]) !== 0 && i.length > 1);
    filtred.map(i => {
      const id = i.split(',')[0];
      switch (id) {
        case '1': {
          setTemp(i.split(',')[1]);
          break;
        };
        case '2': {
          setPulse({
            beat_per_m: i.split(',')[1],
            bet_avg: i.split(',')[2],
          });
          break;
        };
        case '3': {
          setGsr(i.split(',')[1])
          break;
        };
      };
    });

    if (true) {
      setIsSuccess(true);
      setshowSuccesModal(true)
      setTimeout(() => setshowSuccesModal(false), 3000);
      setTimeout(() => setIsSuccess(false), 3000);
    };

  }

  const gettingData = (time) => {
    let id = 0;
    writeSerialPort('1,1;', 3000); // Initilization
    const interval = setInterval(() => {
      let localid = ++id;
      writeSerialPort(`1,${localid};`, 3000);
      setCurrentStateId(localid - 1);
      if (id >= 3) clearInterval(interval);
    }, id == 2 ? time * 1000 * 3 : time * 1000);
    sleep((time + 2) * 1000 );
    setTimeout(() => readSerialPort(3000, id, scanerValues, setScanerValues),  time * 1000 * 3 + 2000); // Read Port
    setTimeout(() => closeSerialPort(3000), time * 1000 * 3 + 4000); // Close Port
    setTimeout(() => clearData(),  time * 1000 * 3 + 4000); // Clear
    setTimeout(() => setShowModal(false),  time * 1000 * 3 + 2000); // Close Modal
  };

  useEffect(() => {
    processing();
  }, [scanerValues])

  return (
    <>
      {
        showSuccesModal && (
          <div className="overlay">
            <div className="overlay__modal">
              <h1>
                { isSuccess ? 'Вы допущены': 'Вы не допущены' }
              </h1>
            </div>
          </div>
        )
      }
      {
        showModal && (
          <div 
            className="overlay"
            >
              <div className="overlay__modal">
                <span 
                  class="material-symbols-outlined" 
                  style={{
                    fontSize: '6rem',
                  }}>
                    memory
                </span>
                <div className="state__wrapper__modal">
                  { state[currentStateId] }
                </div>
              </div>
          </div>
        )
      }
      <div className="leftside__wrapper">
        <div 
          className="serialportget__btn"
          onClick={() => {
            setShowModal(true);
            gettingData(5);
          }}
        >
          <p>Считать показатели</p>
        </div>
        <div className="state__wrapper">
          <h2>Настройки</h2>
          <p
            style={{ marginTop: '10px', color: '#ccc' }}
          >
            В процессе разработки
          </p>
        </div>
      </div>
      <div className="rightside__wrapper">
        <div className="card">
          <h1>Температура</h1>
          <div className="line"></div>
          <p>
            Средняя температура: { temp && Number(temp) / 10 }
          </p>
        </div>
        <div className="card">
          <h1>Пульс</h1>
          <div className="line"></div>
          <p>
            Средний пульс: { pulse.bet_avg && pulse.bet_avg }
          </p>
          <p>
            Среднее количество ударов в минуту: { pulse.beat_per_m && pulse.beat_per_m }
          </p>
        </div>
        <div className="card">
          <h1>Кожно-гальваническая реакция</h1>
          <div className="line"></div>
          <p>
            Показания GSR: { gsr && gsr }
          </p>
        </div>
      </div>
    </>
  );
};

const root = createRoot(document.querySelector('#wrapper'));
root.render(<App/>)