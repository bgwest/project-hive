import React from 'react';

const emptyState = {
  accessCode: '',
  armOrDisarm: '',
};

class AlarmControlsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = emptyState;
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    // validate input is number... number only
    value = Number(value);
    if (name === 'accessCode' && value !== 'NaN' && !Number(value)) {
      alert('Please enter your [4-6] digit access code. numbers only.');
      this.setState({ accessCode: ''});
      return '';
    }
    // dynamic way to capture any state changes
    this.setState({[name]: value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onComplete(this.state);
    this.setState(emptyState);
  };

  render() {
    return (
      <React.Fragment>
        <h3>Enable/Disable Hive</h3>
      <form onSubmit={this.handleSubmit}>
        <input
          name='accessCode'
          placeholder='access code'
          type='text'
          value={this.state.accessCode}
          onChange={this.handleChange}
        />
      </form>
      </React.Fragment>
    );
  }
}

export default AlarmControlsForm;
