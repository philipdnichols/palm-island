export type PalmIslandCardColor = "red" | "blue";
export type PalmIslandCardOrientation =
  | "faceup"
  | "faceup-rotated"
  | "facedown"
  | "facedown-rotated";
export type PalmIslandCardResourceType = "fish" | "log" | "stone";
export type PalmIslandCardAreaActionType = "store" | "rotate" | "flip";
export type PalmIslandCardAreaActionCostType =
  | "free"
  | PalmIslandCardResource[][];

export interface PalmIslandCardResource {
  resourceType: PalmIslandCardResourceType;
  resourceAmount: number;
}

export interface PalmIslandCardAreaAction {
  actionType: PalmIslandCardAreaActionType;
  cost: PalmIslandCardAreaActionCostType;
}

export interface PalmIslandCardArea {
  orientation: PalmIslandCardOrientation;
  resources: PalmIslandCardResource[];
  upgradePoints: number;
  victoryPoints: number;
  availableActions: PalmIslandCardAreaAction[];
}

export interface PalmIslandCard {
  id: number;
  name: string;
  color: PalmIslandCardColor;
  activeOrientation: PalmIslandCardOrientation;
  areas: PalmIslandCardArea[];
  isStored: boolean;
  isRoundMarker: boolean;
}

const resource = (
  resourceType: PalmIslandCardResourceType,
  resourceAmount: number,
): PalmIslandCardResource => {
  return {
    resourceType,
    resourceAmount,
  };
};

const canoeHouse = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Canoe House",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [resource("fish", 1)],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "rotate",
            cost: [[resource("fish", 1)]],
          },
          {
            actionType: "flip",
            cost: [[resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [resource("fish", 2)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "flip",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [resource("log", 1), resource("fish", 1)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "rotate",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "facedown-rotated",
        resources: [resource("log", 1), resource("fish", 2)],
        upgradePoints: 2,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const logger = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Logger",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [resource("log", 1)],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "rotate",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [resource("log", 1)],
        upgradePoints: 1,
        victoryPoints: 1,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "flip",
            cost: [[resource("log", 1), resource("stone", 1)]],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [],
        upgradePoints: 3,
        victoryPoints: 5,
        availableActions: [],
      },
      {
        orientation: "facedown-rotated",
        resources: [resource("log", 2)],
        upgradePoints: 2,
        victoryPoints: 2,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "rotate",
            cost: [[resource("log", 2), resource("stone", 2)]],
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const quarry = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Quarry",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "rotate",
            cost: [[resource("log", 2)]],
          },
          {
            actionType: "flip",
            cost: [[resource("fish", 2)]],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [resource("stone", 1)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "flip",
            cost: [[resource("log", 2), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [resource("stone", 1)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "rotate",
            cost: [[resource("log", 1), resource("fish", 2)]],
          },
        ],
      },
      {
        orientation: "facedown-rotated",
        resources: [resource("stone", 2)],
        upgradePoints: 2,
        victoryPoints: 2,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const market = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Market",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [resource("stone", 1)],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("log", 1)], [resource("fish", 1)]],
          },
          {
            actionType: "rotate",
            cost: [[resource("log", 2)]],
          },
          {
            actionType: "flip",
            cost: [[resource("fish", 2)]],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [resource("fish", 1), resource("stone", 1)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("log", 1)]],
          },
          {
            actionType: "flip",
            cost: [[resource("log", 1), resource("stone", 1)]],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [resource("log", 1), resource("stone", 1)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("fish", 1)]],
          },
          {
            actionType: "rotate",
            cost: [[resource("stone", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "facedown-rotated",
        resources: [
          resource("log", 1),
          resource("fish", 1),
          resource("stone", 1),
        ],
        upgradePoints: 2,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [
              [resource("log", 1)],
              [resource("fish", 1)],
              [resource("stone", 1)],
            ],
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const tradeHouse = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Trade House",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [resource("log", 1), resource("fish", 1)],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("fish", 2)], [resource("log", 2)]],
          },
          {
            actionType: "rotate",
            cost: [[resource("fish", 1)]],
          },
          {
            actionType: "flip",
            cost: [[resource("log", 1)]],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [resource("log", 3)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("fish", 2)], [resource("stone", 2)]],
          },
          {
            actionType: "flip",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [resource("fish", 3)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("log", 2)], [resource("stone", 2)]],
          },
          {
            actionType: "rotate",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "facedown-rotated",
        resources: [resource("stone", 3)],
        upgradePoints: 2,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: [[resource("log", 2)], [resource("fish", 2)]],
          },
          {
            actionType: "rotate",
            cost: [[resource("stone", 1)]],
          },
          {
            actionType: "flip",
            cost: [[resource("stone", 1)]],
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const toolMaker = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Tool Maker",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "flip",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
          {
            actionType: "rotate",
            cost: [
              [resource("log", 1), resource("fish", 1), resource("stone", 2)],
            ],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [],
        upgradePoints: 3,
        victoryPoints: 4,
        availableActions: [],
      },
      {
        orientation: "facedown",
        resources: [resource("log", 1), resource("fish", 1)],
        upgradePoints: 1,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "rotate",
            cost: [
              [resource("log", 1), resource("fish", 1), resource("stone", 1)],
            ],
          },
        ],
      },
      {
        orientation: "facedown-rotated",
        resources: [
          resource("log", 1),
          resource("fish", 1),
          resource("stone", 1),
        ],
        upgradePoints: 2,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "store",
            cost: "free",
          },
          {
            actionType: "flip",
            cost: [
              [resource("log", 2), resource("fish", 2), resource("stone", 2)],
            ],
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const housing = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Housing",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "rotate",
            cost: [[resource("log", 1), resource("fish", 1)]],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [],
        upgradePoints: 1,
        victoryPoints: 1,
        availableActions: [
          {
            actionType: "flip",
            cost: [
              [resource("log", 1), resource("fish", 1), resource("stone", 1)],
            ],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [],
        upgradePoints: 3,
        victoryPoints: 6,
        availableActions: [],
      },
      {
        orientation: "facedown-rotated",
        resources: [],
        upgradePoints: 2,
        victoryPoints: 3,
        availableActions: [
          {
            actionType: "rotate",
            cost: [
              [resource("log", 2), resource("fish", 2), resource("stone", 2)],
            ],
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

const temple = (id: number): PalmIslandCard => {
  return {
    id,
    name: "Temple",
    color: "blue",
    activeOrientation: "faceup",
    areas: [
      {
        orientation: "faceup",
        resources: [],
        upgradePoints: 0,
        victoryPoints: 0,
        availableActions: [
          {
            actionType: "rotate",
            cost: [
              [resource("log", 1), resource("fish", 1), resource("stone", 2)],
            ],
          },
        ],
      },
      {
        orientation: "faceup-rotated",
        resources: [],
        upgradePoints: 1,
        victoryPoints: 3,
        availableActions: [
          {
            actionType: "flip",
            cost: [
              [resource("log", 2), resource("fish", 2), resource("stone", 3)],
            ],
          },
        ],
      },
      {
        orientation: "facedown",
        resources: [],
        upgradePoints: 3,
        victoryPoints: 10,
        availableActions: [],
      },
      {
        orientation: "facedown-rotated",
        resources: [],
        upgradePoints: 2,
        victoryPoints: 6,
        availableActions: [
          {
            actionType: "rotate",
            cost: [
              [resource("log", 3), resource("fish", 3), resource("stone", 4)],
            ],
          },
        ],
      },
    ],
    isStored: false,
    isRoundMarker: false,
  };
};

export const BLUE_ROUND_MARKER_CARD: PalmIslandCard = {
  id: 17,
  name: "Round Marker",
  color: "blue",
  activeOrientation: "faceup",
  areas: [
    {
      orientation: "faceup",
      resources: [],
      upgradePoints: 0,
      victoryPoints: 0,
      availableActions: [
        {
          actionType: "rotate",
          cost: "free",
        },
      ],
    },
    {
      orientation: "faceup-rotated",
      resources: [],
      upgradePoints: 0,
      victoryPoints: 0,
      availableActions: [
        {
          actionType: "flip",
          cost: "free",
        },
      ],
    },
    {
      orientation: "facedown",
      resources: [],
      upgradePoints: 0,
      victoryPoints: 0,
      availableActions: [
        {
          actionType: "flip",
          cost: "free",
        },
      ],
    },
    {
      orientation: "facedown-rotated",
      resources: [],
      upgradePoints: 0,
      victoryPoints: 0,
      availableActions: [
        {
          actionType: "rotate",
          cost: "free",
        },
      ],
    },
  ],
  isStored: false,
  isRoundMarker: true,
};

export const BLUE_CARDS: PalmIslandCard[] = [
  canoeHouse(1),
  canoeHouse(2),
  canoeHouse(3),
  logger(4),
  logger(5),
  logger(6),
  quarry(7),
  quarry(8),
  quarry(9),
  market(10),
  tradeHouse(11),
  toolMaker(12),
  housing(13),
  housing(14),
  temple(15),
  temple(16),
];

export function shuffle<T>(array: T[]): T[] {
  const shuffledArray: T[] = array;

  let currentIndex: number = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex: number = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    const temporaryValue = shuffledArray[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = temporaryValue;
  }

  return shuffledArray;
}
