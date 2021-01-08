import { SET_LOCAL_IP } from './actions';

const initState = {
  localIp: '192.168.0.1',
};

export function reducer(state = initState, action) {
  console.log(action);
  switch (action.type) {
    case SET_LOCAL_IP:
      return { ...state, localIp: action.ip };
    default:
      return state;
  }
}
