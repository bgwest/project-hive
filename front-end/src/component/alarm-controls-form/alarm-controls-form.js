import React from 'react';

const emptyState = {
  accessCode: '',
};

class AlarmControlsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = emptyState;
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    // validate input is number... number only
    if (!value) {
      this.setState({ accessCode: ''});
      return '';
    } // else
    value = Number(value);
    if (name === 'accessCode' && value !== 'NaN' && !Number(value)) {
      alert('Please enter your [4-6] digit access code. numbers only.');
      this.setState({ accessCode: ''});
      return '';
    } // else
    // dynamic way to capture any state changes
    this.setState({[name]: value});
  };

  render() {
    return (
      <React.Fragment>
        <h3>Enable/Disable Alarm</h3>
      <form>
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
