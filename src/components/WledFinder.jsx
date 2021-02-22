import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWledEffects, getWledPalettes } from '../http/wledHandler';
import { setWledDevice } from '../store/actions';
import WledDevice from './WledDevice';
import { CgSpinner } from 'react-icons/cg';

export default function WledFinder() {
  const [effects, setEffects] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const localIp = useSelector((store) => store.localIp);
  const wledDevices = useSelector((store) => store.wledDevices);
  const dispatch = useDispatch();

  useEffect(() => {
    findWled();
  }, [localIp]);

  const findWled = async () => {
    setIsSearching(true);
    console.log('finding Wled devices');
    // range is [0-255] but 0 and 255 are reserved
    const promises = [];
    for (var i = 2; i < 254; i++) {
      try {
        const ipArray = localIp.split('.');
        ipArray.splice(3, 1);
        ipArray.push(i);
        const ip = ipArray.join('.');

        const promise = axios('http://' + ip + '/json/info');

        promises.push(promise); // to keep track of when all promises are done

        // we check the result immediately anyway
        promise.then((res) => {
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
    Promise.all(promises).then((responses) => {
      setIsSearching(false);
    });
  };

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
    <div className="devices-grouping rounded-l-lg border border-r-0 border-white flex flex-col justify-start items-center">
      <h1>WLED Finder</h1>

      <button
        className="p-1 my-2 bg-indigo-800 hover:bg-indigo-600 rounded w-20"
        onClick={findWled}
      >
        <div className="flex justify-between content-center mx-2">
          Find
          <span className="ml-2 align-middle">
            {isSearching && <CgSpinner className="animate-spin" size="1.5em" />}
          </span>
        </div>
      </button>
      <span>
        {wledDevices.length > 0 ? `${wledDevices.length}` : 'No'} WLED devices
      </span>
      {Object.keys(wledDevices).length > 0 && (
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
      )}
    </div>
  );
}
