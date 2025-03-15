import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { restoreAuth } from "./store/authSlice";
import App from "./App";
import '../src/index.css'

// Restore auth state from localStorage if available
store.dispatch(restoreAuth());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
