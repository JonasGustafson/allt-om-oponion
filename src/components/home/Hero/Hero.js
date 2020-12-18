import React, {Component} from 'react';
import {connect} from 'react-redux';

import PartyChart from '../PartyChart/PartyChart';
import PartyChartFilter from '../PartyChartFilter/PartyChartFilter';

import * as helper from '../../../utils/Helper';

import './Hero.scss';

class Hero extends Component {

    initState = {
        parties: this.props.parties,
        chart: 'opinionsundersökningar',
        moment: '2020-05',
    }

    state = this.initState //When adding a server for data retrieval, this needs to be gathered via promise

    onPartyChartChange = (type, data) => {
        if (type === 'chart') {
            this.setState({
                [type]: data,
                moment: data === 'riksdagsval'? this.props.latestElection: this.props.latestOpinion,
            })
        } else if (type === "moment") {
            this.setState({[type]: data})
        } else {
            this.setState({[type]: this.state[type].includes(data)
                ? this.state[type].filter(d => d !== data)
                : [...this.state[type], data]
            })
        }
    }

    render() {
        return (
            <div className="hero">
                <h1>Välkommen, här finner du allt om Sveriges väljaropinion</h1>
                {this.state.chart === 'riksdagsval'
                    ? <h3>Riksdagsvalet  {this.state.moment}</h3>
                    : <h3>Läget från opinionsundersökningar {helper.convertYearMonth(this.state.moment)}</h3>
                }
                
                <PartyChart 
                    chart={this.state.chart}
                    moment={this.state.moment}
                    togglePartyModal={this.props.togglePartyModal}
                    shownParties={this.state.parties}/>
                <PartyChartFilter 
                    moment={this.state.moment}
                    chart={this.state.chart}
                    onFilterChange={this.onPartyChartChange}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const electionYears = helper.getAllElectionYears(state.party.parties);
    const opinionMonths = helper.getAllOpinionMonths(state.party.parties);

    return {
        latestElection: electionYears[0],
        latestOpinion: opinionMonths[0],
        parties: Object.keys(state.party.parties),
        latestUpdate: state.party.latestUpdate,
    }
}

export default connect(mapStateToProps)(Hero);