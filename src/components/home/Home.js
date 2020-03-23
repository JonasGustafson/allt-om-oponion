import React, { PureComponent } from 'react'

import Hero from './Hero/Hero';
import TimeChart from './TimeChart/TimeChart';

import './Home.scss';

class Home extends PureComponent {

	render() {
		return (
			<div className="home-page">
				<Hero togglePartyModal={this.props.togglePartyModal}/>
        <TimeChart />
        
			</div>
		)
	}
}

export default Home
