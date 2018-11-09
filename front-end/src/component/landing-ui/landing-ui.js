import React from 'react';
import { Link } from 'react-router-dom';

const oauthHref = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3000/oauth/google&scope=openid%20email%20profile&client_id=${CLIENT_ID}&prompt=consent&response_type=code`;

class LandingUI extends React.Component {
  render() {
    return (
      <nav className="landingUI">
        <Link to='/signup' className="landingUILinks"> Signup </Link>
        <Link to='/login' className="landingUILinks"> Login </Link>
        <Link to='/dashboard' className="landingUILinks"> Dashboard </Link>
        <Link to='/alarmcontrols' className="landingUILinks"> Alarm Controls </Link>
        <Link to='/viewstatus' className="landingUILinks"> Status </Link>
        <a href={oauthHref} className="landingUILinks">Login with Google</a>
      </nav>
    );
  }
}

export default LandingUI;
