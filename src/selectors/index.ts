import { Selector } from "react-redux";
import { PalmIslandCard } from "../constants/Cards";
import { PalmIslandPhase, PalmIslandState } from "../reducers";

export const cardsSelector: Selector<PalmIslandState, PalmIslandCard[]> = (state: PalmIslandState): PalmIslandCard[] =>
  state.cards;

export const roundSelector: Selector<PalmIslandState, number> = (state: PalmIslandState): number => state.round;

export const phaseSelector: Selector<PalmIslandState, PalmIslandPhase> = (state: PalmIslandState): PalmIslandPhase =>
  state.phase;
