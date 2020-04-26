import { combineReducers } from "redux";
import { palmIslandReducer } from "./palmIslandReducer";
import { gameLogReducer } from "./gameLogReducer";

export const combinedReducers = combineReducers({ palmIslandReducer, gameLogReducer });
