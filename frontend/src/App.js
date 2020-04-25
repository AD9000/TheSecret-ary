import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { SiteContainer } from "./components/SiteContainer";
import { NotFound } from "./components/NotFound";

class App extends React.Component {
  render() {
    console.log(this.props);
    return (
      <Router class={{ height: "100%" }}>
        <Switch>
          <Route path="/" component={SiteContainer} />
          <Route path="/pageNotFound" component={NotFound} />
          <Redirect to="/pageNotFound" />
        </Switch>
      </Router>
    );
  }
}

export default App;
