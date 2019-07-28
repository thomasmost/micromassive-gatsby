import { combineReducers } from 'redux';

import { simulatorReducer } from "./simulator.reducer";

export interface IAppStateContainer {
  simulator: ReturnType<typeof simulatorReducer>;
}

// eslint-disable-next-line no-restricted-syntax
export default combineReducers<IAppStateContainer>({
  simulator: simulatorReducer
});
