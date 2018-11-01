'use strict';

const fs = require('fs-extra');
const aws = require('aws-sdk');

const amazonS3 = new aws.S3();

const s3 = {};

s3.pUpload = (path, key) => {
  // console.log('inside s3.pUpload');
  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };
  // uncomment for debugging
  // console.log(uploadOptions);

  return amazonS3.upload(uploadOptions)
    .promise()
    .then((response) => {
      return fs.remove(path)
        .then(() => response.Location)
        .catch(error => Promise.reject(error));
    })
    .catch((uploadError) => {
      return fs.remove(path)
        .then(() => Promise.reject(uploadError))
        .catch(() => Promise.reject(uploadError));
    });
};

s3.pRemove = (key) => {
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions).promise();
};

module.exports = s3;
