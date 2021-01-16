import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WebMidi from 'webmidi';
import { setMidiInputDevice, setMidiOutputDevice } from '../store/actions';

export default function MidiFinder() {
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
    <div className="">
      <h1>MIDI Finder</h1>
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
  );
}
