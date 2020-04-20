import { takeEvery, select, put } from "redux-saga/effects";
import { DISCARD_TOP_CARD, discardTopCard } from "../actions";
import { PalmIslandCard } from "../constants/Cards";
import { cardsSelector, roundSelector } from "../selectors";

function* checkIfTopCardIsNextRoundCard(): Generator {
  console.log("checkIfTopCardIsNextRoundCard");

  const cards: PalmIslandCard[] = (yield select(
    cardsSelector,
  )) as PalmIslandCard[];

  if (cards[0].isRoundMarker) {
    const round: number = (yield select(roundSelector)) as number;
    if (round === 8) {
      console.log("game over!");
    } else {
      console.log("round over!");
      //yield put(discardTopCard());
    }
  }
}

export function* watcherSaga(): Generator {
  yield takeEvery(DISCARD_TOP_CARD, checkIfTopCardIsNextRoundCard);
}
