import React from 'react';
import { useSelector } from 'react-redux';
import ControlGroup from './ControlGroup';

export default function ControlGroups() {
  const controlGroups = useSelector((store) => store.controlGroups);
  const wledDevices = useSelector((store) => store.wledDevices);

  const noGroupDevices = Object.values(wledDevices).filter(
    (it) => it.controlGroupId === null,
  );

  return (
    <div className="groups-control">
      <h1>Control Groups</h1>
      {Object.values(controlGroups).map((controlGroup) => {
        const groupDevices = Object.values(wledDevices).filter(
          (it) => it.controlGroupId === controlGroup.id,
        );
        return (
          <ControlGroup
            key={controlGroup.id}
            controlGroup={controlGroup}
            groupDevices={groupDevices}
          />
        );
      })}

      {/* {noGroupDevices.length > 0 && (
        <ControlGroup controlGroup={undefined} groupDevices={noGroupDevices} />
      )} */}
    </div>
  );
}
