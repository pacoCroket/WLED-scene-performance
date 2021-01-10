import React from 'react';
import { useSelector } from 'react-redux';

export default function ControlGroups() {
  const controlGroups = useSelector((store) => store.controlGroups);
  const wledDevices = useSelector((store) => store.wledDevices);

  const deviceListStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
  };

  return (
    <div>
      <h1>Control Groups</h1>
      {Object.keys(controlGroups).map((controlGroup) => (
        <div>
          <h4>Group {controlGroup.id + 1}</h4>
          <div style={deviceListStyle}>
            {Object.values(wledDevices)
              .filter((it) => it.controlGroupId === controlGroup.id)
              .map((wledDevice) => (
                <div key={wledDevice.ip}>{wledDevice.name}</div>
              ))}
          </div>
        </div>
      ))}

      <div>
        <h4>No Group</h4>
        <div style={deviceListStyle}>
          {Object.values(wledDevices)
            .filter((it) => it.controlGroupId === undefined)
            .map((wledDevice) => (
              <div key={wledDevice.ip}>{wledDevice.name}</div>
            ))}
        </div>
      </div>
    </div>
  );
}
