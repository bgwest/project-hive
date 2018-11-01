import React from 'react';
import { Link } from 'react-router-dom';

// style
import './dashboard.scss';

class Dashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <br />
        <Link to='/' className="dashboardGoBack"> ◀Back </Link>
        <h1>Dashboard</h1>
        <h3>View Villains</h3>
        <h3>System Status</h3>
        <h3>Create Alert</h3>
      </React.Fragment>
    );
  }
}

export default Dashboard;
