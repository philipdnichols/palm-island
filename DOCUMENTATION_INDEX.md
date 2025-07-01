# Palm Island - Documentation Index

## Overview

Welcome to the comprehensive documentation for the Palm Island React application. This documentation suite provides complete coverage of all public APIs, functions, components, and game logic. Choose the appropriate guide based on your needs:

## Documentation Files

### 📚 [API Documentation](./API_DOCUMENTATION.md)
**Best for: Developers integrating with or extending the codebase**

Complete reference for all public APIs, functions, and components including:
- Component APIs with props and usage examples
- Redux actions, reducers, and selectors
- Game logic functions with parameters and return types
- Store configuration and middleware
- Type definitions and interfaces

**When to use:**
- Looking up function signatures
- Understanding component props
- Implementing new features
- Debugging issues
- Contributing to the codebase

### 🔧 [Component Usage Guide](./COMPONENT_GUIDE.md)
**Best for: Frontend developers working with React components**

Detailed guide for using and customizing components including:
- Implementation details for each component
- Event handling patterns
- State management strategies
- Common usage patterns and best practices
- Troubleshooting common issues
- Performance optimization tips

**When to use:**
- Building new UI features
- Customizing existing components
- Understanding component architecture
- Optimizing performance
- Implementing accessibility features

### 🎮 [Game Logic Guide](./GAME_LOGIC_GUIDE.md)
**Best for: Understanding game rules and implementing game features**

Comprehensive explanation of game mechanics including:
- Core game concepts and rules
- Card system and orientations
- Resource management and payment systems
- Action validation and execution
- Scoring and victory conditions
- Advanced strategies and tips

**When to use:**
- Understanding game rules
- Implementing new game features
- Debugging game logic issues
- Balancing game mechanics
- Adding new card types or actions

## Quick Reference

### For New Developers

1. **Start here:** [API Documentation](./API_DOCUMENTATION.md) - Overview section
2. **Then read:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Component Overview
3. **Finally:** [Game Logic Guide](./GAME_LOGIC_GUIDE.md) - Game Overview

### For Frontend Developers

1. **Component APIs:** [API Documentation](./API_DOCUMENTATION.md) - Components section
2. **Implementation details:** [Component Usage Guide](./COMPONENT_GUIDE.md)
3. **Game rules:** [Game Logic Guide](./GAME_LOGIC_GUIDE.md) - Core Game Concepts

### For Game Designers

1. **Game mechanics:** [Game Logic Guide](./GAME_LOGIC_GUIDE.md)
2. **Function reference:** [API Documentation](./API_DOCUMENTATION.md) - Game Logic Functions
3. **Implementation:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Best Practices

### For Contributors

1. **Architecture overview:** [API Documentation](./API_DOCUMENTATION.md)
2. **Development patterns:** [Component Usage Guide](./COMPONENT_GUIDE.md)
3. **Game rules:** [Game Logic Guide](./GAME_LOGIC_GUIDE.md)

## Key Concepts at a Glance

### Application Architecture

```
┌─────────────────┐
│     App.tsx     │  ← Root component with Redux Provider
└─────────────────┘
         │
┌─────────────────┐
│  PalmIsland     │  ← Main game component
└─────────────────┘
         │
    ┌────┴────┐
┌───▼───┐ ┌──▼──────┐
│ Card  │ │ GameLog │  ← Child components
└───────┘ └─────────┘
```

### State Management

```
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Actions    │───▶│  Reducers   │───▶│    State     │
└──────────────┘    └─────────────┘    └──────────────┘
         ▲                                      │
         │           ┌─────────────┐            │
         └───────────│    Sagas    │◄───────────┘
                     └─────────────┘
```

### Game Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Player     │───▶│  Action     │───▶│  Payment    │
│  Action     │    │ Validation  │    │ Selection   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   State     │◄───│   Redux     │◄───│  Execute    │
│  Update     │    │  Reducer    │    │   Action    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Common Tasks and Where to Find Information

### Adding a New Component
1. **Component structure:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Component Overview
2. **Props interface:** [API Documentation](./API_DOCUMENTATION.md) - Components section
3. **Redux integration:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Redux Integration

### Implementing a New Game Feature
1. **Game rules:** [Game Logic Guide](./GAME_LOGIC_GUIDE.md) - relevant sections
2. **Logic functions:** [API Documentation](./API_DOCUMENTATION.md) - Game Logic Functions
3. **Component updates:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Best Practices

### Debugging Issues
1. **Function reference:** [API Documentation](./API_DOCUMENTATION.md)
2. **Troubleshooting:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Troubleshooting section
3. **Game validation:** [Game Logic Guide](./GAME_LOGIC_GUIDE.md) - Rule Enforcement

### Performance Optimization
1. **Best practices:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Performance section
2. **Component patterns:** [Component Usage Guide](./COMPONENT_GUIDE.md) - Common Patterns
3. **State management:** [API Documentation](./API_DOCUMENTATION.md) - Redux sections

## Code Examples by Use Case

### Basic Component Usage
```tsx
import { Card } from './components/Card';
import { useSelector } from 'react-redux';
import { cardsSelector } from './selectors/palmIslandSelectors';

function MyComponent() {
  const cards = useSelector(cardsSelector);
  
  return (
    <Card 
      card={cards[0]}
      isActionValid={() => true}
    />
  );
}
```

### Game Logic Integration
```tsx
import { actionIsValid, performAction } from './game/logic';
import { useDispatch } from 'react-redux';

function GameAction({ card, action, allCards }) {
  const dispatch = useDispatch();
  
  const handleAction = () => {
    if (actionIsValid(card, card.activeOrientation, action, allCards)) {
      dispatch(performAction(card, action, []));
    }
  };
  
  return <button onClick={handleAction}>Perform Action</button>;
}
```

### Redux Pattern
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { cardsSelector } from './selectors/palmIslandSelectors';
import { discardTopCard } from './actions/palmIslandActions';

function ReduxExample() {
  const cards = useSelector(cardsSelector);
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(discardTopCard())}>
      Discard Top Card
    </button>
  );
}
```

## API Quick Reference

### Most Used Functions

| Function | Purpose | Documentation |
|----------|---------|---------------|
| `actionIsValid()` | Validate if action can be performed | [API Docs](./API_DOCUMENTATION.md#actionisvalidcard-areaorientation-action-cards) |
| `resourcesFromStoredCards()` | Calculate available resources | [API Docs](./API_DOCUMENTATION.md#resourcesfromstoredcardscards) |
| `performAction()` | Execute card action | [API Docs](./API_DOCUMENTATION.md#performactioncard-action-payment) |
| `calculateFinalScore()` | Calculate game score | [API Docs](./API_DOCUMENTATION.md#calculatefinalscoreCards) |

### Most Used Components

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| `App` | Root application component | [Component Guide](./COMPONENT_GUIDE.md#app-component) |
| `PalmIsland` | Main game interface | [Component Guide](./COMPONENT_GUIDE.md#palmisland-component) |
| `Card` | Individual card display | [Component Guide](./COMPONENT_GUIDE.md#card-component) |
| `GameLog` | Event logging | [Component Guide](./COMPONENT_GUIDE.md#gamelog-component) |

### Most Used Types

| Type | Purpose | Documentation |
|------|---------|---------------|
| `PalmIslandCard` | Card data structure | [API Docs](./API_DOCUMENTATION.md#interfaces) |
| `PalmIslandCardOrientation` | Card rotation states | [API Docs](./API_DOCUMENTATION.md#core-types) |
| `PalmIslandCardAreaAction` | Available card actions | [API Docs](./API_DOCUMENTATION.md#interfaces) |

## Getting Help

### Documentation Structure Issues
If you can't find information you need:
1. Check the [API Documentation](./API_DOCUMENTATION.md) table of contents
2. Use your browser's search function (Ctrl+F) to find specific terms
3. Cross-reference between documentation files using the links

### Understanding Game Rules
If game mechanics are unclear:
1. Start with [Game Logic Guide](./GAME_LOGIC_GUIDE.md) - Game Overview
2. Check specific sections for the mechanic you're working with
3. Review the Function Reference for implementation details

### Component Implementation
If you need help with React components:
1. Check [Component Usage Guide](./COMPONENT_GUIDE.md) for patterns
2. Review [API Documentation](./API_DOCUMENTATION.md) for prop interfaces
3. Look at Common Patterns section for examples

## Contributing to Documentation

When updating or extending the documentation:

1. **API Documentation**: Update when adding/changing functions, components, or types
2. **Component Guide**: Update when changing component implementation or adding new patterns
3. **Game Logic Guide**: Update when modifying game rules or adding new mechanics
4. **This Index**: Update when adding new sections or reorganizing content

### Documentation Standards

- Include TypeScript type definitions
- Provide working code examples
- Explain both "what" and "why"
- Cross-reference related sections
- Update all affected files when making changes

---

This documentation suite provides comprehensive coverage of the Palm Island application. Start with the overview sections of each guide, then dive deeper into specific areas as needed. The cross-references between documents will help you find related information quickly.