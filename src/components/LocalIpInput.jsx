import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLocalIp } from '../store/actions';

export default function LocalIpInput() {
  const [ip, setIp] = useState('');
  const dispatch = useDispatch();

  const handleSetIp = () => {
    dispatch(setLocalIp(localIp));
    setIp('');
  };
  return (
    <div>
      <h3>Local IP input</h3>
      <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} />
      <button onClick={handleSetIp}>Set IP</button>
    </div>
  );
}
