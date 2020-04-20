import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { PalmIsland } from "./components/PalmIsland";

import "./App.css";

export const App = (): ReactElement | null => {
  return (
    <Provider store={store}>
      <div className="App">
        <PalmIsland />
      </div>
    </Provider>
  );
};
