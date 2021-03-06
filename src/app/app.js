import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './scenes/Login';
import Signup from './scenes/Signup';
import Index from './scenes/Index';
import Messages from './scenes/Messages';

import style from './style.scss';

class App extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/messages/:id" component={Messages} />
          </Switch>
        </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('app'));
