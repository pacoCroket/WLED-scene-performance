export const SET_LOCAL_IP = 'SET_LOCAL_IP';
export const SET_MIDI_INPUT = 'SET_MIDI_INPUT';
export const SET_MIDI_OUTPUT = 'SET_MIDI_OUTPUT';
export const SET_WLED_DEVICE = 'SET_WLED_DEVICE';
export const SET_CONTROL_GROUP = 'SET_CONTROL_GROUP';

export const setLocalIp = (ip) => ({
  type: SET_LOCAL_IP,
  ip,
});

export const setMidiInputDevice = (midiInputDevice) => ({
  type: SET_MIDI_INPUT,
  midiInputDevice,
});

export const setMidiOutputDevice = (midiOutputDevice) => ({
  type: SET_MIDI_OUTPUT,
  midiOutputDevice,
});

export const setWledDevice = (wledDevice) => ({
  type: SET_WLED_DEVICE,
  wledDevice,
});

export const setControlGroup = (controlGroup) => ({
  type: SET_CONTROL_GROUP,
  controlGroup,
});
