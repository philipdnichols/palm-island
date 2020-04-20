export const NEW_GAME = "NEW_GAME";
export const START_GAME = "START_GAME";
export const NEW_ROUND = "NEW_ROUND";
export const DISCARD_TOP_CARD = "DISCARD_TOP_CARD";

type PalmIslandActionType =
  | "NEW_GAME"
  | "START_GAME"
  | "NEW_ROUND"
  | "DISCARD_TOP_CARD";

export interface PalmIslandAction {
  type: PalmIslandActionType;
}

export function newGame(): PalmIslandAction {
  return {
    type: NEW_GAME,
  };
}

export function startGame(): PalmIslandAction {
  return {
    type: START_GAME,
  };
}

export function newRound(): PalmIslandAction {
  return {
    type: NEW_ROUND,
  };
}

export function discardTopCard(): PalmIslandAction {
  return {
    type: DISCARD_TOP_CARD,
  };
}
