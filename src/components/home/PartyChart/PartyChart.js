import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import CountUp from 'react-countup';

import './PartyChart.scss';

class PartyChart extends PureComponent {

  state = {
    maxPercent: 100,
    ratio: 0,
  }

  componentDidMount = () => {
    this.setState({ratio: this.state.maxPercent/(Math.max.apply(Math, Object.values(this.props.party.parties).map(p => p.currentPercent)))})
  }

  render(){
    return (
      <div className="party-chart-wrapper">
          <div className="party-chart">
            {Object.keys(this.props.party.parties).map(partyInitials => 
              <div className="party-stable-wrapper" key={this.props.party.parties[partyInitials].name}>
                <CountUp className="party-percent" end={this.props.party.parties[partyInitials].currentPercent} duration={2} decimal={','} decimals={1} suffix={'%'}/>
                <div  className="party-staple" style={{height: this.props.party.parties[partyInitials].currentPercent*this.state.ratio+'%', backgroundColor: this.props.party.parties[partyInitials].color}} onClick={() => this.props.togglePartyModal(partyInitials)}></div>  
              </div>
            )}
          </div>
          <div className="party-chart-labels">
            {Object.values(this.props.party.parties).map(party => 
              <div key={party.name} className="party-label">
                <img className="party-logo" src={party.logo} alt="party-logo"/>
              </div>  
            )}
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    party: state.party
  }
}

export default connect(mapStateToProps)(PartyChart)