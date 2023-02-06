/*
mock implementation...
*/
export const loginUserSuccessMockData: any = {
  status: "success",
  message: "Login Success",
  data: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJvbGFtaWRlLmFib3llamlAa29uZ2EuY29tIiwiaWF0IjoxNjc1MzQyMTIzLCJleHAiOjE2NzUzNDU3MjN9.YmrW5ux7ll7aNBIs3-dI6YkDVwEyo-CsMF9BlZf7D60",
  },
};

export const loginUserFailureMockData = {
  statusCode: 401,
  message: "Invalid email or password",
  error: "Unauthorized",
};

export const userRepositoryMock = {
  id: 1,
  first_name: "Olamide",
  last_name: "Aboyeji",
  email: "olamide.aboyeji@konga.com",
  username: "olamide",
  address: "3B Cocoa Road",
  country: "Nigeria",
  phone_number: "08000000000",
  website_url: null,
  status: 0,
  role: 1,
  password: "$2a$10$cHeGc6gnIiCrh6T6YZ2aYufI.6kkkTTfNLMYggeoT2kL38GHYjqf6",
  verified_at: null,
  created_at: "2023-02-02T12:47:26.000Z",
  updated_at: "2023-02-02T12:47:26.000Z",
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
  password: "password",
};

export const registerUserSuccessMock: any = {
  status: "success",
  message: "Account created successfully",
  data: null,
};

export const noUserMock = null;
