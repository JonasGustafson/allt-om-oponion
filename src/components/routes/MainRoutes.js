import React, { PureComponent, Fragment } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from '../home/Home';

class MainRoutes extends PureComponent {
  state = {}

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Fragment>
    )
  }
}

export default MainRoutes