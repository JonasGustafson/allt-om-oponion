import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import moment from 'moment';
import 'moment/locale/sv';

import CountUp from 'react-countup';
import Selector from '../../widgets/Selector/Selector/Selector';

import * as helper from '../../../utils/Helper';

import './TimeChart.scss';

if (moment) {
  moment.locale("sv");
}

class TimeChart extends PureComponent {

  state = {
    availableMonths: [],
    shownMonths: [],
    fromMonth: '',
    toMonth: '',
    currentMonth: '',
    currentPercentages: {},
    previousPercentages: {},
    activeParties: [],
    viewPortWidth: 1000,
    monthInfoShown: false,
    lineOffset: 1,
    min: 0,
    max: 0,
    ratio: 0,
    readyToLoad: false,
  }

  componentDidMount = () => {
    this.setResizeListener()

    this.prepareParties()
    .then(this.setMonthList)
    .then(this.setMinMaxPercent)
    .then(this.setPercentageRatio)
    .then(this.setTimeSpan)
    .then(this.setReadyToLoad)
  }

  setResizeListener = () => {
    window.addEventListener('resize', (e) => {
      if (e.target.innerWidth <= 313) {
        this.setState({viewPortWidth: 313})
      } else if (e.target.innerWidth <= 600) {
        this.setState({viewPortWidth: e.target.innerWidth - 10})
      } else if (e.target.innerWidth <= 1250) {
        this.setState({viewPortWidth: 1000 - (1250 - e.target.innerWidth)*0.8})
      } else {
        this.setState({viewPortWidth: 1000})
      }      
    })
    window.dispatchEvent(new Event('resize'))
  }

  prepareParties = () => {
    return new Promise((resolve) => {

      const {parties} = this.props.party;
      const partyInitials =  Object.keys(parties)

      const percentages = partyInitials.reduce((obj, item) => {
        obj[item] = 0
        return obj
      }, {})

      this.setState({
        currentPercentages: percentages,
        previousPercentages: percentages,
        activeParties: partyInitials
      }, resolve)
    })

  }

  setTimeSpan = () => {
    return new Promise((resolve) => {

      const month = moment(this.state.fromMonth)
      const shownMonths = [];
      
      while (month.isSameOrBefore(moment(this.state.toMonth))) {
        shownMonths.push(month.format("YYYY-MM"))
        month.add(1, 'month')
      }
  
      this.setState({shownMonths}, resolve)
    })

  }

  setMinMaxPercent = () => {
    return new Promise((resolve) => {

      let percentages = [];

      const parties = 
        Object.keys(this.props.party.parties)
        .filter(partyInitials => this.state.activeParties.includes(partyInitials))
        .map(partyInitials => this.props.party.parties[partyInitials])

      parties.forEach(party => {
        const opinionPolls = 
          Object.keys(party.opinionPolls)
          .filter(poll => 
            moment(poll).isSameOrAfter(moment(this.state.fromMonth)) && 
            moment(poll).isSameOrBefore(moment(this.state.toMonth)))
          .map(poll => party.opinionPolls[poll])

        percentages = [...percentages, ...opinionPolls]
      })

      this.setState({
        min: Math.min.apply(Math, percentages) - 1,
        max: Math.max.apply(Math, percentages) + 1,
      }, resolve)

    })
  }

  setPercentageRatio = () => {
    return new Promise(resolve => {

      this.setState({
        ratio: 400/((this.state.max) - (this.state.min)),
      }, resolve)

    })
  }

  setMonthList = () => {
    return new Promise(resolve => {

      let firstMonth = '';
      let lastMonth = '';

      Object.values(this.props.party.parties).forEach(party => {
        Object.keys(party.opinionPolls).forEach((o, index) => {
          firstMonth = index === 0? o: (moment(o).isBefore(firstMonth)? o: firstMonth)
          lastMonth = index === 0? o: (moment(o).isAfter(lastMonth)? o: lastMonth)
        })
      })

      const monthIterator = moment(firstMonth);
      const nrOfMonths = moment(lastMonth).diff(moment(firstMonth), 'month') + 1

      let months = Array(nrOfMonths).fill(null).map(() => {
        const month = monthIterator.format("YYYY-MM")
        monthIterator.add(1, 'month')
        return month; 
      })
      
      this.setState({
        fromMonth: moment(lastMonth).subtract(24, 'month').format("YYYY-MM"),
        toMonth: lastMonth,
        availableMonths: months,
      }, resolve)
    })

  }

  onMouseMove = (e) => {
    const elementX = e.clientX - e.target.getBoundingClientRect().left;
    if (elementX > 0) {
      this.setState({
        indicatorShown: true,
        lineOffset: e.clientX - e.target.getBoundingClientRect().left
      })
    }
  }

  onMouseLeave = () => {
    this.setState({
      indicatorShown: false,
    })
  }

  toggleMonthInfo = () => {
    this.setState({
      monthInfoShown: !this.state.monthInfoShown,
    })
  }

  setCurrentMonthAndPartyPercentage = (month) => {
    const partyPercentages = {}

    Object.keys(this.props.party.parties).forEach(partyInitial => {
      partyPercentages[partyInitial] = this.props.party.parties[partyInitial].opinionPolls[month]
    })

    this.setState({
      currentMonth: month,
      previousPercentages: this.state.currentPercentages,
      currentPercentages: partyPercentages
    })
  }

  filterMonths = (name, choice) => {
    this.setState({
      readyToLoad: false,
      [name]: choice,
    }, () => {
      this.setTimeSpan()
      .then(this.setMinMaxPercent)
      .then(this.setPercentageRatio)
      .then(this.setReadyToLoad)
    })
  }

  toggleParty = (party) => {
    const activeParties = this.state.activeParties.includes(party)
      ? this.state.activeParties.filter(partyInitials => partyInitials !== party)
      : [...this.state.activeParties, party]
    this.setState({
      readyToLoad: false,
      activeParties: activeParties
    }, () => {
      this.setMinMaxPercent()
      .then(this.setPercentageRatio)
      .then(this.setReadyToLoad)
    })
  }

  setReadyToLoad = () => {
    this.setState({readyToLoad: true})
  }
    
  render() {
      return this.state.readyToLoad? (
          <div className="time-chart-wrapper">
            <div className="time-chart-filter" style={{width: this.state.viewPortWidth+'px'}}>
              <div className="time-filter">
              <Selector 
                options={this.state.availableMonths.filter(month => moment(month).isBefore(moment(this.state.toMonth))).reverse()} 
                choice={this.state.fromMonth}
                name={"fromMonth"}
                prefix={'Från'}
                select={this.filterMonths}
                />
              <Selector 
                options={this.state.availableMonths.filter(month => moment(month).isAfter(moment(this.state.fromMonth))).reverse()} 
                choice={this.state.toMonth}
                name="toMonth"
                prefix={'Till'}
                select={this.filterMonths}
                />
                </div>
              <div className="party-colors"> 
                { Object.keys(this.props.party.parties).map(party => 
                  <div key={party} className={"party-color-wrapper" + (this.state.activeParties.includes(party)? " active": '')} onClick={() => this.toggleParty(party)}>
                    <img className="party-logo" src={this.props.party.parties[party].logo} alt="party-logo"/>
                   
                  </div>
                )}
              </div>
            </div>
            <div className="time-chart">
              <svg 
                viewBox={"0 0 "+this.state.viewPortWidth+" 450"} 
                className="chart" 
                onMouseMove={this.onMouseMove} 
                onMouseLeave={this.onMouseLeave} 
                onClick={this.toggleMonthInfo} 
                style={{width: this.state.viewPortWidth, height: '450px'}}>

                { this.state.readyToLoad? Object.keys(this.props.party.parties).map(partyInitials => this.state.activeParties.includes(partyInitials) ?
                  <path 
                    key={partyInitials}
                    className="path"
                    d={this.state.shownMonths.map((month, index) => {
                      const y = (400 - (this.props.party.parties[partyInitials].opinionPolls[month] - this.state.min)*this.state.ratio)
                      const x = ((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index)
                      return index === 0? 'M 2 '+y+' ': 'L '+x+' '+y+' '
                    })}
                    stroke={this.props.party.parties[partyInitials].color} 
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"/>: ''
                ): ''}

                <path d={"M 1 0 L 1 400 L "+this.state.viewPortWidth+" 400"} stroke="lightgrey" strokeWidth="1" fill="none" shapeRendering="crispEdges"/>

                {
                  this.state.shownMonths.map((month, index) => {
                    return index === 0
                    ? <React.Fragment key={month}>
                        {
                          month.endsWith('01')
                          ? <React.Fragment>
                            <path d="M 1 400 L 1 415" stroke="lightgrey" strokeWidth="1" fill="none" shapeRendering="crispEdges"/>
                            <text className="time-chart-year" x="0" y="430" fill="red">{
                              month.substring(0, 4)}
                            </text>
                            </React.Fragment>
                          : <path key={month} d="M 1 400 L 1 405" stroke="lightgrey" strokeWidth="1" fill="none" shapeRendering="crispEdges"/>
                        }
                      </React.Fragment>
                    : <React.Fragment key={month}>
                        {
                          month.endsWith('01')
                          ? <React.Fragment>
                              <path  d={"M "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)+" 400 L "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index + - 0.5)+" 415"} stroke="lightgrey" strokeWidth="1.0" fill="none" shapeRendering="crispEdges"/>
                              <text className="time-chart-year" x={((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)} y="430">
                                {month.substring(0, 4)}
                              </text>
                            </React.Fragment>
                          : <path key={month} d={"M "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)+" 400 L "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index + - 0.5)+" 405"} stroke="lightgrey" strokeWidth="1.0" fill="none" shapeRendering="crispEdges"/>
                        }
                      </React.Fragment> 
                  })
                }

                {
                  this.state.readyToLoad
                    ? Object.keys(this.props.party.parties).map(partyInitials => 
                      this.state.shownMonths.map((month, index) => {
                        
                        const x = (this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index;
                        const y = (400 - (this.props.party.parties[partyInitials].opinionPolls[month] - this.state.min)*this.state.ratio)
                        const isShown = this.state.lineOffset > x - this.state.viewPortWidth/(2*(this.state.shownMonths.length - 1)) && 
                                        this.state.lineOffset < x + this.state.viewPortWidth/(2*(this.state.shownMonths.length - 1)) && 
                                        this.state.indicatorShown

                        if (isShown && this.state.currentMonth !== month) {
                          this.setCurrentMonthAndPartyPercentage(month)
                        }

                        return this.state.activeParties.includes(partyInitials) ? (
                          <circle 
                            key={month}
                            className={"indicator-circle" + (isShown? ' shown': '')}
                            cx={x}
                            cy={y} 
                            r="7" 
                            fill={this.props.party.parties[partyInitials].color}
                            stroke="white" 
                            strokeWidth="2"/>
                        ): ''
                      })
                    )
                    : ''
                }

                {
                  this.state.indicatorShown &&
                    <path className="indicator-path" d={"M "+this.state.lineOffset+" 0 L "+this.state.lineOffset+" 400"} stroke="grey" strokeWidth="2" shapeRendering="crispEdges"/>
                }
              </svg>

             
              {this.state.indicatorShown &&
                <div className="month-info"> 
                  <p className="current-month">{helper.convertYearMonth(this.state.currentMonth)}</p>
                  <hr/>
                  {Object.keys(this.props.party.parties)
                   .sort((a, b) => this.state.currentPercentages[b] - this.state.currentPercentages[a])
                   .map(partyInitials => this.state.activeParties.includes(partyInitials) ? 
                    <div key={this.props.party.parties[partyInitials].name} className="party-name-and-percent">
                      <div className="party-color" style={{backgroundColor: this.props.party.parties[partyInitials].color}}/>
                      <p className="party-name">{this.props.party.parties[partyInitials].name}:</p>
                      <p className="party-percent">
                        <CountUp 
                          start={this.state.previousPercentages[partyInitials]} 
                          end={this.state.currentPercentages[partyInitials]} 
                          duration={0.5}
                          decimals={1}
                          suffix="%"/>
                      </p>
                    </div>: ''
                  )}
                </div>
              }
              </div>
          </div>
      ):
      ('')
  }
}

const mapStateToProps = state => {
  return {
    party: state.party,
  }
}

export default connect(mapStateToProps)(TimeChart);