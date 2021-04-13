import React, { useState } from 'react';
import { ledControl } from '../contants/wledHttpApi';
import { sendJsonRequest, sendRequest } from '../http/wledHandler';

export default function ControlGroup({ controlGroup, groupDevices }) {
  const [brightness, setBrightness] = useState(127);
  const [speed, setSpeed] = useState(127);
  const [intensity, setIntensity] = useState(127);

  const handleBriChange = (brightness) => {
    console.log(brightness);
    groupDevices.forEach((device) => {
      sendRequest(device.ip, ledControl.masterBrightness.param, brightness);
    });
    setBrightness(brightness);
  };
  const handleSpeedChange = (speed) => {
    // const payload = { seg: [{ sx: speed }] };
    // groupDevices.forEach((device) => {
    //   sendJsonRequest(device.ip, payload);
    // });
    groupDevices.forEach((device) => {
      sendRequest(device.ip, ledControl.effectSpeed.param, speed);
    });
    setSpeed(speed);
  };
  const handleIntensityChange = (intensity) => {
    // const payload = { seg: [{ ix: intensity }] };
    // groupDevices.forEach((device) => {
    //   sendJsonRequest(device.ip, payload);
    // });
    groupDevices.forEach((device) => {
      sendRequest(device.ip, ledControl.effectIntensity.param, intensity);
    });
    setIntensity(intensity);
  };
  const handleCancelUDP = () => {
    const payload = {
      udpn: {
        send: false,
        recv: false,
      },
    };
    groupDevices.forEach((device) => {
      sendJsonRequest(device.ip, payload);
    });
  };

  return (
    <div className="mb-8 rounded border border-white">
      <div className="flex justify-center">
        <h4>{`Group ${controlGroup.id + 1}`}</h4>
        <button className="float-right" onClick={handleCancelUDP}>
          Cancel UDP
        </button>
      </div>
      <div className="flex flex-wrap align-center justify-center p-4 border-t border-grey">
        {Object.values(groupDevices).map((wledDevice) => (
          <div
            key={wledDevice.ip}
            className="mx-3 my-2 py-1 px-2 bg-opacity-50 bg-gray-500 rounded"
          >
            {wledDevice.name} - {wledDevice.ip}
          </div>
        ))}
      </div>

      <div className="flex align-center justify-center p-4 border-t border-grey">
        <GroupControl
          headline="Brightness"
          onChange={handleBriChange}
          value={brightness}
        />
        <GroupControl
          headline="FX Speed"
          onChange={handleSpeedChange}
          value={speed}
        />
        <GroupControl
          headline="FX Intensity"
          onChange={handleIntensityChange}
          value={intensity}
        />
      </div>
    </div>
  );
}

const controlStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '2em',
  marginRight: '2em',
};

function GroupControl({ headline, value, onChange }) {
  return (
    <div style={controlStyle}>
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>
        {headline} [{value}]
      </span>
    </div>
  );
}
