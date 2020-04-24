import cx from "classnames";
import produce from "immer";
import React, { CSSProperties, Dispatch, ReactElement, ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { discardTopCard, PalmIslandAction, performAction } from "../actions";
import { PalmIslandCard, PalmIslandCardAreaAction, PalmIslandCardOrientation } from "../constants/Cards";
import { actionIsValid, resourcesFromStoredCards } from "../game/logic";
import { cardsSelector, roundSelector } from "../selectors";
import { Card, resourceSymbolForType } from "./Card";
import styles from "./PalmIsland.module.scss";

export const PalmIsland = (): ReactElement | null => {
  const round: number = useSelector(roundSelector);
  const cards: PalmIslandCard[] = useSelector(cardsSelector);
  const dispatch: Dispatch<PalmIslandAction> = useDispatch<Dispatch<PalmIslandAction>>();

  const [choosingPayment, setChoosingPayment] = useState<boolean>(false);
  const [actionedCard, setActionedCard] = useState<PalmIslandCard | null>(null);
  const [cardAction, setCardAction] = useState<PalmIslandCardAreaAction | null>(null);
  const [actionPayment, setActionPayment] = useState<PalmIslandCard[]>([]);

  function handleDiscardTopCard(): void {
    dispatch(discardTopCard());
  }

  function handleCancelPayment(): void {
    setChoosingPayment(false);
  }

  function handleConfirmPayment(): void {
    if (actionedCard && cardAction) {
      dispatch(performAction(actionedCard, cardAction, actionPayment));
    }
    setChoosingPayment(false);
    setActionedCard(null);
    setCardAction(null);
    setActionPayment([]);
  }

  function renderAvailableResources(): ReactNode | null {
    const [fish, log, stone] = resourcesFromStoredCards(cards);

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

  function renderCard(card: PalmIslandCard, isTopCard?: boolean, left?: number): ReactNode | null {
    const style: CSSProperties = {};
    if (card.isStored) {
      style.left = `${left}px`;
    }

    function handleCardActionValid(
      areaOrientation: PalmIslandCardOrientation,
      action: PalmIslandCardAreaAction,
    ): boolean {
      return !choosingPayment && actionIsValid(card, areaOrientation, action, cards);
    }

    function handleCardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
      if (card.isStored && choosingPayment) {
        e.preventDefault();
        // setActionPayment((prevActionPayment: PalmIslandCard[]) => {
        //   return [...prevActionPayment, card];
        // });
        setActionPayment(
          produce((draft: PalmIslandCard[]) => {
            draft.push(card);
          }),
        );
      }
    }

    function handleCardAction(action: PalmIslandCardAreaAction): void {
      if (action.cost === "free") {
        dispatch(performAction(card, action, []));
      } else {
        setChoosingPayment(true);
        setActionedCard(card);
        setCardAction(action);
      }
    }

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div className={cx({ [styles.topCard]: isTopCard })} key={card.id} onClick={handleCardClick}>
        <Card style={style} card={card} isActionValid={handleCardActionValid} onAction={handleCardAction} />
      </div>
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
        <div className={cx(styles.resourceDisplay)}>Available Resources: {renderAvailableResources()}</div>
        <div className={cx(styles.cardDisplay)}>{renderCards()}</div>
        {choosingPayment ? (
          <div>
            <button type="button" onClick={handleCancelPayment}>
              Cancel Payment
            </button>
            <button type="button" onClick={handleConfirmPayment}>
              Confirm Payment
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleDiscardTopCard}>
            Discard Top Card
          </button>
        )}
      </div>
    );
  };

  return render();
};
