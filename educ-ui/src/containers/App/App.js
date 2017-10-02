import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import logo from '../../images/logo.svg';
import './App.css';
import 'babel-polyfill'
import NetworkStatus from 'react-web3-network-status'

import Home from '../Home/Home';
import About from '../About/About';
import Chat from '../Chat/Chat';
import Catalog from '../Catalog/Catalog';
import Course from '../Course/Course';

class App extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            showHideSidenav: "toggled"
        }
    }

    render() {
        return (
            <div className="App"> 
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h4>Welcome to React - Hello</h4>
                </div>
        
                <Router>
                    <div className={ this.state.showHideSidenav === 'toggled' ? 'App-wrapper toggled': 'App-wrapper'}>
                        <div className="App-sidebar">
                            <ul className="sidebar-nav">
                                <li onClick={this.toggleSidenav.bind(this)} className="toggled"><i className="fa fa-exchange fa-fw" aria-hidden="true" ></i></li>
                                <li><Link to="/"><i className="fa fa-home" aria-hidden="true"></i>Home</Link></li>
                                <li><Link to="/catalog"><i className="fa fa-list" aria-hidden="true"></i>Catalog</Link></li>
                                <li><Link to="/course"><i className="fa fa-graduation-cap" aria-hidden="true"></i>Course</Link></li>
                                <li><Link to="/chat"><i className="fa fa-comments" aria-hidden="true"></i>Chat</Link></li>
                                <li><Link to="/about"><i className="fa fa-info-circle" aria-hidden="true"></i>About</Link></li>
                            </ul>
                        </div>
                    
                        <div className="App-content">
                        
                            <div className="container-fluid">
                                <Route exact path="/" component={Home}/>
                                <Route exact path="/catalog" component={Catalog}/>
                                <Route exact path="/course" component={Course}/>
                                <Route exact path="/chat" component={Chat}/>
                                <Route path="/about" component={About}/>

                            </div>
                        
                        </div>
                    </div>
                </Router>
            
                <div className="footer">
                    <div className="container">
                        <p className="text-muted">123456</p>
                        <div className="pull-right"><NetworkStatus /></div>
                    </div>
                </div>
 
            </div>
        );
    }
  
    toggleSidenav() {
        var css = (this.state.showHideSidenav === "hidden") ? "toggled" : "hidden";
        this.setState({"showHideSidenav": css});
    }
  
}

export default App;
