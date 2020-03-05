import React, { PureComponent } from 'react'

import Hero from './Hero/Hero';
import TimeChart from './TimeChart/TimeChart';

import './Home.scss';
import PartyInfo from './PartyInfo/PartyInfo';



class Home extends PureComponent {
	state = {
    partyModalOpen: false,
    partyInModal: '',
  }
  
  togglePartyModal = (party) => {
    if (this.state.partyModalOpen) {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    }
    this.setState({
      partyInModal: party,
      partyModalOpen: !this.state.partyModalOpen,
    })
  }

	render() {
		return (
			<div className="home-page">
				<Hero togglePartyModal={this.togglePartyModal}/>
        <TimeChart />
        { this.state.partyModalOpen &&
          <PartyInfo 
            party={this.state.partyInModal} 
            togglePartyModal={this.togglePartyModal}/>
        }
			</div>
		)
	}
}

export default Home
