import React, {Component} from 'react';
import MainRoutes from './routes/MainRoutes';
import NavBar from './navigation/NavBar/NavBar/NavBar';

class App extends Component {

  componentDidMount = () => {
    //Retrieve all needed data from not yet created server
  }

  render(){
    return (
      <div className="App">
        <NavBar />
        <MainRoutes />
        <div style={{height: '1000px'}}></div>
      </div>
    );
  }
}

export default App;
