import React from "react";
import { createRoot } from "react-dom/client";
// Montserrat (OFL) is self-hosted via Fontsource; only needed unicode subsets load.
import "@fontsource-variable/montserrat";
import { App } from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <>
    <App />
  </>,
);
