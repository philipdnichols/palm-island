import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { DISCARD_TOP_CARD, PalmIslandAction, PERFORM_ACTION } from "../actions";
import { atMaxResourceLimit, checkHasEnoughResourcesToCoverActionCost } from "../game/logic";
import { PalmIslandState } from "../reducers";

export const testAfterMiddleware: Middleware<{}, PalmIslandState, Dispatch<PalmIslandAction>> = () => {
  return (next: Dispatch<PalmIslandAction>) => {
    return (action: PalmIslandAction): void => {
      next(action);

      if (action.type === DISCARD_TOP_CARD) {
        // console.log("my middleware after action");
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
        // console.log("my middleware before action");
        if (api.getState().cards[0].isRoundMarker) {
          // console.log("cannot discard round marker card");
          return;
        }
      } else if (action.type === PERFORM_ACTION) {
        // console.log("testing if action paid for");
        if (action.cardAction) {
          if (
            !checkHasEnoughResourcesToCoverActionCost(api.getState().cards, action.cardAction, action.actionPayment)
          ) {
            // console.log("card action not paid for!");
            return;
          }
          if (
            action.cardAction.cost === "free" &&
            atMaxResourceLimit(api.getState().cards) &&
            !action.actionedCard?.isRoundMarker &&
            action.actionPayment?.length === 0
          ) {
            // console.log("at max resource limit");
            return;
          }
        }
      }

      next(action);
    };
  };
};
