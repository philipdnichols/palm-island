import { CounterAction } from "../actions/CounterActions";

export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

export const rootReducer = (
  state: CounterState = initialState,
  action: CounterAction,
): CounterState => {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    case "DECREMENT":
      return {
        count: state.count - 1,
      };

    case "RESET":
      return {
        count: 0,
      };

    default:
      return state;
  }
};
