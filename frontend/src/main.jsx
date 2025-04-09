import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index.js"; // Ensure you export your Redux store from src/store/index.js or similar
import "./index.css"; // TailwindCSS or your own styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
