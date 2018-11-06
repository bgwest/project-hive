// libraries and packages
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// components
import LandingUI from '../landing-ui/landing-ui';
import AlarmControls from '../alarm-controls/alarm-controls';
import Status from '../status/status';
// to be user login form
import UserAuthForm from '../user-auth-form/user-auth-form';
import Block from '../block/block';

// images
import hiveLogoOne from '../../assets/hive-logo1.png';
import hiveLogoTwo from '../../assets/hive-logo2.png';

// routes and actions
import * as routes from '../../routes';
import * as authActions from '../../action/auth';

// style
import './landing.scss';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.render = {};
    this.state.render.alarmControls = false;
  }

  handleLogin = (user) => {
    return this.props.pDoLogin(user)
      .then(() => {
        this.props.history.push(routes.DASHBOARD);
      })
      .catch(console.error);
  };

  handleSignup = (user) => {
    return this.props.pDoSignUp(user)
      .then(() => {
        this.props.history.push(routes.DASHBOARD);
      })
      .catch(console.error);
  };

  homePageMessage = () => {
    return <p className="home">Welcome Home :)</p>;
  };

  render() {
    const { location } = this.props;
    console.log('landing:');
    console.log(this.props.token);
    return (
      <section>
        <React.Fragment>
          <LandingUI/>
          <div className="hiveLogoOneWrapper">
            <a className="hiveHomeLink" target="_blank" href="https://github.com/bgwest/project-hive">
              {
                <img src={hiveLogoOne} className="hiveLogoOne" alt="project-hive"/>
              }
            </a>
            <p className="hiveLogoOneText">README?</p>
          </div>
          <Link to='/home' className="hiveHomeLink">
            {
              <img src={hiveLogoTwo} className="hiveLogoTwo" alt="project-your-hive"/>
            }
          </Link>
          { /* Only renders alarmcontrols if link is clicked */ }
          {location.pathname === '/alarmcontrols' ? <AlarmControls/> : null}
          {location.pathname === '/login' ? <UserAuthForm type='login' onComplete={this.handleLogin}/> : null}
          {location.pathname === '/signup' ? <UserAuthForm type='signup' onComplete={this.handleSignup}/> : null}
          {location.pathname === '/viewstatus' ? <Status status={this.props.status}/> : null}
          {location.pathname === '/home' ? this.homePageMessage() : null}
          { /* if isVisible is true, box is visible. if isVisible is false, hidden. */ }
        </React.Fragment>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  status: state.status,
});

const mapDispatchToProps = dispatch => ({
  pDoSignUp: user => dispatch(authActions.signupRequest(user)),
  pDoLogin: user => dispatch(authActions.loginRequest(user)),
});

Landing.propTypes = {
  location: PropTypes.object,
  pDoSignUp: PropTypes.func,
  pDoLogin: PropTypes.func,
};

// export default Landing;
export default connect(mapStateToProps,mapDispatchToProps)(Landing);
