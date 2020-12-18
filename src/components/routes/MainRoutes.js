import React, { PureComponent, Fragment } from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from '../home/Home';
import Privacy from '../privacy/Privacy';

class MainRoutes extends PureComponent {
  state = {}

  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/" render={()=><Home togglePartyModal={this.props.togglePartyModal}/>}/>
          <Route path="/privacy" component={Privacy}/>
        </Switch>
      </Fragment>
    )
  }
}

export default MainRoutes