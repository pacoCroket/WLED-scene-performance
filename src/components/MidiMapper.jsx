import React, { useState } from 'react';
import RotaryControl from './RotaryControl';

export default function MidiMapper() {
  const [speed, setSpeed] = useState(0);
  return (
    <div>
      <h1>Midi Mapper</h1>
      <div>
        <span>Group 1</span>
        <div>
          <span>Speed</span>
          <RotaryControl value={speed} onChange={setSpeed} />
        </div>
      </div>
    </div>
  );
}
