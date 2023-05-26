export const updateProfileResponseData: any = {
  status: "success",
  message: "Profile updated.",
  data: null,
};

export const updateBankDetailsResponseData: any = {
  status: "success",
  message: "Bank Details Updated",
  data: null,
};

export const updateUserData: any = {
  username: "konga",
  website_url: "konga.com",
};

export const userRequestMock: any = {
  user: {
    id: 1,
  },
};

export const updateBankDetailsData: any = {
  account_nummber: "1234567890",
};

export const getAllUsersResponseMock: any = {
  status: "success",
  message: "Affiliates retrieved successfully",
  data: {
    users: [
      {
        id: 1,
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
        created_at: "2023-02-21T21:53:43.371Z",
        updated_at: "2023-02-21T21:53:43.371Z",
      },
    ],
    count: 1,
    current_page: 1,
    pages: 1,
  },
};

export const approveAffiliateResponse: any = {
  status: "success",
  message: "Affiliate has been approved.",
  data: null,
};

export const disableAffiliateResponse: any = {
  status: "success",
  message: "Affiliate has been disabled.",
  data: null,
};

export const userRepositoryMock: any = {
  id: 2,
  first_name: "Olamide",
  last_name: "Aboyeji",
  email: "olamide.aboyeji@konga.com",
  username: "olamidee",
  address: "3B Cocoa Road",
  state: "",
  country: "Nigeria",
  phone_number: "08000000000",
  website_url: null,
  account_number: 1234567890,
  status: 0,
  role: 3,
  password: "$2a$10$s.1AXYLRgHqwUZPt3p1w6.TJJ7VmfHGvvUwe8BTBXIE7ZQyzfiwCW",
  verified_at: null,
  created_at: "2023-03-06T14:34:22.000Z",
  updated_at: "2023-03-06T14:37:08.000Z",
};
