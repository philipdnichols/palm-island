# Palm Island - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Components](#components)
3. [Redux Actions](#redux-actions)
4. [Redux Reducers](#redux-reducers)
5. [Redux Selectors](#redux-selectors)
6. [Game Logic Functions](#game-logic-functions)
7. [Constants and Types](#constants-and-types)
8. [Middleware](#middleware)
9. [Redux Sagas](#redux-sagas)
10. [Store Configuration](#store-configuration)

## Overview

Palm Island is a React-based implementation of the Palm Island board game. The application uses Redux for state management, Redux Saga for side effects, and TypeScript for type safety. The game involves managing cards with different orientations, resources, and actions to achieve the highest score.

## Components

### App Component

**Location:** `src/App.tsx`

The root component that sets up the Redux Provider and renders the main game component.

**Props:** None

**Usage Example:**
```tsx
import { App } from './App';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

### PalmIsland Component

**Location:** `src/components/PalmIsland.tsx`

The main game component that manages the game state and user interactions.

**Props:** None

**Key Features:**
- Displays the current round and available resources
- Manages card interactions (store, rotate, flip)
- Handles payment selection for card actions
- Shows game over screen with final score
- Keyboard shortcuts for card highlighting (Ctrl key)

**State Management:**
- `choosingPayment`: Boolean indicating if the player is selecting payment cards
- `actionedCard`: The card being acted upon
- `cardAction`: The action being performed
- `actionPayment`: Array of cards selected as payment
- `cardHighlightActive`: Boolean for card highlighting state
- `hoveredCard`: Currently hovered card

**Usage Example:**
```tsx
import { PalmIsland } from './components/PalmIsland';

// The component is automatically used in App.tsx
<PalmIsland />
```

### Card Component

**Location:** `src/components/Card.tsx`

Renders individual game cards with their areas, resources, and available actions.

**Props:**
```tsx
interface CardProps {
  card: PalmIslandCard;
  className?: string;
  style?: CSSProperties;
  isActionValid?: (areaOrientation: PalmIslandCardOrientation, action: PalmIslandCardAreaAction) => boolean;
  onAction?: (action: PalmIslandCardAreaAction) => void;
  cardIsBeingActioned?: boolean;
  actionBeingPaidFor?: PalmIslandCardAreaAction | null;
}
```

**Key Features:**
- Displays card resources, victory points, and upgrade points
- Shows available actions (store, rotate, flip) with costs
- Handles card orientation and visual transformations
- Supports round marker cards with special display

**Usage Example:**
```tsx
import { Card } from './components/Card';

<Card
  card={gameCard}
  isActionValid={(orientation, action) => actionIsValid(card, orientation, action, cards)}
  onAction={(action) => handleCardAction(action)}
  cardIsBeingActioned={actionedCard?.id === card.id}
  actionBeingPaidFor={cardAction}
/>
```

### GameLog Component

**Location:** `src/components/GameLog.tsx`

Displays a scrollable log of game events with timestamps.

**Props:**
```tsx
interface GameLogProps {
  className: string;
}
```

**Features:**
- Shows timestamped game events
- Automatically scrolls to show latest events
- Uses moment.js for timezone-aware timestamp formatting

**Usage Example:**
```tsx
import { GameLog } from './components/GameLog';

<GameLog className="game-log-container" />
```

## Redux Actions

### Palm Island Actions

**Location:** `src/actions/palmIslandActions.ts`

#### `newGame()`
Initiates a new game.

**Returns:** `PalmIslandAction`

**Usage:**
```tsx
import { newGame } from '../actions/palmIslandActions';
dispatch(newGame());
```

#### `endGame()`
Ends the current game.

**Returns:** `PalmIslandAction`

**Usage:**
```tsx
import { endGame } from '../actions/palmIslandActions';
dispatch(endGame());
```

#### `discardTopCard()`
Discards the top card of the deck.

**Returns:** `PalmIslandAction`

**Usage:**
```tsx
import { discardTopCard } from '../actions/palmIslandActions';
dispatch(discardTopCard());
```

#### `performAction(card, action, payment)`
Performs an action on a card with specified payment.

**Parameters:**
- `card: PalmIslandCard` - The card to act upon
- `action: PalmIslandCardAreaAction` - The action to perform
- `payment: PalmIslandCard[]` - Cards used as payment

**Returns:** `PalmIslandAction`

**Usage:**
```tsx
import { performAction } from '../actions/palmIslandActions';
dispatch(performAction(selectedCard, rotateAction, [paymentCard1, paymentCard2]));
```

### Game Log Actions

**Location:** `src/actions/gameLogActions.ts`

#### `clearLog()`
Clears all log entries.

**Returns:** `GameLogAction`

**Usage:**
```tsx
import { clearLog } from '../actions/gameLogActions';
dispatch(clearLog());
```

#### `addLog(message)`
Adds a new log entry with timestamp.

**Parameters:**
- `message: string` - The log message

**Returns:** `GameLogAction`

**Usage:**
```tsx
import { addLog } from '../actions/gameLogActions';
dispatch(addLog("Player performed a store action"));
```

## Redux Reducers

### Palm Island Reducer

**Location:** `src/reducers/palmIslandReducer.ts`

Manages the main game state including cards, round, and game phase.

**State Interface:**
```tsx
interface PalmIslandState {
  phase: PalmIslandPhase; // "PLAYING" | "GAME_OVER"
  round: number;
  cards: PalmIslandCard[];
}
```

**Actions Handled:**
- `NEW_GAME`: Resets game to initial state
- `END_GAME`: Sets phase to "GAME_OVER"
- `DISCARD_TOP_CARD`: Moves top card to bottom of deck
- `PERFORM_ACTION`: Executes card actions and updates card state

### Game Log Reducer

**Location:** `src/reducers/gameLogReducer.ts`

Manages the game log state.

**State Interface:**
```tsx
interface GameLogState {
  logs: GameLog[];
}
```

## Redux Selectors

### Palm Island Selectors

**Location:** `src/selectors/palmIslandSelectors.ts`

#### `cardsSelector`
Selects all cards from the state.

**Usage:**
```tsx
import { cardsSelector } from '../selectors/palmIslandSelectors';
const cards = useSelector(cardsSelector);
```

#### `roundSelector`
Selects the current round number.

**Usage:**
```tsx
import { roundSelector } from '../selectors/palmIslandSelectors';
const round = useSelector(roundSelector);
```

#### `phaseSelector`
Selects the current game phase.

**Usage:**
```tsx
import { phaseSelector } from '../selectors/palmIslandSelectors';
const phase = useSelector(phaseSelector);
```

### Game Log Selectors

**Location:** `src/selectors/gameLogSelectors.ts`

#### `logsSelector`
Selects all log entries.

**Usage:**
```tsx
import { logsSelector } from '../selectors/gameLogSelectors';
const logs = useSelector(logsSelector);
```

## Game Logic Functions

**Location:** `src/game/logic.ts`

### `resourcesFromCards(cards)`
Calculates total resources from an array of cards.

**Parameters:**
- `cards: PalmIslandCard[]` - Array of cards to calculate resources from

**Returns:** `[number, number, number]` - [fish, log, stone] counts

**Usage:**
```tsx
import { resourcesFromCards } from '../game/logic';
const [fish, log, stone] = resourcesFromCards(playerCards);
```

### `resourcesFromStoredCards(cards)`
Calculates resources from only stored cards.

**Parameters:**
- `cards: PalmIslandCard[]` - Array of all cards

**Returns:** `[number, number, number]` - [fish, log, stone] counts from stored cards

**Usage:**
```tsx
import { resourcesFromStoredCards } from '../game/logic';
const [fish, log, stone] = resourcesFromStoredCards(allCards);
```

### `checkHasEnoughResourcesToCoverActionCost(cards, action, payment)`
Validates if there are enough resources to pay for an action.

**Parameters:**
- `cards: PalmIslandCard[]` - All cards in play
- `action: PalmIslandCardAreaAction` - The action to validate
- `payment?: PalmIslandCard[]` - Optional payment cards

**Returns:** `boolean` - True if payment is sufficient

**Usage:**
```tsx
import { checkHasEnoughResourcesToCoverActionCost } from '../game/logic';
const canAfford = checkHasEnoughResourcesToCoverActionCost(cards, action, selectedPayment);
```

### `actionIsValid(card, areaOrientation, action, cards)`
Validates if an action can be performed on a card.

**Parameters:**
- `card: PalmIslandCard` - The card to act upon
- `areaOrientation: PalmIslandCardOrientation` - The card's orientation
- `action: PalmIslandCardAreaAction` - The action to perform
- `cards: PalmIslandCard[]` - All cards in play

**Returns:** `boolean` - True if action is valid

**Usage:**
```tsx
import { actionIsValid } from '../game/logic';
const isValid = actionIsValid(selectedCard, orientation, action, allCards);
```

### `atMaxResourceLimit(cards)`
Checks if the maximum number of stored cards is reached.

**Parameters:**
- `cards: PalmIslandCard[]` - All cards in play

**Returns:** `boolean` - True if at maximum (4 stored cards)

**Usage:**
```tsx
import { atMaxResourceLimit } from '../game/logic';
const atLimit = atMaxResourceLimit(cards);
```

### `isGameOver(cards, round)`
Determines if the game has ended.

**Parameters:**
- `cards: PalmIslandCard[]` - All cards in play
- `round: number` - Current round number

**Returns:** `boolean` - True if game is over

**Usage:**
```tsx
import { isGameOver } from '../game/logic';
const gameEnded = isGameOver(cards, currentRound);
```

### `getActiveArea(card)`
Gets the currently active area of a card based on its orientation.

**Parameters:**
- `card: PalmIslandCard` - The card to analyze

**Returns:** `PalmIslandCardArea | undefined` - The active card area

**Usage:**
```tsx
import { getActiveArea } from '../game/logic';
const activeArea = getActiveArea(card);
```

### `calculateFinalScore(cards)`
Calculates the final score and rating.

**Parameters:**
- `cards: PalmIslandCard[]` - All cards in final state

**Returns:** `string` - Formatted score with rating (e.g., "25 (Respectable)")

**Usage:**
```tsx
import { calculateFinalScore } from '../game/logic';
const finalScore = calculateFinalScore(cards);
```

### `getResultingOrientationForAction(action, orientation)`
Determines the new orientation after performing an action.

**Parameters:**
- `action: PalmIslandCardAreaActionType` - The action type
- `orientation: PalmIslandCardOrientation` - Current orientation

**Returns:** `PalmIslandCardOrientation` - New orientation

**Usage:**
```tsx
import { getResultingOrientationForAction } from '../game/logic';
const newOrientation = getResultingOrientationForAction('rotate', 'faceup');
```

## Constants and Types

**Location:** `src/constants/Cards.ts`

### Core Types

```tsx
type PalmIslandCardColor = "red" | "blue";
type PalmIslandCardOrientation = "faceup" | "faceup-rotated" | "facedown" | "facedown-rotated";
type PalmIslandCardResourceType = "fish" | "log" | "stone";
type PalmIslandCardAreaActionType = "store" | "rotate" | "flip";
type PalmIslandCardAreaActionCostType = "free" | PalmIslandCardResource[][];
```

### Interfaces

```tsx
interface PalmIslandCardResource {
  resourceType: PalmIslandCardResourceType;
  resourceAmount: number;
}

interface PalmIslandCardAreaAction {
  actionType: PalmIslandCardAreaActionType;
  cost: PalmIslandCardAreaActionCostType;
}

interface PalmIslandCardArea {
  orientation: PalmIslandCardOrientation;
  resources: PalmIslandCardResource[];
  upgradePoints: number;
  victoryPoints: number;
  availableActions: PalmIslandCardAreaAction[];
}

interface PalmIslandCard {
  id: number;
  name: string;
  color: PalmIslandCardColor;
  activeOrientation: PalmIslandCardOrientation;
  areas: PalmIslandCardArea[];
  isStored: boolean;
  isRoundMarker: boolean;
}
```

### Utility Functions

#### `resourceSymbolForType(resourceType)`
**Location:** `src/components/Card.tsx`

Returns the emoji symbol for a resource type.

**Parameters:**
- `resourceType: PalmIslandCardResourceType` - The resource type

**Returns:** `string` - Emoji symbol (🐟 for fish, 🌲 for log, 🗻 for stone)

**Usage:**
```tsx
import { resourceSymbolForType } from '../components/Card';
const symbol = resourceSymbolForType('fish'); // Returns "🐟"
```

## Middleware

**Location:** `src/middleware/index.ts`

### `testBeforeMiddleware`
Validates actions before they reach the reducer.

**Features:**
- Prevents discarding round marker cards
- Validates payment for card actions
- Prevents actions when at resource limit

### `testAfterMiddleware`
Handles side effects after actions are processed.

**Features:**
- Currently used for logging and debugging
- Can be extended for additional post-action logic

## Redux Sagas

**Location:** `src/sagas/index.ts`

### `watcherSaga()`
Main saga that watches for various actions and triggers side effects.

**Watched Actions:**
- `DISCARD_TOP_CARD`: Checks for game over and auto-discards stored resources
- `PERFORM_ACTION`: Auto-discards stored resources
- `NEW_GAME`: Logs new game start
- `END_GAME`: Logs final score
- `DISCARD_TOP_CARD`: Logs discard action

### Side Effect Generators

#### `checkIfTopCardIsNextRoundCard()`
Checks if the game should end and dispatches `endGame()` if conditions are met.

#### `checkIfTopCardIsStoredResource()`
Automatically discards the top card if it's a stored resource.

#### `logNewGameAction()`
Clears the log and adds a new game message.

#### `logEndGameAction()`
Logs the final score when the game ends.

#### `logDiscardTopCardAction()`
Logs when a player discards a card.

## Store Configuration

**Location:** `src/store/index.ts`

The Redux store is configured with:
- Combined reducers (palmIslandReducer, gameLogReducer)
- Redux Saga middleware for side effects
- Custom middleware for validation and logging
- Redux DevTools Extension support

**Usage:**
```tsx
import { store } from './store';
import { Provider } from 'react-redux';

<Provider store={store}>
  <App />
</Provider>
```

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

## Example Usage Patterns

### Dispatching Actions
```tsx
import { useDispatch } from 'react-redux';
import { performAction, discardTopCard } from '../actions/palmIslandActions';

const dispatch = useDispatch();

// Perform a free store action
dispatch(performAction(card, storeAction, []));

// Perform a paid action
dispatch(performAction(card, rotateAction, [paymentCard1, paymentCard2]));

// Discard top card
dispatch(discardTopCard());
```

### Using Selectors
```tsx
import { useSelector } from 'react-redux';
import { cardsSelector, roundSelector } from '../selectors/palmIslandSelectors';

const cards = useSelector(cardsSelector);
const round = useSelector(roundSelector);
```

### Validating Actions
```tsx
import { actionIsValid, checkHasEnoughResourcesToCoverActionCost } from '../game/logic';

const isValid = actionIsValid(card, orientation, action, allCards);
const canAfford = checkHasEnoughResourcesToCoverActionCost(cards, action, payment);
```

This documentation covers all public APIs, functions, and components in the Palm Island application. Each section includes usage examples and parameter descriptions to help developers understand and use the codebase effectively.