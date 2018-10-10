'use strict';

const queryUsers = {};

queryUsers.find = (Model, findOptions) => {
  const testQuery = Model.find({});
  // find option syntax is space delimited
  // e.g. 'username accessCodeHash'
  return testQuery.select(findOptions);
  // console.log(testQuery);
};

queryUsers.query = (data, callback) => {
  const queryContainer = {};
  // execute the query at a later time
  return data.exec((error, user) => {
    if (error) throw (error);
    // Prints username and accessCodeHash
    // console.log('username: %s, accessCodeHash: %s', user.username, user.accessCodeHash);
    // console.log(user);
    for (let loopQueryList = 0; loopQueryList <= user.length - 1; loopQueryList++) {
      queryContainer[`${loopQueryList}`] = user[loopQueryList];
    }
    // testing new object functionality
    // console.log(queryContainer);
    // console.log(queryContainer['0'].username);
    // console.log(queryContainer['1'].username);
    // console.log(queryContainer);
    callback(queryContainer);
  });
  // console.log('testing', queryContainer);
};

module.exports = queryUsers;
