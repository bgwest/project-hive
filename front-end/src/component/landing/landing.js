// libraries and packages
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

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
    const { location } = this.props;
    return (
      <section>
        <React.Fragment>
          <LandingUI/>
          <div className="hiveLogoOneWrapper">
            <a className="hiveHomeLink" href="https://github.com/bgwest/project-hive">
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
        </React.Fragment>
      </section>
    );
  }
}

Landing.propTypes = {
  location: PropTypes.object,
};

export default Landing;
