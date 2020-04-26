import { Selector } from "react-redux";
import { CombinedState } from "redux";
import { PalmIslandState } from "../reducers/palmIslandReducer";
import { GameLogState } from "../reducers/gameLogReducer";
import { GameLog } from "../actions/gameLogActions";

export const logsSelector: Selector<
  CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
  GameLog[]
> = (state: CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>): GameLog[] =>
  state.gameLogReducer.logs;
