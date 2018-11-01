// libraries and packages
import React from 'react';
import PropTypes from 'prop-types';

// components
import LandingUI from '../landing-ui/landing-ui';
import AlarmControls from '../alarm-controls/alarm-controls';

// images
import hiveLogoOne from '../../assets/hive-logo1.png';
import hiveLogoTwo from '../../assets/hive-logo2.png';

// style
import './landing.scss';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.render = {};
    this.state.render.alarmControls = false;
  }

  render() {
    console.log('Landing');
    const { location } = this.props;
    return (
      <section>
        <React.Fragment>
          <LandingUI/>
          <img src={hiveLogoOne} className="hiveLogoOne" alt="project-hive"/>
          <img src={hiveLogoTwo} className="hiveLogoTwo" alt="project-your-hive"/>
          { /* Only renders alarmcontrols if link is clicked */ }
          {location.pathname === '/alarmcontrols' ? <AlarmControls/> : null}
        </React.Fragment>
      </section>
    );
  }
}

Landing.propTypes = {
  location: PropTypes.object,
};

export default Landing;
