import {
  SET_LOCAL_IP,
  SET_MIDI_INPUT,
  SET_MIDI_OUTPUT,
  SET_WLED_DEVICE,
} from './actions';

const initState = {
  localIp: '192.168.0.1',
  inputMidiDevices: {},
  outputMidiDevices: {},
  wledDevices: {},
};

export function reducer(state = initState, action) {
  console.log(action);
  switch (action.type) {
    case SET_LOCAL_IP:
      return { ...state, localIp: action.ip };
    case SET_MIDI_INPUT:
      return {
        ...state,
        inputMidiDevices: {
          ...state.inputMidiDevices,
          [action.midiInputDevice.name]: action.midiInputDevice,
        },
      };
    case SET_MIDI_OUTPUT:
      return {
        ...state,
        outputMidiDevices: {
          ...state.outputMidiDevices,
          [action.midiOutputDevice.name]: action.midiOutputDevice,
        },
      };
    case SET_WLED_DEVICE:
      return {
        ...state,
        wledDevices: {
          ...state.wledDevices,
          [action.wledDevice.ip]: action.wledDevice,
        },
      };
    default:
      return state;
  }
}
