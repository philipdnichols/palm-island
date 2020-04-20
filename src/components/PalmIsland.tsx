import React, { Dispatch, ReactElement, ReactNode, CSSProperties } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { discardTopCard, PalmIslandAction } from "../actions";
import { roundSelector, cardsSelector } from "../selectors";
import { PalmIslandCard } from "../constants/Cards";
import { Card } from "./Card";

import styles from "./PalmIsland.module.scss";

export const PalmIsland = (): ReactElement | null => {
  const round: number = useSelector(roundSelector);
  const cards: PalmIslandCard[] = useSelector(cardsSelector);

  const dispatch: Dispatch<PalmIslandAction> = useDispatch<
    Dispatch<PalmIslandAction>
  >();

  function handleDiscardTopCard(): void {
    dispatch(discardTopCard());
  }

  function renderCard(
    card: PalmIslandCard,
    isTopCard?: boolean,
    left?: number,
  ): ReactNode | null {
    const style: CSSProperties = {};
    if (card.isStored) {
      style.left = `${left}px`;
    }
    return (
      <Card
        className={cx({ [styles.topCard]: isTopCard })}
        style={style}
        key={card.id}
        card={card}
      />
    );
  }

  const render = (): ReactElement | null => {
    const [firstCard, secondCard, ...remainingCards] = cards;

    const cardsToRender: ReactNode[] = [];
    cardsToRender.unshift(renderCard(firstCard, true));

    let left: number = 63;
    cardsToRender.unshift(renderCard(secondCard, false, left));
    if (secondCard.isStored) {
      left += 60;
    }

    remainingCards.forEach((remainingCard: PalmIslandCard) => {
      if (remainingCard.isStored) {
        cardsToRender.unshift(renderCard(remainingCard, false, left));
        left += 60;
      }
    });

    return (
      <div className={cx(styles.palmIsland)}>
        <div>Round {round}</div>
        <div className={cx(styles.cardDisplay)}>{cardsToRender}</div>
        <button type="button" onClick={handleDiscardTopCard}>
          Discard Top Card
        </button>
      </div>
    );
  };

  return render();
};
