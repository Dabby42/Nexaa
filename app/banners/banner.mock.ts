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
