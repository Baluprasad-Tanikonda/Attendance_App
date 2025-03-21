/** @format */

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./RoutesComponent";
import FirestoreProvider from "./store/Context";

const App = () => {
  return (
    <FirestoreProvider>
      <Router>
        <RoutesComponent />
      </Router>
    </FirestoreProvider>
  );
};

export default App;
