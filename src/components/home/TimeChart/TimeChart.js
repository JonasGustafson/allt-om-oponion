import React, {PureComponent} from 'react';
import CountUp from 'react-countup';
import moment from 'moment';
import 'moment/locale/sv';

import './TimeChart.scss';
import Selector from '../../widgets/Selector/Selector/Selector';

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
    currentPercentages: {'V': 0, 'S': 0, 'MP': 0, 'M': 0, 'L': 0, 'C': 0, 'KD': 0, 'SD': 0 },
    previousPercentages: {'V': 0,'S': 0, 'MP': 0, 'M': 0, 'L': 0, 'C': 0, 'KD': 0, 'SD': 0 },
    viewPortWidth: 1000,
    monthInfoShown: false,
    lineOffset: 1,
    min: 0,
    max: 0,
    ratio: 0,
    readyToLoad: false,
    parties: {
      'V': { 
        name: "vänsterpartiet",
        color: '#A50A24',
        isActive: true,
        opinionPolls: {
          '2016-03': 7.3,
          '2016-04': 7.8,
          '2016-05': 7.8,
          '2016-06': 7.3,
          '2016-07': 7.8,
          '2016-08': 8.3,
          '2016-09': 7.8,
          '2016-10': 8.1,
          '2016-11': 7.8,
          '2016-12': 7.8,
          '2017-01': 7.9,
          '2017-02': 7.8,
          '2017-03': 7.8,
          '2017-04': 7.3,
          '2017-05': 7.6,
          '2017-06': 7.9,
          '2017-07': 8.4,
          '2017-08': 7.5,
          '2017-09': 7.3,
          '2017-10': 7.6,
          '2017-11': 7.3,
          '2017-12': 7.3,
          '2018-01': 7.4,
          '2018-02': 8.2,
          '2018-03': 7.9,
          '2018-04': 7.9,
          '2018-05': 8.7,
          '2018-06': 9.1,
          '2018-07': 10.3,
          '2018-08': 10.1,
          '2018-09': 9.3,
          '2018-10': 7.8,
          '2018-11': 8.0,
          '2018-12': 7.9,
          '2019-01': 8.8,
          '2019-02': 9.7,
          '2019-03': 9.5,
          '2019-04': 9.3,
          '2019-05': 9.2,
          '2019-06': 8.8,
          '2019-07': 8.9,
          '2019-08': 9.2,
          '2019-09': 8.9,
          '2019-10': 9.0,
          '2019-11': 8.9,
          '2019-12': 9.5,
          '2020-01': 10.2,
          '2020-02': 10.7,
        }
      },
      'S': { 
        name: "socialdemokraterna", 
        color: '#EB142E',
        isActive: true,
        opinionPolls: {
          '2016-03': 25.2,
          '2016-04': 25.0,
          '2016-05': 25.5,
          '2016-06': 25.7,
          '2016-07': 24.3,
          '2016-08': 25.2,
          '2016-09': 25.4,
          '2016-10': 25.0,
          '2016-11': 25.5,
          '2016-12': 25.9,
          '2017-01': 25.7,
          '2017-02': 25.7,
          '2017-03': 26.0,
          '2017-04': 26.6,
          '2017-05': 27.1,
          '2017-06': 26.7,
          '2017-07': 24.8,
          '2017-08': 27.8,
          '2017-09': 28.7,
          '2017-10': 28.5,
          '2017-11': 28.5,
          '2017-12': 27.1,
          '2018-01': 27.6,
          '2018-02': 26.8,
          '2018-03': 26.7,
          '2018-04': 26.3,
          '2018-05': 24.9,
          '2018-06': 24.3,
          '2018-07': 23.4,
          '2018-08': 23.9,
          '2018-09': 26.2,
          '2018-10': 29.4,
          '2018-11': 29.2,
          '2018-12': 29.7,
          '2019-01': 29.2,
          '2019-02': 27.7,
          '2019-03': 26.7,
          '2019-04': 26.4,
          '2019-05': 26.3,
          '2019-06': 25.9,
          '2019-07': 25.6,
          '2019-08': 25.6,
          '2019-09': 24.6,
          '2019-10': 24.7,
          '2019-11': 24.4,
          '2019-12': 23.7,
          '2020-01': 23.2,
          '2020-02': 23.6,
        }
      },
      'MP': { 
        name: "miljöpartiet", 
        color: '#006031',
        isActive: true,
        opinionPolls: {
          '2016-03': 5.5,
          '2016-04': 4.8,
          '2016-05': 4.2,
          '2016-06': 4.4,
          '2016-07': 3.9,
          '2016-08': 3.7,
          '2016-09': 4.3,
          '2016-10': 4.1,
          '2016-11': 4.1,
          '2016-12': 4.4,
          '2017-01': 4.5,
          '2017-02': 4.2,
          '2017-03': 4.1,
          '2017-04': 4.0,
          '2017-05': 3.7,
          '2017-06': 3.8,
          '2017-07': 4.3,
          '2017-08': 4.2,
          '2017-09': 4.0,
          '2017-10': 3.8,
          '2017-11': 4.5,
          '2017-12': 3.9,
          '2018-01': 4.0,
          '2018-02': 3.8,
          '2018-03': 4.0,
          '2018-04': 4.1,
          '2018-05': 4.1,
          '2018-06': 4.3,
          '2018-07': 4.4,
          '2018-08': 5.5,
          '2018-09': 4.6,
          '2018-10': 4.5,
          '2018-11': 4.0,
          '2018-12': 4.1,
          '2019-01': 3.8,
          '2019-02': 3.7,
          '2019-03': 3.9,
          '2019-04': 4.3,
          '2019-05': 4.7,
          '2019-06': 5.2,
          '2019-07': 4.7,
          '2019-08': 5.1,
          '2019-09': 4.7,
          '2019-10': 4.7,
          '2019-11': 4.9,
          '2019-12': 4.7,
          '2020-01': 4.3,
          '2020-02': 4.4,
        }
      },
      'M': { 
        name: "moderaterna", 
        color: '#004FAA',
        isActive: true,
        opinionPolls: {
          '2016-03': 24.7,
          '2016-04': 25.4,
          '2016-05': 24.6,
          '2016-06': 24.8,
          '2016-07': 24.3,
          '2016-08': 24.4,
          '2016-09': 23.6,
          '2016-10': 23.0,
          '2016-11': 22.4,
          '2016-12': 21.0,
          '2017-01': 21.8,
          '2017-02': 18.8,
          '2017-03': 16.9,
          '2017-04': 16.8,
          '2017-05': 17.0,
          '2017-06': 16.4,
          '2017-07': 15.4,
          '2017-08': 16.3,
          '2017-09': 16.6,
          '2017-10': 20.1,
          '2017-11': 21.0,
          '2017-12': 22.0,
          '2018-01': 23.2,
          '2018-02': 22.6,
          '2018-03': 22.1,
          '2018-04': 21.7,
          '2018-05': 21.4,
          '2018-06': 19.7,
          '2018-07': 18.8,
          '2018-08': 17.6,
          '2018-09': 18.1,
          '2018-10': 19.4,
          '2018-11': 18.5,
          '2018-12': 18.4,
          '2019-01': 18.2,
          '2019-02': 18.0,
          '2019-03': 17.4,
          '2019-04': 16.6,
          '2019-05': 16.7,
          '2019-06': 18.1,
          '2019-07': 17.0,
          '2019-08': 18.2,
          '2019-09': 19.0,
          '2019-10': 17.9,
          '2019-11': 17.5,
          '2019-12': 17.0,
          '2020-01': 17.5,
          '2020-02': 18.1,
        }
      },
      'L': { 
        name: "liberalerna", 
        color: '#1A74A1',
        isActive: true,
        opinionPolls: {
          '2016-03': 4.6,
          '2016-04': 4.8,
          '2016-05': 4.2,
          '2016-06': 4.7,
          '2016-07': 4.5,
          '2016-08': 4.6,
          '2016-09': 4.9,
          '2016-10': 5.5,
          '2016-11': 5.4,
          '2016-12': 5.7,
          '2017-01': 5.4,
          '2017-02': 5.3,
          '2017-03': 5.5,
          '2017-04': 5.4,
          '2017-05': 5.5,
          '2017-06': 5.6,
          '2017-07': 5.9,
          '2017-08': 5.3,
          '2017-09': 5.1,
          '2017-10': 5.2,
          '2017-11': 4.6,
          '2017-12': 4.9,
          '2018-01': 4.4,
          '2018-02': 4.7,
          '2018-03': 4.6,
          '2018-04': 4.5,
          '2018-05': 4.4,
          '2018-06': 5.1,
          '2018-07': 4.9,
          '2018-08': 5.7,
          '2018-09': 5.8,
          '2018-10': 4.5,
          '2018-11': 4.1,
          '2018-12': 4.1,
          '2019-01': 3.8,
          '2019-02': 3.7,
          '2019-03': 3.6,
          '2019-04': 3.8,
          '2019-05': 3.7,
          '2019-06': 4.0,
          '2019-07': 5.7,
          '2019-08': 4.4,
          '2019-09': 4.0,
          '2019-10': 3.9,
          '2019-11': 3.4,
          '2019-12': 3.9,
          '2020-01': 3.4,
          '2020-02': 3.9,
        }
      },
      'C': { 
        name: "centerpariet", 
        color: '#24d77e',
        isActive: true,
        opinionPolls: {
          '2016-03': 6.0,
          '2016-04': 6.3,
          '2016-05': 6.6,
          '2016-06': 7.3,
          '2016-07': 7.7,
          '2016-08': 7.4,
          '2016-09': 7.4,
          '2016-10': 7.8,
          '2016-11': 8.0,
          '2016-12': 8.8,
          '2017-01': 9.4,
          '2017-02': 11.4,
          '2017-03': 12.4,
          '2017-04': 12.3,
          '2017-05': 12.5,
          '2017-06': 12.1,
          '2017-07': 11.3,
          '2017-08': 11.9,
          '2017-09': 11.9,
          '2017-10': 10.5,
          '2017-11': 10.2,
          '2017-12': 9.6,
          '2018-01': 9.3,
          '2018-02': 9.9,
          '2018-03': 8.6,
          '2018-04': 9.2,
          '2018-05': 8.8,
          '2018-06': 9.1,
          '2018-07': 8.7,
          '2018-08': 8.3,
          '2018-09': 8.6,
          '2018-10': 8.9,
          '2018-11': 9.1,
          '2018-12': 7.7,
          '2019-01': 7.6,
          '2019-02': 7.8,
          '2019-03': 8.2,
          '2019-04': 8.0,
          '2019-05': 8.5,
          '2019-06': 9.0,
          '2019-07': 9.5,
          '2019-08': 8.3,
          '2019-09': 8.3,
          '2019-10': 8.3,
          '2019-11': 7.7,
          '2019-12': 8.1,
          '2020-01': 8.7,
          '2020-02': 8.3,
        }
      },
      'KD': { 
        name: "kristdemokraterna", 
        color: '#76A6C3',
        isActive: true,
        opinionPolls: {
          '2016-03': 3.6,
          '2016-04': 3.4,
          '2016-05': 3.8,
          '2016-06': 3.3,
          '2016-07': 3.5,
          '2016-08': 3.4,
          '2016-09': 3.3,
          '2016-10': 3.3,
          '2016-11': 3.1,
          '2016-12': 3.5,
          '2017-01': 3.1,
          '2017-02': 3.4,
          '2017-03': 3.1,
          '2017-04': 3.3,
          '2017-05': 3.3,
          '2017-06': 3.2,
          '2017-07': 3.0,
          '2017-08': 3.6,
          '2017-09': 3.5,
          '2017-10': 3.2,
          '2017-11': 3.3,
          '2017-12': 3.3,
          '2018-01': 3.1,
          '2018-02': 3.0,
          '2018-03': 3.9,
          '2018-04': 3.4,
          '2018-05': 3.3,
          '2018-06': 3.1,
          '2018-07': 3.5,
          '2018-08': 5.2,
          '2018-09': 6.1,
          '2018-10': 5.8,
          '2018-11': 5.9,
          '2018-12': 6.9,
          '2019-01': 7.8,
          '2019-02': 8.6,
          '2019-03': 10.8,
          '2019-04': 11.4,
          '2019-05': 10.8,
          '2019-06': 8.0,
          '2019-07': 9.2,
          '2019-08': 7.2,
          '2019-09': 6.6,
          '2019-10': 6.9,
          '2019-11': 7.2,
          '2019-12': 6.1,
          '2020-01': 6.7,
          '2020-02': 6.6,
        }
      },
      'SD': { 
        name: "sverigedemokraterna", 
        color: '#CEC000',
        isActive: true,
        opinionPolls: {
          '2016-03': 19.9,
          '2016-04': 18.7,
          '2016-05': 18.8,
          '2016-06': 19.0,
          '2016-07': 20.9,
          '2016-08': 19.5,
          '2016-09': 19.8,
          '2016-10': 19.7,
          '2016-11': 19.9,
          '2016-12': 19.4,
          '2017-01': 18.7,
          '2017-02': 20.3,
          '2017-03': 20.6,
          '2017-04': 20.7,
          '2017-05': 19.8,
          '2017-06': 20.8,
          '2017-07': 23.3,
          '2017-08': 20.4,
          '2017-09': 19.6,
          '2017-10': 17.9,
          '2017-11': 17.1,
          '2017-12': 18.1,
          '2018-01': 17.6,
          '2018-02': 17.8,
          '2018-03': 18.4,
          '2018-04': 18.4,
          '2018-05': 20.7,
          '2018-06': 22.1,
          '2018-07': 22.5,
          '2018-08': 20.0,
          '2018-09': 18.5,
          '2018-10': 18.6,
          '2018-11': 19.6,
          '2018-12': 20.0,
          '2019-01': 19.2,
          '2019-02': 19.6,
          '2019-03': 18.3,
          '2019-04': 18.5,
          '2019-05': 18.3,
          '2019-06': 19.1,
          '2019-07': 18.0,
          '2019-08': 20.0,
          '2019-09': 22.1,
          '2019-10': 22.8,
          '2019-11': 24.4,
          '2019-12': 24.1,
          '2020-01': 25.7,
          '2020-02': 23.4,
        }
      }
    }
  }

  componentDidMount = () => {

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

    this.setMonthList()
    .then(this.setMinMaxPercent)
    .then(this.setPercentageRatio)
    .then(this.setTimeSpan)
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

      const parties = Object.values(this.state.parties).filter(party => party.isActive)

      parties.forEach(party => {
        const opinionPolls = Object.keys(party.opinionPolls)
                             .filter(poll => 
                                moment(poll).isSameOrAfter(moment(this.state.fromMonth)) && 
                                moment(poll).isSameOrBefore(moment(this.state.toMonth)))
                             .map(poll => party.opinionPolls[poll])

        percentages = [...percentages, ...opinionPolls]
      })

      this.setState({
        min: Math.min.apply(Math, percentages) - 1,
        max: Math.max.apply(Math, percentages) + 1,
        readyToLoad: true,
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

      Object.values(this.state.parties).forEach(party => {
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
    Object.keys(this.state.parties).forEach(partyInitial => {
      partyPercentages[partyInitial] = this.state.parties[partyInitial].opinionPolls[month]
    })
    this.setState({
      currentMonth: month,
      previousPercentages: this.state.currentPercentages,
      currentPercentages: partyPercentages
    })
  }

  convertYearMonth = (monthYear) => {
    const m = moment(monthYear)
    return m.format("MMMM") + " " + m.format("YYYY")
  }

  filterMonths = (name, choice) => {
    this.setState({
      [name]: choice,
      readyToLoad: false
    }, () => {
      this.setTimeSpan()
      .then(this.setMinMaxPercent)
      .then(this.setPercentageRatio)
    })
  }

  toggleParty = (party) => {
    this.setState({
      readyToLoad: false,
      parties: {
        ...this.state.parties,
        [party]: {
          ...this.state.parties[party],
          isActive: !this.state.parties[party].isActive
        } 
      }
    }, () => this.setMinMaxPercent().then(this.setPercentageRatio))
  }

  render() {
      return this.state.readyToLoad? (
          <div className="time-chart-wrapper">
            <div className="time-chart-filter">
              <Selector 
                options={this.state.availableMonths.filter(month => moment(month).isBefore(moment(this.state.toMonth))).reverse()} 
                choice={this.state.fromMonth}
                name={"fromMonth"}
                select={this.filterMonths}
                />
              <Selector 
                options={this.state.availableMonths.filter(month => moment(month).isAfter(moment(this.state.fromMonth))).reverse()} 
                choice={this.state.toMonth}
                name="toMonth"
                select={this.filterMonths}
                />
              <div className="party-colors"> 
                { Object.keys(this.state.parties).map(party => 
                  <div key={party} className={"party-color-wrapper" + (this.state.parties[party].isActive? " active": '')} onClick={() => this.toggleParty(party)}>
                    <p>{party}</p>
                    <div className="party-color" style={{backgroundColor: this.state.parties[party].color}}/>
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

                { this.state.readyToLoad? Object.keys(this.state.parties).map(partyInitial => this.state.parties[partyInitial].isActive ?
                  <path 
                    key={partyInitial}
                    className="path"
                    d={this.state.shownMonths.map((month, index) => {
                      const y = (400 - (this.state.parties[partyInitial].opinionPolls[month] - this.state.min)*this.state.ratio)
                      const x = ((this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index)
                      return index === 0? 'M 2 '+y+' ': 'L '+x+' '+y+' '
                    })}
                    stroke={this.state.parties[partyInitial].color} 
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
                            <text className="time-chart-year" x="0" y="400" fill="red">{
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
                    ? Object.keys(this.state.parties).map(partyInitial => 
                      this.state.shownMonths.map((month, index) => {
                        
                        const x = (this.state.viewPortWidth/(this.state.shownMonths.length - 1))*index;
                        const y = (400 - (this.state.parties[partyInitial].opinionPolls[month] - this.state.min)*this.state.ratio)
                        const isShown = this.state.lineOffset > x - this.state.viewPortWidth/(2*(this.state.shownMonths.length - 1)) && 
                                        this.state.lineOffset < x + this.state.viewPortWidth/(2*(this.state.shownMonths.length - 1)) && 
                                        this.state.indicatorShown

                        if (isShown && this.state.currentMonth !== month) {
                          this.setCurrentMonthAndPartyPercentage(month)
                        }

                        return this.state.parties[partyInitial].isActive ? (
                          <circle 
                            key={month}
                            className={"indicator-circle" + (isShown? ' shown': '')}
                            cx={x}
                            cy={y} 
                            r="7" 
                            fill={this.state.parties[partyInitial].color}
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
                  <p className="current-month">{this.convertYearMonth(this.state.currentMonth)}</p>
                  <hr/>
                  {Object.keys(this.state.parties)
                   .sort((a, b) => this.state.currentPercentages[b] - this.state.currentPercentages[a])
                   .map(partyInitial => this.state.parties[partyInitial].isActive ? 
                    <div key={this.state.parties[partyInitial].name} className="party-name-and-percent">
                      <div className="party-color" style={{backgroundColor: this.state.parties[partyInitial].color}}/>
                      <p className="party-name">{this.state.parties[partyInitial].name}:</p>
                      <p className="party-percent">
                        <CountUp 
                          start={this.state.previousPercentages[partyInitial]} 
                          end={this.state.currentPercentages[partyInitial]} 
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

export default TimeChart;