import React, {PureComponent} from 'react';
import CountUp from 'react-countup';

import VLogo from '../../../resources/imgs/partylogos/vansterpartiet.png';
import SLogo from '../../../resources/imgs/partylogos/socialdemokraterna.png';
import MPLogo from '../../../resources/imgs/partylogos/miljopartiet.png';
import MLogo from '../../../resources/imgs/partylogos/moderaterna.png';
import LLogo from '../../../resources/imgs/partylogos/liberalerna.png';
import CLogo from '../../../resources/imgs/partylogos/centerpartiet.png';
import KDLogo from '../../../resources/imgs/partylogos/kristdemokraterna.png';
import SDLogo from '../../../resources/imgs/partylogos/sverigedemokraterna.png';

import './PartyChart.scss';

class PartyChart extends PureComponent {

  state = {
    parties: [
      {name: 'Vänsterpartiet',      initials: 'V',  percent: 10.5,  color: '#A50A24', logo: VLogo},
      {name: 'Socialdemokraterna',  initials: 'S',  percent: 23.3,  color: '#EB142E', logo: SLogo},
      {name: 'Miljöpartiet',        initials: 'MP', percent: 4.1,   color: '#006031', logo: MPLogo},
      {name: 'Moderaterna',         initials: 'M',  percent: 17.6,  color: '#004FAA', logo: MLogo},
      {name: 'Liberalerna',         initials: 'L',  percent: 3.6,   color: '#1A74A1', logo: LLogo},
      {name: 'Centerpartiet',       initials: 'C',  percent: 8.5,   color: '#24d77e', logo: CLogo},
      {name: 'Kristdemokraterna',   initials: 'KD', percent: 6.6,   color: '#76A6C3', logo: KDLogo},
      {name: 'Sverigedemokraterna', initials: 'SD', percent: 24.5,  color: '#CEC000', logo: SDLogo},
    ],
    maxPercent: 80,
    ratio: 0,
  }

  componentDidMount = () => {
    this.setState({ratio: this.state.maxPercent/(Math.max.apply(Math, this.state.parties.map(p => p.percent)))})
  }

  render(){
    return (
      <div className="party-chart-wrapper">
          <div className="party-chart">
            {this.state.parties.map(party => 
              <div className="party-stable-wrapper" key={party.name}>
                <CountUp className="party-percent" end={party.percent} duration={2} decimal={','} decimals={1} suffix={'%'}/>
                <div  className="party-staple" style={{height: party.percent*this.state.ratio+'%', backgroundColor: party.color}}></div>  
              </div>
            )}
          </div>
          <div className="party-chart-labels">
            {this.state.parties.map(party => 
              <div key={party.name} className="party-label">
                <img className="party-logo" src={party.logo} alt="party-logo"/>
              </div>  
            )}
          </div>
      </div>
    )
  }
}

export default PartyChart