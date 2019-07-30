import reducer from './reducers';
import { AnyAction, applyMiddleware, createStore, Dispatch, Middleware } from 'redux';

const actionToPlainObject: Middleware = <S extends AnyAction>() => (next: Dispatch<S>) =>
  <A extends S>(action: A) => next({...action as object} as A);

// we could import pre-hydrated data as the second param here
export const store = createStore(
  reducer,
  // support for devtools extension
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(actionToPlainObject)
);
