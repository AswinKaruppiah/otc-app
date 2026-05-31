import { gql } from "@apollo/client";

export const SYNC_GOOGLE_USER = gql`
  mutation SyncGoogleUser($googleId: String!, $email: String!, $name: String, $image: String) {
    syncGoogleUser(googleId: $googleId, email: $email, name: $name, image: $image) {
      accessToken
    }
  }
`;
