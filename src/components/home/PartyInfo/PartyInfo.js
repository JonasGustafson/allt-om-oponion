import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactGA from 'react-ga';

import Icon from '../../../resources/icons/icon';

import './PartyInfo.scss';
import TimeChart from '../TimeChart/TimeChart';

class PartyInfo extends Component {

    partyDisplayInfo = React.createRef()

    state = {
        showArrow: false,
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.determineScroll)
        window.dispatchEvent(new Event('resize'))
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.determineScroll)
    }

    determineScroll = () => {
        const {scrollWidth, clientWidth} = this.partyDisplayInfo.current;
        this.setState({showArrow: scrollWidth > clientWidth})
        
    }

    scrollToNextColumn = () => {
        const {clientWidth} = this.partyDisplayInfo.current;
        const columnCount = window.getComputedStyle(this.partyDisplayInfo.current).getPropertyValue('column-count');
        const columnGap = parseFloat(window.getComputedStyle(this.partyDisplayInfo.current).getPropertyValue('column-gap').split('px')[0]);
        const factor = Math.ceil(this.partyDisplayInfo.current.scrollLeft / (clientWidth/columnCount + columnGap))+1
        this.partyDisplayInfo.current.scroll({left: (clientWidth/columnCount + columnGap)*factor, behavior: 'smooth'})
    }

    render() {
        return (
            <div className="party-info-bg">
                <div className="bg" onClick={this.props.togglePartyModal}/>
                    
                <div className="party-info-container-wrapper">
                    <div className='close-icon-wrapper' onClick={this.props.togglePartyModal}>
                        <Icon icon='cross' height={'50%'} color={this.props.party.color}/> 
                    </div>
                    <div className="party-info-container">
                        <div className="party-info-hero">
                            { this.state.showArrow &&
                                <Icon icon='arrow' color={this.props.party.color} onClick={this.scrollToNextColumn} width='25px'/>
                            }
                            <div className="party-leader">
                                <img className="party-leader-image" src={this.props.party.party_leader_image} alt="party-leader"/>
                            </div>
                            <div className="party-info">
                                <div className="party-logo">
                                    <img className="party-logo-image" src={this.props.party.logo} alt="party-logo"/>
                                    <h1 className="party-logo-name">{this.props.party.name}</h1>
                                </div>
                                <div ref={this.partyDisplayInfo} className="party-display-info">
                                    <strong>{this.props.party.heroText.breadText}</strong>
                                    <br/><br/>
                                    {this.props.party.heroText.paragraphs.map((para) => {
                                        return (
                                            <React.Fragment>
                                                {para.title && <strong style={{fontSize: '20px'}}>{para.title}</strong>}
                                                {para.title && <br/>}
                                                {para.text}
                                                <br/><br/>
                                            </React.Fragment>
                                        )
                                    })}
                                    
                                </div>
                                <div className="party-links">
                                    <a className="member-button" onClick={() => ReactGA.event({category: 'Party Homepage', action: this.props.party.name})} href={this.props.party.homepage} target="_blank" rel="noopener noreferrer" style={{backgroundColor: this.props.party.color}}>Hemsida</a>
                                    <a className="member-button" onClick={() => ReactGA.event({category: 'Party Member', action: this.props.party.name})} href={this.props.party.register_url} target="_blank" rel="noopener noreferrer" style={{backgroundColor: this.props.party.color}}>Bli Medlem</a>
                                </div>
                                
                            </div>
                            
                        </div>
                        <div className="party-ideology" style={{backgroundColor: this.props.party.color}}>
                            <p className="party-ideology-header">
                                Statistik
                            </p>
                            <div className="party-ideologies">
                                <TimeChart partyInitials={this.props.partyInitials}/>
                            </div>
                        </div>
                        <div className="party-statistics">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
} 

const mapStateToProps = (state, ownProps) => {
    return {
        party: state.party.parties[ownProps.party],
        partyInitials: ownProps.party
    }
}

export default connect(mapStateToProps)(PartyInfo);