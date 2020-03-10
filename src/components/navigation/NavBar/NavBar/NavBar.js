import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import styles from './NavBar.scss';

class NavBar extends PureComponent {

  navbar = React.createRef()

  state = {
    navbarPosition: 'sticky',
    partiesToggled: false,
    navbarAbsoluteOffset: parseInt(styles.navBarAbsoluteOffset.split("px")[0]),
  }

  componentDidMount = () => {
    if (this.props.history.location.pathname === '/') {
      window.addEventListener("scroll", this.handleScroll);
      window.dispatchEvent(new Event('scroll'))
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (this.navbar.current && (this.navbar.current.offsetTop < window.scrollY) && (this.state.navbarPosition === 'absolute')) {
      this.setState({navbarPosition: 'sticky'})
    } else if ((this.state.navbarAbsoluteOffset > window.scrollY) && (this.state.navbarPosition === 'sticky')) {
      this.setState({navbarPosition: 'absolute'})
    }
  }

  toggleParties = () => {
    this.setState({
      partiesToggled: !this.state.partiesToggled,
    })
  }

  closeParties = () => {
    this.setState({
      partiesToggled: false,
    })
  }

  render () {
    return (
      <div className={"navbar " + this.state.navbarPosition} ref={this.navbar} onMouseLeave={this.closeParties}>
        {/* <img className="logo" src={logo} alt="logo"/> */}
        <ul className="left-navbar">
          
          <li className="parties-list">
            <div className="parties" onClick={this.toggleParties}>
              <div className="div-arrow" />
              <p>Läs mer om</p>
            </div>
            <ul className={"party-list " + (this.state.partiesToggled? 'toggled': '')}>
              <div className={"party-list-wrapper " + (this.state.partiesToggled? 'toggled': '')}>
                {Object.keys(this.props.parties).map(party => 
                  <p key={party} style={{backgroundColor: this.props.parties[party].color}}>{party}</p>
                )}
              </div>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    parties: state.party.parties,
  }
}

export default withRouter(connect(mapStateToProps)(NavBar))