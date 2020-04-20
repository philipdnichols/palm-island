type CounterActionType = "INCREMENT" | "DECREMENT" | "RESET";

export interface CounterAction {
  type: CounterActionType;
}

export function increment(): CounterAction {
  return {
    type: "INCREMENT",
  };
}

export function decrement(): CounterAction {
  return {
    type: "DECREMENT",
  };
}

export function reset(): CounterAction {
  return {
    type: "RESET",
  };
}
