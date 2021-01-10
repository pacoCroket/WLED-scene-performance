import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ledControl } from '../contants/wledHttpApi';
import {
  //   getWledInfo,
  sendRequest,
  getWledEffects,
  getWledPalettes,
} from '../http/wledHandler';
import { setControlGroup, setWledDevice } from '../store/actions';

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
            dispatch(setWledDevice({ ...body, ip }));
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
    <div className="center">
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

const WledDevice = ({ device, effects, palettes }) => {
  const [selEffect, setSelEffect] = useState(0);
  const [selPalette, setSelPalette] = useState(0);
  const controlGroups = useSelector((store) => store.controlGroups);
  const controlGroupsCount = Object.keys(controlGroups).length;
  const dispatch = useDispatch();
  const { ip, name } = device;

  const setGroup = (controlGroupId) => {
    console.log(controlGroupId);
    // do nothing if already in this group
    if (controlGroupId === device.controlGroupId || controlGroupId === null)
      return;

    const updatedDevice = { ...device, controlGroupId };
    // check if this is an existing or new group
    let updatedControlGroup;
    if (controlGroups[controlGroupId]) {
      updatedControlGroup = controlGroups[controlGroupId].ips.push(ip);
    } else {
      updatedControlGroup = { id: controlGroupId, ips: [ip] };
    }
    dispatch(setWledDevice(updatedDevice));
    dispatch(setControlGroup(updatedControlGroup));
  };

  const setWled = (ip) => {
    console.log({ selEffect, selPalette });
    sendRequest(ip, ledControl.effectIndex.param, selEffect).then(console.log);
    sendRequest(ip, ledControl.paletteIndex.param, selPalette).then(
      console.log,
    );
  };

  return (
    <div className="flex" style={{ marginTop: '1em', textAlign: 'start' }}>
      <span style={{ width: '130px' }}>{name}</span>
      {/* Group */}
      <div>
        Group:{' '}
        <select
          name="group"
          id="group"
          onChange={(e) =>
            setGroup(e.target.options[e.target.selectedIndex].value)
          }
        >
          {device.controlGroupId === undefined && (
            <option value={null} class="active">
              No group
            </option>
          )}
          {Object.values(controlGroups).map((controlGroup, index) => (
            <option
              value={index}
              key={index}
              class={controlGroup.id === device.controlGroupId ? 'active' : ''}
            >
              Group {controlGroup.id + 1}
            </option>
          ))}
          <option value={controlGroupsCount}>
            New Group ({controlGroupsCount})
          </option>
        </select>
      </div>
      <span style={{ width: '110px' }}>{ip}</span>
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
          <option value={index} key={index}>
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
          <option value={index} key={index}>
            {index} - {pal}
          </option>
        ))}
      </select>
      <button onClick={() => setWled(ip)}>Set</button>
    </div>
  );
};
