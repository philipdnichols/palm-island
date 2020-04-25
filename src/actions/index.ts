import { PalmIslandCard, PalmIslandCardAreaAction } from "../constants/Cards";

export const NEW_GAME = "NEW_GAME";
export const END_GAME = "END_GAME";
export const DISCARD_TOP_CARD = "DISCARD_TOP_CARD";
export const PERFORM_ACTION = "PERFORM_ACTION";

type PalmIslandActionType = "NEW_GAME" | "END_GAME" | "DISCARD_TOP_CARD" | "PERFORM_ACTION";

export interface PalmIslandAction {
  type: PalmIslandActionType;
  actionedCard?: PalmIslandCard;
  cardAction?: PalmIslandCardAreaAction;
  actionPayment?: PalmIslandCard[];
}

export function newGame(): PalmIslandAction {
  return {
    type: NEW_GAME,
  };
}

export function endGame(): PalmIslandAction {
  return {
    type: END_GAME,
  };
}

export function discardTopCard(): PalmIslandAction {
  return {
    type: DISCARD_TOP_CARD,
  };
}

export function performAction(
  card: PalmIslandCard,
  action: PalmIslandCardAreaAction,
  payment: PalmIslandCard[],
): PalmIslandAction {
  return {
    type: PERFORM_ACTION,
    actionedCard: card,
    cardAction: action,
    actionPayment: payment,
  };
}
