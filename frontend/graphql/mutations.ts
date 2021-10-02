import gql from 'graphql-tag';

const REGISTER = gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $twoFactorEnabled: Boolean!
  ) {
    registerUser(
      input: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        twoFactorEnabled: $twoFactorEnabled
      }
    ) {
      token
      user {
        _id
        email
        firstName
        lastName
        bio
      }
    }
  }
`;
