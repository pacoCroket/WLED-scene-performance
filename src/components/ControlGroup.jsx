import React, { useState } from 'react';
import { ledControl } from '../contants/wledHttpApi';
import { sendRequest } from '../http/wledHandler';

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
    groupDevices.forEach((device) => {
      sendRequest(device.ip, ledControl.effectSpeed.param, speed);
    });
    setSpeed(speed);
  };
  const handleIntensityChange = (intensity) => {
    groupDevices.forEach((device) => {
      sendRequest(device.ip, ledControl.effectIntensity.param, intensity);
    });
    setIntensity(intensity);
  };

  return (
    <div className="mb-8 rounded border border-white">
      <h4>
        {controlGroup !== undefined
          ? `Group ${controlGroup.id + 1}`
          : 'No group'}
      </h4>
      <div className="flex align-center justify-center p-4 border-t border-grey">
        {Object.values(groupDevices).map((wledDevice) => (
          <div key={wledDevice.ip} className="mx-6">
            {wledDevice.name}
          </div>
        ))}
      </div>

      <div className="flex align-center justify-center p-4 border-t border-grey">
        <GroupControl
          headline="Group Bri"
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
