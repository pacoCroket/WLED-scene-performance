import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WebMidi from 'webmidi';
import { setMidiInputDevice, setMidiOutputDevice } from '../store/actions';

export default function MidiFinder() {
  const [showModal, setShowModal] = useState(false);
  const inputMidiDevices = useSelector((store) => store.inputMidiDevices);
  const outputMidiDevices = useSelector((store) => store.outputMidiDevices);
  const dispatch = useDispatch();

  useEffect(() => {
    WebMidi.enable(function (err) {
      if (err) {
        console.log('WebMidi could not be enabled.', err);
      } else {
        console.log('WebMidi enabled!');
        findMidi();
      }
    });
  }, []);

  const findMidi = () => {
    console.log(WebMidi.inputs);
    [...WebMidi.inputs].forEach((it) => dispatch(setMidiInputDevice(it)));
    [...WebMidi.outputs].forEach((it) => dispatch(setMidiOutputDevice(it)));

    // Listen to control change message on all channels
    if (WebMidi.inputs.length > 0) {
      const firstMidiDevice = WebMidi.inputs[0];
      firstMidiDevice.addListener('controlchange', 'all', function (e) {
        console.log("Received 'controlchange' message.", {
          channel: e.channel,
          number: e.controller.number,
          value: e.value,
        });
      });
      firstMidiDevice.addListener('noteon', 'all', function (e) {
        console.log(
          "Received 'noteon' message (" + e.note.name + e.note.octave + ').',
        );
      });
    }
  };

  const allDevices = [
    ...Object.values(inputMidiDevices),
    ...Object.values(outputMidiDevices),
  ];

  return (
    <>
      <button
        className="p-1 my-2 bg-indigo-800 hover:bg-indigo-600 rounded w-16"
        onClick={() => setShowModal(!showModal)}
      >
        MIDI Devices
      </button>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-hidden">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Deactivate account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed. This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  MIDI Devices
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="">
                  <button onClick={findMidi}>Find</button>
                  {allDevices.length > 0 ? (
                    <div>
                      {allDevices.map((device, index) => (
                        <div key={index} className="flex">
                          <p>
                            {device.type} - {device.name} - {device.state}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No MIDI devices</div>
                  )}
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
          </div> */}
        </div>
      )}
    </>
  );
}
