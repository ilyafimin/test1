import axios from "axios";

export const writeSerialPort = async (command_, port) => {
  try {
    console.log({ command: command_ });
    const { data } = await axios.post(`http://127.0.0.1:${port}/api/write`, { command: command_ });
  } catch (e) {
    console.log(e);
  }
};

export const readSerialPort = async (port, id, state, setState) => {
  try {
    const { data } = await axios.get(`http://127.0.0.1:${port}/api/read`);
    setState(data.data);
  } catch (e) {
    console.log(e);
  }
};

export const closeSerialPort = async (port) => {
  try {
    const { data } = await axios.get(`http://127.0.0.1:${port}/api/close`);
  } catch (e) {
    console.log(e);
  }
};

export const clearData = async (port) => {
  try {
    const { data } = await axios.get(`http://127.0.0.1:${port}/api/clear`);
  } catch (e) {
    console.log(e);
  }
};
