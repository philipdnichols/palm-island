import { Selector } from "react-redux";
import { CombinedState } from "redux";
import { PalmIslandCard } from "../constants/Cards";
import { PalmIslandPhase, PalmIslandState } from "../reducers/palmIslandReducer";
import { GameLogState } from "../reducers/gameLogReducer";

export const cardsSelector: Selector<
  CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
  PalmIslandCard[]
> = (state: CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>): PalmIslandCard[] =>
  state.palmIslandReducer.cards;

export const roundSelector: Selector<
  CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
  number
> = (state: CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>): number =>
  state.palmIslandReducer.round;

export const phaseSelector: Selector<
  CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
  PalmIslandPhase
> = (state: CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>): PalmIslandPhase =>
  state.palmIslandReducer.phase;
