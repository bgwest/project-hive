import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as routes from '../../routes';


class AuthRedirect extends React.Component {
  render() {
    const { location, token } = this.props;
    const { pathname } = location;
    // !: pathname is the string representing the actual route
    let destinationRoute = null;
    if (pathname === routes.LOGIN || pathname === routes.SIGNUP_FRONTEND
      || pathname === routes.ROOT) {
      if (token) {
        // !: if the user is logged in, we'll take him/her to the dashboard
        destinationRoute = routes.DASHBOARD;
      }
    } else if (!token && pathname === routes.ALARM_CONTROLS) {
      destinationRoute = routes.ALARM_CONTROLS;
    } else if (!token && pathname === '/home') {
      destinationRoute = '/home';
    } else if (!token) {
      // !: if the user is not logged in, we'll take him/her to root (/)
      destinationRoute = routes.ROOT;
      alert('Please login before using Status or Dashboard.');
    }
    // !:  DASHBOARD, ROOT, null
    console.log('DESTINATION_ROUTE', destinationRoute);
    return (
      <div>
        { destinationRoute ? <Redirect to={destinationRoute}/> : undefined }
      </div>
    );
  }
}

AuthRedirect.propTypes = {
  token: PropTypes.string,
  location: PropTypes.object, // !: this is the current front-end route
};

// !: I'm mapping to the state because I need
// !: access to the token that's on the store
const mapStateToProps = state => ({
  token: state.token,
});

export default connect(mapStateToProps)(AuthRedirect);
