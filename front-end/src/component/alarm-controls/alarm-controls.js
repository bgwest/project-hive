import React from 'react';
import AlarmControlsForm from '../alarm-controls-form/alarm-controls-form';
import { Link } from 'react-router-dom';

// style
import './alarm-controls.scss';
import * as routes from '../../routes';

import * as authActions from '../../action/auth';
import * as statusActions from '../../action/status';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

class AlarmControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.status = this.props.status;
    this.state.dispDefaultMessage = null;
    this.state.showStatus = false;
  }

  changePath = () => {
    console.log('inside changePath');
    // console.log(this.props);
    // this.props.history.location.pathname = routes.STATUS;
  };

  determineArmOrDisarm = (accesscode) => {
    // if system IS armed, attempt to DISARM
    if (this.state.status) {
      return this.attemptArmOrDisarm(accesscode, this.props.disarmSystem);
    } // else
    // if system is NOT armed, attempt to ARM
    return this.attemptArmOrDisarm(accesscode, this.props.armSystem);
  };

  attemptArmOrDisarm = (accesscode, systemFunction) => {
    return systemFunction(accesscode)
      .then((response) => {
        console.log('response:');
        const convertedResponse = JSON.parse(response.payload);
        if (convertedResponse.isValid) {
          // if accessCode is valid... now determine is arm or disarm ran
          if (convertedResponse.arm) {
            this.setState({ status: true, dispDefaultMessage: false });
          }
          if (convertedResponse.disarm) {
            this.setState({ status: false, dispDefaultMessage: false });
          }
          this.props.updateSystemStatus(this.state.status);
        }
        this.changePath();
      })
      .catch(console.error);
  };

  defaultAlarmControlsMessage = () => {
    return (
      <React.Fragment>
        <br/>
        <div className="ensureNoSquash">
          {this.props.token === null ? <p>Recommended: login first.</p> : null}
          <br/>
          <p><b>Please note:</b></p>
          <li>A VALID access code will also post system status.</li>
          <li>If the state of the system is enabled, a disable will be ran.</li>
          <li>If the state of the system is disabled, an enable will be ran.</li>
          </div>
      </React.Fragment>
    );
  };

  renderTheCorrectSystemActionMessage = () => {
    if (this.state.status === true && this.state.dispDefaultMessage === false) {
      return <p>Access Code Accepted.<br/>System ARMED.</p>;
    }
    if (this.state.status === false && this.state.dispDefaultMessage === false) {
      return <p>Access Code Accepted.<br/>System DISARMED.</p>;
    }
  };

  // attemptArm = (accesscode) => {
  //   return this.props.armSystem(accesscode)
  //     .then((response) => {
  //       console.log('response:');
  //       const convertedResponse = JSON.parse(response.payload);
  //       if (convertedResponse.isValid) {
  //         console.log(convertedResponse.isValid);
  //         this.setState({ status: true });
  //         this.props.updateSystemStatus(this.state.status);
  //       }
  //       this.changePath();
  //     })
  //     .catch(console.error);
  // };

  render() {
    return (
      <section className="alarmControls">
        <AlarmControlsForm onComplete={this.determineArmOrDisarm}/>
        {/*{this.state.status === true ? <p>Access Code Accepted.<br/>System ARMED.</p> : null}*/}
        {/*{this.state.status === false ? <p>Access Code Accepted.<br/>System DISARMED.</p> : null}*/}
        {this.renderTheCorrectSystemActionMessage()}
        {this.state.dispDefaultMessage === null ? this.defaultAlarmControlsMessage() : null}
      </section>
    );
  }
}

// export default AlarmControls;

const mapStateToProps = state => ({
  token: state.token,
  status: state.status,
});

const mapDispatchToProps = dispatch => ({
  armSystem: accesscode => dispatch(statusActions.armSystem(accesscode)),
  disarmSystem: accesscode => dispatch(statusActions.disarmSystem(accesscode)),
  updateSystemStatus: status => dispatch(statusActions.set(status)),
});

AlarmControls.propTypes = {
  location: PropTypes.object,
  armSystem: PropTypes.func,
  disarmSystem: PropTypes.func,
  updateSystemStatus: PropTypes.func,
};

// export default Landing;
export default connect(mapStateToProps,mapDispatchToProps)(AlarmControls);
