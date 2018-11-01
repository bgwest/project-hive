import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from '../landing/landing';
import Dashboard from '../dashboard/dashboard';
// import AuthRedirect from '../auth-redirect/auth-redirect';


class App extends React.Component {
  render() {
    return (
        <div>
          <BrowserRouter>
            <div>
              { /* <Route path='*' component={AuthRedirect}/> */ }
              <Route exact path='/' component={Landing}/>
              <Route exact path='/signup' component={Landing}/>
              <Route exact path='/viewstatus' component={Landing}/>
              <Route exact path='/dashboard' component={Dashboard}/>
              <Route exact path='/login' component={Landing}/>
              <Route exact path='/alarmcontrols' component={Landing}/>
            </div>
          </BrowserRouter>
        </div>
    );
  }
}

export default App;
