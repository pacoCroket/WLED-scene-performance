import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLocalIp } from '../store/actions';
import Modal from './Modal';

export default function LocalIpInput() {
  const [showModal, setShowModal] = useState(false);
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
    <>
      <button
        className="p-1 my-2 bg-indigo-800 hover:bg-indigo-600 rounded w-16"
        onClick={() => setShowModal(!showModal)}
      >
        Local IP
      </button>

      {showModal && (
        <Modal header="Set local IP" closeModal={() => setShowModal(false)}>
          <div className="flex">
            <input
              type="text"
              className="flex-1"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetIp()}
            />
            <button className="flex-1" onClick={handleSetIp}>
              Set IP
            </button>
          </div>
          <div className="mt-5">
            <a
              className="text-blue-400 hover:underline"
              href="https://lifehacker.com/how-to-find-your-local-and-external-ip-address-5833108#:~:text=Open%20up%20the%20Command%20Prompt,is%20your%20local%20IP%20address."
              target="_blank"
            >
              How to find your local IP
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
