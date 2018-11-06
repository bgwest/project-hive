const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'TOKEN_SET':
      console.log('TOKEN_SET called');
      return payload;
    case 'TOKEN_REMOVE':
      console.log('TOKEN_REMOVE called');
      return initialState;
    default:
      return state;
  }
};
