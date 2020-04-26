import { put, select, takeEvery } from "redux-saga/effects";
import {
  DISCARD_TOP_CARD,
  discardTopCard,
  END_GAME,
  endGame,
  NEW_GAME,
  PERFORM_ACTION,
} from "../actions/palmIslandActions";
import { PalmIslandCard } from "../constants/Cards";
import { cardsSelector, roundSelector } from "../selectors/palmIslandSelectors";
import { calculateFinalScore, isGameOver } from "../game/logic";
import { addLog, clearLog } from "../actions/gameLogActions";

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

function* logNewGameAction(): Generator {
  yield put(clearLog());
  yield put(addLog("Player initiated a new game."));
}

function* logEndGameAction(): Generator {
  const cards: PalmIslandCard[] = (yield select(cardsSelector)) as PalmIslandCard[];

  yield put(addLog(`Game over! Final score: ${calculateFinalScore(cards)}`));
}

function* logDiscardTopCardAction(): Generator {
  yield put(addLog("Player discarded the top card of the deck."));
}

export function* watcherSaga(): Generator {
  yield takeEvery(DISCARD_TOP_CARD, checkIfTopCardIsNextRoundCard);
  yield takeEvery(DISCARD_TOP_CARD, checkIfTopCardIsStoredResource);
  yield takeEvery(PERFORM_ACTION, checkIfTopCardIsStoredResource);

  yield takeEvery(NEW_GAME, logNewGameAction);
  yield takeEvery(END_GAME, logEndGameAction);
  yield takeEvery(DISCARD_TOP_CARD, logDiscardTopCardAction);
}
