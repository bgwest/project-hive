import React from 'react';
import AlarmControlsForm from '../alarm-controls-form/alarm-controls-form';

// style
import './alarm-controls.scss';

import * as statusActions from '../../action/status';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

class AlarmControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.status = this.props.status;
    this.state.dispDefaultMessage = null;
    this.state.accessCodeIsValid = true;
    this.state.waitForValidation = null;
  }

  determineArmOrDisarm = (accesscode) => {
    // if system IS armed, attempt to DISARM
    if (this.state.status) {
      return this.attemptArmOrDisarm(accesscode, this.props.disarmSystem);
    } // else
    // if system is NOT armed, attempt to ARM
    return this.attemptArmOrDisarm(accesscode, this.props.armSystem);
  };

  attemptArmOrDisarm = (accesscode, systemFunction) => {
    // for populating 'verifying access code message'...
    // only useful with large data sets
    // keep in mind.. this is not only querying but also running bcrypt for each entry
    // to decrypt and compare O.o;
    this.state.waitForValidation = true;
    this.setState(this.state);
    return systemFunction(accesscode)
      .then((response) => {
        this.state.waitForValidation = false;
        const convertedResponse = JSON.parse(response.payload);
        if (convertedResponse.isValid) {
          // if accessCode is valid... now determine is arm or disarm ran
          if (convertedResponse.arm) {
            this.setState({ status: true, dispDefaultMessage: false, accessCodeIsValid: true });
          }
          if (convertedResponse.disarm) {
            this.setState({ status: false, dispDefaultMessage: false, accessCodeIsValid: true });
          }
          this.props.updateSystemStatus(this.state.status);
        } // else
        if (!convertedResponse.isValid) {
          this.state.accessCodeIsValid = false;
          return this.setState(this.state);
        }
      })
      .catch(console.error);
  };

  defaultAlarmControlsMessage = () => {
    return (
      <React.Fragment>
        <br/>
        <div className="ensureNoSquash">
          {/*this message will really only appear if you are working with a large set of entries*/}
          {/*I was testing with 3100 entries so this was useful to see switch back and forth to know*/}
          {/*My code is still working.*/}
          {this.state.waitForValidation === true ? <p>Verifying Access Code...</p> : null}
          {this.state.accessCodeIsValid === false ? <p>Invalid code.</p> : null}
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

  render() {
    return (
      <section className="alarmControls">
        <AlarmControlsForm onComplete={this.determineArmOrDisarm}/>
        {this.renderTheCorrectSystemActionMessage()}
        {this.state.dispDefaultMessage === null ? this.defaultAlarmControlsMessage() : null}
      </section>
    );
  }
}

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

export default connect(mapStateToProps,mapDispatchToProps)(AlarmControls);
