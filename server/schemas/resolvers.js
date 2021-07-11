const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {},

  Mutation: {
    addUser: async (parent, newUserData) => {
      const newUser = await User.create(newUserData);
      const token = signToken(newUser);

      return { token, newUser };
    },
  },
};

module.exports = resolvers;
