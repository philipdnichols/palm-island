import { PalmIslandAction } from "../actions";
import {
  BLUE_CARDS,
  BLUE_ROUND_MARKER_CARD,
  PalmIslandCard,
  shuffle,
} from "../constants/Cards";

export type PalmIslandPhase = "SETUP" | "CARD_DECISION";

export interface PalmIslandState {
  phase: PalmIslandPhase;
  round: number;
  resources: number;
  cards: PalmIslandCard[];
}

const initialState: PalmIslandState = {
  phase: "SETUP",
  round: 1,
  resources: 0,
  // cards: [...shuffle(BLUE_CARDS), BLUE_ROUND_MARKER_CARD],
  cards: [...BLUE_CARDS, BLUE_ROUND_MARKER_CARD],
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

    default:
      return state;
  }
};
