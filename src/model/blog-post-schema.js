'use strict';

// development note: this is the many of the single

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const UserModel = require('./user-schema');

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  content: {
    type: String,
  },
  user: { // development note: this is where we are making the connection to user-schema
    type: mongoose.Schema.Types.ObjectId,
    required: true, // we need to have a one before we can create a many
    ref: 'user-schema', // name of model in mongoose.model export
  },
});
// -------------------------------------------------------------------------------------
// CRUD RULES
// -------------------------------------------------------------------------------------
function blogPostPreHook(done) {
  // development note: the value of 'this' inside this function is going to be the document
  // that is going to be saved
  return UserModel.findById(this.user)
    .then((userFound) => {
      if (!userFound) {
        throw new HttpError(404, 'user not found');
      }
      // first, make changes to the model
      userFound.blogPosts.push(this._id);
      // then, save the model
      return userFound.save();
    })
    .then(() => done()) // value => done(value)
    .catch(done); // error => done(error)
}

const blogPostPostHook = (document, done) => {
  return UserModel.findById(document.user)
    .then((userFound) => {
      // console.log(document);
      if (!userFound) {
        throw new HttpError(500, 'user not found');
      }
      userFound.blogPosts = userFound.blogPosts.filter((blogPost) => {
        return blogPost._id.toString() !== document._id.toString();
        // return blogPost._doc._id.toString() !== document._id.toString();
      });
      return userFound.save();
    })
    .then(() => done()) // value => done(value)
    .catch(done); // error => done(error)
}; // hard to find documentation on done() for mongoose ...

blogPostSchema.pre('save', blogPostPreHook);
blogPostSchema.post('remove', blogPostPostHook);
// -------------------------------------------------------------------------------------

module.exports = mongoose.model('blog-post-schema', blogPostSchema);
