import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./views/Home";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import { ThemeProvider } from "@material-ui/core/styles";
import { Play } from "./views/Play";
import { View } from "./views/View";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: purple,
    secondary: { main: "#ff7518" }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <AppBar position="static" theme="theme">
            {" "}
            <Toolbar>
              <Typography variant="h6">Spooky Quiz</Typography>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/play/:room" component={Play} />
            <Route path="/view/:room" component={View} />
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
