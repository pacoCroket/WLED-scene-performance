import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLocalIp } from '../store/actions';

export default function LocalIpInput() {
  const [ip, setIp] = useState('');
  const dispatch = useDispatch();

  const handleSetIp = () => {
    //TODO check validity of input
    if (ip.match(/\d{3}.\d{3}.\d+.\d+/g)) {
      dispatch(setLocalIp(ip));
      setIp('');
    } else {
      alert('The local IP has this form: 192.168.0.1');
    }
  };
  return (
    <div>
      <h3>IPv4 Address (local Ip)</h3>
      <input
        type="text"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSetIp()}
      />
      <button onClick={handleSetIp}>Set IP</button>
    </div>
  );
}
