import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./store/store.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; // Import Ant Design styles
import SocketContext from "./context/socketContext.js";

import { BrowserRouter } from "react-router-dom";
import  socket  from "./utils/socketIo.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContext.Provider>
    </Provider>
  </StrictMode>
);
