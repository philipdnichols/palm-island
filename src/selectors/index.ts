import { PalmIslandCard } from "../constants/Cards";
import { PalmIslandState } from "../reducers";

export const cardsSelector = (state: PalmIslandState): PalmIslandCard[] => state.cards;

export const roundSelector = (state: PalmIslandState): number => state.round;
