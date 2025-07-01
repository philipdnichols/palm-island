# Palm Island - Component Usage Guide

## Table of Contents

1. [Component Overview](#component-overview)
2. [App Component](#app-component)
3. [PalmIsland Component](#palmisland-component)
4. [Card Component](#card-component)
5. [GameLog Component](#gamelog-component)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Component Overview

The Palm Island application consists of four main React components that work together to create a fully functional card game interface. Each component has specific responsibilities and integrates with Redux for state management.

## App Component

### Purpose
The root component that initializes the Redux store and provides it to the entire application.

### Implementation Details
```tsx
// src/App.tsx
import React, { ReactElement } from "react";
import cx from "classnames";
import { Provider } from "react-redux";
import { store } from "./store";
import { PalmIsland } from "./components/PalmIsland";
import styles from "./App.module.scss";

export const App = (): ReactElement | null => {
  return (
    <Provider store={store}>
      <div className={cx(styles.App)}>
        <PalmIsland />
      </div>
    </Provider>
  );
};
```

### Key Features
- **Redux Provider Setup**: Wraps the entire application with Redux store
- **SCSS Modules**: Uses CSS modules for scoped styling
- **Single Responsibility**: Only responsible for application bootstrap

### Usage in Entry Point
```tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

### Styling
The App component uses `App.module.scss` for styling. The main container uses the `styles.App` class.

## PalmIsland Component

### Purpose
The main game interface component that manages all game interactions, state, and user input.

### Key State Variables

```tsx
// Local component state
const [choosingPayment, setChoosingPayment] = useState<boolean>(false);
const [actionedCard, setActionedCard] = useState<PalmIslandCard | null>(null);
const [cardAction, setCardAction] = useState<PalmIslandCardAreaAction | null>(null);
const [actionPayment, setActionPayment] = useState<PalmIslandCard[]>([]);
const [cardHighlightActive, setCardHighlightActive] = useState<boolean>(false);
const [hoveredCard, setHoveredCard] = useState<PalmIslandCard | null>(null);
```

### Redux Integration

```tsx
// Redux selectors
const round = useSelector(roundSelector);
const cards = useSelector(cardsSelector);
const phase = useSelector(phaseSelector);
const dispatch = useDispatch();
```

### Key Event Handlers

#### Card Action Handling
```tsx
function handleCardAction(action: PalmIslandCardAreaAction): void {
  if (action.cost === "free" && (!atMaxResourceLimit(cards) || card.isRoundMarker)) {
    // Perform free action immediately
    dispatch(performAction(card, action, []));
  } else {
    // Enter payment selection mode
    setChoosingPayment(true);
    setActionedCard(card);
    setCardAction(action);
  }
}
```

#### Payment Management
```tsx
function handleCardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
  if (card.isStored && choosingPayment) {
    e.preventDefault();
    
    const index = actionPayment.findIndex(paymentCard => paymentCard.id === card.id);
    if (index !== -1) {
      // Remove from payment
      setActionPayment(prev => prev.filter((_, i) => i !== index));
    } else {
      // Add to payment
      setActionPayment(prev => [...prev, card]);
    }
  }
}
```

#### Payment Confirmation
```tsx
function handleConfirmPayment(): void {
  if (actionedCard && cardAction) {
    dispatch(performAction(actionedCard, cardAction, actionPayment));
  }
  // Reset payment state
  setChoosingPayment(false);
  setActionedCard(null);
  setCardAction(null);
  setActionPayment([]);
}
```

### Keyboard Interactions

The component supports keyboard shortcuts for enhanced user experience:

```tsx
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Control" && hoveredCard) {
      const index = cards.findIndex(card => card.id === hoveredCard?.id);
      if (index >= 0 && index <= 2) {
        setCardHighlightActive(true);
      }
    }
  }

  function handleKeyUp(e: KeyboardEvent): void {
    if (e.key === "Control") {
      setCardHighlightActive(false);
    }
  }

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  };
}, [hoveredCard, cards]);
```

### Resource Display

```tsx
function renderAvailableResources(): ReactNode | null {
  const [fish, log, stone] = resourcesFromStoredCards(cards);
  
  const renderedResources: ReactNode[] = [];
  if (fish) renderedResources.push(`${fish}${resourceSymbolForType("fish")}`);
  if (log) renderedResources.push(`${log}${resourceSymbolForType("log")}`);
  if (stone) renderedResources.push(`${stone}${resourceSymbolForType("stone")}`);
  
  return renderedResources;
}
```

### Card Layout Management

The component handles complex card positioning for the deck and stored cards:

```tsx
function renderCards(): ReactNode | null {
  const [firstCard, secondCard, thirdCard, ...remainingCards] = cards;
  const cardsToRender: ReactNode[] = [];
  
  // Render deck cards with specific positioning
  cardsToRender.unshift(renderCard(firstCard, 0));
  
  let left = 63;
  cardsToRender.unshift(renderCard(secondCard, 1, left));
  if (secondCard.isStored) left += 60;
  
  cardsToRender.unshift(renderCard(thirdCard, 2, left));
  if (thirdCard.isStored) left += 60;
  
  // Render stored cards
  remainingCards.forEach((remainingCard, index) => {
    if (remainingCard.isStored) {
      cardsToRender.unshift(renderCard(remainingCard, index + 3, left));
      left += 60;
    }
  });
  
  return cardsToRender;
}
```

### Game State Rendering

```tsx
function render(): ReactElement | null {
  return phase !== "GAME_OVER" ? (
    <div>
      <div className={cx(styles.gameLogOverflowWrapper)}>
        <GameLog className={cx(styles.gameLog)} />
      </div>
      <div className={cx({ [styles.cardHighlightMask]: cardHighlightActive })} />
      <div className={cx(styles.palmIsland)}>
        <div>Round {round}</div>
        <div className={cx(styles.resourceDisplay)}>
          Available Resources: {renderAvailableResources()}
        </div>
        <div className={cx(styles.cardDisplay)}>{renderCards()}</div>
        {/* Payment or action buttons */}
      </div>
    </div>
  ) : (
    <div className={cx(styles.gameOverScreen)}>
      <span>Game Over! Final Score: {calculateFinalScore(cards)}</span>
      <button type="button" onClick={handleNewGame}>New Game!</button>
      <div className={cx(styles.gameOverCardDisplay)}>
        {cards.map(card => (
          <Card key={card.id} card={card} isActionValid={() => true} />
        ))}
      </div>
    </div>
  );
}
```

## Card Component

### Purpose
Renders individual game cards with their areas, resources, actions, and handles visual transformations.

### Props Interface

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

### Resource Rendering

```tsx
function renderResources(resources: PalmIslandCardResource[]): ReactNode | null {
  return resources.map((resource: PalmIslandCardResource) => {
    return [...Array(resource.resourceAmount)].map((_, index: number) => {
      const key = `${resource.resourceType}${index}`;
      return (
        <div key={key} className={cx(styles.resource)}>
          {resourceSymbolForType(resource.resourceType)}
        </div>
      );
    });
  });
}
```

### Action Rendering

```tsx
function renderActions(area: PalmIslandCardArea): ReactNode | null {
  return area.availableActions.map((action, index) => {
    let actionSymbol = "";
    switch (action.actionType) {
      case "store": actionSymbol = "↩"; break;
      case "rotate": actionSymbol = "↩"; break;
      case "flip": actionSymbol = "🔁"; break;
    }

    const validAction = !!isActionValid && isActionValid(area.orientation, action);
    const isActionBeingPaidFor = !!cardIsBeingActioned && 
      area.orientation === card.activeOrientation && 
      actionBeingPaidFor?.actionType === action.actionType;

    return (
      <div
        key={`${action.actionType}${index}`}
        className={cx(styles.action, {
          [styles.actionDisabled]: !validAction,
          [styles.highlightAction]: isActionBeingPaidFor,
        })}
        onClick={() => validAction && onAction?.(action)}
      >
        <div className={cx(styles.actionSymbol, {
          [styles.rotate180]: action.actionType === "store",
          [styles.rotate270]: action.actionType === "rotate",
        })}>
          {actionSymbol}
        </div>
        :{renderActionCost(action.cost)}
      </div>
    );
  });
}
```

### Card Orientation Handling

```tsx
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
    <div className={cx(className, styles.card, {
      [styles.rotate180]: card.activeOrientation.endsWith("-rotated") && !card.isStored,
      [styles.storedCard]: card.isStored && !card.activeOrientation.endsWith("-rotated"),
      [styles.rotate180AndStoredCard]: card.activeOrientation.endsWith("-rotated") && card.isStored,
    })} style={style}>
      {card.activeOrientation.startsWith("faceup") && 
        <div className={cx(styles.cardNumber)}>{card.id}</div>
      }
      {renderArea(card.name, card.isRoundMarker, topArea)}
      <div className={cx(styles.colorBar)} />
      {renderArea(card.name, card.isRoundMarker, bottomArea)}
    </div>
  );
}
```

### Usage Examples

#### Basic Card Display
```tsx
<Card 
  card={gameCard}
  isActionValid={() => true}
/>
```

#### Interactive Card with Actions
```tsx
<Card
  card={gameCard}
  isActionValid={(orientation, action) => 
    actionIsValid(gameCard, orientation, action, allCards)
  }
  onAction={(action) => handleCardAction(action)}
  cardIsBeingActioned={selectedCard?.id === gameCard.id}
  actionBeingPaidFor={currentAction}
/>
```

#### Styled Card with Custom Properties
```tsx
<Card
  card={gameCard}
  className="custom-card-style"
  style={{ left: '100px', zIndex: 2 }}
  isActionValid={() => false} // Read-only mode
/>
```

## GameLog Component

### Purpose
Displays a chronological log of game events with timestamps.

### Props Interface

```tsx
interface GameLogProps {
  className: string;
}
```

### Implementation

```tsx
export const GameLog = (props: GameLogProps): ReactElement | null => {
  const { className } = props;
  
  const logs = useSelector(logsSelector);
  
  return (
    <div className={cx(className)}>
      <div className={cx(styles.wrapper)}>
        {logs.map((log: iGameLog) => (
          <div key={log.id} className={cx(styles.log)}>
            <span>
              {moment.unix(log.timestamp).tz(moment.tz.guess()).format("hh:mm A")}: {log.log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Usage Examples

#### Basic Log Display
```tsx
<GameLog className="game-events-log" />
```

#### Styled Log Container
```tsx
<div className="log-container">
  <h3>Game Events</h3>
  <GameLog className="scrollable-log" />
</div>
```

## Common Patterns

### 1. Card Action Validation Pattern

```tsx
function isCardActionValid(
  card: PalmIslandCard, 
  orientation: PalmIslandCardOrientation, 
  action: PalmIslandCardAreaAction
): boolean {
  return !choosingPayment && 
         actionIsValid(card, orientation, action, cards);
}
```

### 2. Resource Display Pattern

```tsx
function displayResources(cards: PalmIslandCard[]): string {
  const [fish, log, stone] = resourcesFromStoredCards(cards);
  const resources = [];
  
  if (fish) resources.push(`${fish}🐟`);
  if (log) resources.push(`${log}🌲`);
  if (stone) resources.push(`${stone}🗻`);
  
  return resources.join(' ');
}
```

### 3. Conditional Rendering Pattern

```tsx
function ConditionalGameContent({ phase }: { phase: PalmIslandPhase }) {
  return phase === "GAME_OVER" ? (
    <GameOverScreen />
  ) : (
    <ActiveGameInterface />
  );
}
```

### 4. Event Handler Pattern

```tsx
function useCardActions() {
  const dispatch = useDispatch();
  
  const handleFreeAction = useCallback((card: PalmIslandCard, action: PalmIslandCardAreaAction) => {
    dispatch(performAction(card, action, []));
  }, [dispatch]);
  
  const handlePaidAction = useCallback((
    card: PalmIslandCard, 
    action: PalmIslandCardAreaAction, 
    payment: PalmIslandCard[]
  ) => {
    dispatch(performAction(card, action, payment));
  }, [dispatch]);
  
  return { handleFreeAction, handlePaidAction };
}
```

## Best Practices

### 1. Component Responsibilities
- Keep components focused on their single responsibility
- Use Redux for shared state, local state for UI-specific data
- Separate business logic from presentation logic

### 2. Performance Optimization
```tsx
// Use useCallback for event handlers
const handleCardClick = useCallback((card: PalmIslandCard) => {
  // Handle click
}, [dependencies]);

// Use useMemo for expensive calculations
const availableResources = useMemo(() => 
  resourcesFromStoredCards(cards), [cards]
);
```

### 3. Type Safety
```tsx
// Always type your props and state
interface ComponentProps {
  cards: PalmIslandCard[];
  onAction: (action: PalmIslandCardAreaAction) => void;
}

// Use type guards when necessary
function isValidCard(card: unknown): card is PalmIslandCard {
  return typeof card === 'object' && 
         card !== null && 
         'id' in card && 
         'name' in card;
}
```

### 4. Error Handling
```tsx
function SafeCardRender({ card }: { card: PalmIslandCard }) {
  try {
    return <Card card={card} isActionValid={() => true} />;
  } catch (error) {
    console.error('Error rendering card:', error);
    return <div>Error loading card</div>;
  }
}
```

### 5. Accessibility
```tsx
// Use semantic HTML and ARIA attributes
<button 
  type="button" 
  onClick={handleDiscardTopCard}
  disabled={cards[0].isRoundMarker}
  aria-label="Discard the top card from the deck"
>
  Discard Top Card
</button>
```

## Troubleshooting

### Common Issues

#### 1. Cards Not Updating
**Problem**: Cards don't reflect state changes
**Solution**: Ensure Redux actions are properly dispatched and reducers return new state objects

```tsx
// Incorrect - mutating state
state.cards[0].isStored = true;

// Correct - returning new state
return {
  ...state,
  cards: state.cards.map((card, index) => 
    index === 0 ? { ...card, isStored: true } : card
  )
};
```

#### 2. Action Validation Failing
**Problem**: Valid actions appear disabled
**Solution**: Check validation logic and ensure all conditions are met

```tsx
// Debug validation
console.log('Validation check:', {
  actionMatchesActiveOrientation: card.activeOrientation === areaOrientation,
  isStoredCard: card.isStored,
  isTopCard: card.id === cards[0].id,
  hasEnoughResources: checkHasEnoughResourcesToCoverActionCost(cards, action)
});
```

#### 3. Payment Selection Issues
**Problem**: Payment selection not working
**Solution**: Verify payment state management and event handlers

```tsx
// Check payment state
useEffect(() => {
  console.log('Payment state:', {
    choosingPayment,
    actionedCard: actionedCard?.id,
    actionPayment: actionPayment.map(card => card.id)
  });
}, [choosingPayment, actionedCard, actionPayment]);
```

#### 4. Styling Issues
**Problem**: Cards not displaying correctly
**Solution**: Check CSS module imports and class names

```tsx
// Verify CSS module import
import styles from './Card.module.scss';

// Check class application
<div className={cx(styles.card, {
  [styles.storedCard]: card.isStored
})}>
```

### Debugging Tips

1. **Use Redux DevTools**: Monitor state changes and action dispatches
2. **Console Logging**: Add strategic console.log statements for debugging
3. **Component Props**: Use React Developer Tools to inspect component props
4. **Type Checking**: Leverage TypeScript's type checking to catch errors early

### Performance Monitoring

```tsx
// Performance monitoring wrapper
function PerformanceCard({ card, ...props }: CardProps) {
  const startTime = performance.now();
  
  useEffect(() => {
    const endTime = performance.now();
    console.log(`Card ${card.id} render time: ${endTime - startTime}ms`);
  });
  
  return <Card card={card} {...props} />;
}
```

This comprehensive component guide provides detailed information about each component's implementation, usage patterns, and best practices for developing with the Palm Island application.