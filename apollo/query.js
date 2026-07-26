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
  query ListOrders($search: String, $status: [String!], $dateTo: DateTime, $dateFrom: DateTime, $page: Int, $limit: Int) {
    listOrders(search: $search, status: $status, dateTo: $dateTo, dateFrom: $dateFrom, page: $page, limit: $limit) {
      items {
        id
        orderId
        status
        amountRequested
        cryptoAmountEstimated
        createdAt
      }
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

export const GET_ORDER = gql`
  query GetOrder($orderId: ID!) {
    getOrder(orderId: $orderId) {
      id
      orderId
      amountRequested
      cryptoAmountEstimated
      rate
      totalPaymentsSubmitted
      status
      user {
        walletAddress
      }
      blockchainTx {
        hash
        to
        amount
        confirmedAt
      }
      payments {
        id
        paymentIndex
        amount
        utr
        title
        screenshotUrl
        status
        rejectionReason
      }
      userBank {
        bankName
        accountHolderName
        accountNumber
        ifscCode
      }
    }
  }
`;
