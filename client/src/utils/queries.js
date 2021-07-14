import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      username
      bookCount
      saveBooks {
        bookId
        authors
        title
      }
    }
  }
`;
