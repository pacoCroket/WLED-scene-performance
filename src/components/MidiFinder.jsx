import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WebMidi from 'webmidi';
import { setMidiInputDevice, setMidiOutputDevice } from '../store/actions';
import Modal from './Modal';

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
        <Modal header="MIDI Devices" closeModal={() => setShowModal(false)}>
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
        </Modal>
      )}
    </>
  );
}
