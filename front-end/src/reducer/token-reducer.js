function findMeTheToken(strToFind) {
  const cookies = document.cookie.split('; ');
  let hiveToken = null;
  let prop = null;
  let key = null;
  for (let i = 0; i <= cookies.length - 1; i++) {
    if (cookies[i].includes(strToFind)) {
      hiveToken = cookies[i];
    }
  }
  if (hiveToken !== null) {
    prop = hiveToken.split('=')[0];
    key = hiveToken.split('=')[1];
  }
  return key;
}

const initialState = findMeTheToken('hive-token');

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'TOKEN_SET':
      return payload;
    case 'TOKEN_REMOVE':
      return initialState;
    default:
      return state;
  }
};
