import React, {Component} from 'react';
import MainRoutes from './routes/MainRoutes';
import NavBar from './navigation/NavBar/NavBar/NavBar';
import PartyInfo from './home/PartyInfo/PartyInfo';

class App extends Component {

  state = {
    partyModalOpen: false,
    partyInModal: '',
  }

  componentDidMount = () => {
    //Retrieve all needed data from not yet created server
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

  render(){
    return (
      <div className="App">
        <NavBar togglePartyModal={this.togglePartyModal}/>
        <MainRoutes togglePartyModal={this.togglePartyModal}/>
       
        <div style={{height: '1000px'}}></div>
        { this.state.partyModalOpen &&
          <PartyInfo 
            party={this.state.partyInModal} 
            togglePartyModal={this.togglePartyModal}/>
        }
      </div>
    );
  }
}

export default App;
