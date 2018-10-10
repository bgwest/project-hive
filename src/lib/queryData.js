'use strict';

const queryData = {};

queryData.find = (Model, findOptions) => {
  const testQuery = Model.find({});
  // find option syntax is space delimited
  // e.g. 'username accessCodeHash'
  return testQuery.select(findOptions);
};

queryData.query = (function (data, callback) {
  const queryContainer = {};
  // execute the query at a later time
  data.exec(function (error, user) { //eslint-disable-line
    if (error) {
      callback(error);
    }

    for (let loopQueryList = 0; loopQueryList <= user.length - 1; loopQueryList++) {
      queryContainer[`${loopQueryList}`] = user[loopQueryList];
    }
    // uncomment for debugging
    // console.log(queryContainer);
    // console.log(queryContainer['0'].username);
    // console.log(queryContainer['1'].username);
    callback(queryContainer);
  });
});

module.exports = queryData;
