import React from 'react';
import { Link } from 'react-router-dom';

class LandingUI extends React.Component {
  render() {
    return (
      <nav className="landingUI">
        <Link to='/signup' className="landingUILinks"> Signup </Link>
        <Link to='/login' className="landingUILinks"> Login </Link>
        <Link to='/dashboard' className="landingUILinks"> Dashboard </Link>
        <Link to='/alarmcontrols' className="landingUILinks"> Alarm Controls </Link>
        <Link to='/viewstatus' className="landingUILinks"> Status </Link>
      </nav>
    );
  }
}

export default LandingUI;
