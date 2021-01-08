import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ledControl } from '../contants/wledHttpApi';
import {
  getWledInfo,
  sendRequest,
  getWledEffects,
  getWledPalettes,
} from '../http/wledHandler';

export default function WledFinder() {
  const [ipMap, setIpMap] = useState();
  const [response, setResponse] = useState('');
  const [effects, setEffects] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const localIp = useSelector((store) => store.localIp);

  useEffect(() => {
    console.log(localIp);
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
            setIpMap((ipMap) => ({ ...ipMap, [ip]: { ...body, ip } }));
            console.log(ip, 'success');
            getWledDeviceJsonInfo(ip);
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
    if (ipMap && Object.keys(ipMap).length > 0) {
      if (effects.length === 0)
        getWledEffects(Object.keys(ipMap)[0]).then((effs) => setEffects(effs));
      if (palettes.length === 0)
        getWledPalettes(Object.keys(ipMap)[0]).then((pals) =>
          setPalettes(pals),
        );
    }
  }, [ipMap]);

  const getWledDeviceJsonInfo = (ip) => {
    setResponse('');
    getWledInfo(ip).then((res) => setResponse(JSON.stringify(res)));
  };

  return (
    <div className="center">
      <h1>WLED Finder</h1>

      <button onClick={findWled}>Find</button>

      {ipMap ? (
        <div>
          {Object.entries(ipMap).map(([ip, device]) => (
            <WledDevice
              ip={ip}
              key={ip}
              device={device}
              getWledDeviceJsonInfo={getWledDeviceJsonInfo}
              effects={effects}
              palettes={palettes}
            />
          ))}
        </div>
      ) : (
        <div>No WLED devices</div>
      )}
      <h3>Response</h3>
      <div>
        <div
          style={{ backgroundColor: '#282c34', margin: '1em', padding: '1em' }}
        >
          <code style={{ color: 'white', backgroundColor: 'transparent' }}>
            {response}
          </code>
        </div>
      </div>
    </div>
  );
}

const WledDevice = ({
  ip,
  device,
  getWledDeviceJsonInfo,
  effects,
  palettes,
}) => {
  const [selEffect, setSelEffect] = useState(0);
  const [selPalette, setSelPalette] = useState(0);

  const setWled = (ip) => {
    console.log({ selEffect, selPalette });
    sendRequest(ip, ledControl.effectIndex.param, selEffect).then(console.log);
    sendRequest(ip, ledControl.paletteIndex.param, selPalette).then(
      console.log,
    );
  };

  return (
    <div className="flex" style={{ marginTop: '1em' }}>
      {device.name} - {ip}{' '}
      <button
        onClick={() => {
          getWledDeviceJsonInfo(ip);
        }}
      >
        getInfo
      </button>
      {/* Effects */}
      <select
        name="effects"
        id="effects"
        onChange={(e) =>
          setSelEffect(
            Number.parseInt(e.target.options[e.target.selectedIndex].value),
          )
        }
      >
        {effects.map((eff, index) => (
          <option value={index}>
            {index} - {eff}
          </option>
        ))}
      </select>
      {/* Palettes */}
      <select
        name="palettes"
        id="palettes"
        onChange={(e) =>
          setSelPalette(
            Number.parseInt(e.target.options[e.target.selectedIndex].value),
          )
        }
      >
        {palettes.map((pal, index) => (
          <option value={index}>
            {index} - {pal}
          </option>
        ))}
      </select>
      <button onClick={() => setWled(ip)}>Set</button>
    </div>
  );
};
