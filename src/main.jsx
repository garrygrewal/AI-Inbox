import React from "react";
import ReactDOM from "react-dom/client";
import { defineCustomElements } from "@xplortech/apollo-core/loader";
import App from "./App";
import "../node_modules/@xplortech/apollo-core/build/style.css";
import "./styles.css";

defineCustomElements();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
