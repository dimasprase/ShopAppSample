import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import HomeSeller from './components/HomeSeller'
import TrackingCourier from './components/TrackingCourier'
import Cart from './components/Cart'
import History from './components/History'
import Delivered from './components/Delivered'

class App extends Component {
  render() {
    return (
       <BrowserRouter>
            <div className="App">
            
              <Navbar/>
                <Switch>
                    <Route exact path="/buyer" component={Home}/>
                    <Route path="/buyer/cart" component={Cart}/>
                    <Route path="/buyer/history" component={History}/>
                    <Route path="/seller" component={HomeSeller}/>
                    <Route path="/tracking" component={TrackingCourier}/>
                    <Route path="/delivered" component={Delivered}/>
                  </Switch>
             </div>
       </BrowserRouter>
      
    );
  }
}

export default App;
