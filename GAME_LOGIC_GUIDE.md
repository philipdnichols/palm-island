# Palm Island - Game Logic Guide

## Table of Contents

1. [Game Overview](#game-overview)
2. [Core Game Concepts](#core-game-concepts)
3. [Card System](#card-system)
4. [Resource Management](#resource-management)
5. [Action System](#action-system)
6. [Game Flow](#game-flow)
7. [Scoring System](#scoring-system)
8. [Function Reference](#function-reference)
9. [Game Rules Implementation](#game-rules-implementation)
10. [Advanced Strategies](#advanced-strategies)

## Game Overview

Palm Island is a portable card game where players manipulate a deck of cards to gather resources, perform actions, and score points. The game is played over 8 rounds, with the goal of maximizing your final score through strategic card management.

### Key Game Principles

- **No Table Required**: All cards are held in your hand
- **Resource Management**: Collect and spend fish 🐟, logs 🌲, and stone 🗻 resources
- **Card Transformation**: Cards can be rotated, flipped, and stored to reveal different abilities
- **Limited Storage**: Maximum of 4 cards can be stored at once
- **Strategic Depth**: Multiple paths to victory through different card combinations

## Core Game Concepts

### Card Orientations

Each card has four possible orientations, each providing different resources and actions:

```tsx
type PalmIslandCardOrientation = 
  | "faceup"           // Initial orientation
  | "faceup-rotated"   // Rotated 180 degrees
  | "facedown"         // Flipped over
  | "facedown-rotated" // Flipped and rotated
```

### Card States

Cards can exist in different states during the game:

```tsx
interface CardState {
  isStored: boolean;      // Card is in storage area (provides resources)
  isRoundMarker: boolean; // Special card that marks round progression
  activeOrientation: PalmIslandCardOrientation; // Current orientation
}
```

### Resource Types

The game uses three types of resources:

```tsx
type PalmIslandCardResourceType = "fish" | "log" | "stone";
```

Each resource type has specific uses and strategic value:
- **Fish** 🐟: Generally easier to obtain, used for basic actions
- **Log** 🌲: Medium rarity, used for building and upgrading
- **Stone** 🗻: Rarest resource, used for advanced actions and high-value cards

## Card System

### Card Structure

Every card contains four areas (one for each orientation):

```tsx
interface PalmIslandCardArea {
  orientation: PalmIslandCardOrientation;
  resources: PalmIslandCardResource[];     // Resources provided
  upgradePoints: number;                   // Points for upgrading other cards
  victoryPoints: number;                   // Points towards final score
  availableActions: PalmIslandCardAreaAction[]; // Actions that can be performed
}
```

### Example Card Implementation

```tsx
const canoeHouse = (id: number): PalmIslandCard => ({
  id,
  name: "Canoe House",
  color: "blue",
  activeOrientation: "faceup",
  areas: [
    {
      orientation: "faceup",
      resources: [{ resourceType: "fish", resourceAmount: 1 }],
      upgradePoints: 0,
      victoryPoints: 0,
      availableActions: [
        { actionType: "store", cost: "free" },
        { actionType: "rotate", cost: [[{ resourceType: "fish", resourceAmount: 1 }]] },
        { actionType: "flip", cost: [[{ resourceType: "fish", resourceAmount: 1 }]] }
      ]
    },
    // ... other three orientations
  ],
  isStored: false,
  isRoundMarker: false
});
```

### Card Actions

Three types of actions can be performed on cards:

#### Store Action
- **Purpose**: Move card to storage area to provide resources
- **Cost**: Usually free, sometimes requires payment
- **Effect**: Card provides resources each turn

```tsx
// Store action implementation
case "store":
  actionedCard.isStored = true;
  break;
```

#### Rotate Action
- **Purpose**: Rotate card 180 degrees to access different area
- **Cost**: Varies by card and orientation
- **Effect**: Changes active orientation (faceup ↔ faceup-rotated)

```tsx
// Rotate action implementation
case "rotate":
  actionedCard.activeOrientation = getResultingOrientationForAction(
    "rotate", 
    actionedCard.activeOrientation
  );
  break;
```

#### Flip Action
- **Purpose**: Flip card to opposite side
- **Cost**: Varies by card and orientation
- **Effect**: Changes active orientation (faceup ↔ facedown)

```tsx
// Flip action implementation
case "flip":
  actionedCard.activeOrientation = getResultingOrientationForAction(
    "flip", 
    actionedCard.activeOrientation
  );
  break;
```

## Resource Management

### Resource Calculation

Resources are calculated from stored cards only:

```tsx
function resourcesFromStoredCards(cards: PalmIslandCard[]): [number, number, number] {
  const storedCards = cards.filter(card => card.isStored);
  return resourcesFromCards(storedCards);
}

function resourcesFromCards(cards: PalmIslandCard[]): [number, number, number] {
  let fish = 0, log = 0, stone = 0;
  
  cards.forEach(card => {
    const activeArea = getActiveArea(card);
    activeArea?.resources.forEach(resource => {
      switch (resource.resourceType) {
        case "fish": fish += resource.resourceAmount; break;
        case "log": log += resource.resourceAmount; break;
        case "stone": stone += resource.resourceAmount; break;
      }
    });
  });
  
  return [fish, log, stone];
}
```

### Resource Limits

The game enforces a maximum storage limit:

```tsx
function atMaxResourceLimit(cards: PalmIslandCard[]): boolean {
  return cards.filter(card => card.isStored).length >= 4;
}
```

When at the limit:
- Free store actions are blocked (except for round markers)
- Paid store actions can still be performed (payment cards are removed)
- Players must manage storage strategically

### Payment System

Actions with costs can be paid in multiple ways:

```tsx
type PalmIslandCardAreaActionCostType = 
  | "free"                    // No cost
  | PalmIslandCardResource[][]  // Array of payment options

// Example: Action costs 2 fish OR 1 log + 1 stone
const actionCost = [
  [{ resourceType: "fish", resourceAmount: 2 }],
  [
    { resourceType: "log", resourceAmount: 1 },
    { resourceType: "stone", resourceAmount: 1 }
  ]
];
```

Payment validation ensures sufficient resources:

```tsx
function checkHasEnoughResourcesToCoverActionCost(
  cards: PalmIslandCard[],
  action: PalmIslandCardAreaAction,
  payment?: PalmIslandCard[]
): boolean {
  if (action.cost === "free") return true;
  
  const [fish, log, stone] = payment ? 
    resourcesFromCards(payment) : 
    resourcesFromStoredCards(cards);
  
  return action.cost.some(resourceGroup => 
    resourceGroup.every(resource => {
      switch (resource.resourceType) {
        case "fish": return fish >= resource.resourceAmount;
        case "log": return log >= resource.resourceAmount;
        case "stone": return stone >= resource.resourceAmount;
        default: return false;
      }
    })
  );
}
```

## Action System

### Action Validation

Multiple conditions must be met for an action to be valid:

```tsx
function actionIsValid(
  card: PalmIslandCard,
  areaOrientation: PalmIslandCardOrientation,
  action: PalmIslandCardAreaAction,
  cards: PalmIslandCard[]
): boolean {
  const actionMatchesActiveOrientation = card.activeOrientation === areaOrientation;
  const isStoredCard = card.isStored;
  const isRoundMarkerCard = card.isRoundMarker;
  const isTopCard = card.id === cards[0].id;
  const topCardIsRoundMarkerCard = cards[0].isRoundMarker;
  const hasEnoughResourcesToCoverCost = checkHasEnoughResourcesToCoverActionCost(cards, action);
  const index = cards.findIndex(deckCard => deckCard.id === card.id);

  return (
    (index === 0 || index === 1) &&                    // Only first two cards can be acted upon
    actionMatchesActiveOrientation &&                    // Action must match current orientation
    !isStoredCard &&                                    // Can't act on stored cards
    ((!topCardIsRoundMarkerCard && !isRoundMarkerCard) || isTopCard) && // Round marker rules
    hasEnoughResourcesToCoverCost                        // Must be able to pay cost
  );
}
```

### Orientation Transitions

Actions change card orientations according to specific rules:

```tsx
function getResultingOrientationForAction(
  action: PalmIslandCardAreaActionType,
  orientation: PalmIslandCardOrientation
): PalmIslandCardOrientation {
  switch (action) {
    case "rotate":
      switch (orientation) {
        case "faceup": return "faceup-rotated";
        case "faceup-rotated": return "faceup";
        case "facedown": return "facedown-rotated";
        case "facedown-rotated": return "facedown";
        default: return orientation;
      }
    
    case "flip":
      switch (orientation) {
        case "faceup": return "facedown";
        case "faceup-rotated": return "facedown-rotated";
        case "facedown": return "faceup";
        case "facedown-rotated": return "faceup-rotated";
        default: return orientation;
      }
    
    case "store":
    default:
      return orientation; // Store doesn't change orientation
  }
}
```

## Game Flow

### Round Progression

The game progresses through 8 rounds, marked by special round marker cards:

```tsx
function isGameOver(cards: PalmIslandCard[], round: number): boolean {
  return cards[0].isRoundMarker && 
         cards[0].activeOrientation === "facedown" && 
         round === 8;
}
```

Round markers display different round numbers based on orientation:
- **faceup**: Rounds 1/5
- **faceup-rotated**: Rounds 2/6  
- **facedown**: Rounds 4/8
- **facedown-rotated**: Rounds 3/7

### Turn Structure

Each turn follows this pattern:

1. **Check top card**: If it's a stored card, automatically discard it
2. **Player action**: Choose to either:
   - Perform an action on the top card
   - Perform an action on the second card
   - Discard the top card
3. **Payment**: If action has a cost, select payment cards
4. **Resolution**: Execute action and update game state
5. **Cleanup**: Check for end-game conditions

### Middleware Validation

Custom middleware enforces game rules:

```tsx
// Before action execution
if (action.type === DISCARD_TOP_CARD) {
  if (cards[0].isRoundMarker) {
    return; // Cannot discard round marker
  }
} else if (action.type === PERFORM_ACTION) {
  if (!checkHasEnoughResourcesToCoverActionCost(cards, action.cardAction, action.actionPayment)) {
    return; // Insufficient payment
  }
  if (action.cardAction.cost === "free" && atMaxResourceLimit(cards) && 
      !action.actionedCard?.isRoundMarker && action.actionPayment?.length === 0) {
    return; // At storage limit
  }
}
```

## Scoring System

### Victory Points

Final score is calculated from victory points on all cards:

```tsx
function calculateFinalScore(cards: PalmIslandCard[]): string {
  let finalScore = 0;
  
  cards.forEach(card => {
    const activeArea = getActiveArea(card);
    finalScore += activeArea?.victoryPoints || 0;
  });
  
  let finalRating: string;
  if (finalScore >= 40) finalRating = "Astounding";
  else if (finalScore >= 30) finalRating = "Exceptional";
  else if (finalScore >= 20) finalRating = "Respectable";
  else finalRating = "Needs work";
  
  return `${finalScore} (${finalRating})`;
}
```

### Scoring Strategies

#### High-Value Cards
Focus on cards with high victory point areas:
- **Tool Maker** (faceup-rotated): 4 victory points
- **Logger** (facedown): 5 victory points
- Advanced card orientations often provide more points

#### Upgrade Points
Some cards provide upgrade points that enhance other cards:
- Upgrade points don't directly add to score
- They enable powerful card combinations
- Strategic use can multiply scoring potential

#### Resource Engines
Build efficient resource generation:
- Store cards that provide multiple resources
- Create resource loops for repeated actions
- Balance immediate resources vs. long-term engines

## Function Reference

### Core Game Logic Functions

#### `resourcesFromCards(cards: PalmIslandCard[]): [number, number, number]`
Calculates total resources from given cards.

#### `resourcesFromStoredCards(cards: PalmIslandCard[]): [number, number, number]`
Calculates resources from stored cards only.

#### `actionIsValid(card, orientation, action, cards): boolean`
Validates if an action can be performed.

#### `checkHasEnoughResourcesToCoverActionCost(cards, action, payment?): boolean`
Validates payment for an action.

#### `atMaxResourceLimit(cards: PalmIslandCard[]): boolean`
Checks if storage limit is reached.

#### `isGameOver(cards: PalmIslandCard[], round: number): boolean`
Determines if game has ended.

#### `getActiveArea(card: PalmIslandCard): PalmIslandCardArea | undefined`
Gets the currently active area of a card.

#### `calculateFinalScore(cards: PalmIslandCard[]): string`
Calculates final score and rating.

#### `getResultingOrientationForAction(action, orientation): PalmIslandCardOrientation`
Determines new orientation after an action.

### Utility Functions

#### `resourceSymbolForType(resourceType: PalmIslandCardResourceType): string`
Returns emoji symbol for resource type.

#### `shuffle<T>(array: T[]): T[]`
Shuffles an array using Fisher-Yates algorithm.

## Game Rules Implementation

### Rule Enforcement

The game enforces rules through multiple layers:

1. **Action Validation**: `actionIsValid()` prevents invalid moves
2. **Middleware**: Custom middleware enforces payment and storage rules
3. **UI Constraints**: Components disable invalid actions visually
4. **Redux Reducers**: State updates maintain game integrity

### Common Rule Violations

#### Invalid Action Attempts
```tsx
// Player tries to act on stored card
if (card.isStored) {
  // Action validation fails
  return false;
}

// Player tries to act on third card
if (cardIndex > 1) {
  // Action validation fails
  return false;
}
```

#### Payment Violations
```tsx
// Player tries to pay with insufficient resources
if (!checkHasEnoughResourcesToCoverActionCost(cards, action, payment)) {
  // Middleware blocks action
  return;
}
```

#### Storage Limit Violations
```tsx
// Player tries free store action at limit
if (atMaxResourceLimit(cards) && action.cost === "free") {
  // Middleware blocks action unless round marker
  return;
}
```

### Rule Flexibility

Some rules have exceptions:

- Round markers can be stored even at storage limit
- Round markers cannot be discarded
- Free actions respect storage limits differently than paid actions

## Advanced Strategies

### Resource Efficiency

#### Multi-Resource Cards
Prioritize cards that provide multiple resource types:
```tsx
// Market card (facedown-rotated) provides all three resources
resources: [
  { resourceType: "log", resourceAmount: 1 },
  { resourceType: "fish", resourceAmount: 1 },
  { resourceType: "stone", resourceAmount: 1 }
]
```

#### Resource Conversion
Use cards that convert abundant resources to rare ones:
```tsx
// Trade House allows converting 2 logs to access stone resources
```

### Card Synergies

#### Upgrade Chains
Build sequences where upgrade points enable powerful transformations:
1. Store cards with upgrade points
2. Use upgrade points to enable high-cost flips/rotates
3. Access high-value victory point areas

#### Resource Loops
Create sustainable resource generation:
1. Store resource-generating cards
2. Use resources to enable more storage
3. Build engine for repeated high-value actions

### Timing Strategies

#### Early Game
- Focus on resource generation
- Build storage capacity
- Set up future scoring opportunities

#### Mid Game
- Execute major card transformations
- Optimize resource efficiency
- Prepare for end-game scoring

#### Late Game
- Maximize victory points
- Use remaining resources efficiently
- Plan for final scoring optimization

### Risk Management

#### Storage Decisions
Balance current needs vs. future flexibility:
- Don't store cards you'll need to pay with
- Maintain resource diversity
- Plan storage exits for better cards

#### Payment Optimization
Minimize payment waste:
- Use exact payment when possible
- Consider alternative payment options
- Save rare resources for high-value actions

This comprehensive guide covers all aspects of the Palm Island game logic, from basic concepts to advanced strategies. Use it as a reference for understanding how the game systems work together to create engaging strategic gameplay.