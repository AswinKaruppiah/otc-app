import { gql } from "@apollo/client";

export const SYNC_GOOGLE_USER = gql`
  mutation SyncGoogleUser($googleId: String!, $email: String!, $name: String, $image: String) {
    syncGoogleUser(googleId: $googleId, email: $email, name: $name, image: $image) {
      accessToken
      onboarding
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {
    updateUserProfile(userId: $userId, input: $input) {
      id
      fullName
      profileType
      referralCode
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderId
      status
      amountRequested
      cryptoAmountEstimated
      createdAt
    }
  }
`;

export const ADD_BANK_ACCOUNT = gql`
  mutation AddBankAccount($input: AddBankAccountInput!) {
    addBankAccount(input: $input) {
      id
      label
      bankName
      accountHolderName
      accountNumberMasked
      accountNumber
      ifscCode
      branch
      accountType
      isActive
      status
      createdAt
      updatedAt
    }
  }
`;

export const ADD_WHITELISTED_ADDRESS = gql`
  mutation AddUserWalletAddress($label: String!, $address: String!) {
    addUserWalletAddress(label: $label, address: $address) {
      id
      label
      address
      network
      isDefault
      status
      createdAt
    }
  }
`;

export const REMOVE_WHITELISTED_ADDRESS = gql`
  mutation RemoveUserWalletAddress($addressId: ID!) {
    removeUserWalletAddress(addressId: $addressId) {
      message
    }
  }
`;

export const REQUEST_FYSTACK_WITHDRAWAL = gql`
  mutation RequestFystackWithdrawal($amount: String!, $recipientAddress: String!, $assetId: String) {
    requestFystackWithdrawal(amount: $amount, recipientAddress: $recipientAddress, assetId: $assetId) {
      autoApproved
      status
      withdrawalId
    }
  }
`;



