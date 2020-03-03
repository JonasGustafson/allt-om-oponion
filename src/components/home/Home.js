import React, { PureComponent } from 'react'

import './Home.scss';
import PartyChart from './PartyChart/PartyChart';
import TimeChart from './TimeChart/TimeChart';

class Home extends PureComponent {
	state = {

	}

	render() {
		return (
			<div className="home-page">
				<PartyChart />
        		<TimeChart />
			</div>
		)
	}
}

export default Home
