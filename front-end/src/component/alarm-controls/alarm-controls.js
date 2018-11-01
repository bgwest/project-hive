import React from 'react';
import AlarmControlsForm from '../alarm-controls-form/alarm-controls-form';
import { Link } from 'react-router-dom';

// style
import './alarm-controls.scss';

class AlarmControls extends React.Component {
  render() {
    return (
      <section className="alarmControls">
        <AlarmControlsForm/>
      </section>
    );
  }
}

export default AlarmControls;
