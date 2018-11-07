import React from 'react';
import { Link } from 'react-router-dom';

// style
import './dashboard.scss';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import Block from '../block/block';
import * as statusActions from '../../action/status';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Block/>
        <br />
        <Link to='/home' className="dashboardGoBack"> ◀Back </Link>
        <Link to='/viewstatus' className="dashboardUILinks"> Status </Link>
        <h3>Upcoming Features...</h3>
        <p> - View Villains</p>
        <p> - Create Alert</p>
        <br/>
        <p><b>Note:</b></p>
        <p>Slide left / right feature also a future implementation.</p>
        <p>The idea is, once you are logged in, it is just as good as an access code.</p>
        <p>For now, please use access controls on landing to control the hive.</p>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  location: PropTypes.object,
  status: PropTypes.bool,
};

const mapStateToProps = state => ({
  token: state.token,
  status: state.status,
  notUnique: state.notUnique,
});

const mapDispatchToProps = dispatch => ({
  armSystem: accesscode => dispatch(statusActions.armSystem(accesscode)),
  disarmSystem: accesscode => dispatch(statusActions.disarmSystem(accesscode)),
  updateSystemStatus: status => dispatch(statusActions.set(status)),
});

// export default Landing;
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
