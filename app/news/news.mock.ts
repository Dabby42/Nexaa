export const newsData = {
  title: "Hello affiliates.",
  body: "Hello affiliates2 \nThis is a new update about our new platform \nThanks for remaining with us.",
};

export const createNewsMock = {
  status: "success",
  message: "News created.",
  data: null,
};

export const updateNewsMock = {
  status: "success",
  message: "News updated.",
  data: null,
};

export const deleteNewsMock = {
  status: "success",
  message: "News deleted.",
  data: null,
};

export const userMock = {
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

export const fetchNewsMock: any = {
  status: "success",
  message: "News fetched.",
  data: {
    news: [
      {
        id: 6,
        title: "Hello affiliates.",
        body: "Hello affiliates2 \n This is a new update about our new platform \n Thanks for remaining with us.",
        created_at: "2023-03-14T13:29:39.129Z",
        updated_at: "2023-03-14T13:29:39.129Z",
      },
      {
        id: 4,
        title: "Hello affiliates.",
        body: "Hello affiliates2 \n This is a new update about our new platform \n Thanks for remaining with us.",
        created_at: "2023-03-14T12:09:15.589Z",
        updated_at: "2023-03-14T12:09:15.589Z",
      },
      {
        id: 3,
        title: "Hello affiliates.",
        body: "Hello affiliates2 \n This is a new update about our new platform \n Thanks for remaining with us.",
        created_at: "2023-03-14T12:07:42.502Z",
        updated_at: "2023-03-14T12:07:42.502Z",
      },
    ],
    count: 4,
    current_page: 1,
    pages: 2,
  },
};
