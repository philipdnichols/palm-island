import {
  PalmIslandCard,
  PalmIslandCardArea,
  PalmIslandCardAreaAction,
  PalmIslandCardAreaActionType,
  PalmIslandCardOrientation,
  PalmIslandCardResource,
} from "../constants/Cards";

export function resourcesFromCards(cards: PalmIslandCard[]): [number, number, number] {
  let fish: number = 0;
  let log: number = 0;
  let stone: number = 0;

  cards.forEach((card: PalmIslandCard) => {
    let activeArea: PalmIslandCardArea;
    switch (card.activeOrientation) {
      case "faceup-rotated":
        activeArea = card.areas[1];
        break;

      case "facedown":
        activeArea = card.areas[2];
        break;

      case "facedown-rotated":
        activeArea = card.areas[3];
        break;

      default:
      case "faceup":
        activeArea = card.areas[0];
        break;
    }

    activeArea.resources.forEach((resource: PalmIslandCardResource) => {
      switch (resource.resourceType) {
        case "fish":
          fish += resource.resourceAmount;
          break;

        case "log":
          log += resource.resourceAmount;
          break;

        case "stone":
          stone += resource.resourceAmount;
          break;

        default:
      }
    });
  });

  return [fish, log, stone];
}

export function resourcesFromStoredCards(cards: PalmIslandCard[]): [number, number, number] {
  const storedCards: PalmIslandCard[] = cards.filter((card: PalmIslandCard) => card.isStored);
  return resourcesFromCards(storedCards);
}

export function checkHasEnoughResourcesToCoverActionCost(
  cards: PalmIslandCard[],
  action: PalmIslandCardAreaAction,
  payment?: PalmIslandCard[],
): boolean {
  let hasEnoughResourcesToCoverCost: boolean = false;
  const [fish, log, stone] = payment ? resourcesFromCards(payment) : resourcesFromStoredCards(cards);
  if (action.cost === "free") {
    hasEnoughResourcesToCoverCost = true;
  } else {
    action.cost.some((resources: PalmIslandCardResource[]) => {
      let hasEnough: boolean = true;
      resources.some((resource: PalmIslandCardResource) => {
        switch (resource.resourceType) {
          case "fish":
            hasEnough = fish >= resource.resourceAmount;
            break;

          case "log":
            hasEnough = log >= resource.resourceAmount;
            break;

          case "stone":
            hasEnough = stone >= resource.resourceAmount;
            break;

          default:
            hasEnough = false;
            break;
        }
        return !hasEnough;
      });
      hasEnoughResourcesToCoverCost = hasEnough;
      return hasEnoughResourcesToCoverCost;
    });
  }
  return hasEnoughResourcesToCoverCost;
}

export function actionIsValid(
  card: PalmIslandCard,
  areaOrientation: PalmIslandCardOrientation,
  action: PalmIslandCardAreaAction,
  cards: PalmIslandCard[],
): boolean {
  const activeSide: boolean = card.activeOrientation === areaOrientation;
  const storedCard: boolean = card.isStored;
  const hasEnoughResourcesToCoverCost = checkHasEnoughResourcesToCoverActionCost(cards, action);

  return activeSide && !storedCard && hasEnoughResourcesToCoverCost;
}

export function getResultingOrientationForAction(
  action: PalmIslandCardAreaActionType,
  orientation: PalmIslandCardOrientation,
): PalmIslandCardOrientation {
  switch (action) {
    case "rotate":
      switch (orientation) {
        case "faceup":
          return "faceup-rotated";

        case "faceup-rotated":
          return "faceup";

        case "facedown":
          return "facedown-rotated";

        case "facedown-rotated":
          return "facedown";

        default:
          return orientation;
      }

    case "flip":
      switch (orientation) {
        case "faceup":
          return "facedown";

        case "faceup-rotated":
          return "facedown-rotated";

        case "facedown":
          return "faceup";

        case "facedown-rotated":
          return "faceup-rotated";

        default:
          return orientation;
      }

    case "store":
    default:
      return orientation;
  }
}
