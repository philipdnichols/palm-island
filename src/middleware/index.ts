import { CombinedState, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { DISCARD_TOP_CARD, PalmIslandAction, PERFORM_ACTION } from "../actions/palmIslandActions";
import { atMaxResourceLimit, checkHasEnoughResourcesToCoverActionCost } from "../game/logic";
import { PalmIslandState } from "../reducers/palmIslandReducer";
import { GameLogState } from "../reducers/gameLogReducer";
import { GameLogAction } from "../actions/gameLogActions";

export const testAfterMiddleware: Middleware<
  {},
  CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
  Dispatch<PalmIslandAction | GameLogAction>
> = () => {
  return (next: Dispatch<PalmIslandAction | GameLogAction>) => {
    return (action: PalmIslandAction | GameLogAction): void => {
      next(action);

      if (action.type === DISCARD_TOP_CARD) {
        // console.log("my middleware after action");
        // api.dispatch(addLog("Player discarded the top card of the deck."));
      }
    };
  };
};

export const testBeforeMiddleware: Middleware<
  {},
  CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
  Dispatch<PalmIslandAction | GameLogAction>
> = (
  api: MiddlewareAPI<
    Dispatch<PalmIslandAction | GameLogAction>,
    CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>
  >,
) => {
  return (next: Dispatch<PalmIslandAction | GameLogAction>) => {
    return (action: PalmIslandAction | GameLogAction): void => {
      if (action.type === DISCARD_TOP_CARD) {
        // console.log("my middleware before action");
        if (api.getState().palmIslandReducer.cards[0].isRoundMarker) {
          // console.log("cannot discard round marker card");
          return;
        }
      } else if (action.type === PERFORM_ACTION) {
        // console.log("testing if action paid for");
        if (action.cardAction) {
          if (
            !checkHasEnoughResourcesToCoverActionCost(
              api.getState().palmIslandReducer.cards,
              action.cardAction,
              action.actionPayment,
            )
          ) {
            // console.log("card action not paid for!");
            return;
          }
          if (
            action.cardAction.cost === "free" &&
            atMaxResourceLimit(api.getState().palmIslandReducer.cards) &&
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
