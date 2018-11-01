import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from '../landing/landing';
// import Dashboard from '../dashboard/dashboard';
// import AuthRedirect from '../auth-redirect/auth-redirect';


class App extends React.Component {
  render() {
    console.log('APP');
    return (
        <div>
        <BrowserRouter>
        <div>
          { /* <Route path='*' component={AuthRedirect}/> */ }
    <Route exact path='/' component={Landing}/>
    <Route exact path='/signup' component={Landing}/>
    <Route exact path='/login' component={Landing}/>
    </div>
    </BrowserRouter>
    </div>
  );
  }
}

export default App;
