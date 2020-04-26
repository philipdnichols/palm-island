import { PalmIslandCard, PalmIslandCardAreaAction } from "../constants/Cards";

export const NEW_GAME = "PalmIsland::NEW_GAME";
export const END_GAME = "PalmIsland::END_GAME";
export const DISCARD_TOP_CARD = "PalmIsland::DISCARD_TOP_CARD";
export const PERFORM_ACTION = "PalmIsland::PERFORM_ACTION";

type PalmIslandActionType =
  | "PalmIsland::NEW_GAME"
  | "PalmIsland::END_GAME"
  | "PalmIsland::DISCARD_TOP_CARD"
  | "PalmIsland::PERFORM_ACTION";

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
