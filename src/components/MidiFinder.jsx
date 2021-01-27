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
        MIDI
      </button>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-hidden">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowModal(!showModal)}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium"
                      id="modal-headline"
                    >
                      MIDI Devices
                    </h3>
                    <div className="mt-2">
                      <div className="">
                        <button
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={findMidi}
                        >
                          Find
                        </button>
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
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {/* <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Deactivate
                </button> */}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(!showModal)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
