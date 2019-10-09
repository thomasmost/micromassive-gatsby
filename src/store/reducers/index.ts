import { combineReducers } from 'redux';

import { simulationReducer } from "./simulation.reducer";

export interface IAppStateContainer {
  simulation: ReturnType<typeof simulationReducer>;
}

export const stateReducer = simulationReducer;
