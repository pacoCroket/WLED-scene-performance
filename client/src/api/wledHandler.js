import axios from 'axios';

export const sendRequest = (ip, control, value) => {
  // i.e. https://162.27.0.25/win&PL=1
  const req = 'http://' + ip + '/win&' + control + value;
  console.log(req);
  return axios
    .get(req)
    .then((res) => {
      if (res.statusText === 'OK') return res.data;
      else return null;
    })
    .catch((err) => console.log(err));
};

export const sendJsonRequest = (ip, payload) => {
  // https://github.com/Aircoookie/WLED/wiki/JSON-API
  const req = 'http://' + ip + '/json/state';
  console.log(req, payload);
  return axios
    .post(req, payload)
    .then((res) => {
      if (res.statusText === 'OK') return res.data;
      else return null;
    })
    .catch((err) => console.log(err));
};

export const getWledInfo = (ip) => {
  return axios('http://' + ip + '/json/info').then((res) => {
    if (res.statusText === 'OK') return res.data;
    else return null;
  });
};

export const getWledState = (ip) => {
  return axios('http://' + ip + '/json/state').then((res) => {
    if (res.statusText === 'OK') return res.data;
    else return null;
  });
};

export const getWledEffects = (ip) => {
  return axios('http://' + ip + '/json/eff').then((res) => {
    if (res.statusText === 'OK') return res.data;
    else return null;
  });
};

export const getWledPalettes = (ip) => {
  return axios('http://' + ip + '/json/pal').then((res) => {
    if (res.statusText === 'OK') return res.data;
    else return null;
  });
};
