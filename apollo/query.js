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


