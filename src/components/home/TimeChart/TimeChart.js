import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import moment from 'moment';
import 'moment/locale/sv';

import RadioButtonList from '../../widgets/RadioButtonList/RadioButtonList';
import RadioButton from '../../widgets/RadioButton/RadioButton';
import Selector from '../../widgets/Selector/Selector/Selector';


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
    percentageSpan: 5,
    currentPercentages: {},
    activeParties: [],
    viewPortWidth: 1000,
    monthInfoShown: false,
    lineOffset: 1,
    min: 0,
    max: 0,
    ratio: 0,
    readyToLoad: false,
    chartTypes: [
      'opinionsundersökningar',
      'riksdagsval'
    ],
    currentChart: 'opinionsundersökningar',
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

  setCurrentChart = (chartType) => {
    this.setState({currentChart: chartType})
  }

  setResizeListener = () => {
    window.addEventListener('resize', (e) => {
      if (e.target.innerWidth <= 313) {
        this.setState({viewPortWidth: 313})
      } else if (e.target.innerWidth <= 600) {
        this.setState({viewPortWidth: e.target.innerWidth})
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

      const parties = this.props.parties;
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
        Object.keys(this.props.parties)
        .filter(partyInitials => this.state.activeParties.includes(partyInitials))
        .map(partyInitials => this.props.parties[partyInitials])

      parties.forEach(party => {
        const opinionPolls = 
          Object.keys(party['opinionsundersökningar'])
          .filter(poll => 
            moment(poll).isSameOrAfter(moment(this.state.fromMonth)) && 
            moment(poll).isSameOrBefore(moment(this.state.toMonth)))
          .map(poll => party['opinionsundersökningar'][poll])
            
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
        ratio: 400/(this.state.max - this.state.min),
      }, resolve)

    })
  }

  setMonthList = () => {
    return new Promise(resolve => {

      let firstMonth = '';
      let lastMonth = '';

      Object.values(this.props.parties).forEach(party => {
        Object.keys(party['opinionsundersökningar']).forEach((o, index) => {
          firstMonth = index === 0? o: (moment(o).isBefore(firstMonth)? o: firstMonth)
          lastMonth = index === 0? o: (moment(o).isAfter(lastMonth)? o: lastMonth)
        })
      })

      const monthIterator = moment(firstMonth);
      const nrOfMonths = moment(lastMonth).diff(moment(firstMonth), 'month') + 1

      let months = Array(nrOfMonths).fill(null).map(() => {
        const month = monthIterator.format("YYYY-MM")
        monthIterator.add(1, 'month')
        return month.toString(); 
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
        lineOffset: elementX
      }, () => this.setCurrentMonthAndPartyPercentage())
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

  setCurrentMonthAndPartyPercentage = () => {

    const monthIndex = this.getMonthIndex()
    const month = this.state.shownMonths[monthIndex]
    
    const partyPercentages = {}
    
    Object.keys(this.props.parties).forEach(partyInitial => {
      partyPercentages[partyInitial] = this.props.parties[partyInitial]['opinionsundersökningar'][month]
    })

    this.setState({
      currentMonth: month,
      currentPercentages: partyPercentages
    })
  }
  
  getMonthIndex = () => {
    const stepLength = this.state.viewPortWidth/(this.state.shownMonths.length - 1)
    const monthIndex = Math.round(this.state.lineOffset / stepLength)
    return monthIndex
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

  createPartyPath = (partyInitials) => {

    const onlyOneParty = this.props.partyInitials !== undefined;

    if (this.state.activeParties.includes(partyInitials) && this.state.readyToLoad) {
      
      const partyShownMonths = this.state.shownMonths
                              .map((month, index) => ({index: index, month: month}))
                              .filter(m => Object.keys(this.props.parties[partyInitials]['opinionsundersökningar']).includes(m.month))

      const separatedPartyMonths = [];
      let index = 0
      for (let i = 0; i < partyShownMonths.length; i++) {
        if (!separatedPartyMonths[index]) {
          separatedPartyMonths[index] = []
        } 
        separatedPartyMonths[index].push(partyShownMonths[i])
        if (partyShownMonths[i+1]) {
          if (partyShownMonths[i].index + 1 !== partyShownMonths[i+1].index) {
            index ++;
          }
        }
      }
      return separatedPartyMonths.map((months, index) => {
        return months.length === 1
        ? 
        <circle 
            key={months[0].index}
            cx={((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*months[0].index)}
            cy={(400 - (this.props.parties[partyInitials]['opinionsundersökningar'][months[0].month] - this.state.min)*this.state.ratio)}
            r="2"
            opacity={onlyOneParty? '1': '0.6'} 
            fill={onlyOneParty ? 'white': this.props.parties[partyInitials].color}/>
        :
        <polyline 
            key={partyInitials + index}
            className={"path" + (onlyOneParty? ' only-one-party': '')}
            points={months.map((m) => {
              const y = (400 - (this.props.parties[partyInitials]['opinionsundersökningar'][m.month] - this.state.min)*this.state.ratio)
              const x = ((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*m.index)
              return x + ' ' + y + ' ';
            })}
            stroke={onlyOneParty ? "white": this.props.parties[partyInitials].color} 
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"/>
      })
    }
    return '';
  }

  createIndicatorCircles = (partyInitials) => {

    const onlyOneParty = this.props.partyInitials !== undefined;

    if (this.state.readyToLoad && this.state.activeParties.includes(partyInitials)) {

      const partyShownMonths = this.state.shownMonths
      .map((month, index) => ({index: index, month: month}))
      .filter(m => Object.keys(this.props.parties[partyInitials]['opinionsundersökningar']).includes(m.month))

      return partyShownMonths.map((m, index) => {

        const x = (this.state.viewPortWidth/(this.state.shownMonths.length - 1))*m.index;
        const y = (400 - (this.props.parties[partyInitials]['opinionsundersökningar'][m.month] - this.state.min)*this.state.ratio)
        
        const isShown = this.state.lineOffset > x - this.state.viewPortWidth/(2*(this.state.shownMonths.length - 1)) && 
                        this.state.lineOffset < x + this.state.viewPortWidth/(2*(this.state.shownMonths.length - 1)) && 
                        this.state.indicatorShown 

        return (
          <circle 
            key={m.month}
            className={"indicator-circle" + (isShown? ' shown': '') + (onlyOneParty? " only-one-party": "")}
            cx={x}
            cy={y} 
            r="7" 
            fill={this.props.parties[partyInitials].color}
            stroke="white" 
            strokeWidth="2"/>
        )
      })
    }
    return ''
  }

  createYearLines = (month, index) => {

    const onlyOneParty = this.props.partyInitials !== undefined;

    return index === 0
      ? <React.Fragment key={month}>
          {
            month.endsWith('01')
            ? <React.Fragment>
              <path d="M 1 400 L 1 415" stroke={onlyOneParty? "white": "lightgrey"} strokeWidth="1" fill="none" shapeRendering="crispEdges"/>
              <text className={"time-chart-year" + (onlyOneParty? " only-one-party": "")} x="0" y="415" writingMode='vertical-lr'>
                {month.substring(0, 4)}
              </text>
              </React.Fragment>
            : <path key={month} d="M 1 400 L 1 405" stroke={onlyOneParty? "white": "lightgrey"} strokeWidth="1" fill="none" shapeRendering="crispEdges"/>
          }
        </React.Fragment>
      : <React.Fragment key={month}>
          {
            month.endsWith('01')
            ? <React.Fragment>
                <path  d={"M "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5) +" 400 L "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)+" 415"} stroke="lightgrey" strokeWidth="1.0" fill="none" shapeRendering="crispEdges"/>
                <text className={"time-chart-year" + (onlyOneParty? " only-one-party": "")} x={((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)} y="420" writingMode='vertical-lr'>
                  {month.substring(0, 4)}
                </text>
              </React.Fragment>
            : <path key={month} d={"M "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)+" 400 L "+((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index - 0.5)+" 405"} stroke="lightgrey" strokeWidth="1.0" fill="none" shapeRendering="crispEdges"/>
          }
        </React.Fragment> 
  } 

  createPercentageLines = () => {

    const onlyOneParty = this.props.partyInitials !== undefined;

    let percentageSpans = [];
    let i = Math.ceil(this.state.min/this.state.percentageSpan)*this.state.percentageSpan;

    while (i < this.state.max) {
      percentageSpans.push(i)
      i += this.state.percentageSpan;
    }

    return percentageSpans.map(percentage => {
      let relativeYPercentage = (400 - (percentage - this.state.min)*this.state.ratio)
      let isSmallScreen = window.innerWidth <= 600;
      let textYPosition = isSmallScreen? relativeYPercentage - 4: relativeYPercentage + 4;
      let textXPosition = isSmallScreen? 5: -35
      return (
        <React.Fragment key={percentage}>
          <text y={textYPosition} x={textXPosition} fontSize="12" fill={onlyOneParty? "white": "lightgrey"} opacity={onlyOneParty? "1": "0.8"} fontWeight="100">
            {percentage}%
          </text>
          <polyline 
            points={"-5 "+relativeYPercentage+" "+this.state.viewPortWidth+" "+relativeYPercentage} 
            strokeWidth="0.5" 
            stroke={onlyOneParty? "white": "lightgrey"}
            opacity={onlyOneParty? "1":"0.3"} 
            shapeRendering="crispEdges"/>
        </React.Fragment>
      )
    })
  }
    
  render() {

      const onlyOneParty = this.props.partyInitials !== undefined;

      return this.state.readyToLoad? (
          <div className="time-chart-wrapper">
            <div className="time-chart-filter" style={{width: this.state.viewPortWidth+'px'}}>
              <div className="time-chart-type-filter">
                <div className="time-filter">
                  <Selector 
                    options={this.state.availableMonths.filter(month => moment(month).isBefore(moment(this.state.toMonth))).reverse()} 
                    choice={this.state.fromMonth}
                    name={"fromMonth"}
                    prefix={'Från'}
                    select={this.filterMonths}/>
                  <Selector 
                    options={this.state.availableMonths.filter(month => moment(month).isAfter(moment(this.state.fromMonth))).reverse()} 
                    choice={this.state.toMonth}
                    name="toMonth"
                    prefix={'Till'}
                    select={this.filterMonths}/>
                </div>
                <RadioButtonList onChoice={this.setCurrentChart}>
                  {
                    this.state.chartTypes.map(type => 
                      <RadioButton key={type} name={type} label={''}/>
                    )
                  }
                </RadioButtonList>
                  
              </div>
              { !onlyOneParty &&
                <div className="party-colors"> 
                  { Object.keys(this.props.parties).map(party => 
                    <div key={party} className={"party-color-wrapper" + (this.state.activeParties.includes(party)? " active": '')} onClick={() => this.toggleParty(party)}>
                      <img className="party-logo" src={this.props.parties[party].logo} alt="party-logo"/>
                    </div>
                  )}
                </div>
              }
            </div>
            <div className="time-chart">
              <svg 
                viewBox={"0 0 "+this.state.viewPortWidth+" 450"} 
                className="chart" 
                onMouseMove={this.onMouseMove} 
                onMouseLeave={this.onMouseLeave} 
                onClick={this.toggleMonthInfo} 
                style={{width: this.state.viewPortWidth, height: '450px'}}>

                <path d={"M 1 0 L 1 400 L "+(this.state.viewPortWidth) +" 400"} stroke={onlyOneParty? "white": "lightgrey"} strokeWidth="1" fill="none" shapeRendering="crispEdges"/>
                {this.createPercentageLines()}
                {Object.keys(this.props.parties).filter(party => onlyOneParty ? party === this.props.partyInitials: true).map(this.createPartyPath)}
                {this.state.shownMonths.map(this.createYearLines)}
                {Object.keys(this.props.parties).map(this.createIndicatorCircles)}
                {this.state.indicatorShown &&
                  <path className="indicator-path" d={"M "+this.state.lineOffset+" 0 L "+this.state.lineOffset+" 400"} stroke={onlyOneParty? "white": "grey"} strokeWidth="2" shapeRendering="crispEdges"/>
                }
              </svg>
              {this.state.indicatorShown &&
                <div className="month-info"> 
                  <p className="current-month">{this.state.currentMonth}</p>
                  <hr/>
                  {Object.keys(this.props.parties)
                   .sort((a, b) => this.state.currentPercentages[b] - this.state.currentPercentages[a])
                   .map(partyInitials => this.state.activeParties.includes(partyInitials) && !isNaN(this.state.currentPercentages[partyInitials])? 
                    <div key={this.props.parties[partyInitials].name} className="party-name-and-percent">
                      <div className="party-color" style={{backgroundColor: this.props.parties[partyInitials].color}}/>
                      <p className="party-name">{this.props.parties[partyInitials].name}:</p>
                      <p className="party-percent">
                        {(Math.round(this.state.currentPercentages[partyInitials] * 100) / 100).toFixed(1)}%
                      </p>
                    </div>: ''
                  )}
                </div>
              }
              </div>
          </div>
      ):
      ''
  }
}

const mapStateToProps = (state, ownProps) => {
  const onlyOneParty = ownProps.partyInitials !== undefined

  const parties = onlyOneParty 
  ? Object.keys(state.party.parties)
      .filter(key => key === ownProps.partyInitials)
      .reduce((obj, key) => {
        obj[key] = state.party.parties[key];
        return obj
      }, {})
  : state.party.parties
  return { parties }
}

export default connect(mapStateToProps)(TimeChart);