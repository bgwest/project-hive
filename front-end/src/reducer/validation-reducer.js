const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NOT_UNIQUE':
      return payload;
    default:
      return state;
  }
};
