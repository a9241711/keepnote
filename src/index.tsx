import React, { Suspense } from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { GlobalStyle } from "./components/constant";

const container = document.getElementById("root");
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <Suspense>
      <GlobalStyle />
      <App />
    </Suspense>
  );
} else {
  console.error("No root element found");
}
