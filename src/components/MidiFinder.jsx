import React, { useEffect, useState } from 'react';
import WebMidi from 'webmidi';

export default function MidiFinder() {
  const [midiDevices, setMidiDevices] = useState([]);

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
    setMidiDevices([...WebMidi.inputs, ...WebMidi.outputs]);
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);

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

  return (
    <div className="center">
      <h1>MIDI Finder</h1>
      <button onClick={findMidi}>Find</button>
      {midiDevices.length > 0 ? (
        <div>
          {midiDevices.map((device, index) => (
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
