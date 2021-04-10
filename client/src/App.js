import React from "react";
import "./App.css";
import Home from "./components/Home";
import { ActionCableProvider } from "react-actioncable-provider";

function App() {
  let api_ws_root = "";
  //console.log("url check");
  const appURL = window.location.hostname;
  //console.log(appURL);
  const searchString = "localhost";
  if (appURL.indexOf(searchString) === -1) {
    api_ws_root = "wss://php8.herokuapp.com/cable";
  } else {
    api_ws_root = "ws://localhost:3001/cable";
  }

  return (
    <ActionCableProvider url={api_ws_root}>
      <div className="App">
        <Home />
      </div>
    </ActionCableProvider>
  );
}

export default App;
