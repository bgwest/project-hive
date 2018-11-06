// this is a curried function with 3 arguments
export default store => next => (action) => {
  try {
    // enable for development... but live this will output token to console :(
    // console.log('__ACTION__', action);
    // console.log('__OLD STATE__', store.getState());
    const result = next(action);
    // console.log('__NEW STATE__', store.getState());
    return result; //! this code will break eventually if you don't have returns
  } catch (error) {
    console.log('__ERROR__', error);
    action.error = error;
    return action;
  }
};
