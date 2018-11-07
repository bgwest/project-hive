import React from 'react';
import PropTypes from 'prop-types';

// style
import './user-auth-form.scss';
import validator from 'validator';

const emptyState = {
  username: '',
  usernamePristine: true,
  usernameError: 'Username is Required',
  usernameTaken: '',

  email: '',
  emailPristine: true,
  emailError: 'Email is Required',

  password: '',
  passwordPristine: true,
  passwordError: 'Password is required',

  // has own custom validation -- works good for now
  accesscode: '',
};

const MIN_NAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = emptyState;
  }

  handleValidation = (name, value) => {

    switch(name) {
      case 'username':
        if ( value.length < MIN_NAME_LENGTH) {
          return `Your username must be at least ${MIN_NAME_LENGTH} characters long`;
        }
        return null;
      case 'email':
        if(!validator.isEmail(value)) {
          return 'You must provide a valid email';
        }
      case 'password':
        if (value.length < MIN_PASSWORD_LENGTH) {
          return `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
        }
        return null;
      default:
        return null;
    }

    // THUNK
    // superagent.get(`${API_URL}/usernameTaken/${value}`);

    return null;
  };

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

    this.setState({
      [name]: value,
      [`${name}Pristine`]: false,
      [`${name}Error`]: this.handleValidation(name,value),
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { usernameError, emailError, passwordError } = this.state;

    if(this.props.type === 'login' || this.props.type === 'signup' || (!usernameError && !passwordError && !emailError)) {
      this.props.onComplete(this.state);
      this.setState(emptyState);
    } else {
      this.setState({
        usernamePristine: false,
        passwordPristine: false,
        emailPristine: false,
      });
    }
  };

  render() {
    let { type } = this.props;
    type = type === 'login' ? 'login' : 'signup';

    const signupJSX = () => {
      return (<section>
      { this.state.emailPristine ? undefined : <p>{ this.state.emailError }</p> }
      <input
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
        { this.state.usernamePristine ? undefined : <p> {this.state.usernameError}</p>}
        <input
          name='username'
          placeholder='username'
          type='text'
          value={this.state.username}
          onChange={this.handleChange}
        />
        <br />
        { this.state.passwordPristine ? undefined : <p> {this.state.passwordError}</p>}
        <input
          name='password'
          placeholder='password'
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
