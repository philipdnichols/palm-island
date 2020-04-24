import produce from "immer";
import { Reducer } from "redux";
import { PalmIslandAction } from "../actions";
import { BLUE_CARDS, BLUE_ROUND_MARKER_CARD, PalmIslandCard, shuffle } from "../constants/Cards";
import { getResultingOrientationForAction } from "../game/logic";

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

export const rootReducer: Reducer<PalmIslandState, PalmIslandAction> = produce(
  (draft: PalmIslandState, action: PalmIslandAction) => {
    if (draft) {
      switch (action.type) {
        case "DISCARD_TOP_CARD": {
          console.log("discard top card reducer");
          const { cards } = draft;
          const discardedCard: PalmIslandCard = cards.splice(0, 1)[0];
          cards.push(discardedCard);
          break;
        }

        case "PERFORM_ACTION": {
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

          cards.push(actionedCard);
          break;
        }

        default:
      }
    }
    return draft;
  },
  initialState,
);

// export const rootReducer = (
//   state: PalmIslandState = initialState,
//   action: PalmIslandAction,
// ): PalmIslandState => {
//   switch (action.type) {
//     // case "NEW_GAME":
//     //   return {
//     //     phase: "SETUP",
//     //     resources: 0,
//     //   };

//     // case "START_GAME":
//     //   return {
//     //     phase: "CARD_DECISION",
//     //     resources: state.resources + 1,
//     //   };
//     case "DISCARD_TOP_CARD": {
//       console.log("discard top card reducer");
//       // const { cards } = state;
//       // const discardedCard: PalmIslandCard = cards.splice(0, 1)[0];

//       return produce(state, (draftState: PalmIslandState) => {
//         const { cards } = draftState;
//         const discardedCard: PalmIslandCard = cards.splice(0, 1)[0];
//         cards.push(discardedCard);
//       });
//       // return { ...state, cards: [...cards, discardedCard] };
//     }

//     case "PERFORM_ACTION": {
//       const { cards } = state;
//       const index: number = cards.findIndex(
//         (card: PalmIslandCard) => card.id === action.actionedCard?.id,
//       );
//       const actionedCard: PalmIslandCard = cards.splice(index, 1)[0];

//       switch (action.cardAction?.actionType) {
//         case "store":
//           actionedCard.isStored = true;
//           break;

//         case "rotate":
//         case "flip": {
//           actionedCard.activeOrientation = getOrientationForAction(
//             action.cardAction.actionType,
//             actionedCard.activeOrientation,
//           );
//           break;
//         }

//         default:
//       }
//       return { ...state, cards: [...cards, actionedCard] };
//     }

//     default:
//       return state;
//   }
// };
