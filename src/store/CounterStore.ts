import { Store, createStore } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import { CounterState, rootReducer } from "../reducers/CounterReducer";
import { CounterAction } from "../actions/CounterActions";

export const store: Store<CounterState, CounterAction> = createStore(
  rootReducer,
  composeWithDevTools(),
);
