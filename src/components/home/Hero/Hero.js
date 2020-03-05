import React, {Component} from 'react';
import {connect} from 'react-redux';

import PartyChart from '../PartyChart/PartyChart';

import * as helper from '../../../utils/Helper';

import './Hero.scss';

class Hero extends Component {
    render() {
        return (
            <div className="hero">
                <h1>Välkommen, här finner du allt om Sveriges riksdags opinion</h1>
                <h3>Läget från opinionsundersökningar {helper.convertYearMonth(this.props.latestUpdate)}</h3>
                <PartyChart togglePartyModal={this.props.togglePartyModal}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        latestUpdate: state.party.latestUpdate,
    }
}

export default connect(mapStateToProps)(Hero);