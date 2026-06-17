import { gql } from "@apollo/client";

export const GET_USER = gql`
  query UserMe {
    userMe {
      id
      googleId
      userId
      email
      walletAddress
      fullName
      profileImage
      profileType
      walletStatus
      kycTag
      kycStatus
      totalVolume
      roles
      status
      wallet
      walletHold
      onboarding
      referralCode
      createdAt
      updatedAt
      assignedAdminBank {
      id
      accountHolderName
      accountNumber
      bankName
      branch
      ifscCode
      note
      }
    }
  }
`;

export const LATEST_PRICE = gql`
  query LatestPrice {
    latestPrice {
      id
      sellPrice
      market
    }
  }
`;

export const LIST_ORDERS = gql`
  query ListOrders($status: [String!]) {
    listOrders(status: $status) {
      total
    }
  }
`;

export const MY_BANK_ACCOUNTS = gql`
  query MyBankAccounts {
    myBankAccounts {
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
