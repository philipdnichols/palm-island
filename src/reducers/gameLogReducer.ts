import produce from "immer";
import { Reducer } from "redux";
import { GameLog, GameLogAction } from "../actions/gameLogActions";

export interface GameLogState {
  logs: GameLog[];
}

const initialState: GameLogState = {
  logs: [],
};

export const gameLogReducer: Reducer<GameLogState, GameLogAction> = produce(
  (draft: GameLogState, action: GameLogAction) => {
    switch (action.type) {
      case "GameLog::CLEAR_LOG":
        draft.logs = [];
        break;

      case "GameLog::ADD_LOG":
        if (action.payload?.log) {
          draft.logs.push(action.payload?.log);
        }
        break;

      default:
    }
    return draft;
  },
  initialState,
);
