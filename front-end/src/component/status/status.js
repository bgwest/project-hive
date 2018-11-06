import React from 'react';
import './status.scss';
import statusGreen from '../../assets/statusGreen.svg';
import statusRed from '../../assets/statusRed.svg';

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.status = this.props.status || null;
  }

  renderStatusSVG = (status) => {
    if (status === true) {
      return statusGreen;
    }
    if (status === false) {
      return statusRed;
    }
    // else -- if null aka system status unknown
    // do nothing... so default unknown status appears
    console.log('status is unknown');
  };

  render() {
    const { status } = this.state;
    return (
      <React.Fragment>
      <div className="showStatus">
        <p>{<b>hive:status</b>} <object type="image/svg+xml"
                                                      data={this.renderStatusSVG(this.props.status)}
                                                      className="statusLight">
          unknown
          </object>
        </p>
        {status === null ? <p><b>recommended:</b> enable hive security when possible.</p> : null}
      </div>
      </React.Fragment>
    );
  }
}

export default Status;
