import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import CountUp from 'react-countup';
import ReactGA from 'react-ga';
import chartShadow from '../../../resources/imgs/chart-shadow.png'

import './PartyChart.scss';

class PartyChart extends PureComponent {

  state = {
    maxPercent: 100,
    ratio: 0,
  }

  componentDidMount = () => {
    this.calculateMaxRatio()
  }

  componentDidUpdate = (prevProps) => {
    if (JSON.stringify(prevProps.shownParties) !== JSON.stringify(this.props.shownParties) ||
        JSON.stringify(prevProps.chart) !== JSON.stringify(this.props.chart) ||
        JSON.stringify(prevProps.moment) !== JSON.stringify(this.props.moment)) {
        this.calculateMaxRatio()
    }
  }

  calculateMaxRatio = () => {
    const {parties} = this.props.party;
    this.setState({ratio: this.state.maxPercent/(Math.max.apply(Math, Object.keys(parties).filter(p => !!parties[p][this.props.chart][this.props.moment]).filter(p => this.props.shownParties.includes(p)).map(p => parties[p][this.props.chart][this.props.moment])))})
  }

  render(){
    const {shownParties} = this.props;
    const {parties} = this.props.party; 

    console.log(parties)
    
    return (
      <div className="party-chart-wrapper">
          <div className="party-chart">
            {Object.keys(parties)
            .filter(partyInitials => !!parties[partyInitials][this.props.chart][this.props.moment])
            .filter(partyInitials => shownParties.includes(partyInitials))
            .map(partyInitials => 
              <div className="party-stable-wrapper" key={parties[partyInitials].name} style={{height: parties[partyInitials][this.props.chart][this.props.moment]*this.state.ratio+'%'}}>
                <CountUp className="party-percent" end={parties[partyInitials][this.props.chart][this.props.moment]} duration={2} decimal={','} decimals={1} suffix={'%'}/>
                <div  className="party-staple" onClick={() => {
                    this.props.togglePartyModal(partyInitials);
                    ReactGA.event({
                      category: "Opened Party",
                      action: parties[partyInitials].name,
                    });
                  }} style={{backgroundColor: parties[partyInitials].color}} /> 
              </div>
            )}
            <img className="chart-shadow" alt="Chart Shadow" src={chartShadow}/>
          </div>
          <div className="party-chart-labels">
            {Object.keys(parties)
            .filter(partyInitials => !!parties[partyInitials][this.props.chart][this.props.moment])
            .filter(partyInitials => shownParties.includes(partyInitials))
            .map(party => 
              <div key={parties[party].name} className="party-label">
                <img className="party-logo" src={parties[party].logo} alt="party-logo"/>
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