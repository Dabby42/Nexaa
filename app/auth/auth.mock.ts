/*
mock implementation...
*/
export const loginUserSuccessMockData: any = {
  status: "success",
  message: "Login Success",
  data: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvbGFtaWRlLmFib3llamlAa29uZ2EuY29tIiwicm9sZSI6MywiaWF0IjoxNjc5MzE3NjQxLCJleHAiOjE2NzkzMjEyNDF9.r1TWM0hTbkhxG8OHHOkTV_3N9eNeMQkskRx2PbMvt2s",
    user: {
      id: 2,
      first_name: "Olamide",
      last_name: "Aboyeji",
      email: "olamide.aboyeji@konga.com",
      username: "olamide",
      address: "3B Cocoa Road",
      state: "",
      country: "Nigeria",
      phone_number: "08000000000",
      website_url: null,
      account_number: 1234567890,
      status: 1,
      role: 3,
      verified_at: null,
      created_at: "2023-03-06T14:34:22.000Z",
      updated_at: "2023-03-06T14:37:08.000Z",
    },
  },
};

export const loginAdminSuccessMockData: any = {
  status: "success",
  message: "Login Success",
  data: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvbGFtaWRlLmFib3llamlAa29uZ2EuY29tIiwicm9sZSI6MywiaWF0IjoxNjc5MzE3NjQxLCJleHAiOjE2NzkzMjEyNDF9.r1TWM0hTbkhxG8OHHOkTV_3N9eNeMQkskRx2PbMvt2s",
    user: {
      id: 2,
      first_name: "Olamide",
      last_name: "Aboyeji",
      email: "admin@konga.com",
      created_at: "2023-04-13T22:50:13.000Z",
      updated_at: "2023-04-13T22:50:13.000Z",
      is_active: true,
    },
  },
};

export const loginUserFailureMockData = {
  statusCode: 401,
  message: "Invalid email or password",
  error: "Unauthorized",
};

export const userRepositoryMock = {
  id: 2,
  first_name: "Olamide",
  last_name: "Aboyeji",
  email: "olamide.aboyeji@konga.com",
  username: "olamide",
  address: "3B Cocoa Road",
  state: "",
  country: "Nigeria",
  phone_number: "08000000000",
  website_url: null,
  account_number: 1234567890,
  status: 1,
  role: 3,
  password: "$2a$10$s.1AXYLRgHqwUZPt3p1w6.TJJ7VmfHGvvUwe8BTBXIE7ZQyzfiwCW",
  verified_at: null,
  created_at: "2023-03-06T14:34:22.000Z",
  updated_at: "2023-03-06T14:37:08.000Z",
};

export const adminRepositoryMock = {
  id: 2,
  first_name: "Olamide",
  last_name: "Aboyeji",
  email: "admin@konga.com",
  is_active: true,
  password: "$2a$10$s.1AXYLRgHqwUZPt3p1w6.TJJ7VmfHGvvUwe8BTBXIE7ZQyzfiwCW",
  created_at: "2023-04-13T22:50:13.000Z",
  updated_at: "2023-04-13T22:50:13.000Z",
};

export const userDataMock: any = {
  first_name: "Olamide",
  last_name: "Aboyeji",
  email: "olamide.aboyeji@konga.com",
  username: "olamide",
  address: "3B Cocoa Road",
  country: "Nigeria",
  phone_number: "08000000000",
  status: 0,
  state: 1,
  website_url: "https://olamide.affliate.com",
  password: "password123",
};

export const registerUserSuccessMock: any = {
  status: "success",
  message: "Account created successfully",
  data: null,
};

export const changeUserPasswordSuccessMock: any = {
  status: "success",
  message: "Password updated successfully",
  data: null,
};

export const noUserMock = null;
