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
