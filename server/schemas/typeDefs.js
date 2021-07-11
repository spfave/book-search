const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    authors: [String]
    title: String!
    description: String!
    bookId: String!
    image: String
    link: String
  }

  type Query {

  }
`;

// type Mutation { }

module.exports = typeDefs;
