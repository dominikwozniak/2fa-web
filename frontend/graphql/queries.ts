import gql from 'graphql-tag';

const WHOAMI = gql`
  query WhoAmI {
    WhoAmI {
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
