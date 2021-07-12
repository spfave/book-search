const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user)
        throw new AuthenticationError(
          'You need  to be logged in to view content'
        );

      return User.findOne({ _id: context.user._id }).populate('savedBooks');
    },
  },

  Mutation: {
    addUser: async (parent, newUserData) => {
      const newUser = await User.create(newUserData);
      const token = signToken(newUser);

      return { token, user: newUser };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user)
        throw new AuthenticationError(
          'No user found with provided credentials'
        );

      const correctPw = user.isCorrectPassword(password);
      if (!correctPw)
        throw new AuthenticationError(
          'No user found with provided credentials'
        );

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
