import React from 'react';
import { Link } from 'react-router-dom';

class LandingUI extends React.Component {
  render() {
    return (
      <nav className="landingUI">
        {/* Signup is not an option because you will be redirected automatically */ }
        {/* Signup will only appear on login component and if token is not present */}

        {/* Eventually, I only want login to render conditionally */ }
        <Link to='/login' className="landingUILinks"> Login </Link>
        {/* Dashboard isn't an option because it is a result of sign in */ }
        {/* Dashboard will auto load if signed in. If not, a successful login
            will render dashboard... */ }
        <Link to='/dashboard' className="landingUILinks"> Dashboard </Link>
        <Link to='/alarmcontrols' className="landingUILinks"> Alarm Controls </Link>
        <Link to='/viewstatus' className="landingUILinks"> Status </Link>

      </nav>
    );
  }
}

export default LandingUI;
