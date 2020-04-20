import { Dispatch, Middleware } from "redux";
import { DISCARD_TOP_CARD, PalmIslandAction } from "../actions";
import { PalmIslandState } from "../reducers";

export const testAfterMiddleware: Middleware<
  {},
  PalmIslandState,
  Dispatch<PalmIslandAction>
> = () => {
  return (next: Dispatch<PalmIslandAction>) => {
    return (action: PalmIslandAction): void => {
      next(action);

      if (action.type === DISCARD_TOP_CARD) {
        console.log("my middleware after action");
      }
    };
  };
};

export const testBeforeMiddleware: Middleware<
  {},
  PalmIslandState,
  Dispatch<PalmIslandAction>
> = () => {
  return (next: Dispatch<PalmIslandAction>) => {
    return (action: PalmIslandAction): void => {
      if (action.type === DISCARD_TOP_CARD) {
        console.log("my middleware before action");
      }

      next(action);
    };
  };
};
