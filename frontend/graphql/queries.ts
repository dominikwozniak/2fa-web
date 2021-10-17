import gql from 'graphql-tag';

const WHOAMI = gql`
  query WhoAmI {
    WhoAmI {
      token
      user {
        email
        firstName
        lastName
        bio
        image
        twoFactorEnabled
      }
    }
  }
`;
