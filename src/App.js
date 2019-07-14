import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route , NavLink} from 'react-router-dom';
import Game from './tictactoe-game/Game'
import Chart from './chart/Chart'
function App() {
  return (
    <Router>
      <Route path="/" exact strict render ={() =>
        <div className="allApps"> 
          <NavLink to="/app">Main App</NavLink>
          <NavLink to="/tictactoe">Tic Tac Toe Game</NavLink>
          <NavLink to="/orgchart">Simple Org Chart</NavLink>
        </div>
      }>
      </Route>
      <Route path="/app" exact strict render ={() => 
          <div className="App">
            This is an example of Route Render app
          </div>
      }>
      </Route>
      <Route path="/tictactoe" exact strict component={Game}>
      </Route>
      <Route path="/orgchart" exact strict render = {()=><Chart></Chart>}>
      </Route>
    </Router>
  );
}

export default App;
