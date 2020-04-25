import { enableAllPlugins } from "immer";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./index.css";

enableAllPlugins();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
