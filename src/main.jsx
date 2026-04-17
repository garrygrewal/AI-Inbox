import React from "react";
import ReactDOM from "react-dom/client";
import { defineCustomElements } from "apollo-core-local/loader";
import App from "./App";
import "apollo-core-local/build/style.css";
import "./styles.css";

defineCustomElements();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
