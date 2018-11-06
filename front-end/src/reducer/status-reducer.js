const initialState = null;

// If pi was accessible remotely, we would get this state from
// the pi. However, because we do not, we need to mock the state
// for functionality testing. In the future this will be taken either from
// database or light status on pi.
// this.state.renderSystemArmed = false;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'STATUS_SET':
      console.log('STATUS_SET called');
      return payload;
    default:
      return state;
  }
};
