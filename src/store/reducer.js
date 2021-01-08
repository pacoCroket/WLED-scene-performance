import { SET_LOCAL_IP } from './actions';

const initState = {
  localIp: undefined,
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case SET_LOCAL_IP:
      return { ...state, localIp: action.ip };
    default:
      return state;
  }
}
