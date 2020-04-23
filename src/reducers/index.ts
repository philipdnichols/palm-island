import { PalmIslandAction } from "../actions";
import {
  BLUE_CARDS,
  BLUE_ROUND_MARKER_CARD,
  PalmIslandCard,
  shuffle,
} from "../constants/Cards";
import { getOrientationForAction } from "../game/logic";

export type PalmIslandPhase = "SETUP" | "CARD_DECISION";

export interface PalmIslandState {
  phase: PalmIslandPhase;
  round: number;
  cards: PalmIslandCard[];
}

const initialState: PalmIslandState = {
  phase: "SETUP",
  round: 1,
  cards: [...shuffle(BLUE_CARDS), BLUE_ROUND_MARKER_CARD],
  // cards: [...BLUE_CARDS, BLUE_ROUND_MARKER_CARD],
};

export const rootReducer = (
  state: PalmIslandState = initialState,
  action: PalmIslandAction,
): PalmIslandState => {
  switch (action.type) {
    // case "NEW_GAME":
    //   return {
    //     phase: "SETUP",
    //     resources: 0,
    //   };

    // case "START_GAME":
    //   return {
    //     phase: "CARD_DECISION",
    //     resources: state.resources + 1,
    //   };
    case "DISCARD_TOP_CARD": {
      console.log("discard top card reducer");
      const { cards } = state;
      const discardedCard: PalmIslandCard = cards.splice(0, 1)[0];
      return { ...state, cards: [...cards, discardedCard] };
    }

    case "PERFORM_ACTION": {
      const { cards } = state;
      const index: number = cards.findIndex(
        (card: PalmIslandCard) => card.id === action.actionedCard?.id,
      );
      const actionedCard: PalmIslandCard = cards.splice(index, 1)[0];

      switch (action.cardAction?.actionType) {
        case "store":
          actionedCard.isStored = true;
          break;

        case "rotate":
        case "flip": {
          actionedCard.activeOrientation = getOrientationForAction(
            action.cardAction.actionType,
            actionedCard.activeOrientation,
          );
          break;
        }

        default:
      }
      return { ...state, cards: [...cards, actionedCard] };
    }

    default:
      return state;
  }
};
