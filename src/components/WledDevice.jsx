import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ledControl } from '../contants/wledHttpApi';
import { sendRequest } from '../http/wledHandler';
import { setControlGroup, setWledDevice } from '../store/actions';

export default function WledDevice({ device, effects, palettes }) {
  const [selEffect, setSelEffect] = useState(0);
  const [selPalette, setSelPalette] = useState(0);
  const controlGroups = useSelector((store) => store.controlGroups);
  const controlGroupsCount = Object.keys(controlGroups).length;
  const dispatch = useDispatch();
  const { ip, name } = device;

  const setGroup = (controlGroupId) => {
    // do nothing if already in this group
    if (controlGroupId === device.controlGroupId || !controlGroupId >= 0)
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
    <>
      <span>{name}</span>
      {/* Group */}
      <select
        name="group"
        className="bg-gray-500"
        id="group"
        onChange={(e) =>
          Number.parseInt(
            setGroup(e.target.options[e.target.selectedIndex].value),
          )
        }
      >
        {device.controlGroupId === null && (
          <option value={null} className="active">
            No group
          </option>
        )}
        {Object.values(controlGroups).map((controlGroup, index) => (
          <option
            value={index}
            key={index}
            className={
              controlGroup.id === device.controlGroupId ? 'active' : ''
            }
          >
            Group {controlGroup.id + 1}
          </option>
        ))}
        <option value={controlGroupsCount}>
          New Group ({controlGroupsCount})
        </option>
      </select>
    </>
  );
}
