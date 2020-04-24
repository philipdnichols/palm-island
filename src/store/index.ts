import { applyMiddleware, createStore, Store } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import { PalmIslandAction } from "../actions";
import { testAfterMiddleware, testBeforeMiddleware } from "../middleware";
import { PalmIslandState, rootReducer } from "../reducers";
import { watcherSaga } from "../sagas";

const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

// TODO create combined reducer
export const store: Store<PalmIslandState, PalmIslandAction> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(testBeforeMiddleware, testAfterMiddleware, sagaMiddleware, testAfterMiddleware)),
);

sagaMiddleware.run(watcherSaga);
