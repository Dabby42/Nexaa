export const createBannerResponseData: any = {
  status: "success",
  message: "Banner Created",
  data: {
    banner_name: "Yakata",
    banner_images_and_sizes: '[{"banner_size":"300 x 200","banner_image_url":"https://test.com"},{"banner_size":"100 x 200","banner_image_url":"https://test2.com"}]',
    banner_link: "https://test.com",
    tracking_tag: "lmao",
    commission: 14,
    id: 2,
    status: 1,
  },
};

export const createBannerData: any = {
  banner_name: "Yakata",
  banner_images_and_sizes: [
    {
      banner_size: "300 x 200",
      banner_image_url: "https://test.com",
    },
    {
      banner_size: "100 x 200",
      banner_image_url: "https://test2.com",
    },
  ],
  banner_link: "https://test.com",
  tracking_tag: "lmao",
  commission: 14,
};

export const createBannerRequestMock: any = {
  user: {
    role: 3,
  },
};

export const notAdminRequestMock: any = {
  user: {
    role: 31,
  },
};

export const getActiveBannersResponseMock: any = {
  status: "success",
  message: "Data fetched successfully",
  data: {
    banners: [
      {
        id: 1,
        banner_name: "string",
        banner_images_and_sizes: "[{}]",
        banner_link: "string",
        tracking_tag: "string",
        status: 1,
        commission: 0,
        created_at: "2023-02-21T21:53:43.371Z",
        updated_at: "2023-02-21T21:53:43.371Z",
      },
    ],
    count: 1,
    current_page: 1,
    pages: 1,
  },
};

export const updateBannerData: any = {
  banner_name: "automobiles",
  banner_images_and_sizes: [
    {
      banner_size: "300 x 200",
      banner_image_url: "https://test.com",
    },
    {
      banner_size: "100 x 200",
      banner_image_url: "https://test2.com",
    },
  ],
  banner_link: "https://test.com",
  tracking_tag: "lmao",
  commission: 12,
};

export const updateBannerDetailsResponseData: any = {
  status: "success",
  message: "Banner Updated",
  data: null,
};

export const getAllBannersResponseMock: any = {
  status: "success",
  message: "Data fetched successfully",
  data: {
    banners: [
      {
        id: 1,
        banner_name: "string",
        banner_images_and_sizes: "[{}]",
        banner_link: "string",
        tracking_tag: "string",
        status: 1,
        commission: 0,
        created_at: "2023-05-07T21:53:43.371Z",
        updated_at: "2023-05-07T21:53:43.371Z",
      },
    ],
    count: 1,
    current_page: 1,
    pages: 1,
  },
};

export const updateBannerMock: any = 1;
