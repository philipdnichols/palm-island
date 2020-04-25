import { put, select, takeEvery } from "redux-saga/effects";
import { DISCARD_TOP_CARD, discardTopCard, endGame, PERFORM_ACTION } from "../actions";
import { PalmIslandCard } from "../constants/Cards";
import { cardsSelector, roundSelector } from "../selectors";
import { isGameOver } from "../game/logic";

function* checkIfTopCardIsNextRoundCard(): Generator {
  // console.log("checkIfTopCardIsNextRoundCard");

  const cards: PalmIslandCard[] = (yield select(cardsSelector)) as PalmIslandCard[];
  const round: number = (yield select(roundSelector)) as number;

  if (isGameOver(cards, round)) {
    // console.log("game over!");
    yield put(endGame());
  }
}

function* checkIfTopCardIsStoredResource(): Generator {
  const cards: PalmIslandCard[] = (yield select(cardsSelector)) as PalmIslandCard[];

  if (cards[0].isStored) {
    yield put(discardTopCard());
  }
}

export function* watcherSaga(): Generator {
  yield takeEvery(DISCARD_TOP_CARD, checkIfTopCardIsNextRoundCard);
  yield takeEvery(DISCARD_TOP_CARD, checkIfTopCardIsStoredResource);
  yield takeEvery(PERFORM_ACTION, checkIfTopCardIsStoredResource);
}
