import cx from "classnames";
import produce from "immer";
import React, { CSSProperties, Dispatch, ReactElement, ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { discardTopCard, newGame, PalmIslandAction, performAction } from "../actions";
import { PalmIslandCard, PalmIslandCardAreaAction, PalmIslandCardOrientation } from "../constants/Cards";
import {
  actionIsValid,
  atMaxResourceLimit,
  calculateFinalScore,
  checkHasEnoughResourcesToCoverActionCost,
  resourcesFromStoredCards,
} from "../game/logic";
import { cardsSelector, phaseSelector, roundSelector } from "../selectors";
import { Card, resourceSymbolForType } from "./Card";
import styles from "./PalmIsland.module.scss";
import { PalmIslandPhase, PalmIslandState } from "../reducers";

export const PalmIsland = (): ReactElement | null => {
  const round: number = useSelector<PalmIslandState, number>(roundSelector);
  const cards: PalmIslandCard[] = useSelector<PalmIslandState, PalmIslandCard[]>(cardsSelector);
  const phase: PalmIslandPhase = useSelector<PalmIslandState, PalmIslandPhase>(phaseSelector);
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
    setActionedCard(null);
    setCardAction(null);
    setActionPayment([]);
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

    let cardSelectedAsPayment: boolean = false;
    if (card.isStored) {
      if (actionPayment.findIndex((paymentCard: PalmIslandCard) => card.id === paymentCard.id) !== -1) {
        cardSelectedAsPayment = true;
      }
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

        const index: number = actionPayment.findIndex((paymentCard: PalmIslandCard) => paymentCard.id === card.id);
        if (index !== -1) {
          // Payment card is already selected, unselect it.
          setActionPayment(
            produce((draft: PalmIslandCard[]) => {
              draft.splice(index, 1);
            }),
          );
        } else {
          // Select payment card
          setActionPayment(
            produce((draft: PalmIslandCard[]) => {
              draft.push(card);
            }),
          );
        }
      }
    }

    function handleCardAction(action: PalmIslandCardAreaAction): void {
      if (action.cost === "free" && !atMaxResourceLimit(cards)) {
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
        <Card
          className={cx({ [styles.selectedPaymentCard]: cardSelectedAsPayment })}
          style={style}
          card={card}
          isActionValid={handleCardActionValid}
          onAction={handleCardAction}
          cardIsBeingActioned={actionedCard?.id === card.id}
          actionBeingPaidFor={cardAction}
        />
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

  function confirmPaymentIsValid(): boolean {
    return !!cardAction && checkHasEnoughResourcesToCoverActionCost(cards, cardAction, actionPayment);
  }

  function handleNewGame(): void {
    dispatch(newGame());
  }

  const render = (): ReactElement | null => {
    return phase !== "GAME_OVER" ? (
      <div className={cx(styles.palmIsland)}>
        <div>Round {round}</div>
        <div className={cx(styles.resourceDisplay)}>Available Resources: {renderAvailableResources()}</div>
        <div className={cx(styles.cardDisplay)}>{renderCards()}</div>
        {choosingPayment ? (
          <div>
            <button type="button" onClick={handleCancelPayment}>
              Cancel Payment
            </button>
            <button type="button" onClick={handleConfirmPayment} disabled={!confirmPaymentIsValid()}>
              Confirm Payment
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleDiscardTopCard} disabled={cards[0].isRoundMarker}>
            Discard Top Card
          </button>
        )}
      </div>
    ) : (
      <div className={cx(styles.gameOverScreen)}>
        <span>Game Over! Final Score: {calculateFinalScore(cards)}</span>
        <button type="button" onClick={handleNewGame}>
          New Game!
        </button>
        <div className={cx(styles.gameOverCardDisplay)}>
          {cards.map((card: PalmIslandCard) => (
            <Card card={card} isActionValid={(): boolean => true} />
          ))}
        </div>
      </div>
    );
  };

  return render();
};
