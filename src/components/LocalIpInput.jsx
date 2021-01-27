import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLocalIp } from '../store/actions';

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
        <div
          className="modal fade"
          id="localIpModal"
          tab-index="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Set IPv4 local address
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-center">
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSetIp()}
                  />
                  <button onClick={handleSetIp}>Set IP</button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
