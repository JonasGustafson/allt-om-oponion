import React, {Component} from 'react';
import {connect} from 'react-redux'

import './PartyInfo.scss';

class PartyInfo extends Component {
    render() {
        return (
            <div className="party-info-bg">
                <div className="bg" onClick={this.props.togglePartyModal}/>
                <div className="party-info-container">
                    <div className="party-info-hero">
                        <div className="party-leader">
                            <img className="party-leader-image" src={this.props.party.party_leader_image} alt="party-leader"/>
                        </div>
                        <div className="party-info">
                            <div className="party-logo">
                                <img className="party-logo-image" src={this.props.party.logo} alt="party-logo"/>
                                <h1 className="party-logo-name">{this.props.party.name}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="filler" style={{backgroundColor: this.props.party.color}}>

                        <p>HEJHEJ</p>

                    </div>
                </div>
            </div>
        )
    }
} 

const mapStateToProps = (state, ownProps) => {
    return {
        party: state.party.parties[ownProps.party]
    }
}

export default connect(mapStateToProps)(PartyInfo);