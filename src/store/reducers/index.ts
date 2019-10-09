import { combineReducers } from 'redux';

import { simulationReducer } from "./simulation.reducer";

export interface IAppStateContainer {
  simulation: ReturnType<typeof simulationReducer>;
}

// eslint-disable-next-line no-restricted-syntax
export const stateReducer = simulationReducer;