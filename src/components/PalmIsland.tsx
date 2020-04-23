import cx from "classnames";
import React, { CSSProperties, Dispatch, ReactElement, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { discardTopCard, PalmIslandAction, performAction } from "../actions";
import {
  PalmIslandCard,
  PalmIslandCardAreaAction,
  PalmIslandCardOrientation,
} from "../constants/Cards";
import { actionIsValid, resourcesFromCards } from "../game/logic";
import { cardsSelector, roundSelector } from "../selectors";
import { Card, resourceSymbolForType } from "./Card";
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

  function handleCardActionValid(
    card: PalmIslandCard,
    areaOrientation: PalmIslandCardOrientation,
    action: PalmIslandCardAreaAction,
  ): boolean {
    return actionIsValid(card, areaOrientation, action);
  }

  // TODO passing back itself might not be needed...can probably handle via smart function wrapping
  function handleCardAction(
    card: PalmIslandCard,
    action: PalmIslandCardAreaAction,
  ): void {
    dispatch(performAction(card, action, []));
  }

  function renderAvailableResources(): ReactNode | null {
    const storedCards: PalmIslandCard[] = cards.filter(
      (card: PalmIslandCard) => card.isStored,
    );
    const [fish, log, stone] = resourcesFromCards(storedCards);

    const renderedResources: ReactNode[] = [];
    if (fish) {
      renderedResources.push(`${fish}${resourceSymbolForType("fish")}`);
    }
    if (log) {
      renderedResources.push(`${log}${resourceSymbolForType("log")}`);
    }
    if (stone) {
      renderedResources.push(`${stone}${resourceSymbolForType("stone")}`);
    }

    return renderedResources;
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
        isActionValid={handleCardActionValid}
        onAction={handleCardAction}
      />
    );
  }

  function renderCards(): ReactNode | null {
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

    return cardsToRender;
  }

  const render = (): ReactElement | null => {
    return (
      <div className={cx(styles.palmIsland)}>
        <div>Round {round}</div>
        <div className={cx(styles.resourceDisplay)}>
          Available Resources:
          {renderAvailableResources()}
        </div>
        <div className={cx(styles.cardDisplay)}>{renderCards()}</div>
        <button type="button" onClick={handleDiscardTopCard}>
          Discard Top Card
        </button>
      </div>
    );
  };

  return render();
};
