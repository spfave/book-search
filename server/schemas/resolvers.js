const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Query a single user by their token id
    me: async (parent, args, context) => {
      if (!context.user)
        throw new AuthenticationError(
          'You need to be logged in to view saved books'
        );

      return await User.findOne({ _id: context.user._id }).populate(
        'savedBooks'
      );
    },
  },

  Mutation: {
    // create a new user, return with a signed token
    addUser: async (parent, newUserData) => {
      const newUser = await User.create(newUserData);
      const token = signToken(newUser);

      return { token, user: newUser };
    },

    // Login a user, return with a signed token
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user)
        throw new AuthenticationError(
          'No user found with provided credentials'
        );

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw)
        throw new AuthenticationError(
          'No user found with provided credentials'
        );

      const token = signToken(user);
      return { token, user };
    },

    // Save a book to a user's savedBooks list
    saveBook: async (parent, { book }, context) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged to save books');

      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true }
      );

      return user;
    },

    // Remove a book from a user's saveBooks list
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged to remove books');

      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      return user;
    },
  },
};

module.exports = resolvers;
