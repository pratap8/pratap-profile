import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GA4React from "react-ga4";

// ✅ Initialize Google Analytics
GA4React.initialize("G-V9135PG146");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
