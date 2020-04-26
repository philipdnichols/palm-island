import { v4 as uuidv4 } from "uuid";
import moment from "moment"; // For version 5

export const CLEAR_LOG: string = "GameLog::CLEAR_LOG";
export const ADD_LOG: string = "GameLog::ADD_LOG";

export type GameLogActionType = "GameLog::CLEAR_LOG" | "GameLog::ADD_LOG";

export interface GameLog {
  id: string;
  log: string;
  timestamp: number;
}

export interface GameLogAddLogActionPayload {
  log: GameLog;
}

export type GameLogActionPayloadType = GameLogAddLogActionPayload;

export interface GameLogAction {
  type: GameLogActionType;
  payload?: GameLogActionPayloadType;
}

export function clearLog(): GameLogAction {
  return {
    type: "GameLog::CLEAR_LOG",
  };
}

export function addLog(log: string): GameLogAction {
  return {
    type: "GameLog::ADD_LOG",
    payload: {
      log: {
        id: uuidv4(),
        log,
        timestamp: moment().unix(),
      },
    },
  };
}
