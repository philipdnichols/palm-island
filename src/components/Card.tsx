import cx from "classnames";
import React, { ReactElement, ReactNode, CSSProperties } from "react";
import {
  PalmIslandCard,
  PalmIslandCardArea,
  PalmIslandCardAreaAction,
  PalmIslandCardAreaActionCostType,
  PalmIslandCardResource,
  PalmIslandCardResourceType,
  PalmIslandCardOrientation,
} from "../constants/Cards";
import styles from "./Card.module.scss";

export interface CardProps {
  card: PalmIslandCard;
  className?: string;
  style?: CSSProperties;
}

export const Card = (props: CardProps): ReactElement | null => {
  const { card, className, style } = props;

  function resourceSymbolForType(
    resourceType: PalmIslandCardResourceType,
  ): string {
    switch (resourceType) {
      case "fish":
        return "🐟";

      case "log":
        return "🌲";

      case "stone":
        return "🗻";

      default:
        return "❓";
    }
  }

  function renderActionCost(
    actionCost: PalmIslandCardAreaActionCostType,
  ): ReactNode | null {
    if (actionCost === "free") {
      return "Free";
    }

    const renderedCosts: ReactNode[] = [];
    actionCost.forEach(
      (resourceGroup: PalmIslandCardResource[], index: number) => {
        if (index !== 0) {
          renderedCosts.push(" / ");
        }

        renderedCosts.push(
          resourceGroup.map((resource: PalmIslandCardResource) => {
            return `${resource.resourceAmount} ${resourceSymbolForType(
              resource.resourceType,
            )}`;
          }),
        );
      },
    );
    return renderedCosts;
  }

  function renderActions(
    actions: PalmIslandCardAreaAction[],
  ): ReactNode | null {
    const renderedActions: ReactNode[] = actions.map(
      (action: PalmIslandCardAreaAction, index: number) => {
        let actionSymbol: string = "";
        switch (action.actionType) {
          case "store":
            actionSymbol = "↩";
            break;

          case "rotate":
            actionSymbol = "↩";
            break;

          case "flip":
            actionSymbol = "🔁";
            break;

          default:
        }

        const key: string = `${action.actionType}${index}`;

        return (
          <div key={key} className={cx(styles.action)}>
            <div
              className={cx(styles.actionSymbol, {
                [styles.rotate180]: action.actionType === "store",
                [styles.rotate270]: action.actionType === "rotate",
              })}
            >
              {actionSymbol}
            </div>
            :{renderActionCost(action.cost)}
          </div>
        );
      },
    );

    return renderedActions;
  }

  function renderResources(
    resources: PalmIslandCardResource[],
  ): ReactNode | null {
    const renderedResources: ReactNode[] = resources.map(
      (resource: PalmIslandCardResource) => {
        return [...Array(resource.resourceAmount)].map((_, index: number) => {
          const key: string = `${resource.resourceType}${index}`;
          return (
            <div key={key} className={cx(styles.resource)}>
              {resourceSymbolForType(resource.resourceType)}
            </div>
          );
        });
      },
    );

    return renderedResources;
  }

  function renderRoundMarkerNumbers(
    orientation: PalmIslandCardOrientation,
  ): ReactNode | null {
    let roundNumbers: string = "";
    switch (orientation) {
      case "faceup":
        roundNumbers = "1 / 5";
        break;

      case "faceup-rotated":
        roundNumbers = "2 / 6";
        break;

      case "facedown":
        roundNumbers = "3 / 7";
        break;

      case "facedown-rotated":
        roundNumbers = "4 / 8";
        break;

      default:
        break;
    }

    return <div>{roundNumbers}</div>;
  }

  function renderArea(
    name: string,
    isRoundMarker: boolean,
    area: PalmIslandCardArea,
  ): ReactNode | null {
    return (
      <div
        className={cx(styles.area, {
          [styles.rotate180]: area.orientation.endsWith("-rotated"),
        })}
      >
        {!isRoundMarker ? (
          <div className={cx(styles.resources)}>
            {renderResources(area.resources)}
          </div>
        ) : (
          <div className={cx(styles.roundMarkerNumbers)}>
            {renderRoundMarkerNumbers(area.orientation)}
          </div>
        )}
        <div className={cx(styles.cardName)}>
          {area.victoryPoints > 0 && (
            <div className={cx(styles.victoryPoints)}>
              {area.victoryPoints}⭐
            </div>
          )}
          <div>{name}</div>
          {area.upgradePoints > 0 && (
            <div className={cx(styles.upgradePoints)}>
              {area.upgradePoints}⬆
            </div>
          )}
        </div>
        <div className={cx(styles.actions)}>
          {renderActions(area.availableActions)}
        </div>
      </div>
    );
  }

  function render(): ReactElement | null {
    const { areas } = card;

    let topArea: PalmIslandCardArea;
    let bottomArea: PalmIslandCardArea;
    switch (card.activeOrientation) {
      case "facedown":
      case "facedown-rotated":
        topArea = areas[2];
        bottomArea = areas[3];
        break;

      case "faceup":
      case "faceup-rotated":
      default:
        topArea = areas[0];
        bottomArea = areas[1];
        break;
    }
    return (
      <div
        className={cx(className, styles.card, {
          [styles.rotate180]: card.activeOrientation.endsWith("-rotated"),
          [styles.storedCard]: card.isStored,
        })}
        style={style}
      >
        {card.activeOrientation.startsWith("faceup") && (
          <div className={cx(styles.cardNumber)}>{card.id}</div>
        )}
        {renderArea(card.name, card.isRoundMarker, topArea)}
        <div className={cx(styles.colorBar)} />
        {renderArea(card.name, card.isRoundMarker, bottomArea)}
      </div>
    );
  }

  return render();
};
