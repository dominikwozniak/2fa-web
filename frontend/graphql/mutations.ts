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

const CONFIRM_USER = gql`
  mutation confirmUser($token: String!) {
    confirmAccount(input: { confirmToken: $token })
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      qrUrl
      useAuthenticator
      user {
        email
        firstName
        lastName
        bio
      }
      token
    }
  }
`;

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(input: { email: $email })
  }
`;

const FORGOT_CHANGE_PASSWORD = gql`
  mutation forgotChangePassword($token: String!, $password: String!) {
    forgotPasswordChangePassword(input: { token: $token, password: $password })
  }
`;

const UPDATE_PROFILE = gql`
  mutation updateProfile($bio: String, $firstName: String, $lastName: String) {
    updateProfile(
      input: { bio: $bio, firstName: $firstName, lastName: $lastName }
    )
  }
`;

const CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(
      input: { oldPassword: $oldPassword, newPassword: $newPassword }
    )
  }
`;

const CHANGE_EMAIL = gql`
  mutation changeEmail($email: String!, $password: String!) {
    changeEmail(input: { email: $email, password: $password })
  }
`;
