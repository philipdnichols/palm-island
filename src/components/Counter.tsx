import React, { ReactElement, Dispatch } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  reset,
  CounterAction,
} from "../actions/CounterActions";
import { CounterState } from "../reducers/CounterReducer";

export function Counter(): ReactElement | null {
  const count: number = useSelector((state: CounterState) => state.count);
  const dispatch: Dispatch<CounterAction> = useDispatch<
    Dispatch<CounterAction>
  >();

  function handleIncrement(): void {
    dispatch(increment());
  }

  function handleDecrement(): void {
    dispatch(decrement());
  }

  function handleReset(): void {
    dispatch(reset());
  }

  function renderCounter(): ReactElement | null {
    return (
      <div>
        <h2>Counter</h2>
        <div>
          <button type="button" onClick={handleDecrement}>
            -
          </button>
          <span>{count}</span>
          <button type="button" onClick={handleIncrement}>
            +
          </button>
        </div>
        <div>
          <button type="button" onClick={handleReset}>
            RESET
          </button>
        </div>
      </div>
    );
  }

  return renderCounter();
}
