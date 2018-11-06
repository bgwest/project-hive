import React from 'react';
import PropTypes from 'prop-types';

// style
import './user-auth-form.scss';

const emptyState = {
  username: '',
  email: '',
  password: '',    // !: This is the NAKED password.
  accesscode: '', //     Handle as quickly as possible...
};

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = emptyState;
  }

  handleChange = (event) => {
    let { name, value } = event.target;

    if (name === 'accesscode') {
      // if field is not blank...
      if (value !== '') {
        value = Number(value);
        // and if field is not solely a numeric value..
        if (value !== 'NaN' && !Number(value)) {
          alert('Please enter your [4-6] digit access code. numbers only.');
          this.setState({ accessCode: ''});
          return '';
        }
      }
    }

    this.setState({[name]: value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onComplete(this.state);
    this.setState(emptyState);
  };

  render() {
    let { type } = this.props;
    type = type === 'login' ? 'login' : 'signup';

    const signupJSX = () => {
      return (<section><input
        name='email'
        placeholder='email'
        type='email'
        value={this.state.email}
        onChange={this.handleChange}
      />
      <br />
      <input
        name='accesscode'
        maxLength="6"
        minLength="4"
        placeholder='access code'
        type='text'
        value={this.state.accesscode}
        onChange={this.handleChange}
      />
    </section>
    );
    };

    return(
      <form className='userAuthForm' onSubmit={this.handleSubmit}>
        <input
          name='username'
          placeholder='username'
          type='text'
          value={this.state.username}
          onChange={this.handleChange}
        />
        <br />
        <input
          name='password'
          placeholder='sekret'
          type='password'
          value={this.state.password}
          onChange={this.handleChange}
        />
        <br />
        { type === 'signup' ? signupJSX() : undefined }
        <button type='submit'>{type}</button>
      </form>
    );
  }
};

AuthForm.propTypes = {
  onComplete: PropTypes.func,
};

export default AuthForm;
