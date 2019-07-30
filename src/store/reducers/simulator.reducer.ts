import { INITIALIZE_SIMULATION, SimulatorAction, SHUTDOWN_SIMULATION, PLAY, PAUSE } from "../actions";
import { Reducer } from "react";

interface ISimulatorState {
  initialized: boolean;
  playing: boolean;
  lastClick: number;
}

export const simulatorReducer: Reducer<ISimulatorState, SimulatorAction> =
(state = {
  initialized: false,
  playing: false,
  lastClick: 0
}, action) => {
  switch (action.type) {
    case INITIALIZE_SIMULATION:
      return {...state, initialized: true, lastClick: 0}
    case SHUTDOWN_SIMULATION:
      return {...state, initialized: false}
    case PLAY: {
      if (!state.initialized) {
        return state;
      }
      return {...state, playing: true}
    }
    case PAUSE: {
      if (!state.initialized) {
        return state;
      }
      return {...state, playing: false}
    }
    default:
      return state;
  }
}
