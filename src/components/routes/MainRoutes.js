import React, { PureComponent, Fragment } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from '../home/Home';

class MainRoutes extends PureComponent {
  state = {}

  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Fragment>
    )
  }
}

export default MainRoutes