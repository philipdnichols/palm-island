import produce from "immer";
import { Reducer } from "redux";
import { PalmIslandAction } from "../actions/palmIslandActions";
import { BLUE_CARDS, BLUE_ROUND_MARKER_CARD, PalmIslandCard, shuffle } from "../constants/Cards";
import { getResultingOrientationForAction } from "../game/logic";

export type PalmIslandPhase = "PLAYING" | "GAME_OVER";

export interface PalmIslandState {
  phase: PalmIslandPhase;
  round: number;
  cards: PalmIslandCard[];
}

function initialState(): PalmIslandState {
  return {
    phase: "PLAYING",
    round: 1,
    cards: [...shuffle(BLUE_CARDS), BLUE_ROUND_MARKER_CARD],
  };
}

export const palmIslandReducer: Reducer<PalmIslandState, PalmIslandAction> = produce(
  (draft: PalmIslandState, action: PalmIslandAction) => {
    // if (draft) {
    switch (action.type) {
      case "PalmIsland::NEW_GAME":
        draft = initialState();
        break;

      case "PalmIsland::END_GAME":
        draft.phase = "GAME_OVER";
        draft.cards.forEach((card: PalmIslandCard) => {
          card.isStored = false;
        });
        break;

      case "PalmIsland::DISCARD_TOP_CARD": {
        // console.log("discard top card reducer");
        const { cards } = draft;
        const discardedCard: PalmIslandCard = cards.splice(0, 1)[0];

        discardedCard.isStored = false;

        cards.push(discardedCard);
        break;
      }

      case "PalmIsland::PERFORM_ACTION": {
        const { cards } = draft;
        // TODO change to just pass the card id not the whole entire card
        // payment too
        const { actionedCard: ac, cardAction, actionPayment } = action;
        const index: number = cards.findIndex((card: PalmIslandCard) => card.id === ac?.id);
        const actionedCard: PalmIslandCard = cards.splice(index, 1)[0];

        if (actionPayment) {
          actionPayment.forEach((paymentCard: PalmIslandCard) => {
            const i: number = cards.findIndex((card: PalmIslandCard) => card.id === paymentCard.id);
            cards[i].isStored = false;
          });
        }

        switch (cardAction?.actionType) {
          case "store":
            actionedCard.isStored = true;
            break;

          case "rotate":
          case "flip": {
            actionedCard.activeOrientation = getResultingOrientationForAction(
              cardAction.actionType,
              actionedCard.activeOrientation,
            );
            break;
          }

          default:
        }

        if (actionedCard.isRoundMarker) {
          draft.round++;
        }

        cards.push(actionedCard);
        break;
      }

      default:
    }
    // }
    return draft;
  },
  initialState(),
);
