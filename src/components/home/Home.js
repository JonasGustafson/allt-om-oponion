import React, { PureComponent } from 'react'

import Hero from './Hero/Hero';
import TimeChart from './TimeChart/TimeChart';

import './Home.scss';
import Contact from '../contact/Contact';

class Home extends PureComponent {

	render() {
		return (
			<div className="home-page">
				<Hero togglePartyModal={this.props.togglePartyModal}/>
        		<TimeChart />
				<Contact />
        
			</div>
		)
	}
}

export default Home
