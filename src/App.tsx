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
