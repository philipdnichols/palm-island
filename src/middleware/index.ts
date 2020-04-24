import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { DISCARD_TOP_CARD, PalmIslandAction, PERFORM_ACTION } from "../actions";
import { checkHasEnoughResourcesToCoverActionCost } from "../game/logic";
import { PalmIslandState } from "../reducers";

export const testAfterMiddleware: Middleware<{}, PalmIslandState, Dispatch<PalmIslandAction>> = () => {
  return (next: Dispatch<PalmIslandAction>) => {
    return (action: PalmIslandAction): void => {
      next(action);

      if (action.type === DISCARD_TOP_CARD) {
        console.log("my middleware after action");
      }
    };
  };
};

export const testBeforeMiddleware: Middleware<{}, PalmIslandState, Dispatch<PalmIslandAction>> = (
  api: MiddlewareAPI<Dispatch<PalmIslandAction>, PalmIslandState>,
) => {
  return (next: Dispatch<PalmIslandAction>) => {
    return (action: PalmIslandAction): void => {
      if (action.type === DISCARD_TOP_CARD) {
        console.log("my middleware before action");
      } else if (action.type === PERFORM_ACTION) {
        console.log("testing if action paid for");
        if (
          action.cardAction &&
          !checkHasEnoughResourcesToCoverActionCost(api.getState().cards, action.cardAction, action.actionPayment)
        ) {
          console.log("card action not paid for!");
          return;
        }
      }

      next(action);
    };
  };
};
