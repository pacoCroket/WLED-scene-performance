import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWledEffects, getWledPalettes } from '../http/wledHandler';
import { setWledDevice } from '../store/actions';
import WledDevice from './WledDevice';

export default function WledFinder() {
  const [effects, setEffects] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const localIp = useSelector((store) => store.localIp);
  const wledDevices = useSelector((store) => store.wledDevices);
  const dispatch = useDispatch();

  useEffect(() => {
    findWled();
  }, [localIp]);

  const findWled = async () => {
    console.log('finding Wled devices');
    // range is [0-255] but 0 and 255 are reserved
    for (var i = 2; i < 254; i++) {
      try {
        const ipArray = localIp.split('.');
        ipArray.splice(3, 1);
        ipArray.push(i);
        const ip = ipArray.join('.');

        axios('http://' + ip + '/json/info').then((res) => {
          if (res.statusText === 'OK') {
            const body = res.data;
            dispatch(setWledDevice({ ...body, ip, controlGroupId: null })); //  TODO util to construct a new wled device
            console.log(ip, 'success');
          }
        });
      } catch (err) {
        console.log(err.response);
      }
    }
  };

  // on mount
  //   useEffect(() => {
  //     // search for Wled devices in local network
  //     findWled();
  //   }, []);

  // get effect and palette list
  useEffect(() => {
    if (Object.keys(wledDevices).length > 0) {
      if (effects.length === 0)
        getWledEffects(Object.keys(wledDevices)[0]).then((effs) =>
          setEffects(effs),
        );
      if (palettes.length === 0)
        getWledPalettes(Object.keys(wledDevices)[0]).then((pals) =>
          setPalettes(pals),
        );
    }
  }, [wledDevices]);

  return (
    <div className="devices-grouping  rounded-l-lg border border-r-0 border-white">
      <h1>WLED Finder</h1>

      <button onClick={findWled}>Find</button>

      {Object.keys(wledDevices).length > 0 ? (
        <div>
          {Object.entries(wledDevices).map(([ip, device]) => (
            <WledDevice
              key={ip}
              device={device}
              effects={effects}
              palettes={palettes}
            />
          ))}
        </div>
      ) : (
        <div>No WLED devices</div>
      )}
    </div>
  );
}
