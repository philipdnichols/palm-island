import { applyMiddleware, CombinedState, createStore, Store } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import { testAfterMiddleware, testBeforeMiddleware } from "../middleware";
import { watcherSaga } from "../sagas";
import { combinedReducers } from "../reducers";
import { GameLogState } from "../reducers/gameLogReducer";
import { PalmIslandState } from "../reducers/palmIslandReducer";

const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

export const store: Store<CombinedState<{
  palmIslandReducer: PalmIslandState;
  gameLogReducer: GameLogState;
}>> = createStore(
  combinedReducers,
  composeWithDevTools(applyMiddleware(testBeforeMiddleware, testAfterMiddleware, sagaMiddleware)),
);

sagaMiddleware.run(watcherSaga);
