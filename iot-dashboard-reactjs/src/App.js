import React from 'react';
import './App.css';
import LoginPage from './pages/loginpage/loginpage.component';
import RegisterPage from './pages/registerpage/registerpage.component';
import DeviceTypePage from './pages/devicetypepage/devicetypepage.component';
import EndpointTypePage from './pages/endpointtypepage/endpointtypepage.component';
import DevicePage from './pages/devicepage/devicepage.component';
import { Switch, Route } from 'react-router-dom';
import EndpointDetailPage from './pages/endpointdetailpage/endpointdetailpage.component';
import EndpointPage from './pages/endpointpage/endpointpage.component';
import DashboardPage from './pages/dashboard-page/dashboardpage.component';
import DashBoardDetailPage from './pages/dashboard-detail-page/dashboarddetailpage.component';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'bootstrap/dist/css/bootstrap.min.css';
class App extends React.Component {
  render(){
    return(
      <div className="App">
        <ReactNotification />
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/register" component={RegisterPage}/>
          <Route exact path="/devicetype" component={DeviceTypePage}/>
          <Route exact path="/endpointtype" component={EndpointTypePage}/>
          <Route exact path="/device" component={DevicePage}/>
          <Route exact path="/device/:deviceId" component={EndpointPage}/>
          <Route exact path="/device/:deviceId/:endpointId" component={EndpointDetailPage}/>
          <Route exact path="/dashboard" component={DashboardPage}/>
          <Route exact path="/dashboard/:dashboardId" component={DashBoardDetailPage}/>
        </Switch>
      </div>
    )
  }
}

export default App;
