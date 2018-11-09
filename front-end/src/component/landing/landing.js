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
    this.state.errors = {};
    this.state.errors.duplicateEntry = this.props.notUnique || null;
    this.state.errors.duplicateEntryType = null;
  }

  handleLogin = (user) => {
    return this.props.pDoLogin(user)
      .then(() => {
        console.log('user login called');
        this.props.history.push(routes.DASHBOARD);
      })
      .catch(console.error);
  };

  handleSignup = (user) => {
    return this.props.uniqueHandling(user)
      .then((response) => {
        const convertedResponse = response;
        if (convertedResponse.foundUser === true || convertedResponse.foundEmail === true) {
          let displayFailure = convertedResponse.foundUser ? 'username' : null;
          if (displayFailure === null) {
            displayFailure = convertedResponse.foundEmail ? 'email' : null;
          }
          console.log(`${displayFailure} already exists... try again.`);
          console.log(convertedResponse);
          this.state.errors.duplicateEntry = true;
          this.state.errors.duplicateEntryType = displayFailure;
          return this.setState(this.state);
        } // else
        return convertedResponse.foundUser || convertedResponse.foundEmail;
      }).then((trueOrFalse) => {
        if (trueOrFalse === true) {
          console.log('this should never happen. if it does, something is wrong.');
        } // else
        if (trueOrFalse === false) {
          // console.log('time to signup.');
          // console.log(user);
          return this.props.pDoSignUp(user);
        }
      }).then((finalReply) => {
        let doIhaveAToken = null;
        if (typeof finalReply !== 'undefined') {
          doIhaveAToken = JSON.parse(finalReply.payload);
          if (doIhaveAToken.token) {
            return this.props.history.push(routes.DASHBOARD);
          }
        } // else
        return null;
      })
      .catch(console.error);
  };

  homePageMessage = () => {
    return <p className="home">Welcome Home :)</p>;
  };

  render() {
    const { location } = this.props;
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
          {this.state.errors.duplicateEntry === true ? <p>{this.state.errors.duplicateEntryType} already exists... try again</p> : null}
          {location.pathname === '/viewstatus' ? <Status status={this.props.status}/> : null}
          {location.pathname === '/home' ? this.homePageMessage() : null}
          { /*location.pathname === '/finish/oauth' ? this.pHandleOauthSignUp : null */ }
          { /* if isVisible is true, box is visible. if isVisible is false, hidden. */ }
        </React.Fragment>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  status: state.status,
  notUnique: state.notUnique,
});

const mapDispatchToProps = dispatch => ({
  pDoSignUp: user => dispatch(authActions.signupRequest(user)),
  pDoLogin: user => dispatch(authActions.loginRequest(user)),
  uniqueHandling: account => dispatch(authActions.uniqueHandling(account)),
  pHandleOauthSignUp: google => dispatch(authActions.oauthPostOperation(google)),
});

Landing.propTypes = {
  location: PropTypes.object,
  pDoSignUp: PropTypes.func,
  pDoLogin: PropTypes.func,
};

export default connect(mapStateToProps,mapDispatchToProps)(Landing);
